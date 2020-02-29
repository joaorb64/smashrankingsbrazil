import React, { Component } from 'react'

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

    this.setState({playerData: null})

    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/master/player_data/'+this.player+'/data.json')
    .then(res => res.json())
    .then((data) => {
      this.setState({playerData: data});
    });
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
                    <h2>{this.state.playerData.name}</h2>

                    <row>
                      <h5>Ligas:</h5>
                      <table class="table table-striped table-sm">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Liga</th>
                            <th scope="col">Colocação</th>
                            <th scope="col">Pontuação</th>
                          </tr>
                        </thead>
                        <tbody>
                            {Object.values(this.state.playerData.rank).map((rank, i)=>(
                              <tr>
                                <th scope="row">{i+1}</th>
                                {this.props.leagues ?
                                  <td>{this.props.leagues.find(element => element.id == Object.keys(this.state.playerData.rank)[i]).name}</td>
                                :
                                  <td>{Object.keys(this.state.playerData.rank)[i]}</td>
                                }
                                <td>{rank.rank}</td>
                                <td>{rank.score}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
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
                                <tr>
                                  <th scope="row">{i+1}</th>
                                  <td>{tournament.name}</td>
                                  <td>{tournament.rank}</td>
                                  <td>{tournament.placing}</td>
                                  <td>{tournament.points}</td>
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