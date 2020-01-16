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
    fetch('https://cdn.jsdelivr.net/gh/joaorb64/tournament_api/out/'+this.props.contacts[this.state.selectedLeague]+'.json')
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
        <div class="btn-group" role="group" style={{margin: 10}}>
          {this.props.contacts.map((contact, i) => (
            <button onClick={()=>this.selectLeague(i)} type="button" class="btn btn-danger">{contact}</button>
          ))}
        </div>


        <ul class="list-group" style={{padding: "10px"}}>

        
          {this.state.players.length > 3 ?
            <div class="row">
              <div class="col-8" style={{paddingRight: "5px"}}>
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
                        <div style={{flexGrow: 1, fontSize: "3.2rem"}}>{this.state.players[0].name}</div>
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
                </li>
              </div>

              <div class="col-4" style={{paddingLeft: 0}}>
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
                          <div style={{flexGrow: 1, fontSize: "2.0rem"}}>{this.state.players[1].name}</div>
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
                          paddingLeft: "40px", paddingRight: "40px", paddingTop: "10px", display: "flex", backgroundColor: "#f0f0f0",
                          height: "60px", position: "absolute", left: "-30px", right: "-30px", bottom: 0
                        }}>
                          <div style={{flexGrow: 1, fontSize: "2.0rem"}}>{this.state.players[2].name}</div>
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
              <div style={{flexGrow: 1}}>{player.name}</div>
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