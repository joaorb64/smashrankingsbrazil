import React, { Component } from 'react'
import styles from './contacts.module.css'
import { Link, useParams, useLocation } from 'react-router-dom';
import LeagueSelector from './leagueselector';
import styles_selector from './leagueselector.module.css'
import PlayerRanking from './playerRanking';
import Statistics from './statistics';
import Information from './information';
import TournamentList from './tournamentList';
import moment from "../../node_modules/moment-timezone/moment-timezone";
import i18n from '../locales/i18n';
import Players from './players';
import { browserHistory } from 'react-router';
import { withRouter } from 'react-router-dom'

class Contacts extends Component {
  state = {
    selectedLeague: -1,
    selectedTab: "ranking",
    players: [],
    top3Colors: ["#D6AF36", "#D7D7D7", "#A77044"],
    top3Colors2: ["#AF9500", "#B4B4B4", "#6A3805"],
    top3Colors3: ["#C9B037", "#A7A7AD", "#824A02"],
    userCountry: null
  }

  componentDidUpdate(prevProps) {
    if(this.props != prevProps)
      this.manageUrl(prevProps);
  }

  componentDidMount() {
    this.state.selectedLeague = -1;
    if(!this.props.match) return;
    this.manageUrl();
  }

  manageUrl(prevProps = null){
    if(!this.props.match) return;
    if(!this.props.allplayers) return;
    if(!this.props.alltournaments) return;
    if(!this.props.contacts) return;

    let leagueId = this.props.match.params["id"];

    if(this.props.contacts && this.props.contacts.length > 0) {
      if(this.props.match.params["id"]){
        let selectedId = this.props.match.params["id"];    
        if(selectedId){
          let selectedLeague = this.props.contacts.findIndex((a)=>{return a.id == selectedId});
          if(selectedLeague != -1){
            this.selectLeague(selectedLeague);
          } else {
            this.selectLeague(0);
            leagueId = this.props.contacts[0].id
          }
        } else {
          this.selectLeague(0);
          leagueId = this.props.contacts[0].id;
        }
      } else if(!this.props.match.params["id"]) {
        let selectLeague = 0;

        if(this.props.usercountry){
          for(let i=0; i<this.props.contacts.length; i+=1){
            if(this.props.contacts[i].country && this.props.contacts[i].country == this.props.usercountry){
              selectLeague = i;
              break;
            }
          }
        } else {
          selectLeague = 0;
        }

        console.log(selectLeague)

        if(selectLeague != -1){
          console.log(selectLeague)
          console.log(this.props.contacts)
          this.selectLeague(selectLeague);
          this.props.history.push('/leagues/smash/'+this.props.contacts[selectLeague].id);
          leagueId = this.props.contacts[selectLeague].id;
        }
      }

      if(this.props.match.params["tab"]){
        this.handleTabChange(this.props.match.params["tab"]);
      } else {
        this.props.history.push(
          '/leagues/smash/'+leagueId+'/ranking'
        );
      }
    }
  }

