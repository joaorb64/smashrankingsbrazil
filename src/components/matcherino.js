import React, { Component } from 'react';
import moment from "../../node_modules/moment-timezone/moment-timezone";
import styles from "./nextTournaments.module.css"

class Matcherino extends Component {
  state = {
    tournaments: null
  }

  componentDidUpdate(nextProps) {
  }

  componentDidMount() {
    fetch('https://matcherino.com/__api/bounties/list?size=20&creatorId=490735&published=true&gameId=112')
    .then(res => res.json())
    .then((data) => {
      data.body.forEach(tournament => {
        let used = 0;

        tournament.transactions.forEach(transaction => {
          if(transaction.action == "coupon:use"){
            used += 1;
          }
        })

        tournament.usedCoupons = used;
      });
      this.state.tournaments = data.body;
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
          Campanhas ativas no Matcherino
        </h2>
        <div class="row">
          {
            this.state.tournaments != null ?
              this.state.tournaments.map((tournament)=>(
                <div class="col-md-6 col-lg-4" style={{padding: 2}}>
                  <a href={"https://matcherino.com/tournaments/"+tournament.id}>
                    <div className={styles.tournamentContainerHighlight} style={{cursor: "pointer"}}>
                      <div className={styles.tournamentContainer} style={{backgroundColor: "#ff5e24", border: "4px solid black", cursor: "pointer"}}>
                        <div style={{backgroundImage: "url("+tournament.meta.backgroundImg+")", height: 140, margin: "4px",
                        backgroundSize: "cover", backgroundPosition: "center", backgroundColor: "black"}}></div>

                        <div style={{height: 60, display: "flex", flexDirection: "column", alignItems: "center", placeContent: "center",
                        paddingLeft: "8px", paddingRight: "8px", background: "rgb(255,113,40)",
                        background: "linear-gradient(180deg, rgba(255,113,40,1) 0%, rgba(221,87,37,1) 100%)"}}>
                          <div style={{color: "white", textAlign: "center", fontSize: "24px",
                          whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden",
                          textShadow: "2px 2px 0px #00000070", width: "100%"}}>
                            {tournament.title}
                          </div>
                        </div>

                        <div style={{display: "flex", color: "black", backgroundColor: "#dedede"}}>
                          <div style={{backgroundColor: "#dedede", padding: "4px", paddingLeft: "8px", flex: "1 1 0"}}>
                            Cupons usados: {tournament.usedCoupons}
                          </div>
                          <div style={{backgroundColor: "#dedede", padding: "4px", paddingRight: "8px", flex: "1 1 0", alignSelf: "center"}}>
                            <div class="progress position-relative" style={{backgroundColor: "black"}}>
                              <div className={"progress-bar" + (tournament.balance/100/50 >= 1 ? " bg-success" : "")} role="progressbar"
                              style={{width: Math.min(tournament.balance/100/50*100, 100)+"%"}}>
                              </div>
                              <div class="justify-content-center d-flex position-absolute w-100" style={{color: "white"}}>${tournament.balance/100}</div>
                            </div>
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

export default Matcherino