import React, { Component } from 'react'
import styles from './contacts.module.css'
import { Link, useParams, useLocation } from 'react-router-dom';
import PlayerModalGranblue from './playermodalgranblue';
import styles_selector from './leagueselector.module.css'
import StatisticsGranblue from './statisticsgranblue';

class Granblue extends Component {
  state = {
    selectedLeague: 0,
    selectedTab: "ps4",
    players_pc: [],
    players_ps4: [],
    top3Colors: ["#D6AF36", "#D7D7D7", "#A77044"],
    top3Colors2: ["#AF9500", "#B4B4B4", "#6A3805"],
    top3Colors3: ["#C9B037", "#A7A7AD", "#824A02"]
  }

  componentDidUpdate(nextProps) {
    if(nextProps !== this.props) {
      this.updateData();
    }
  }

  componentDidMount() {
    if(this.props.match){
      let selectedTab = this.props.match.match.params["tab"];
      if(selectedTab){
        this.handleTabChange(selectedTab);
        console.log(this.state.selectedTab)
      }
    }
    
    this.updateData();
  }

  preloadImagesPc(index) {
    index = index || 0;

    if(!this.state.players_pc) return
    if(index >= this.state.players_pc.length) return

    if(!this.state.players_pc[index].twitter){
      this.preloadImagesPc(index+1);
      return;
    }

    var img = new Image();
    img.onload = (()=>{
      this.state.players_pc[index].avatar = img.src;
      this.preloadImagesPc(index + 1);
      this.setState(this.state);
    }, this)
    img.onerror = ()=>{
      this.state.players_pc[index].avatar = img.src;
      this.preloadImagesPc(index + 1);
      this.setState(this.state);
    }
    img.src = `https://twivatar.glitch.me/${this.getTwitterHandle(this.state.players_pc[index].twitter)}`;
  }

  preloadImagesPs4(index) {
    index = index || 0;

    if(!this.state.players_ps4) return
    if(index >= this.state.players_ps4.length) return

    if(!this.state.players_ps4[index].twitter){
      this.preloadImagesPs4(index+1);
      return;
    }

    var img = new Image();
    img.onload = (()=>{
      this.state.players_ps4[index].avatar = img.src;
      this.preloadImagesPs4(index + 1);
      this.setState(this.state);
    }, this)
    img.onerror = ()=>{
      this.state.players_ps4[index].avatar = img.src;
      this.preloadImagesPs4(index + 1);
      this.setState(this.state);
    }
    img.src = `https://twivatar.glitch.me/${this.getTwitterHandle(this.state.players_ps4[index].twitter)}`;
  }

  updateData() {
    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/master/granblue/out/ranking.json')
    .then(res => res.json())
    .then((data) => {
      fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/master/granblue/allplayers.json')
      .then(res => res.json())
      .then((allplayers_data) => {
        if(data && allplayers_data){
          this.state.allplayers = allplayers_data;

          let players_pc = [];
          let players_ps4 = [];

          Object.keys(data["ranking"]).forEach(function(id){
            let p = allplayers_data["players"][allplayers_data["mapping"][id]]

            if(p.twitter) {
              p.avatar = "?";
            }
  
            if(p.mains.length == 0 || p.mains[0] == ""){
              p.mains = ["Random"]
            }

            if(p["tournament_points_pc"].length > 0)
              players_pc.push(p);
            if(p["tournament_points_ps4"].length > 0)
              players_ps4.push(p);
          }, this);
          
          players_pc.sort(function(a, b){
            if(Number(b["score_pc"]) - Number(a["score_pc"]) != 0){
              return Number(b["score_pc"]) - Number(a["score_pc"]);
            } else {
              if(a["name"] < b["name"]) { return -1; }
              if(a["name"] > b["name"]) { return 1; }
              return 0;
            }
          });

          players_ps4.sort(function(a, b){
            if(Number(b["score_ps4"]) - Number(a["score_ps4"]) != 0){
              return Number(b["score_ps4"]) - Number(a["score_ps4"]);
            } else {
              if(a["name"] < b["name"]) { return -1; }
              if(a["name"] > b["name"]) { return 1; }
              return 0;
            }
          });

          this.state.players_pc = players_pc;
          this.state.players_ps4 = players_ps4;
          this.setState({ players_pc: players_pc, players_ps4: players_ps4, statistics: data.statistics })

          this.preloadImagesPc();
          this.preloadImagesPs4();
        }
      })
      .catch(console.log)
    })
    .catch(console.log)
  }

  getCharName(name){
    return name.toLowerCase().replace(/ /g, "_");
  }

  getTwitterHandle(twitter){
    let parts = twitter.split('/');
    return parts[parts.length-1];
  }