  updateData() {
    console.log("Update data");
    if(!this.props) return
    if(!this.props.contacts) return
    if(!this.props.allplayers) return
    if(!this.props.alltournaments) return
    if(!this.props.contacts[this.state.selectedLeague]) return

    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/out/'+this.props.contacts[this.state.selectedLeague].id+'/ranking.json')
    .then(res => res.json())
    .then((data) => {
      fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/out/'+this.props.contacts[this.state.selectedLeague].id+'/statistics.json')
      .then(res => res.json())
      .then((statistics) => {
        fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/out/'+this.props.contacts[this.state.selectedLeague].id+'/players.json')
        .then(res => res.json())
        .then((league_players) => {
          if(data){
            let players = []

            if(data.ranking){
              Object.entries(data.ranking).forEach(function(id){
                let league = this.props.contacts[this.state.selectedLeague].id;
      
                let p = {}
                p = Object.assign(p, this.props.allplayers["players"][this.props.allplayers["mapping"][league+":"+id[0]]]);
      
                p.avatars = [];

                if(p.twitter) {
                  p.avatars.push(`http://unavatar.now.sh/twitter/${this.getTwitterHandle(p.twitter)}?fallback=false`);
                  p.avatars.push(`https://api.microlink.io/?url=https://twitter.com/${this.getTwitterHandle(p.twitter)}&embed=image.url`);
                }
                if(p.smashgg_image) {
                  p.avatars.push(p.smashgg_image);
                }
      
                if(p.mains == null || p.mains.length == 0 || p.mains[0] == ""){
                  p.mains = ["Random"]
                }
                
                p.ranking = id[1]["rank"]
                p.score = id[1]["score"]

                p.league_id = id[0];
      
                players.push(p);
              }, this)
            }
            
            players.sort(function(a, b){
              return Number(a["ranking"]) - Number(b["ranking"]);
            });

            console.log(players)

            console.log(statistics)
            console.log(this.props.alltournaments[this.props.contacts[this.state.selectedLeague].id])

            let final_league_players = [];
            Object.keys(league_players.players).forEach((player) => {
              let globalId = this.props.allplayers["mapping"][this.props.contacts[this.state.selectedLeague].id+":"+player];
              final_league_players.push(this.props.allplayers["players"][globalId])
            })

            this.setState({
              players: players,
              league_players: final_league_players,
              updateTime: data["update_time"],
              statistics: statistics,
              tournaments: this.props.alltournaments[this.props.contacts[this.state.selectedLeague].id],
              rankingName: data.ranking["name"],
              rankingType: data.ranking["type"],
              rankingAlltimes: data.ranking["alltimes"],
              rankingStartTime: data.ranking["timeStart"],
              rankingEndTime: data.ranking["timeEnd"]
            }, ()=>{
              if(this.props.match.params["player_id"]){
                console.log(this.props.match.params["player_id"])

                setTimeout(()=>{
                  let div = document.getElementById("ranking_player_"+players.findIndex((p)=>p.league_id == this.props.match.params["player_id"]));
                  console.log(div)

                  if(div)
                    window.scrollTo({behavior: "smooth", top: div.offsetTop})

                  this.openPlayerModal(players.find((p)=>p.league_id == this.props.match.params["player_id"]));
                }, 500);
              }
            })
          }
        })
        .catch((e)=>{
          console.log(e)
          this.setState({
            players: [],
            updateTime: 1
          })
        })
      })
      .catch((e)=>{
        console.log(e)
        this.setState({
          players: [],
          updateTime: 1
        })
      })
    })
    .catch((e)=>{
      console.log(e)
      this.setState({
        players: [],
        updateTime: 1
      })
    })
  }

  selectLeague(i){
    if(i != this.state.selectedLeague){
      this.state.selectedLeague = i;
      this.state.players = [];
      this.state.updateTime = null;
      this.state.statistics = null;
      this.setState(this.state, ()=>{
        this.updateData();
      });
    }
  }

  getCharName(name){
    return name.toLowerCase().replace(/ /g, "");
  }

  getTwitterHandle(twitter){
    let parts = twitter.split('/');
    return parts[parts.length-1];
  }

  normalizePlayerName(name){
    return name.normalize("NFKD").replace(/ /g, '_').replace(/@/g, "_At_").replace(/~/g, "_Tilde_").replace(RegExp('[^0-9a-zA-Z_-]'), '').replace("|", "")
  }

  openPlayerModal(player){
    if(window.playerModal){
      window.playerModal.player = player;
      window.playerModal.fetchPlayer();
      this.props.history.push(
        '/leagues/smash/'+this.props.match.params["id"]+'/'+
        this.props.match.params["tab"]+"/"+player.league_id
      );
      window.playerModal.open();
    }
  }

  handleTabChange(value){
    if(this.state.selectedTab != value){
      this.props.history.push(
        '/leagues/smash/'+this.props.match.params["id"]+'/'+value
      );
      this.setState({selectedTab: value});
    }
  }

