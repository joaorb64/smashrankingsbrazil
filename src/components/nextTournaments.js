import React, { Component } from 'react';
import moment from "../../node_modules/moment-timezone/moment-timezone";
import styles from "./nextTournaments.module.css"
import { faCalendar, faEdit, faMapMarkerAlt, faUser, faWifi } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

var WEEKDAYS = {
  0: "DOM",
  1: "SEG",
  2: "TER",
  3: "QUA",
  4: "QUI",
  5: "SEX",
  6: "SÁB"
}

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
        <div class="row" style={{marginLeft: -8, marginRight: -8}}>
          <h2 style={{color: "white"}}>
            Próximos torneios
          </h2>
          <a href="https://twitter.com/smash_bot_br" class="col-12" style={{backgroundColor: "white", minHeight: "64px", display: "flex", alignItems: "center"}}>
            <img src="/images/bot.jpg" style={{height: 48, width: 48, borderRadius: 8}} />
            <div style={{padding: 8, color: "black"}}>Siga o @smash_bot_br para ser notificado de próximos eventos e resultados de torneios em tempo real!</div>
          </a>
        </div>
        <div class="row">
          {
            this.state.tournaments != null ?
              this.state.tournaments.filter(t=>{return t.startAt > Date.now()/1000}).map((tournament)=>(
                <div class="col-md-6 col-xl-4" style={{padding: 2}}>
                  <a href={tournament.url}>
                    <div className={styles.tournamentContainerHighlight} style={{cursor: "pointer"}}>
                      <div className={styles.tournamentContainer} style={{backgroundColor: "#ff5e24", border: "4px solid black", cursor: "pointer"}}>
                        <div style={{backgroundImage: "url("+
                          (tournament.images.find(img => img["type"]=="banner") || tournament.images[tournament.images.length-1]).url+
                          ")", height: 140, margin: "4px",
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
                          <div style={{color: "white", textAlign: "center", fontSize: "20px",
                          whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden",
                          textShadow: "2px 2px 0px #00000070", width: "100%"}}>
                            {tournament.tournament_multievent ? tournament.name : tournament.tournament}
                          </div>
                        </div>

                        <div style={{display: "flex", color: "black", fontSize: "0.8rem", flexDirection: "column"}}>
                          <div style={{backgroundColor: "#dedede", padding: "2px", paddingLeft: "8px", flexGrow: 1}}>
                            {tournament.isOnline ?
                              <span><FontAwesomeIcon icon={faWifi}/> Online</span>
                              :
                              <span><FontAwesomeIcon icon={faMapMarkerAlt}/> {tournament.tournament_venueName + " - " + tournament.tournament_addrState}</span>
                            }
                          </div>

                          <div style={{backgroundColor: "#dedede", padding: "2px", paddingRight: "8px", paddingLeft: "8px", flexGrow: 1, textAlign: "left"}}>
                            <FontAwesomeIcon icon={faCalendar}/> Início: {WEEKDAYS[moment(tournament.startAt * 1000).day()]+" "}{moment(tournament.startAt * 1000).format("DD/MM/YY HH:mm") + " (GMT-3)"}
                          </div>
                          
                          <div style={{backgroundColor: "#dedede", padding: "2px", paddingRight: "8px", paddingLeft: "8px", flexGrow: 1, textAlign: "left"}}>
                            <FontAwesomeIcon icon={faEdit}/> Inscrições até: {WEEKDAYS[moment(tournament.tournament_registrationClosesAt * 1000).day()]+" "}{moment(tournament.tournament_registrationClosesAt * 1000).format("DD/MM/YY HH:mm") + " (GMT-3)"}
                          </div>

                          <div style={{backgroundColor: "#dedede", padding: "2px", paddingRight: "8px", paddingLeft: "8px", flexGrow: 1, textAlign: "left"}}>
                            <FontAwesomeIcon icon={faUser}/> Inscritos: {tournament.numEntrants}
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