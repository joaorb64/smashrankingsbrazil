import React, { Component } from 'react'
import styles from './contacts.module.css'
import {CHARACTERS, CHARACTER_EYE_HEIGHT_PERCENTAGE} from "../globals";
import LazyLoad from 'react-lazyload';
import i18n from '../locales/i18n';

const fuzzysort = require('fuzzysort')

class Players extends Component {
  state = {
    players: [],
    filtered: [],
    search: ""
  }

  componentDidUpdate(prevProps) {
    if(prevProps != this.props && (!prevProps.allplayers || !prevProps.allplayers.players || !this.props.allplayers)){
      this.fetchPlayers();
    }
  }

  componentDidMount() {
    this.fetchPlayers();
  }
  
  fetchPlayers() {
    if(this.props.allplayers && this.props.allplayers.players && Object.keys(this.props.allplayers.players).length > 0){
      let players = [];

      this.props.allplayers["players"].forEach(function(p){
        if(p.smashgg_image) {
          p.avatar = p.smashgg_image;
        }
        if(!p.smashgg_image && p.twitter) {
          p.avatar = `http://unavatar.now.sh/twitter/${this.getTwitterHandle(p.twitter)}`;
        }

        if(!p.mains || p.mains.length == 0 || p.mains[0] == ""){
          p.mains = ["Random"]
        }

        p.mainnames = p.mains.join(" ");

        if(this.props.match){
          if(this.props.match.params["id"]){
            p.braacket_links.forEach(link => {
              let linkLeague = link.split(":")[0];
              let linkId = link.split(":")[1];
    
              if(linkLeague == this.props.match.params["id"]){
                p.league_id = linkId;
              }
            })
          } else {
            if(p.braacket_links.length > 0){
              p.league_id = p.braacket_links[0];
            } else {
              p.league_id = 0;
            }
          }
        }

        players.push(p);
      }, this)

      players.sort((a, b) => {return a.org+a.name > b.org+b.name ? -1 : 1});

      this.setState({players: players, filtered: players})
    }
  }

  getCharCodename(playerData, id){
    let skin = 0;

    if(playerData.hasOwnProperty("skins")){
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
      if(this.props.match.params["id"]){
        this.props.history.push(
          '/leagues/smash/'+this.props.match.params["id"]+'/'+
          this.props.match.params["tab"]+"/"+player.league_id
        );
      } else{
        this.props.history.push(
          '/players/'+player.league_id
        );
      }
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
          'country',
          'state',
          'mainnames'
        ],
        threshold: -10000,
        limit: 20,
        scoreFn(a){
          return Math.max(
            a[0]?a[0].score:-1000,
            a[1]?a[1].score-10:-1000,
            a[2]?a[2].score-10:-1000,
            a[3]?a[3].score-100:-1000,
            a[4]?a[4].score-100:-1000,
            a[5]?a[5].score-10:-1000,
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

        {this.state.players && Object.entries(this.state.players).length > 0 ?
          <>
            <div class="col-md-12" style={{padding: 0, marginBottom: "12px"}}>
              <input ref={(input)=>this.myinput = input} class="form-control" type="text" placeholder={i18n.t("search-in")+Object.entries(this.state.players).length+i18n.t("search-players")}
              value={this.state.search} onChange={(e)=>this.search(e.target.value)} />
            </div>

            {Object.values(this.state.filtered).slice(0, 64).map((player, i) => (
              <li key={"_"+i}
              class={"slide-fade " + styles.listItem + " list-group-item"}
              style={{cursor: "pointer"}}
              data-toggle="modal" data-target="#playerModal"
              onClick={()=>this.openPlayerModal(player)}
              >
                {player.avatar ?
                  <div class="player-avatar">
                    <LazyLoad style={{height: "100%"}}>
                      <div class="player-avatar" style={{
                        backgroundImage: `url(${player.avatar})`,
                        width: "64px", height: "100%", display: "inline-block", backgroundSize: "cover", backgroundRepeat: "no-repeat",
                        backgroundPosition: "center", backgroundColor: "white",
                      }}>
                        {!player.smashgg_image ? 
                          <div style={{width: "100%", height: "100%", display: "flex", alignItems: "flex-end", justifyContent: "flex-end"}}>
                            <div style={{
                              backgroundImage: "url(/icons/twitter.svg)", width: 16, height: 16, bottom: 0, right: 0, margin: "2px"
                            }}></div>
                          </div>
                          :
                          null}
                      </div>
                    </LazyLoad>
                  </div>
                :
                  <div class="player-avatar" style={{
                    width: "64px", height: "48px", display: "inline-block", backgroundSize: "cover", backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}></div>
                }

<div class="flags-container">
                  <div class="state-flag-container" style={{
                    width: "40px", display: "flex", justifyContent: "center", alignItems: "center", padding: "6px"
                  }}>
                    {player.country_code && player.country_code != "null" ?
                      <div class="flag" style={{
                        backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/country_flag/${player.country_code.toLowerCase()}.png)`
                      }}><span>{player.country_code}</span></div>
                    :
                      null
                    }
                  </div>

                  <div class="state-flag-container" style={{
                    width: "40px", display: "flex", justifyContent: "center", alignItems: "center", padding: "6px"
                  }}>
                    {player.state && player.state != "null" ?
                      <div class="flag" style={{
                        backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/state_flag/${player.country_code}/${player.state}.png)`
                      }}><span>{player.state}</span></div>
                    :
                      null
                    }
                  </div>
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

                <div class="player-main" style={{display: "flex", width: "120px"}}>
                  {player.mains.length > 0 ?
                    <div style={{
                      backgroundImage: `url(${process.env.PUBLIC_URL}/portraits/ssbu/chara_0_${this.getCharCodename(player, 0)}.png)`,
                      width: "128px", backgroundPositionX: "center", backgroundSize: "cover", backgroundColor: "#ababab", overflow: "hidden",
                      backgroundPositionY: (CHARACTER_EYE_HEIGHT_PERCENTAGE[player.mains[0]]+"%" || "center")
                    }}>
                      <div style={{overflow: "hidden", display: "flex", height: "100%", alignItems: "flex-end", justifyContent: "flex-end"}}>
                        {player.mains.slice(1).map((main, i)=>(
                          <div class="player-main-mini" style={{
                            backgroundImage: `url(${process.env.PUBLIC_URL}/portraits/ssbu/chara_2_${this.getCharCodename(player, i+1)}.png)`,
                            width: "24px", height: "24px", backgroundPosition: "center", backgroundSize: "cover",
                            flexGrow: 0, display: "flex", flexShrink: 1
                          }}></div>
                        ))}
                      </div>
                    </div>
                    :
                    <div style={{
                      backgroundImage: `url(${process.env.PUBLIC_URL}/portraits/ssbu/chara_0_random.png)`,
                      width: "128px", backgroundPosition: "center", backgroundSize: "cover", backgroundColor: "#ababab"
                    }}></div>
                  }
                </div>
              </li>
            ))}
          </>
          :
          null
        }

        
      </div>
    )
  }
};

export default Players