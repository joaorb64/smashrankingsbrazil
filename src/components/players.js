import React, { Component } from 'react'
import styles from './contacts.module.css'
import Fuse from '../../node_modules/fuse.js/dist/fuse'

class Players extends Component {
  state = {
    players: {},
    filtered: {},
    search: ""
  }

  componentDidUpdate(nextProps) {
    if(nextProps != this.props){
      this.fetchPlayers();
    }
  }

  componentDidMount() {
    this.fetchPlayers();
  }
  
  fetchPlayers() {
    if(this.props.leagues){
      this.state.players = {};

      this.props.leagues.forEach((league)=>{
        fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/master/out/'+league.id+'.json')
        .then(res => res.json())
        .then((data) => {

          if(Object.keys(data).includes("ranking")){
            Object.entries(data["ranking"]).forEach((player)=>{
              if(player[1].avatar){
                player[1].avatar = `https://raw.githubusercontent.com/joaorb64/tournament_api/master/${player[1].avatar}`;
              } else if (player[1].twitter) {
                player[1].avatar = `https://twivatar.glitch.me/${this.getTwitterHandle(player[1].twitter)}`;
              }

              this.state.players[player[1].name] = player[1];
            })

            this.state.filtered = this.state.players;

            this.setState(this.state);
          }
        })
        .catch(console.log)
      })
    }
  }

  getCharName(name){
    return name.toLowerCase().replace(/ /g, "_");
  }

  getTwitterHandle(twitter){
    let parts = twitter.split('/');
    return parts[parts.length-1];
  }

  normalizePlayerName(name){
    return name.normalize("NFKD").replace(/ /g, '_').replace(/@/g, "_At_").replace(/~/g, "_Tilde_").replace(RegExp('[^0-9a-zA-Z_-]'), '').replace("|", "")
  }

  openPlayerModal(player){
    if(window.playerModal){
      window.playerModal.player = this.normalizePlayerName(player.name);
      window.playerModal.fetchPlayer();
    }
  }

  search(e){
    this.state.search = e;

    const options = {
      keys: [
        {
          name: 'name',
          weight: 0.4
        },
        {
          name: 'full_name',
          weight: 0.3
        },
        {
          name: 'mains.name',
          weight: 0.2
        },
        {
          name: 'state',
          weight: 0.1
        }
      ],
      threshold: 0.4,
      location: 50
    }
    
    // Create a new instance of Fuse
    const fuse = new Fuse(Object.values(this.state.players), options)

    if(this.state.search.length == 0){
      this.state.filtered = this.state.players;
    } else {
      let result = fuse.search(e);
      this.state.filtered = {}
      Object.values(result).forEach((val)=>{
        this.state.filtered[val["item"]["uuid"]] = val["item"];
      })
    }

    this.setState(this.state);
  }

  render (){
    return(
      <div style={{textAlign: "center", fontFamily: "SmashFont"}}>

        <div class="col-md-12" style={{padding: 0, marginBottom: "12px"}}>
          <input ref={(input)=>this.myinput = input} class="form-control" type="text" placeholder="Pesquisar"
          value={this.state.search} onChange={(e)=>this.search(e.target.value)} />
        </div>

        {Object.values(this.state.filtered).map((player, i) => (
          <li key={"_"+i}
          class={"slide-fade " + styles.listItem + " list-group-item"}
          style={{animationDelay: ((i+3)/50.0)+"s", cursor: "pointer"}}
          data-toggle="modal" data-target="#playerModal"
          onClick={()=>this.openPlayerModal(player)}
          >
            {player.avatar ?
              <a href={player.twitter}>
                <div class="player-avatar" style={{
                  backgroundImage: `url(${player.avatar})`,
                  width: "64px", height: "100%", display: "inline-block", backgroundSize: "cover", backgroundRepeat: "no-repeat",
                  backgroundPosition: "center", backgroundColor: "white",
                }}>
                  {player.twitter ? 
                    <div style={{width: "100%", height: "100%", display: "flex", alignItems: "flex-end", justifyContent: "flex-end"}}>
                      <div style={{
                        backgroundImage: "url(/icons/twitter.svg)", width: 16, height: 16, bottom: 0, right: 0, margin: "2px"
                      }}></div>
                    </div>
                    :
                    null}
                </div>
              </a>
            :
              <div class="player-avatar" style={{
                width: "64px", height: "48px", display: "inline-block", backgroundSize: "cover", backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}></div>
            }

            <div class="state-flag-container" style={{
              width: "64px", display: "flex", justifyContent: "center", alignItems: "center", padding: "8px"
            }}>
              {player.state ?
                <div class="state-flag" style={{
                  backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/master/state_icon/${player.state}.png)`,
                  width: "100%", height: "100%", display: "inline-block", backgroundSize: "contain", backgroundRepeat: "no-repeat",
                  backgroundPosition: "center"
                }}>{player.state}</div>
              :
                null
              }
            </div>

            <div class="player-name-container" style={{display: "flex", flexGrow: 1, overflow: "hidden", textOverflow: "ellipsis", justifyContent: "center"}}>
              <div class="player-name" style={{overflow: "hidden", textOverflow: "ellipsis",
                overflowWrap: "break-word", lineHeight: "1.6rem", fontSize: "1.2rem"
              }}>
                {player.name}
              </div>
              <div class="player-name-small" style={{
                overflow: "hidden", textOverflow: "ellipsis", color: "darkgray", fontSize: "0.8rem",
                whiteSpace: "nowrap", lineHeight: "0.8rem"
              }}>
                {player.full_name}
              </div>
            </div>

            <div class="player-main" style={{display: "flex", width: "128px"}}>
              {player.mains.length > 0 ?
                <div style={{
                  backgroundImage: `url(${process.env.PUBLIC_URL}/portraits-small/${this.getCharName(player.mains[0].name)}.png)`,
                  width: "128px", backgroundPosition: "center", backgroundSize: "cover", backgroundColor: "#ababab", overflow: "hidden"
                }}>
                  <div style={{overflow: "hidden", display: "flex", height: "100%", alignItems: "flex-end", justifyContent: "flex-end"}}>
                    {player.mains.slice(1).map((main)=>(
                      <div class="player-main-mini" style={{
                        backgroundImage: `url(http://braacket.com/${this.getCharName(main.icon)})`,
                        width: "24px", height: "24px", backgroundPosition: "center", backgroundSize: "cover",
                        flexGrow: 0, display: "flex", flexShrink: 1
                      }}></div>
                    ))}
                  </div>
                </div>
                :
                <div style={{
                  backgroundImage: `url(${process.env.PUBLIC_URL}/portraits-small/${"random"}.png)`,
                  width: "128px", backgroundPosition: "center", backgroundSize: "cover", backgroundColor: "#ababab"
                }}></div>
              }
            </div>
          </li>
        ))}
      </div>
    )
  }
};

export default Players