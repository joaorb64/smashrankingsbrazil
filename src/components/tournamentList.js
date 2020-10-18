import React, { Component } from 'react'
import styles from './statistics.module.css'
import moment from "../../node_modules/moment-timezone/moment-timezone";

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
                  <th scope="col">Data</th>
                  <th scope="col">Jogadores</th>
                </tr>
              </thead>
              <tbody>
                {
                  Object.values(this.props.tournaments).sort((a,b)=>{return b.time - a.time}).map((tournament)=>(
                    <tr>
                      <td><a target="_blank" href={`https://braacket.com/tournament/${tournament.id}`}>{tournament.name}</a></td>
                      <td>{moment.unix(tournament.time).add(1, "day").format("DD/MM/YY")}</td>
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