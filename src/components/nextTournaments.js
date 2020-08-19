import React, { Component } from 'react';
import moment from "../../node_modules/moment-timezone/moment-timezone";
import styles from "./nextTournaments.module.css"

class NextTournaments extends Component {
  state = {
    tournaments: null
  }

  componentDidUpdate(nextProps) {
  }

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/joaorb64/SmashTwitterBot/master/events.json')
    .then(res => res.json())
    .then((data) => {
      this.state.tournaments = Object.values(data).sort((a, b) => (a.startAt > b.startAt) ? 1 : -1);
      this.setState(this.state);
    })
    .catch(console.log)
  }

  render (){
    return(
      <div class="slide-fade list-group-item" style={{
        backgroundColor: "#f0f0f000", borderRadius: "10px", border: 0, marginBottom: "5px", width: "100%",
        padding: "30px", alignSelf: "center"
      }}>
        <h2 style={{color: "white"}}>
          Próximos torneios
        </h2>
        <div class="row">
          {
            this.state.tournaments != null ?
              this.state.tournaments.map((tournament)=>(
                <div class="col-md-6 col-lg-4" style={{padding: 2}}>
                  <a href={tournament.url}>
                    <div className={styles.tournamentContainerHighlight} style={{cursor: "pointer"}}>
                      <div className={styles.tournamentContainer} style={{backgroundColor: "#ff5e24", border: "4px solid black", cursor: "pointer"}}>
                        <div style={{backgroundImage: "url("+tournament.images[1].url+")", height: 140, margin: "4px",
                        backgroundSize: "cover", backgroundPosition: "center", backgroundColor: "black"}}></div>

                        <div style={{height: 60, display: "flex", flexDirection: "column", alignItems: "center", placeContent: "center",
                        paddingLeft: "8px", paddingRight: "8px", background: "rgb(255,113,40)",
                        background: "linear-gradient(180deg, rgba(255,113,40,1) 0%, rgba(221,87,37,1) 100%)"}}>
                          {tournament.tournament_multievent ?
                            <div style={{color: "white", textAlign: "center", fontSize: "14px",
                            whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden",
                            textShadow: "2px 2px 0px #00000070", width: "100%"}}>
                              {tournament.tournament}
                            </div>
                            :
                            null}
                          <div style={{color: "white", textAlign: "center", fontSize: "24px",
                          whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden",
                          textShadow: "2px 2px 0px #00000070", width: "100%"}}>
                            {tournament.tournament_multievent ? tournament.name : tournament.tournament}
                          </div>
                        </div>

                        <div style={{display: "flex", color: "black"}}>
                          <div style={{backgroundColor: "#dedede", padding: "4px", paddingLeft: "8px", flexGrow: 1}}>
                            {/*tournament.isOnline ? "Online" : "Offline"*/}
                          </div>
                          <div style={{backgroundColor: "#dedede", padding: "4px", paddingRight: "8px"}}>
                            {moment(tournament.startAt * 1000).tz("America/Sao_Paulo").format("DD/MM/YY HH:mm") + " (GMT-3)"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))
              :
              null
          }
        </div>
      </div>
    )
  }
};

export default NextTournaments