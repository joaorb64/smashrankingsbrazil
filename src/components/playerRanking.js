import React, { Component } from 'react'
import styles from './contacts.module.css'
import { Link, useParams, useLocation } from 'react-router-dom';
import LeagueSelector from './leagueselector';
import moment from "../../node_modules/moment-timezone/moment-timezone";
import CHARACTERS from "../globals";
import LazyLoad from 'react-lazyload';

class PlayerRanking extends Component {
  state = {
    selectedLeague: 0,
    players: [],
    top3Colors: ["#D6AF36", "#D7D7D7", "#A77044"],
    top3Colors2: ["#AF9500", "#B4B4B4", "#6A3805"],
    top3Colors3: ["#C9B037", "#A7A7AD", "#824A02"]
  }

  componentDidUpdate(nextProps) {
    if(nextProps !== this.props) {
      if(this.props.match){
        let selectedId = this.props.match.match.params["id"];    
        if(selectedId){
          let selectedLeague = this.props.contacts.findIndex((a)=>{return a.id == selectedId});
          if(selectedLeague != -1){
            this.selectLeague(selectedLeague);
          }
        }
      }

      if(this.props.ranking){
        this.state.players = this.props.ranking;
      } else {
        this.state.players = null;
      }

      if(this.props.updateTime){
        this.state.updateTime = this.props.updateTime;
      } else {
        this.state.updateTime = null;
      }

      this.setState(this.state);
    }
  }

  componentDidMount() {
    if(this.props.match){
      let selectedId = this.props.match.match.params["id"];    
      if(selectedId){
        let selectedLeague = this.props.contacts.findIndex((a)=>{return a.id == selectedId});
        if(selectedLeague != -1){
          this.selectLeague(selectedLeague);
        }
      }
    }

    if(this.props.ranking){
      this.state.players = this.props.ranking;
    } else {
      this.state.players = [];
    }

    this.state.updateTime = this.props.updateTime;

    this.setState(this.state);
  }

  selectLeague(i){
    if(i != this.state.selectedLeague){
      this.state.selectedLeague = i;
      this.updateData();
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
    }
  }

