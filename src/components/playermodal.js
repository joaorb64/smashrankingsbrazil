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
                    {this.state.playerData.name}
                    {Object.values(this.state.playerData.rank).map((rank, i)=>(
                      <div>{Object.keys(this.state.playerData.rank)[i]} - [{rank.rank}] - {rank.score} pts</div>
                    ))}
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