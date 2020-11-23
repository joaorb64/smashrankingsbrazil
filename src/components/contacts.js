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

class Contacts extends Component {
  state = {
    selectedLeague: 0,
    selectedTab: "ranking",
    players: [],
    top3Colors: ["#D6AF36", "#D7D7D7", "#A77044"],
    top3Colors2: ["#AF9500", "#B4B4B4", "#6A3805"],
    top3Colors3: ["#C9B037", "#A7A7AD", "#824A02"]
  }

  componentDidUpdate(nextProps) {
    if(nextProps !== this.props) {
      if(this.props.match){
        let selectedId = this.props.match.match.params["id"];    
        if(selectedId){
          let selectedLeague = this.props.contacts.findIndex((a)=>{return a.id == selectedId});
          if(selectedLeague != -1){
            this.selectLeague(selectedLeague);
          }
        }
      }

      if(this.props.contacts.length > 0){
        this.updateData();
      }
    }
  }

  componentDidMount() {
    if(this.props.match){
      let selectedId = this.props.match.match.params["id"];
      if(selectedId){
        let selectedLeague = this.props.contacts.findIndex((a)=>{return a.id == selectedId});
        if(selectedLeague != -1){
          this.selectLeague(selectedLeague);
        }
      }
      let selectedTab = this.props.match.match.params["tab"];
      if(selectedTab){
        this.handleTabChange(selectedTab);
        console.log(this.state.selectedTab)
      }
    }

    if(this.props.contacts.length > 0){
      this.updateData();
    }
  }

  preloadImages(index) {
    index = index || 0;

    if(!this.state.players) return
    if(index >= this.state.players.length){
      this.setState(this.state);
      return;
    }

    if(!this.state.players[index].twitter){
      this.preloadImages(index+1);
      return;
    }

    var img = new Image();

    setTimeout(()=>{
      this.state.players[index].avatar = img.src;
      this.preloadImages(index + 1);
      if(index % 8 == 0)
        this.setState(this.state);
    }, 5);

    img.src = `http://twitter-avatar.now.sh/${this.getTwitterHandle(this.state.players[index].twitter)}`;
  }

  updateData() {
    if(!this.props) return
    if(!this.props.contacts) return
    if(!this.props.allplayers) return
    if(!this.props.alltournaments) return

    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/out/'+this.props.contacts[this.state.selectedLeague].id+'/ranking.json')
    .then(res => res.json())
    .then((data) => {
      fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/out/'+this.props.contacts[this.state.selectedLeague].id+'/statistics.json')
      .then(res => res.json())
      .then((statistics) => {
        if(data){
          let players = []

          if(data.ranking){
            Object.entries(data.ranking.ranking).forEach(function(id){
              let league = this.props.contacts[this.state.selectedLeague].id;
    
              let p = this.props.allplayers["players"][this.props.allplayers["mapping"][league+":"+id[0]]]
    
              if(p.smashgg_image && !p.twitter) {
                p.avatar = p.smashgg_image;
              }
    
              if(p.mains == null || p.mains.length == 0 || p.mains[0] == ""){
                p.mains = ["Random"]
              }
    
              
              p.ranking = id[1]["rank"]
              p.score = id[1]["score"]
    
              players.push(p);
            }, this)
          }
          
          players.sort(function(a, b){
            let league = this.props.contacts[this.state.selectedLeague].id;
            return Number(a["ranking"]) - Number(b["ranking"]);
          }.bind(this));

          this.state.players = players;

          console.log(statistics)
          console.log(this.props.alltournaments[this.props.contacts[this.state.selectedLeague].id])

          this.setState({
            players: players,
            updateTime: data["update_time"],
            statistics: statistics,
            tournaments: this.props.alltournaments[this.props.contacts[this.state.selectedLeague].id],
            rankingName: data.ranking["name"],
            rankingType: data.ranking["type"],
            rankingAlltimes: data.ranking["alltimes"],
            rankingStartTime: data.ranking["timeStart"],
            rankingEndTime: data.ranking["timeEnd"]
          })

          this.preloadImages();
        }
      })
      .catch(console.log)
    })
    .catch(console.log)
  }

  selectLeague(i){
    if(i != this.state.selectedLeague){
      this.state.selectedLeague = i;
      this.state.statistics = null;
      this.updateData();
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
    }
  }

  handleTabChange(value){
    if(this.state.selectedTab != value){
      this.state.selectedTab = value;
      this.setState(this.state);
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
          <button className={styles_selector.teste+" btn col-3"} value="ranking" aria-expanded={this.state.selectedTab === "ranking"} onClick={(event)=>this.handleTabChange(event.target.value)}>
            {i18n.t("Ranking")}
          </button>
          <button className={styles_selector.teste+" btn col-3"} value="tournaments" aria-expanded={this.state.selectedTab === "tournaments"} onClick={(event)=>this.handleTabChange(event.target.value)}>
            {i18n.t("Tournaments")}
          </button>
          <button className={styles_selector.teste+" btn col-3"} value="statistics" aria-expanded={this.state.selectedTab === "statistics"} onClick={(event)=>this.handleTabChange(event.target.value)}>
            {i18n.t("Statistics")}
          </button>
          <button className={styles_selector.teste+" btn col-3"} value="info" aria-expanded={this.state.selectedTab === "info"} onClick={(event)=>this.handleTabChange(event.target.value)}>
            {i18n.t("Info")}
          </button>
        </div>

        {
          this.state.selectedTab == "ranking" && this.state.players ?
            <PlayerRanking contacts={this.props.contacts} allplayers={this.state.players} ranking={this.state.players} updateTime={this.state.updateTime} />
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

export default Contacts