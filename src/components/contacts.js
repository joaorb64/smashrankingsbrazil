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
    fetch('https://cdn.jsdelivr.net/gh/joaorb64/tournament_api/out/'+this.props.contacts[this.state.selectedLeague].id+'.json')
    .then(res => res.json())
    .then((data) => {
      if(data){
        let players = [];

        Object.keys(data).forEach(function(player){
          players.push(data[player]);
        });

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
                backgroundImage: `url(https://cdn.jsdelivr.net/gh/joaorb64/tournament_api@master/icon/${contact.id}.png)`
              }}></div>
              {contact.name}
            </button>
          ))}
        </div>


        <ul class="list-group" style={{padding: "10px"}}>

        
          {this.state.players.length > 3 ?
            <div class="row no-gutters">
              <div class="col-md-8" style={{paddingRight: "5px"}}>
                <li key='123' class="list-group-item" style={{
                    backgroundColor: "#f0f0f0", borderRadius: "10px", border: 0, marginBottom: "5px", width: "100%", height: "512px", lineHeight: "48px",
                    padding: 0, display: "flex", alignSelf: "center", overflow: "hidden", backgroundColor: "#f7c407"
                  }}>
                    <div style={{
                      backgroundImage: `url(./portraits-full/${this.getCharName(this.state.players[0].mains[0].name)}.png)`, display: "flex",
                      width: "100%", backgroundPosition: "center", backgroundSize: "cover", 
                      filter: "drop-shadow(10px 10px 0px #000000AF)"
                    }}>
                      <div style={{
                        paddingLeft: "40px", paddingRight: "40px", paddingTop: "20px", display: "flex", backgroundColor: "#f0f0f0",
                        height: "80px", position: "absolute", left: "-30px", right: "-30px", bottom: 0,
                      }}>
                        <div style={{
                          flexGrow: 1, fontSize: "3.2rem",
                          textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"
                        }}>{this.state.players[0].name}</div>
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
                      fontSize: "3rem", position: "absolute", right: "0px", bottom: "80px", backgroundColor: "black", color: "white", padding: "10px"
                    }}>
                      {this.state.players[0].score} pts.
                    </div>
                </li>
                <div class="d-md-block" style={{display: "none", width: 5}}></div>
              </div>

              <div class="col-md-4">
                <div class="">
                  <li key='123' class="list-group-item" style={{
                      backgroundColor: "#f0f0f0", borderRadius: "10px", border: 0, marginBottom: "5px", width: "100%", height: "302px", lineHeight: "48px",
                      padding: 0, display: "flex", alignSelf: "center", overflow: "hidden", backgroundColor: "#b9b9b9"
                    }}>
                      <div style={{
                        backgroundImage: `url(./portraits-full/${this.getCharName(this.state.players[1].mains[0].name)}.png)`, display: "flex",
                        width: "100%", backgroundPosition: "center", backgroundSize: "cover",
                        filter: "drop-shadow(10px 10px 0px #000000AF)"
                      }}>
                        <div style={{
                          paddingLeft: "40px", paddingRight: "40px", paddingTop: "10px", display: "flex", backgroundColor: "#f0f0f0",
                          height: "60px", position: "absolute", left: "-30px", right: "-30px", bottom: 0
                        }}>
                          <div style={{
                            flexGrow: 1, fontSize: "2.0rem",
                            textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"
                          }}>{this.state.players[1].name}</div>
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
                        fontSize: "2rem", position: "absolute", right: "0px", bottom: "60px", backgroundColor: "black", color: "white", padding: "0px 10px"
                      }}>
                        {this.state.players[1].score} pts.
                      </div>
                  </li>
                </div>
                <div class="">
                  <li key='123' class="list-group-item" style={{
                      backgroundColor: "#f0f0f0", borderRadius: "10px", border: 0, marginBottom: "5px", width: "100%", height: "205px", lineHeight: "48px",
                      padding: 0, display: "flex", alignSelf: "center", overflow: "hidden", backgroundColor: "#c55d30"
                    }}>
                      <div style={{
                        backgroundImage: `url(./portraits-full/${this.getCharName(this.state.players[2].mains[0].name)}.png)`, display: "flex",
                        width: "100%", backgroundPosition: "center", backgroundSize: "cover",
                        filter: "drop-shadow(10px 10px 0px #000000AF)"
                      }}>
                        <div style={{
                          paddingLeft: "40px", paddingRight: "40px", paddingTop: "4px", display: "flex", backgroundColor: "#f0f0f0",
                          height: "50px", position: "absolute", left: "-30px", right: "-30px", bottom: 0
                        }}>
                          <div style={{
                            flexGrow: 1, fontSize: "2.0rem",
                            textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"
                          }}>{this.state.players[2].name}</div>
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
                        fontSize: "1.6rem", position: "absolute", right: "0px", bottom: "50px", backgroundColor: "black", color: "white", padding: "0px 10px"
                      }}>
                        {this.state.players[2].score} pts.
                      </div>
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
              padding: 0, display: "flex", alignSelf: "center", overflow: "hidden", animationDelay: (i/30.0)+"s"
            }}>
              <div style={{width: "45px", textAlign: "center", fontSize: "1.2rem"}}>{player.rank}</div>

              <div style={{flexGrow: 1, overflow: "hidden", textOverflow: "ellipsis"}}>{player.name}</div>

              <div style={{width: "128px", padding: "5px"}}>
                <div style={{
                  backgroundColor: "black", color: "white", height: "32px", lineHeight: "32px", fontSize: "1.2rem"
                }}>{player.score} pts.</div>
              </div>

              
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
            </li>
          ))}
        </ul>
      </div>
    )
  }
};

export default Contacts