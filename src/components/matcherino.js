import React, { Component } from 'react';
import moment from "../../node_modules/moment-timezone/moment-timezone";
import styles from "./nextTournaments.module.css"

class Matcherino extends Component {
  state = {
    tournaments: null,
    loading: true
  }

  componentDidUpdate(nextProps) {
  }

  componentDidMount() {
    let offset = 0;
    let perPage = 10;

    let fetchPage = function(offset, perPage) {
      fetch('https://matcherino.com/__api/bounties/list?offset='+offset+'&size='+perPage+'&creatorId=490735&published=true&gameId=112')
      .then(res => res.json())
      .then((data) => {
        console.log(data);
  
        data.body = data.body.filter((tournament) => {
          if(tournament.status=="ready"){
            return true;
          }
          return false;
        });
  
        console.log(data.body)
  
        data.body.forEach(tournament => {
          let used = 0;
  
          if(tournament.transactions){
            tournament.transactions.forEach(transaction => {
              if(transaction.action == "coupon:use"){
                used += 1;
              }
            })
          }
  
          tournament.usedCoupons = used;
  
          let coupon = tournament.description.match(/cupom:[\s][a-zA-Z|0-9]+/gi);
  
          if(coupon != null){
            coupon = coupon[0].substring(6).trim()
          }
  
          tournament.coupon = coupon;
        });

        if(this.state.tournaments == null){
          this.state.tournaments = []
        }

        data.body.forEach((tournament) => {
          this.state.tournaments.push(tournament);
        })

        this.setState(this.state);

        offset+=10;

        if(offset < 100){
          fetchPage.call(this, offset, perPage);
        } else {
          this.setState({loading: false});
        }
      })
      .catch((err)=>{
        console.log(err);
        this.setState({loading: false});
      })
    };

    fetchPage.call(this, offset, perPage)
  }

  render(){
    return(
      <div class="slide-fade list-group-item" style={{
        backgroundColor: "#f0f0f000", borderRadius: "10px", border: 0, marginBottom: "5px", width: "100%",
        padding: "10px", paddingTop: 0, alignSelf: "center"
      }}>
        <div class="row" style={{marginLeft: -8, marginRight: -8}}>
          <h2 style={{color: "white"}}>
            Campanhas ativas no Matcherino
          </h2>
        </div>
        <div class="row">
          {
            this.state.tournaments != null ?
              this.state.tournaments.map((tournament)=>(
                <div class="col-md-6 col-lg-4" style={{padding: 2}}>
                  <a href={"https://matcherino.com/tournaments/"+tournament.id}>
                    <div className={styles.tournamentContainerHighlight} style={{cursor: "pointer"}}>
                      <div className={styles.tournamentContainer} style={{backgroundColor: "#ff5e24", border: "4px solid black", cursor: "pointer"}}>
                        <div style={{backgroundImage: "url("+tournament.meta.backgroundImg+")", height: 140, margin: "4px",
                        backgroundSize: "cover", backgroundPosition: "center", backgroundColor: "black"}}>
                          { tournament.coupon ?
                            <div style={{background: "linear-gradient(180deg, rgba(255,113,40,1) 0%, rgba(221,87,37,1) 100%)",
                            color: "white", width: "fit-content", borderBottomRightRadius: "16px", padding: "5px 10px 5px 5px"}}>
                              Cupom: {tournament.coupon}
                            </div>
                            :
                            null
                          }
                        </div>

                        <div style={{height: 40, display: "flex", flexDirection: "column", alignItems: "center", placeContent: "center",
                        paddingLeft: "8px", paddingRight: "8px", background: "rgb(255,113,40)",
                        background: "linear-gradient(180deg, rgba(255,113,40,1) 0%, rgba(221,87,37,1) 100%)"}}>
                          <div style={{color: "white", textAlign: "center", fontSize: "20px",
                          whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden",
                          textShadow: "2px 2px 0px #00000070", width: "100%"}}>
                            {tournament.title}
                          </div>
                        </div>

                        <div style={{display: "flex", color: "black", backgroundColor: "#dedede"}}>
                          <div style={{backgroundColor: "#dedede", padding: "4px", paddingLeft: "8px", flex: "1 1 0"}}>
                            Cupons utilizados: {tournament.usedCoupons}/50
                          </div>
                        </div>

                        <div style={{display: "flex", color: "black", backgroundColor: "#dedede"}}>
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
        {this.state.loading ?
          <div class="loader"></div>
          :
          null
        }
      </div>
    )
  }
};

export default Matcherino