  normalizePlayerName(name){
    return name.replace(/á/g, "a").replace(/Á/g, "A")
      .normalize("NFKD")
      .replace(/ /g, '_').replace(/@/g, "_At_")
      .replace(/~/g, "_Tilde_").replace(RegExp('[^0-9a-zA-Z_-]'), '')
      .replace("|", "")
  }

  openPlayerModal(player){
    if(window.playerModalGranblue){
      window.playerModalGranblue.player = player
      window.playerModalGranblue.fetchPlayer();
    }
  }

  handleTabChange(value){
    if(this.state.selectedTab != value){
      this.state.selectedTab = value;
      this.setState(this.state);
    }
  }

  render (){
    let players = this.state.selectedTab == "pc" ? this.state.players_pc : this.state.players_ps4;
    let score_string = this.state.selectedTab == "pc" ? "score_pc" : "score_ps4";

    return(
      <div style={{textAlign: "center", fontFamily: "SmashFont"}}>
        <div className="teste btn-group btn-group-toggle col-12" style={{padding: "5px 8px 0px 10px", marginBottom: "-5px"}}>
          <button className={styles_selector.teste+" btn col-12"} value="ps4" aria-expanded={this.state.selectedTab === "ps4"} onClick={(event)=>this.handleTabChange(event.target.value)}>
            PS4
          </button>
          <button className={styles_selector.teste+" btn col-12"} value="pc" aria-expanded={this.state.selectedTab === "pc"} onClick={(event)=>this.handleTabChange(event.target.value)}>
            PC
          </button>
          <button className={styles_selector.teste+" btn col-12"} value="statistics" aria-expanded={this.state.selectedTab === "statistics"} onClick={(event)=>this.handleTabChange(event.target.value)}>
            Estatísticas
          </button>
        </div>

        {
          this.state.selectedTab == "ps4" || this.state.selectedTab == "pc" ?
            <ul class="list-group" style={{padding: "10px"}}>
              <div class="row no-gutters" style={{margin: "0 -4px"}}>
                {players.slice(0,3).map((player, i) => (
                  <div class={"col-md-4 " + styles.listItemParent}
                  style={{padding: "0px 4px", cursor: "pointer"}}
                  data-toggle="modal" data-target="#playerModalGranblue"
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
                          backgroundImage: `url(${process.env.PUBLIC_URL}/portraits-full/granblue/${this.getCharName(player.mains[0])}.png)`, display: "flex",
                          width: "100%", backgroundPosition: "center 0", backgroundSize: "cover",
                          filter: "drop-shadow(10px 10px 0px #000000AF)"
                        }}>
                          <div class={styles.listItemChild} style={{
                            backgroundColor: "#f0f0f0", alignItems: "center", display: "flex", flexDirection: "column",
                            height: "60px", position: "absolute", left: "0px", right: "0px", bottom: 0, justifyContent: "center"
                          }}>
                            <div style={{
                              flexGrow: 0, fontSize: "2rem", lineHeight: "2rem", width: "100%",
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
                                  backgroundImage: `url(http://braacket.com/${this.getCharName(main)})`,
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
                            {player[score_string]} pts.
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


              {players.slice(3).map((player, i) => (
                <li key={this.state.selectedLeague+"_"+i}
                class={"slide-fade " + styles.listItem + " list-group-item"}
                style={{animationDelay: ((i+3)/50.0)+"s", cursor: "pointer"}}
                data-toggle="modal" data-target="#playerModalGranblue"
                onClick={()=>this.openPlayerModal(player)}
                >
                  <div class={styles.playerRanking}>{i+4}</div>

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
                      }}>{player[score_string]} pts.</div>
                    </div>
                  </div>

                  <div class="player-main" style={{display: "flex", width: "128px"}}>
                    {player.mains.length > 0 ?
                      <div style={{
                        backgroundImage: `url(${process.env.PUBLIC_URL}/portraits-small/granblue/${this.getCharName(player.mains[0])}.png)`,
                        width: "128px", backgroundPosition: "center", backgroundSize: "cover", backgroundColor: "#ababab", overflow: "hidden"
                      }}>
                        <div style={{overflow: "hidden", display: "flex", height: "100%", alignItems: "flex-end", justifyContent: "flex-end"}}>
                          {player.mains.slice(1).map((main)=>(
                            <div class="player-main-mini" style={{
                              backgroundImage: `url(${process.env.PUBLIC_URL}/portraits-small/granblue/${this.getCharName(main)}.png)`,
                              width: "24px", height: "24px", backgroundPosition: "center", backgroundSize: "cover",
                              flexGrow: 0, display: "flex", flexShrink: 1, borderRadius: "100%",
                              border: "1px solid black"
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
            </ul>
          :
            <StatisticsGranblue statistics={this.state.statistics} />
        }

        <PlayerModalGranblue />
      </div>
    )
  }
};

export default Granblue