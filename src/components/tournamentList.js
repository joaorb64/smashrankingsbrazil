import React, { Component } from 'react'
import styles from './statistics.module.css'

class TournamentList extends Component {
  state = {
  }

  componentDidMount() {
  }

  render (){
    return(
      <div class="slide-fade list-group-item" style={{
        backgroundColor: "#f0f0f0", borderRadius: "10px", border: 0, marginBottom: "5px", margin: "10px",
        padding: "30px", alignSelf: "center", textAlign: "left", fontFamily: "Roboto, sans-serif"
      }}>
        {this.props.tournaments ?
          <div>
            <table class="table table-striped table-sm">
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">Jogadores</th>
                </tr>
              </thead>
              <tbody>
                {
                  Object.values(this.props.tournaments).map((tournament)=>(
                    <tr>
                      <td><a target="_blank" href={`https://braacket.com/tournament/${tournament.id}`}>{tournament.name}</a></td>
                      <td>{tournament.player_number}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        :
          null
        }
      </div>
    )
  }
};

export default TournamentList