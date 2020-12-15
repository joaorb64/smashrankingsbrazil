import React, { Component } from 'react';
import moment from "../../node_modules/moment-timezone/moment-timezone";
import styles from "./nextTournaments.module.css"
import { faCalendar, faEdit, faMapMarkerAlt, faUser, faWifi } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import i18n from '../locales/i18n';
import HelpButton from './HelpButton';

class NextTournaments extends Component {
  state = {
    tournaments: [],
    selectedCountry: null,
    selections: {},
    alltournaments: null
  }

  componentDidUpdate(nextProps) {
  }

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/out/nexttournaments.json')
    .then(res => res.json())
    .then((data) => {
      console.log(data);

      Object.entries(data).forEach(country => {
        country[1].events.forEach((event)=>{
          event.country = country[0];
        })
      })

      this.state.alltournaments = data;

      let selections = {}

      Object.entries(data).forEach(country => {
        if(!selections.hasOwnProperty(country[1].region)){
          selections[country[1].region] = []
        }
        selections[country[1].region].push(country[0])
      });

      this.state.selections = selections;

      this.setState(this.state);
      
      this.filterTournaments("all");
    })
    .catch(console.log)
  }

  selectCountry(e){
    this.state.selectedCountry = e.target.value;
    this.filterTournaments(e.target.value);
  }

  filterTournaments(value){
    let selectedTournaments = [];

    if(value == "all"){
      Object.entries(this.state.alltournaments).forEach((country)=>{
        selectedTournaments = selectedTournaments.concat(country[1].events)
      })
    } else if(value.startsWith("region_")){
      Object.entries(this.state.alltournaments).forEach((country)=>{
        if(country[1].region == value.split("region_")[1]){
          selectedTournaments = selectedTournaments.concat(country[1].events)
        }
      })
    } else {
      selectedTournaments = this.state.alltournaments[value].events;
    }
    
    selectedTournaments = selectedTournaments.sort((a, b) => (a.startAt > b.startAt) ? 1 : -1);

    this.state.tournaments = selectedTournaments;

    this.setState(this.state);
  }

  render (){
    return(
      <div class="slide-fade list-group-item" style={{
        backgroundColor: "#f0f0f000", borderRadius: "10px", border: 0, marginBottom: "5px", width: "100%",
        padding: "10px", paddingTop: 0, alignSelf: "center"
      }}>
        <div class="row" style={{marginLeft: -8, marginRight: -8}}>
          <h2 style={{color: "white"}}>
            {i18n.t("next-tournaments")} <HelpButton content="To have your tournaments listed on this page, set their location to your country, even for online tournaments." />
          </h2>
          <select class="form-control form-control-lg" onChange={(e)=>this.selectCountry(e)}>
            <option value="all">{i18n.t("all")}</option>
            {Object.keys(this.state.selections).map((region) => (
              <>
                <optgroup label={i18n.t("region-"+region.toLowerCase())}>
                  <option value={"region_"+region}>{i18n.t("all")} ({i18n.t("region-"+region.toLowerCase())})</option>
                  {this.state.selections[region].map((country) => (
                    <option value={country}>{country+" ("+this.state.alltournaments[country].events.length+")"}</option>
                  ))}
                </optgroup>
              </>
            ))}
          </select>
          {this.state.selectedCountry == "BR" ? 
            <a href="https://twitter.com/smash_bot_br" class="col-12" style={{backgroundColor: "white", minHeight: "64px", display: "flex", alignItems: "center", marginTop: 8}}>
              <img src="/images/bot.png" style={{height: 48, width: 48, borderRadius: 8}} />
              <div style={{padding: 8, color: "black"}}>Siga o @smash_bot_br para ser notificado de próximos eventos e resultados de torneios em tempo real!</div>
            </a>
            :
            null
          }          
        </div>
        <div class="row">
          {
            this.state.tournaments != null ?
              this.state.tournaments.filter(t=>{return t.startAt > Date.now()/1000}).map((tournament)=>(
                <div class="col-md-6 col-xl-6" style={{padding: 2}}>
                  <a href={tournament.url}>
                    <div className={styles.tournamentContainerHighlight} style={{cursor: "pointer"}}>
                      <div className={styles.tournamentContainer} style={{backgroundColor: "#ff5e24", border: "4px solid black", cursor: "pointer"}}>
                        <div style={{backgroundImage: "url("+
                          ((tournament.images.find(img => img["type"]=="banner") || tournament.images[tournament.images.length-1])?.url || "") +
                          ")", height: 140, margin: "4px",
                        backgroundSize: "cover", backgroundPosition: "center", backgroundColor: "black"}}>
                          <div style={{position: "absolute", width: 50, height: 30, backgroundPosition: "center", backgroundSize: "cover", margin: "2px", border: "2px solid black",
                          backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/country_flag/${tournament.country.toLowerCase()}.png)`}}></div>
                        </div>

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
                              <span><FontAwesomeIcon icon={faMapMarkerAlt}/> {(tournament.tournament_venueName ? tournament.tournament_venueName+" - " : "") + tournament.tournament_addrState}</span>
                            }
                          </div>

                          <div style={{backgroundColor: "#dedede", padding: "2px", paddingRight: "8px", paddingLeft: "8px", flexGrow: 1, textAlign: "left"}}>
                            <FontAwesomeIcon icon={faCalendar}/> {i18n.t("starts-time")}: {i18n.t("weekday-"+moment(tournament.startAt * 1000).format("ddd").toLowerCase())} {moment(tournament.startAt * 1000).format("DD/MM/YY HH:mm")} GMT{moment(tournament.startAt * 1000).format("Z")}
                          </div>
                          
                          <div style={{backgroundColor: "#dedede", padding: "2px", paddingRight: "8px", paddingLeft: "8px", flexGrow: 1, textAlign: "left"}}>
                            <FontAwesomeIcon icon={faEdit}/> {i18n.t("register-due")}: {i18n.t("weekday-"+moment(tournament.tournament_registrationClosesAt * 1000).format("ddd").toLowerCase())} {moment(tournament.tournament_registrationClosesAt * 1000).format("DD/MM/YY HH:mm")} GMT{moment(tournament.tournament_registrationClosesAt * 1000).format("Z")}
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