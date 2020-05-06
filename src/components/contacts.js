import React, { Component } from 'react'
import styles from './contacts.module.css'
import { Link, useParams, useLocation } from 'react-router-dom';
import LeagueSelector from './leagueselector';

class Contacts extends Component {
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

      this.updateData();
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

    if(this.props.contacts.length > 0){
      this.updateData();
    }
  }

  updateData() {
    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/master/out/'+this.props.contacts[this.state.selectedLeague].id+'.json')
    .then(res => res.json())
    .then((data) => {
      if(data){
        let players = [];

        Object.keys(data.ranking).forEach(function(player){
          if(data["ranking"][player].avatar){
            data["ranking"][player].avatar = `https://raw.githubusercontent.com/joaorb64/tournament_api/master/${data["ranking"][player].avatar}`;
          } else if (data["ranking"][player].twitter) {
            data["ranking"][player].avatar = `https://avatars.io/twitter/${this.getTwitterHandle(data["ranking"][player].twitter)}`;
          }

          if(!data["ranking"][player].mains){
            data["ranking"][player].mains = [];
          }

          if(data["ranking"][player].mains.length == 0){
            data["ranking"][player].mains.push({name: "Random", icon: ""});
          }

          if((data["ranking"][player]["rank"])){
            data["ranking"][player]["score"] = data["ranking"][player]["rank"][this.props.contacts[this.state.selectedLeague].id]["score"];
            data["ranking"][player]["ranking"] = data["ranking"][player]["rank"][this.props.contacts[this.state.selectedLeague].id]["rank"];
            if(data["ranking"][player]["ranking"]){
              players.push(data["ranking"][player]);
            }
          }
        }, this);
        
        players.sort(function(a, b){
          return Number(a["ranking"]) - Number(b["ranking"]);
        });

        this.setState({ players: players, updateTime: data["update_time"] })
      }
    })
    .catch(console.log)
  }

  selectLeague(i){
    if(i != this.state.selectedLeague){
      this.state.selectedLeague = i;
      this.updateData();
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

  render (){
    return(
      <div style={{textAlign: "center", fontFamily: "SmashFont"}}>
        <LeagueSelector
          leagues={this.props.contacts}
          selectLeague={this.selectLeague.bind(this)}
          selectedLeague={this.state.selectedLeague}
        />

        {this.state.players && this.state.players.length > 0 ?
          <ul class="list-group" style={{padding: "10px"}}>
            <div class="row no-gutters" style={{margin: "0 -4px"}}>
              {this.state.players.slice(0,3).map((player, i) => (
                <div class={"col-md-4 " + styles.listItemParent}
                style={{padding: "0px 4px", cursor: "pointer"}}
                data-toggle="modal" data-target="#playerModal"
                onClick={()=>this.openPlayerModal(player)}>
                  <li key={this.state.selectedLeague+'_'+i} class={styles.top3container + " slide-fade list-group-item"} style={{
                      backgroundColor: this.state.top3Colors[i], borderRadius: "10px", border: 0, marginBottom: "5px", width: "100%", lineHeight: "48px",
                      padding: 0, display: "flex", alignSelf: "center", overflow: "hidden", animationDelay: (i/50.0)+"s"
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
                        backgroundImage: `url(${process.env.PUBLIC_URL}/portraits-full/${this.getCharName(player.mains[0].name)}.png)`, display: "flex",
                        width: "100%", backgroundPosition: "center", backgroundSize: "cover",
                        filter: "drop-shadow(10px 10px 0px #000000AF)"
                      }}>
                        <div class={styles.listItemChild} style={{
                          backgroundColor: "#f0f0f0", alignItems: "center", display: "flex", flexDirection: "column",
                          height: "60px", position: "absolute", left: "0px", right: "0px", bottom: 0, justifyContent: "center"
                        }}>
                          <div style={{
                            flexGrow: 0, fontSize: "1.6rem", lineHeight: "2rem", width: "100%",
                            textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"
                          }}>{player.name}</div>
                          <div style={{
                            flexGrow: 0, fontSize: "1rem", lineHeight: "1rem", width: "100%", color: "darkgray",
                            textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"
                          }}>{player.full_name}</div>
                        </div>
                      </div>

                      <div style={{
                        width: "200px", height: "200px", position: "absolute", backgroundColor: "#f0f0f0", top: -100, left: -100, transform: "rotate(-45deg)"
                      }}>
                      </div>
                      <div style={{
                        width: "100px", height: "100px", position: "absolute", top: 0
                      }}>
                        <div style={{
                          width: 100, height: 100, backgroundImage: `url(${process.env.PUBLIC_URL}/icons/rank${i+1}.png)`,
                          backgroundSize: "cover", position: "absolute", left: -10, top: -10
                        }}></div>
                      </div>

                      <div style={{
                        position: "absolute", left: "0px", right: "0px", bottom: "60px",
                        color: "white", display: "flex", whiteSpace: "nowrap", lineHeight: "32px"
                      }}>
                        <div style={{
                          display: "flex", flexGrow: 1, flexWrap: "wrap", alignSelf: "flex-end", padding: "10px", filter: "drop-shadow(2px 2px 0px black)"
                        }}>
                          {player.mains.length > 0 ?
                            player.mains.slice(1).map((main)=>(
                              <div style={{
                                backgroundImage: `url(http://braacket.com/${this.getCharName(main.icon)})`,
                                width: "32px", height: "32px", backgroundPosition: "center", backgroundSize: "cover",
                                flexGrow: 0, display: "inline-block"
                              }}></div>
                            ))
                            :
                            null
                          }
                        </div>
                        <div class="" style={{
                          width: "64px", display: "flex", justifyContent: "center", alignItems: "center", padding: "8px", alignSelf: "flex-end"
                        }}>
                          {player.state ?
                            <div class="state-flag" style={{
                              backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/master/state_icon/${player.state}.png)`,
                              width: "100%", height: "47px", display: "inline-block", backgroundSize: "contain", backgroundRepeat: "no-repeat",
                              backgroundPosition: "center", paddingTop: "32px"
                            }}>{player.state}</div>
                          :
                            null
                          }
                        </div>
                        <div style={{
                          fontSize: "2rem", backgroundColor: "black", color: "white", textAlign: "right",
                          alignSelf: "flex-end", padding: "10px"
                        }}>
                          {player.score} pts.
                        </div>
                      </div>

                      {player.avatar ?
                        <a href={player.twitter}>
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
              style={{animationDelay: ((i+3)/50.0)+"s", cursor: "pointer"}}
              data-toggle="modal" data-target="#playerModal"
              onClick={()=>this.openPlayerModal(player)}
              >
                <div class={styles.playerRanking}>{player.ranking}</div>

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

                <div class="player-score" style={{width: "128px", padding: "5px", display: "flex", flexDirection: "column", justifyContent: "center", flexShrink: 0}}>
                  <div style={{backgroundColor: "black", flexGrow: 1, display: "flex"}}>
                    <div style={{
                      backgroundColor: "black", color: "white", fontSize: "1.2rem", lineHeight: "1.2rem", flexGrow: 1, alignSelf: "center", width: "100%"
                    }}>{player.score} pts.</div>
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
            <div style={{textAlign: "right", fontFamily: "SmashFont", color: "white"}}>
              <div class="col-12" style={{padding: "0 0px"}}>
                Dados atualizados em: {this.state.updateTime}
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
            <div class={"col-12"} style={{paddingTop: 10}}>
              <div class={styles.listItem} style={{padding: "10px 10px", lineHeight: "24px", height: "auto"}}>
                Loading...
              </div>
            </div>
        }
      </div>
    )
  }
};

export default Contacts