import React, { Component } from 'react'
import styles from './contacts.module.css'
import CHARACTERS from "../globals";

const fuzzysort = require('fuzzysort')

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

  preloadImages(index) {
    index = index || 0;

    if(!this.state.players) return
    if(index >= this.state.players.length){
      this.setState(this.state);
      return;
    }

    if(!this.state.players[index].twitter){
      this.preloadImages(index+1);
      return;
    }

    var img = new Image();

    setTimeout(()=>{
      this.state.players[index].avatar = img.src;
      this.preloadImages(index + 1);
      if(index % 8 == 0)
        this.setState(this.state);
    }, 5);

    img.src = `http://twitter-avatar.now.sh/${this.getTwitterHandle(this.state.players[index].twitter)}`;
  }
  
  fetchPlayers() {
    if(this.props.allplayers){
      let players = [];

      this.props.allplayers["players"].forEach(function(p){
        if(p.twitter) {
          p.avatar = "";
        }

        if(p.mains.length == 0 || p.mains[0] == ""){
          p.mains = ["Random"]
        }

        p.mainnames = p.mains.join(" ");

        players.push(p);
      }, this)

      this.state.players = players;
      this.setState({players: players, filtered: players})
      this.preloadImages();
    }
  }

  getCharCodename(playerData, id){
    let skin = 0;

    if("skins" in Object.keys(playerData)){
      skin = playerData["skins"][id];
    }
    
    return CHARACTERS[playerData["mains"][id]]+"_0"+skin;
  }

  getCharName(name){
    return name.toLowerCase().replace(/ /g, "");
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
      window.playerModal.player = player;
      window.playerModal.fetchPlayer();
    }
  }

  search(e){
    this.state.search = e;

    if(this.state.search.length == 0){
      this.state.filtered = this.state.players;
    } else {
      let result = fuzzysort.go(this.state.search, Object.values(this.state.players), {
        keys: [
          'name',
          'full_name',
          'org',
          'state',
          'mainnames'
        ],
        threshold: -10000,
        limit: 20,
        scoreFn(a){
          return Math.max(
            a[0]?a[0].score:-1000,
            a[1]?a[1].score-10:-1000,
            a[2]?a[2].score-100:-1000,
            a[3]?a[3].score-100:-1000,
            a[4]?a[4].score-100:-1000,
          )}
      })
      this.state.filtered = []
      Object.values(result).forEach((val)=>{
        if (val["obj"] != null)
          this.state.filtered.push(val["obj"]);
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
          style={{cursor: "pointer"}}
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
                <b style={{color: "#bb0000"}}>{player.org} </b>
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
                  backgroundImage: `url(${process.env.PUBLIC_URL}/portraits/ssbu/chara_0_${this.getCharCodename(player, 0)}.png)`,
                  width: "128px", backgroundPosition: "center 45%", backgroundSize: "cover", backgroundColor: "#ababab", overflow: "hidden"
                }}>
                  <div style={{overflow: "hidden", display: "flex", height: "100%", alignItems: "flex-end", justifyContent: "flex-end"}}>
                    {player.mains.slice(1).map((main)=>(
                      <div class="player-main-mini" style={{
                        backgroundImage: `url(${process.env.PUBLIC_URL}/portraits-mini/${this.getCharName(main)}.png)`,
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