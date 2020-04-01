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

    this.setState({playerData: null})

    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/master/granblue/player_data/'+this.player+'/data.json')
    .then(res => res.json())
    .then((data) => {
      console.log("aaaa")
      this.setState({playerData: data});
    });
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
                                  <td>{tournament.tier}</td>
                                  <td>{
                                    tournament.placing_pc || tournament.placing_ps4 ?
                                      <div>
                                        <div>{tournament.placing_pc ? "PC: "+tournament.placing_pc : null}</div>
                                        <div>{tournament.placing_ps4 ? "PS4: "+tournament.placing_ps4 : null}</div>
                                      </div>
                                    :
                                      tournament.placing
                                  }</td>
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

export default PlayerModalGranblue