  render (){
    return(
      <div style={{textAlign: "center", fontFamily: "SmashFont", marginLeft: "-10px", marginRight: "-10px"}}>
        <LeagueSelector
          leagues={this.props.contacts}
          selectLeague={this.selectLeague.bind(this)}
          selectedLeague={this.state.selectedLeague}
        />

        {this.state.rankingName ?
          <div className="teste btn-group btn-group-toggle col-12" style={{padding: "5px 10px 0px 10px"}}>
            <button className={styles_selector.teste+" btn col-12"}>
              {this.state.rankingName}
              {this.state.rankingType ? " ("+this.state.rankingType+")" : ""}
              <br/>
              {this.state.alltimes || this.state.rankingStartTime == null ?
                <>{"All times"}</>
                :
                <>{i18n.t("dateFrom") + " " + i18n.t("date_format", {date: moment.unix(this.state.rankingStartTime).toDate()}) + " " + i18n.t("dateFromAfter") + " " + i18n.t("dateTo") + " " + i18n.t("date_format", {date: moment.unix(this.state.rankingEndTime).toDate()}) + " " + i18n.t("dateToAfter")}</>
              }
            </button>
          </div>
          :
          null
        }

        <div className="teste btn-group btn-group-toggle col-12" style={{padding: "5px 8px 0px 10px", marginBottom: "-5px"}}>
          <button className={"tab " + styles_selector.teste+" "+styles_selector.aria+" btn col-3"} value="ranking" aria-expanded={this.state.selectedTab == "ranking"} onClick={(event)=>this.handleTabChange(event.target.value)}>
            {i18n.t("Ranking")}
          </button>
          <button className={"tab " + styles_selector.teste+" "+styles_selector.aria+" btn col-3"} value="players" aria-expanded={this.state.selectedTab == "players"} onClick={(event)=>this.handleTabChange(event.target.value)}>
            {i18n.t("players")}
          </button>
          <button className={"tab " + styles_selector.teste+" "+styles_selector.aria+" btn col-3"} value="tournaments" aria-expanded={this.state.selectedTab == "tournaments"} onClick={(event)=>this.handleTabChange(event.target.value)}>
            {i18n.t("Tournaments")}
          </button>
          <button className={"tab " + styles_selector.teste+" "+styles_selector.aria+" btn col-3"} value="statistics" aria-expanded={this.state.selectedTab == "statistics"} onClick={(event)=>this.handleTabChange(event.target.value)}>
            {i18n.t("Statistics")}
          </button>
          <button className={"tab " + styles_selector.teste+" "+styles_selector.aria+" btn col-3"} value="info" aria-expanded={this.state.selectedTab == "info"} onClick={(event)=>this.handleTabChange(event.target.value)}>
            {i18n.t("Info")}
          </button>
        </div>

        {
          this.state.selectedTab == "ranking" && this.state.players ?
            <PlayerRanking contacts={this.props.contacts} allplayers={this.state.players} ranking={this.state.players} updateTime={this.state.updateTime} history={this.props.history} match={this.props.match} />
            :
            this.state.selectedTab == "players" ?
              <div style={{padding: "10px"}}>
                <Players leagues={this.props.contacts} alltournaments={this.state.tournaments} allplayers={{"players": this.state.league_players}} history={this.props.history} match={this.props.match} />
              </div>
              :
              this.state.selectedTab == "tournaments" ?
                <TournamentList tournaments={this.state.tournaments} />
                :
                this.state.selectedTab == "statistics" ?
                  this.state.statistics ? 
                    <Statistics league={this.props.contacts[this.state.selectedLeague].id} statistics={this.state.statistics} />
                    :
                    null
                  :
                  this.state.selectedTab == "info" ?
                    <Information info={this.props.contacts[this.state.selectedLeague]} />
                    :
                    null
        }
      </div>
    )
  }
};

export default withRouter(Contacts)