import React, { Component } from 'react';
import moment from "../../node_modules/moment-timezone/moment-timezone";
import HelpButton from './HelpButton';
import styles from "./nextTournaments.module.css"

class Matcherino extends Component {
  state = {
    matcherinos: {},
    selected: null,
    tournaments: {},
    loading: false
  }

  componentDidUpdate(nextProps) {
  }

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/matcherinos.json')
    .then(res => res.json())
    .then((data) => {
      console.log(data);

      this.setState({
        matcherinos: data,
        selected: Object.keys(data)[0]
      });

      if(this.props.match && this.props.match.params && this.props.match.params.country){
        if(this.state.matcherinos && this.state.matcherinos[this.props.match.params.country.toUpperCase()] != null){
          this.state.selected = this.props.match.params.country.toUpperCase();
        }
      }

      this.selectCountry({target: {value: this.state.selected}});

      /*let offset = 0;
      let perPage = 10;
      this.fetchPage(this.state.selected, offset, perPage);*/
    });
  }

  fetchPage(stateSelection, offset, perPage) {
    if(this.state.selected == null || this.state.selected != stateSelection) return;
    
    if(offset == 0){
      this.state.tournaments[stateSelection] = [];
      this.state.loading = true;
      this.setState(this.state);
    }

    let promises = [];

    this.state.matcherinos[this.state.selected].forEach((accountId)=>{
      promises.push(fetch('https://matcherino.com/__api/bounties/list?offset='+offset+'&size='+perPage+'&creatorId='+accountId+'&published=true')
      .then(res => res.json())
      .then((data) => {
        console.log(data);

        data.body = data.body.filter((tournament) => {
          if(tournament.status=="ready" && [112,115].includes(tournament.gameId)){
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

        data.body.forEach((tournament) => {
          this.state.tournaments[stateSelection].push(tournament);
        })
      })
      .catch((err)=>{
        console.log(err);
      }))
    })

    Promise.all(promises).then(()=>{
      this.setState(this.state);
      
      offset+=10;

      if(offset < 200){
        this.fetchPage(stateSelection, offset, perPage);
      } else {
        this.setState({loading: false});
      }
    })
  };

  selectCountry(e){
    this.state.selected = e.target.value;
    this.setState({selected: e.target.value});
    this.props.history.push('/matcherino/'+this.state.selected.toLowerCase());

    let offset = 0;
    let perPage = 10;
    this.fetchPage(e.target.value, offset, perPage);
  }

  render(){
    return(
      <div class="slide-fade list-group-item" style={{
        backgroundColor: "#f0f0f000", borderRadius: "10px", border: 0, marginBottom: "5px", width: "100%",
        padding: "10px", paddingTop: 0, alignSelf: "center"
      }}>
        <div class="row" style={{marginLeft: -8, marginRight: -8}}>
          <h2 style={{color: "white"}}>
            Campanhas ativas no Matcherino <HelpButton content="To have your Matcherino campains listed on this page, contact @joao_shino on twitter" />
          </h2>
        </div>
        <select value={this.state.selected} class="form-control form-control-lg" onChange={(e)=>this.selectCountry(e)}>
          {Object.keys(this.state.matcherinos).map((country) => (
            <>
              <option value={country}>{country}</option>
            </>
          ))}
        </select>
        <div class="row">
          {
            this.state.tournaments[this.state.selected] != null ?
              this.state.tournaments[this.state.selected].map((tournament)=>(
                <div class="col-md-6 col-lg-4" style={{padding: 2}}>
                  <a href={"https://matcherino.com/tournaments/"+tournament.id} target="_blank">
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
                          <div style={{color: "white", textAlign: "center", fontSize: "18px",
                          whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden",
                          textShadow: "2px 2px 0px #00000070", width: "100%"}}>
                            {tournament.title}
                          </div>
                        </div>

                        <div style={{display: "flex", color: "black", backgroundColor: "#dedede"}}>
                          <div style={{backgroundColor: "#dedede", padding: "4px", paddingLeft: "8px",
                          flex: "1 1 0", display: "flex", placeItems: "center"}}>
                            <div style={{
                              width: 32, height: 32, backgroundRepeat: "no-repeat",
                              backgroundPosition: "center", backgroundSize: "cover",
                              backgroundImage: `url(${tournament.creator.avatar})`,
                              borderRadius: "100%"
                            }}></div>
                            <div style={{marginLeft: 8}}>{tournament.creator.displayName}</div>
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