  render (){
    return(
      <div style={{textAlign: "center", fontFamily: "SmashFont"}}>

        {this.state.players && this.state.players.length > 0 ?
          <ul class="list-group" style={{padding: "10px"}}>
            <div class="row no-gutters" style={{margin: "0 -4px"}}>
              {this.state.players.slice(0,3).map((player, i) => (
                <div class={"col-md-4 col-sm-4 col-xs-12 " + styles.listItemParent}
                style={{padding: "0px 4px", cursor: "pointer"}}
                data-toggle="modal" data-target="#playerModal"
                onClick={()=>this.openPlayerModal(player)}
                key={this.state.selectedLeague+'_'+i}>
                  <li class={styles.top3container + " slide-fade list-group-item"} style={{
                      backgroundColor: this.state.top3Colors[i], borderRadius: "10px", border: 0, marginBottom: "5px", width: "100%", lineHeight: "48px",
                      padding: 0, display: "flex", alignSelf: "center", overflow: "hidden"
                    }}>
                      <div style={{
                        backgroundColor: this.state.top3Colors2[i], position: "absolute",
                        top: 0, bottom: 0, left: 0, right: 0,
                        clipPath: "polygon(0 0, 0% 100%, 100% 100%)"
                      }}></div>
                      <div style={{
                        backgroundColor: this.state.top3Colors3[i], position: "absolute",
                        top: 0, bottom: 0, left: 0, right: 0,
                        clipPath: "polygon(0 60%, 0% 100%, 100% 100%)"
                      }}></div>
                      <div style={{
                        backgroundImage: `url(${process.env.PUBLIC_URL}/portraits/ssbu/chara_1_${this.getCharCodename(player, 0)}.png)`, display: "flex",
                        width: "-webkit-fill-available", backgroundPosition: "center", backgroundSize: "cover",
                        filter: "drop-shadow(10px 10px 0px #000000AF)", marginLeft: "-10px", marginTop: "-10px"
                      }}></div>
                    
                      <div class={styles.listItemChild} style={{
                        backgroundColor: "#f0f0f0", alignItems: "center", display: "flex", flexDirection: "column",
                        height: "60px", position: "absolute", left: "0px", right: "0px", bottom: 0, justifyContent: "center"
                      }}>
                        <div style={{
                          flexGrow: 0, fontSize: "1.6rem", lineHeight: "2rem", width: "100%",
                          textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"
                        }}><b style={{color: "#bb0000"}}>{player.org} </b>{player.name}</div>
                        <div style={{
                          flexGrow: 0, fontSize: "1rem", lineHeight: "1rem", width: "100%", color: "darkgray",
                          textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"
                        }}>{player.full_name}</div>
                      </div>

                      <div style={{
                        width: "200px", height: "200px", position: "absolute", backgroundColor: "#f0f0f0", top: -100, left: -100,
                        transform: "rotate(-45deg)"
                      }}>
                      </div>
                      <div style={{
                        width: "100px", height: "100px", position: "absolute", top: 0
                      }}>
                        <div style={{
                          width: 100, height: 100, backgroundImage: `url(${process.env.PUBLIC_URL}/icons/rank${i+1}.png)`,
                          backgroundSize: "cover", position: "absolute"
                        }}></div>
                      </div>

                      <div style={{
                        position: "absolute", left: "0px", right: "0px", bottom: "60px",
                        color: "white", display: "flex", whiteSpace: "nowrap", lineHeight: "32px"
                      }}>
                        <div style={{
                          display: "flex", flexGrow: 1, flexWrap: "wrap", alignSelf: "flex-end",
                          padding: "10px", filter: "drop-shadow(2px 2px 0px black)",
                        }}>
                          {player.mains.length > 0 ?
                            player.mains.slice(1).map((main, i)=>(
                              <div style={{
                                backgroundImage: `url(${process.env.PUBLIC_URL}/portraits/ssbu/chara_2_${this.getCharCodename(player, i+1)}.png)`,
                                width: "32px", height: "32px", backgroundPosition: "center", backgroundSize: "cover",
                                flexGrow: 0, display: "inline-block"
                              }}></div>
                            ))
                            :
                            null
                          }
                        </div>
                        {player.country_code && player.country_code != "null" ?
                          <div class="" style={{
                            width: "48px", display: "flex", justifyContent: "center", alignItems: "center", padding: "8px", alignSelf: "flex-end"
                          }}>
                            <div class="state-flag" style={{
                              backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/country_flag/${player.country_code.toLowerCase()}.png)`,
                              width: "100%", height: "32px", display: "inline-block", backgroundSize: "contain", backgroundRepeat: "no-repeat",
                              backgroundPosition: "center", paddingTop: "20px"
                            }}>{player.country_code}</div>
                          </div>
                          :
                          null
                        }
                        {player.state && player.state != "null" ?
                          <div class="" style={{
                            width: "48px", display: "flex", justifyContent: "center", alignItems: "center", padding: "8px", alignSelf: "flex-end"
                          }}>
                            <div class="state-flag" style={{
                              backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/state_flag/${player.country_code}/${player.state}.png)`,
                              width: "100%", height: "32px", display: "inline-block", backgroundSize: "contain", backgroundRepeat: "no-repeat",
                              backgroundPosition: "center", paddingTop: "20px"
                            }}>{player.state}</div>
                          </div>
                          :
                          null
                        }
                        <div style={{
                          fontSize: "1.4rem", backgroundColor: "black", color: "white", textAlign: "right",
                          alignSelf: "flex-end", padding: "6px", paddingTop: "2px", paddingBottom: "2px"
                        }}>
                          {player.score} pts.
                        </div>
                      </div>

                      {player.avatar ?
                        <a href={"http://twitter.com/"+player.twitter}>
                          <LazyLoad>
                            <div style={{
                              backgroundImage: `url(${player.avatar})`,
                              width: "96px", height: "96px", backgroundSize: "cover", backgroundPosition: "center",
                              borderRadius: "100%", position: "absolute", right: 10, top: 10, border: "5px #f0f0f0 solid",
                              backgroundColor: "gray"
                            }}>
                              {player.twitter ? 
                                <div style={{width: "100%", height: "100%", display: "flex", alignItems: "flex-end", justifyContent: "flex-end", margin: "5px"}}>
                                  <div style={{
                                    backgroundImage: "url(/icons/twitter.svg)", width: 32, height: 32, bottom: 0, right: 0
                                  }}></div>
                                </div>
                                :
                                null}
                            </div>
                          </LazyLoad>
                        </a>
                      :
                        null
                      }
                  </li>
                </div>
              ))}
            </div>


            {this.state.players.slice(3).map((player, i) => (
              <li key={this.state.selectedLeague+"_"+i}
              class={"slide-fade " + styles.listItem + " list-group-item"}
              style={{cursor: "pointer"}}
              data-toggle="modal" data-target="#playerModal"
              onClick={()=>this.openPlayerModal(player)}
              >
                <div class={styles.playerRanking}>{player.ranking}</div>

                {player.avatar ?
                  <LazyLoad style={{width: "64px", height: "100%"}}>
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
                  </LazyLoad>
                :
                  <div class="player-avatar" style={{
                    width: "64px", height: "48px", display: "inline-block", backgroundSize: "cover", backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}></div>
                }

                <div class="state-flag-container" style={{
                  width: "40px", display: "flex", justifyContent: "center", alignItems: "center", padding: "6px"
                }}>
                  {player.country_code && player.country_code != "null" ?
                    <div class="state-flag" style={{
                      backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/country_flag/${player.country_code.toLowerCase()}.png)`,
                      width: "100%", height: "100%", display: "inline-block", backgroundSize: "contain", backgroundRepeat: "no-repeat",
                      backgroundPosition: "center"
                    }}>{player.country_code}</div>
                  :
                    null
                  }
                </div>

                <div class="state-flag-container" style={{
                  width: "40px", display: "flex", justifyContent: "center", alignItems: "center", padding: "6px"
                }}>
                  {player.state && player.state != "null" ?
                    <div class="state-flag" style={{
                      backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/state_flag/${player.country_code}/${player.state}.png)`,
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

                <div class="player-score" style={{width: "128px", padding: "5px", display: "flex", flexDirection: "column", justifyContent: "center", flexShrink: 0}}>
                  <div style={{backgroundColor: "black", flexGrow: 1, display: "flex"}}>
                    <div style={{
                      backgroundColor: "black", color: "white", fontSize: "1.2rem", lineHeight: "1.2rem", flexGrow: 1, alignSelf: "center", width: "100%"
                    }}>{player.score} pts.</div>
                  </div>
                </div>

                <div class="player-main" style={{display: "flex", width: "120px"}}>
                  {player.mains.length > 0 ?
                    <div style={{
                      backgroundImage: `url(${process.env.PUBLIC_URL}/portraits/ssbu/chara_0_${this.getCharCodename(player, 0)}.png)`,
                      width: "128px", backgroundPosition: "center 45%", backgroundSize: "cover", backgroundColor: "#ababab", overflow: "hidden"
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
            <div style={{textAlign: "right", fontFamily: "SmashFont", color: "white"}}>
              <div class="col-12" style={{padding: "0 0px"}}>
                Dados atualizados em: {moment(this.state.updateTime).subtract(3, "hours").format("DD/MM/YY HH:mm") + " (GMT-3)"}
              </div>
            </div>
          </ul>
          :
            this.state.updateTime ?
              <div class={"col-12"} style={{paddingTop: 10}}>
                <div class={styles.listItem} style={{padding: "10px 10px", lineHeight: "24px", height: "auto"}}>
                  Não foi encontrado ranking para esta liga no Braacket. Para solução de problemas, entre em contato com os TOs da sua região.
                </div>
              </div>
            :
            <div class="loader"></div>
        }
      </div>
    )
  }
};

export default PlayerRanking