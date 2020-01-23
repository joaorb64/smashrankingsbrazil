import React, { Component } from 'react'

class Contacts extends Component {
  state = {
    selectedLeague: 0,
    players: []
  }

  componentDidUpdate(nextProps) {
    if(nextProps !== this.props) {
      this.updateData();
    }
  }

  updateData() {
    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/master/out/'+this.props.contacts[this.state.selectedLeague].id+'.json')
    .then(res => res.json())
    .then((data) => {
      if(data){
        let players = [];

        Object.keys(data).forEach(function(player){
          if(data[player].avatar){
            data[player].avatar = `https://raw.githubusercontent.com/joaorb64/tournament_api/master/${data[player].avatar}`;
          } else if (data[player].twitter) {
            data[player].avatar = `https://avatars.io/twitter/${this.getTwitterHandle(data[player].twitter)}`;
          }

          if(!data[player].mains){
            data[player].mains = [];
          }

          if(data[player].mains.length == 0){
            data[player].mains.push({name: "Random", icon: ""});
          }

          players.push(data[player]);
        }, this);

        function compare(a, b) {
          if(parseInt(a.score) > parseInt(b.score)){
            return -1;
          }
          if(parseInt(a.score) < parseInt(b.score)){
            return 1;
          }
          return 0;
        }
        
        players.sort(compare);

        this.setState({ players: players })
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
    return name.toLowerCase().normalize("NFKD").replace('[ ]+', '_').replace('[^0-9a-zA-Z_-]', '')
  }

  render (){
    console.log(this.state.players);
    return(
      <div style={{textAlign: "center", fontFamily: "SmashFont"}}>
        <div class="btn-group btn-group-justified col-12" role="group" style={{marginTop: 10, padding: "0 10px"}}>
          {this.props.contacts.map((contact, i) => (
            <button onClick={()=>this.selectLeague(i)} type="button" class="btn btn-danger" style={{flexGrow: 1, flexBasis: 0, overflow: "hidden", textOverflow: "ellipsis"}}>
              <div style={{
                width: "32px", height: "32px", display: "inline-block", backgroundSize: "contain", backgroundRepeat: "no-repeat",
                backgroundPosition: "center", verticalAlign: "inherit", backgroundColor: "white", borderRadius: "100%", marginRight: "5px",
                backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/master/league_icon/${contact.id}.png)`
              }}></div>
              {contact.name}
            </button>
          ))}
        </div>


        <ul class="list-group" style={{padding: "10px"}}>

        
          {this.state.players.length > 3 ?
            <div class="row no-gutters">
              <div class="col-md-8 firstplayer-col" style={{paddingRight: "5px"}}>
                <li key={this.state.selectedLeague+'_0'} class="slide-fade list-group-item" style={{
                    backgroundColor: "#f0f0f0", borderRadius: "10px", border: 0, marginBottom: "5px", width: "100%", height: "512px", lineHeight: "48px",
                    padding: 0, display: "flex", alignSelf: "center", overflow: "hidden", backgroundColor: "#f7c407", animationDelay: (0/30.0)+"s"
                  }}>
                    <div style={{
                      backgroundImage: `url(./portraits-full/${this.getCharName(this.state.players[0].mains[0].name)}.png)`, display: "flex",
                      width: "100%", backgroundPosition: "center", backgroundSize: "cover", 
                      filter: "drop-shadow(10px 10px 0px #000000AF)"
                    }}>
                      <div style={{
                        backgroundColor: "#f0f0f0", alignItems: "center", display: "flex", flexDirection: "column",
                        height: "80px", position: "absolute", left: "0px", right: "0px", bottom: 0, justifyContent: "center"
                      }}>
                        <div style={{
                          flexGrow: 0, fontSize: "3.2rem", lineHeight: "3.2rem", width: "100%",
                          textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"
                        }}>{this.state.players[0].name}</div>
                        <div style={{
                          flexGrow: 0, fontSize: "1.2rem", lineHeight: "1.2rem", width: "100%", color: "darkgray",
                          textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"
                        }}>{this.state.players[0].full_name}</div>
                      </div>
                    </div>

                    <div style={{
                      width: "300px", height: "300px", position: "absolute", backgroundColor: "#f0f0f0", top: -150, left: -150, transform: "rotate(-45deg)"
                    }}>
                    </div>
                    <div style={{
                      width: "150px", height: "150px", position: "absolute", top: 0, left: "-20px", fontSize: "8rem", lineHeight: "150px"
                    }}>
                      1
                    </div>

                    <div style={{
                      position: "absolute", left: "0px", right: "0px", bottom: "80px",
                      color: "white", display: "flex", whiteSpace: "nowrap"
                    }}>
                      <div style={{
                        display: "flex", flexGrow: 1, flexWrap: "wrap", alignSelf: "flex-end", padding: "10px", filter: "drop-shadow(2px 2px 0px black)"
                      }}>
                        {this.state.players[0].mains.length > 0 ?
                          this.state.players[0].mains.slice(1).map((main)=>(
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
                      <div style={{
                        fontSize: "3rem", backgroundColor: "black", color: "white", textAlign: "right",
                        alignSelf: "flex-end", padding: "10px"
                      }}>
                        {this.state.players[0].score} pts.
                      </div>
                    </div>

                    {this.state.players[0].avatar ?
                      <div style={{
                        backgroundImage: `url(${this.state.players[0].avatar})`,
                        width: "128px", height: "128px", backgroundSize: "cover", backgroundPosition: "center",
                        borderRadius: "100%", position: "absolute", right: 10, top: 10, border: "5px #f0f0f0 solid"
                      }}></div>
                    :
                      null
                    }
                </li>
                <div class="d-md-block" style={{display: "none", width: 5}}></div>
              </div>

              <div class="col-md-4">
                <div class="">
                  <li key={this.state.selectedLeague+'_1'} class="slide-fade list-group-item" style={{
                      backgroundColor: "#f0f0f0", borderRadius: "10px", border: 0, marginBottom: "5px", width: "100%", height: "302px", lineHeight: "48px",
                      padding: 0, display: "flex", alignSelf: "center", overflow: "hidden", backgroundColor: "#b9b9b9", animationDelay: (1/30.0)+"s"
                    }}>
                      <div style={{
                        backgroundImage: `url(./portraits-full/${this.getCharName(this.state.players[1].mains[0].name)}.png)`, display: "flex",
                        width: "100%", backgroundPosition: "center", backgroundSize: "cover",
                        filter: "drop-shadow(10px 10px 0px #000000AF)"
                      }}>
                        <div style={{
                          backgroundColor: "#f0f0f0", alignItems: "center", display: "flex", flexDirection: "column",
                          height: "60px", position: "absolute", left: "0px", right: "0px", bottom: 0, justifyContent: "center"
                        }}>
                          <div style={{
                            flexGrow: 0, fontSize: "2rem", lineHeight: "2rem", width: "100%",
                            textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"
                          }}>{this.state.players[1].name}</div>
                          <div style={{
                            flexGrow: 0, fontSize: "1rem", lineHeight: "1rem", width: "100%", color: "darkgray",
                            textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"
                          }}>{this.state.players[1].full_name}</div>
                        </div>
                      </div>

                      <div style={{
                        width: "200px", height: "200px", position: "absolute", backgroundColor: "#f0f0f0", top: -100, left: -100, transform: "rotate(-45deg)"
                      }}>
                      </div>
                      <div style={{
                        width: "100px", height: "100px", position: "absolute", top: 0, left: "-10px", fontSize: "5rem", lineHeight: "100px"
                      }}>
                        2
                      </div>

                      <div style={{
                        position: "absolute", left: "0px", right: "0px", bottom: "60px",
                        color: "white", display: "flex", whiteSpace: "nowrap", lineHeight: "32px"
                      }}>
                        <div style={{
                          display: "flex", flexGrow: 1, flexWrap: "wrap", alignSelf: "flex-end", padding: "10px", filter: "drop-shadow(2px 2px 0px black)"
                        }}>
                          {this.state.players[1].mains.length > 0 ?
                            this.state.players[1].mains.slice(1).map((main)=>(
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
                        <div style={{
                          fontSize: "2rem", backgroundColor: "black", color: "white", textAlign: "right",
                          alignSelf: "flex-end", padding: "10px"
                        }}>
                          {this.state.players[1].score} pts.
                        </div>
                      </div>

                      {this.state.players[1].avatar ?
                        <div style={{
                          backgroundImage: `url(${this.state.players[1].avatar})`,
                          width: "96px", height: "96px", backgroundSize: "cover", backgroundPosition: "center",
                          borderRadius: "100%", position: "absolute", right: 10, top: 10, border: "5px #f0f0f0 solid"
                        }}></div>
                      :
                        null
                      }
                  </li>
                </div>
                <div class="">
                  <li key={this.state.selectedLeague+'_2'} class="slide-fade list-group-item" style={{
                      backgroundColor: "#f0f0f0", borderRadius: "10px", border: 0, marginBottom: "5px", width: "100%", height: "205px", lineHeight: "48px",
                      padding: 0, display: "flex", alignSelf: "center", overflow: "hidden", backgroundColor: "#c55d30", animationDelay: (2/30.0)+"s"
                    }}>
                      <div style={{
                        backgroundImage: `url(./portraits-full/${this.getCharName(this.state.players[2].mains[0].name)}.png)`, display: "flex",
                        width: "100%", backgroundPosition: "center", backgroundSize: "cover",
                        filter: "drop-shadow(10px 10px 0px #000000AF)"
                      }}>
                        <div style={{
                          backgroundColor: "#f0f0f0", alignItems: "center", display: "flex", flexDirection: "column",
                          height: "50px", position: "absolute", left: "0px", right: "0px", bottom: 0, justifyContent: "center"
                        }}>
                          <div style={{
                            flexGrow: 0, fontSize: "2rem", lineHeight: "2rem", width: "100%",
                            textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"
                          }}>{this.state.players[2].name}</div>
                          <div style={{
                            flexGrow: 0, fontSize: "1rem", lineHeight: "1rem", width: "100%", color: "darkgray",
                            textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"
                          }}>{this.state.players[2].full_name}</div>
                        </div>
                      </div>

                      <div style={{
                        width: "160px", height: "160px", position: "absolute", backgroundColor: "#f0f0f0", top: -80, left: -80, transform: "rotate(-45deg)"
                      }}>
                      </div>
                      <div style={{
                        width: "80px", height: "80px", position: "absolute", top: 0, left: "-8px", fontSize: "4rem", lineHeight: "80px"
                      }}>
                        3
                      </div>

                      <div style={{
                        position: "absolute", left: "0px", right: "0px", bottom: "50px",
                        color: "white", display: "flex", whiteSpace: "nowrap", lineHeight: "24px"
                      }}>
                        <div style={{
                          display: "flex", flexGrow: 1, flexWrap: "wrap", alignSelf: "flex-end", padding: "10px", filter: "drop-shadow(2px 2px 0px black)"
                        }}>
                          {this.state.players[2].mains.length > 0 ?
                            this.state.players[2].mains.slice(1).map((main)=>(
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
                        <div style={{
                          fontSize: "1.6rem", backgroundColor: "black", color: "white", textAlign: "right",
                          alignSelf: "flex-end", padding: "10px"
                        }}>
                          {this.state.players[2].score} pts.
                        </div>
                      </div>

                      {this.state.players[2].avatar ?
                        <div style={{
                          backgroundImage: `url(${this.state.players[2].avatar})`,
                          width: "84px", height: "84px", backgroundSize: "cover", backgroundPosition: "center",
                          borderRadius: "100%", position: "absolute", right: 10, top: 10, border: "5px #f0f0f0 solid"
                        }}></div>
                      :
                        null
                      }
                  </li>
                </div>
              </div>

            </div>
            :
            null
          }


          {this.state.players.slice(3).map((player, i) => (
            <li key={this.state.selectedLeague+"_"+i} class="slide-fade list-group-item" style={{
              backgroundColor: "#f0f0f0", borderRadius: "10px", border: 0, marginBottom: "5px", width: "100%", height: "42px", lineHeight: "48px",
              padding: 0, display: "flex", alignSelf: "center", overflow: "hidden", animationDelay: ((i+3)/30.0)+"s"
            }}>
              <div class="player-ranking" style={{width: "45px", textAlign: "center", fontSize: "1.2rem"}}>{i+4}</div>

              {player.avatar ?
                <div class="player-avatar" style={{
                  backgroundImage: `url(${player.avatar})`,
                  width: "64px", height: "48px", display: "inline-block", backgroundSize: "cover", backgroundRepeat: "no-repeat",
                  backgroundPosition: "center", backgroundColor: "white",
                }}></div>
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
                  }}></div>
                :
                  null
                }
              </div>

              <div style={{display: "flex", flexGrow: 1, overflow: "hidden", textOverflow: "ellipsis", justifyContent: "center"}}>
                <div class="player-name" style={{overflow: "hidden", textOverflow: "ellipsis",
                  whiteSpace: "nowrap", flexShrink: 0
                }}>
                  {player.name}
                </div>
                <div class="player-name-small" style={{
                  overflow: "hidden", textOverflow: "ellipsis", color: "darkgray", paddingLeft: 5, fontSize: "0.8rem",
                  whiteSpace: "nowrap"
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
                    backgroundImage: `url(./portraits-small/${this.getCharName(player.mains[0].name)}.png)`,
                    width: "128px", backgroundPosition: "center", backgroundSize: "cover", backgroundColor: "#ababab"
                  }}></div>
                  :
                  <div style={{
                    backgroundImage: `url(./portraits-small/${"random"}.png)`,
                    width: "128px", backgroundPosition: "center", backgroundSize: "cover", backgroundColor: "#ababab"
                  }}></div>
                }
                <div style={{position: "absolute", display: "flex", right: 0, bottom: 0}}>
                  {player.mains.slice(1).map((main)=>(
                    <div style={{
                      backgroundImage: `url(http://braacket.com/${this.getCharName(main.icon)})`,
                      width: "24px", height: "24px", backgroundPosition: "center", backgroundSize: "cover",
                      flexGrow: 0, display: "inline-block"
                    }}></div>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
};

export default Contacts