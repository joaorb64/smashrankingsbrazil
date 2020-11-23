import React, { Component } from 'react'

class PlayerModalGranblue extends Component {
  state = {
    playerData: null
  }

  componentDidUpdate(nextProps) {
    if(nextProps !== this.props) {
      
    }
  }

  componentDidMount() {
    window.playerModalGranblue = this;
  }

  fetchPlayer(){
    if(this.player == null) return;

    this.player.tournaments_pc = []
    this.player.tournaments_ps4 = []

    this.player.tournaments.forEach(tournament => {
      if(tournament.placing_pc) this.player.tournaments_pc.push(tournament)
      if(tournament.placing_ps4) this.player.tournaments_ps4.push(tournament)
    });

    this.setState({playerData: this.player})

    /*fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/granblue/player_data/'+this.player+'/data.json')
    .then(res => res.json())
    .then((data) => {
      if(data.avatar){
        data.avatar = `https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/${data.avatar}`;
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

  render (){
    return(
      <div class="modal fade" id="playerModalGranblue" tabindex="-1" role="dialog" aria-hidden="true" style={{
        fontFamily: "sans-serif", textAlign: "left"
      }}>
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
                    <h2>{this.state.playerData.name}</h2>

                    {this.state.playerData.tournaments_ps4.length > 0 ?
                      <row>
                        <h5>Torneios contabilizados (PS4):</h5>
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
                              this.state.playerData.tournaments_ps4.sort((a, b) => Number(b.name) - Number(a.name)).sort((a, b) => Number(b.points_ps4) - Number(a.points_ps4)).map((tournament, i)=>(
                                <tr class={i<10? "" : "text-muted"}>
                                  <th scope="row">{i+1}</th>
                                  <td>{tournament.name}</td>
                                  <td>{tournament.tier}</td>
                                  <td>{
                                    tournament.placing_ps4 ?
                                      <div>
                                        <div>{tournament.placing_ps4 ? tournament.placing_ps4 : 0}</div>
                                      </div>
                                    :
                                      tournament.placing_ps4
                                  }</td>
                                  {i<10?
                                    <td><b>
                                      <div>{tournament.points_ps4 ? tournament.points_ps4 : 0}</div>
                                    </b></td>
                                    :
                                    <td>{tournament.points_ps4}</td>
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

                    {this.state.playerData.tournaments_pc.length > 0 ?
                      <row>
                        <h5>Torneios contabilizados (PC):</h5>
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
                              this.state.playerData.tournaments_pc.sort((a, b) => Number(b.name) - Number(a.name)).sort((a, b) => Number(b.points_pc) - Number(a.points_pc)).map((tournament, i)=>(
                                <tr class={i<10? "" : "text-muted"}>
                                  <th scope="row">{i+1}</th>
                                  <td>{tournament.name}</td>
                                  <td>{tournament.tier}</td>
                                  <td>{
                                    tournament.placing_pc ?
                                      <div>
                                        <div>{tournament.placing_pc ? tournament.placing_pc : 0}</div>
                                      </div>
                                    :
                                      tournament.placing_pc
                                  }</td>
                                  {i<10?
                                    <td><b>
                                      <div>{tournament.points_pc ? tournament.points_pc : 0}</div>
                                    </b></td>
                                    :
                                    <td>{tournament.points_pc}</td>
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

export default PlayerModalGranblue