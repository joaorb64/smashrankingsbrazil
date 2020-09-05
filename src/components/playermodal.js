import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import CHARACTERS from "../globals";

class PlayerModal extends Component {
  state = {
    playerData: null
  }

  componentDidUpdate(nextProps) {
    if(nextProps !== this.props) {
      
    }
  }

  componentDidMount() {
    window.playerModal = this;
  }

  fetchPlayer(){
    if(this.player == null) return;

    this.setState({playerData: this.player})

    /*fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/master/player_data/'+this.player+'/data.json')
    .then(res => res.json())
    .then((data) => {
      if(data.avatar){
        data.avatar = `https://raw.githubusercontent.com/joaorb64/tournament_api/master/${data.avatar}`;
      } else if (data.twitter) {
        data.avatar = `https://twivatar.glitch.me/${this.getTwitterHandle(data.twitter)}`;
      }

      this.setState({playerData: data});
    });*/
  }

  getTwitterHandle(twitter){
    let parts = twitter.split('/');
    return parts[parts.length-1];
  }

  closeModal(){
    window.jQuery("#playerModal").modal("toggle");
  }

  getCharCodename(playerData, id){
    let skin = 0;

    if("skins" in Object.keys(playerData)){
      skin = playerData["skins"][id];
    }
    
    return CHARACTERS[playerData["mains"][id]]+"_0"+skin;
  }

  render (){
    return(
      <div class="modal fade" id="playerModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Player</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              {this.state.playerData ?
                  <div>
                    <div style={{height: "128px", background: "black", display: "flex", alignItems: "center"}}>
                      {
                        this.state.playerData.twitter ?
                          <a href={this.state.playerData.twitter}>
                            <div style={{
                              backgroundImage: `url(${this.state.playerData.avatar})`,
                              width: "96px", height: "96px", backgroundSize: "cover", backgroundPosition: "center",
                              borderRadius: "32px", border: "5px #f0f0f0 solid",
                              backgroundColor: "gray", margin: "20px"
                            }}>
                              {this.state.playerData.twitter ? 
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

                      <div style={{
                        backgroundImage: `url(${process.env.PUBLIC_URL}/portraits/ssbu/chara_1_${this.getCharCodename(this.state.playerData, 0)}.png)`,
                        width: "220px", backgroundPosition: "center 40%", backgroundSize: "cover", height: "100%"
                      }}></div>
                    </div>
                    <div>
                      <h3><b style={{color: "#bb0000"}}>{this.state.playerData.org}</b> {this.state.playerData.name}</h3>
                    </div>

                    <row>
                      <h5>Ligas:</h5>
                      {this.state.playerData.rank ?
                        <table class="table table-striped table-sm">
                          <thead>
                            <tr>
                              <th scope="col">Liga</th>
                              <th scope="col">Colocação</th>
                              <th scope="col">Pontuação</th>
                            </tr>
                          </thead>
                          <tbody>
                              {Object.values(this.state.playerData.rank).map((rank, i)=>(
                                <>
                                  <tr id={i} onClick={()=>{window.jQuery("#"+this.state.playerData.rank[i]+"_"+i).collapse("toggle");}}>
                                    {this.props.leagues ?
                                        <td>
                                          <Link 
                                            to={`/home/smash/${this.props.leagues.find(element => element.id == Object.keys(this.state.playerData.rank)[i]).id}`}
                                            onClick={()=>this.closeModal()}>
                                              {this.props.leagues.find(element => element.id == Object.keys(this.state.playerData.rank)[i]).name}
                                          </Link>
                                          <a href={`http://braacket.com/league/${this.state.playerData.braacket_links.find(x => x.startsWith(Object.keys(this.state.playerData.rank)[i])).replace(":", "/player/")}`}>
                                            <div style={{
                                              backgroundImage: `url(${process.env.PUBLIC_URL}/icons/external_link.svg)`,
                                              width: 16, height: 16, display: "inline-block", backgroundSize: "contain",
                                              marginLeft: 2, verticalAlign: "middle"
                                            }}></div>
                                          </a>
                                        </td>
                                    :
                                      <td>{Object.keys(this.state.playerData.rank)[i]}</td>
                                    }
                                    <td>{rank.rank}</td>
                                    <td>{rank.score}</td>
                                  </tr>
                                  <tr>
                                    <td colspan="99" style={{padding: 0}}>
                                      <div id={this.state.playerData.rank[i]+"_"+i} class="collapse" style={{backgroundColor: "#EDEDED"}}>
                                        <iframe width='100%' height='600px' frameborder='0' allowfullscreen
                                        src={`http://braacket.com/league/${this.state.playerData.braacket_links.find(x => x.startsWith(Object.keys(this.state.playerData.rank)[i])).replace(":", "/player/")}?&embed=1`}></iframe>
                                      </div>
                                    </td>
                                  </tr>
                                </>
                              ))}
                          </tbody>
                        </table>
                        :
                        <div>Este jogador não foi encontrado em nenhuma liga.</div>
                      }
                    </row>

                    {this.state.playerData.tournaments ?
                      <row>
                        <h5>Torneios contabilizados:</h5>
                        <table class="table table-striped table-sm">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Nome</th>
                              <th scope="col">Tier</th>
                              <th scope="col">Colocação</th>
                              <th scope="col">Pontuação</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              this.state.playerData.tournaments.sort((a, b) => Number(b.name) - Number(a.name)).sort((a, b) => Number(b.points) - Number(a.points)).map((tournament, i)=>(
                                <tr class={i<10? "" : "text-muted"}>
                                  <th scope="row">{i+1}</th>
                                  <td>{tournament.name}</td>
                                  <td>{tournament.rank}</td>
                                  <td>{tournament.placing}</td>
                                  {i<10?
                                    <td><b>{tournament.points}</b></td>
                                    :
                                    <td>{tournament.points}</td>
                                  }
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                      </row>
                      :
                      null
                    }
                  </div>
                :
                null
              }
            </div>
            <div class="modal-footer">
            </div>
          </div>
        </div>
      </div>
    )
  }
};

export default PlayerModal