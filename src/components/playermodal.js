import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import styles from './playermodal.module.css';
import { GetCharacterCodename, CHARACTERS_GG_TO_BRAACKET } from "../globals";
import moment from "../../node_modules/moment-timezone/moment-timezone";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import i18n from '../locales/i18n';
import { browserHistory } from 'react-router';
import { withRouter } from 'react-router-dom'
import numeral from 'numeral';
import { Dialog, DialogTitle, DialogContent, IconButton, withStyles,
  Box, Typography, Grid, makeStyles, useTheme, TableFooter, Icon, Chip, Avatar, Tooltip, Hidden } from '@material-ui/core';
import { CloseIcon } from '@material-ui/icons/Close';
import { ArrowBack } from '@material-ui/icons/ArrowBack'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

const useStyles = (theme) => ({
  dialogRoot: {
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      maxWidth: "100% !important",
      width: "100%"
    }
  },
  ChipLeague: {
    height: "32px",
    borderRadius: "100px",
    width: "100%",
    justifyContent: "left"
  },
  ChipLeagueAvatar: {
    display: "flex",
    alignItems: "center",
    width: "unset !important"
  },
  ChipLabelGrow: {
    width: "100%"
  }
});

class PlayerModal extends Component {
  state = {
    playerData: null,
    alltournaments: {},
    tournaments: {},
    achievements: {},
    open: false,
    player: null,
    setsRowsPerPage: 5,
    setsPage: 0,
    tournamentsRowsPerPage: 5,
    tournamentsPage: 0
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.open && !prevState.open){
      this.fetchPlayer();
    }

    if(this.props.game != prevProps.game){
      this.setState({playerData: null})
    }
  }

  componentDidMount() {
  }

  fetchPlayer(){
    console.log("fetchplayer");
    
    if(this.state.player == null) return;

    this.player = this.state.player;

    let tournamentsWent = [];
    let achievements = [];
    let matchesPlayed = [];

    let myIds = []

    if(this.player.character_usage){
      let usage_percent = {};
      Object.assign(usage_percent, this.player.character_usage);
      this.player.character_usage_percent = usage_percent;

      this.player.character_usage_percent = Object.entries(this.player.character_usage_percent).sort((a,b)=>{return b[1]-a[1]});

      let sum = 0;

      this.player.character_usage_percent.forEach((character)=>{
        sum += character[1];
      })

      this.player.character_usage_percent.forEach((character)=>{
        character[1] = character[1]/sum;
      })
    }

    if(this.props.alltournaments != null && this.props.allplayers != null){
      this.player.rank = {}
      this.player.matches = []

      if(this.player.braacket_links){
        this.player.braacket_links.forEach(link => {
          let linkLeague = link.split(":")[0];
          let linkId = link.split(":")[1];

          fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/out/'+this.props.game+'/'+linkLeague+'/ranking.json')
          .then(res => res.json())
          .then((data) => {
            if(data.ranking.ranking[linkId]){
              this.player.rank[linkLeague] = {rank: data.ranking.ranking[linkId].rank, score: data.ranking.ranking[linkId].score};
              this.setState({playerData: this.player})
            }
          }, this);
  
          if(Object.keys(this.props.alltournaments).includes(linkLeague)){
            Object.values(this.props.alltournaments[linkLeague]).forEach(tournament => {
              if(tournament.ranking && Object.keys(tournament.linkage).includes(linkId)){
                let playerIdInTournament = tournament.linkage[linkId];

                let tournamentEntry = {};
                Object.assign(tournamentEntry, tournament);

                if(tournament.ranking[playerIdInTournament]){
                  tournamentEntry["ranking"] = tournament.ranking[playerIdInTournament].rank;
                  tournamentEntry["league"] = linkLeague;

                  let leagueObj = this.props.leagues.find(element => element.id == linkLeague);
    
                  if(leagueObj.wifi){
                    tournamentEntry["state"] = "wifi"
                  } else {
                    tournamentEntry["state"] = leagueObj.state;
                  }
  
                  if(!tournament.name.includes("[MATCHMAKING]")){
                    let found = tournamentsWent.find(element =>
                      element.name == tournamentEntry.name ||
                      element.id == tournamentEntry.id ||
                      (element.link != null && element.link == tournamentEntry.link)
                    );
      
                    if(!found){
                      tournamentsWent.push(tournamentEntry);
                    } else {
                      if(found.state == "BR" && tournamentEntry["state"] != "BR"){
                        found.state = tournamentEntry["state"];
                      }
                    }
                  }
  
                  if(tournament.matches){
                    tournament.matches.forEach(match => {
                      if(match.participants.hasOwnProperty(playerIdInTournament)){
                        let matchEntry = {}
                        matchEntry.tournamentName = tournament.name;
                        matchEntry.tournamentTime = tournament.time;
                        matchEntry.participants = match.participants;
                        matchEntry.tournamentId = tournament.id;
                        if(leagueObj.wifi){
                          matchEntry.wifi = true;
                        }
                        matchEntry.participantsLeague = {};
                        Object.keys(match.participants).forEach(tournamentId => {
                          let participantPlayer = Object.entries(tournament.linkage).find(i => i[1] == tournamentId);
                          if(participantPlayer){
                            let participantPlayerGlobalId = this.props.allplayers["mapping"][linkLeague+":"+participantPlayer[0]];
                            matchEntry.participantsLeague[tournamentId] = this.props.allplayers["players"][participantPlayerGlobalId];
                            if(participantPlayer[1] != playerIdInTournament){
                              matchEntry.opponent = matchEntry.participantsLeague[tournamentId];
                              matchEntry.scoreOther = match.participants[tournamentId];
                            } else {
                              matchEntry.scoreMe = match.participants[tournamentId];
                            }
                          }
                        })
                        if(match.winner == playerIdInTournament){
                          matchEntry.won = true;
                        }
                        if(Object.keys(matchEntry.participantsLeague).length == 2 && matchEntry.opponent &&
                        matchEntry.scoreMe != -1 && matchEntry.scoreOther != -1){
                          matchesPlayed.push(matchEntry);
                        }
                      }
                    });
                  }
                }
              }
            })
          }
        });
      }
    }

    console.log("Tournaments: "+tournamentsWent.length);
    console.log("Matches: "+matchesPlayed.length)

    matchesPlayed = matchesPlayed.sort((a, b) => {return b.tournamentTime - a.tournamentTime;})

    // Stats
    let stats = []
    
    if(this.player.ts){
      stats.push({text: "PowerRankings Power", value: Math.round(this.player.ts * 160000000).toLocaleString(i18n.language)})
    }
    stats.push({text: "Tournaments played", value: tournamentsWent.length})
    stats.push({text: "Sets played", value: matchesPlayed.length})

    let wins = 0;
    matchesPlayed.forEach((match) => {if(match.won) wins += 1;})
    let winRate = wins/matchesPlayed.length*100;
    if(!winRate) winRate = 0;
    stats.push({
      text: "Win rate",
      value: winRate.toLocaleString(i18n.language, {minimumFractionDigits: 2,maximumFractionDigits: 2})+"%"
    })

    wins = 0;
    matchesPlayed.slice(0, 50).forEach((match) => {if(match.won) wins += 1;})
    winRate = wins/Math.min(matchesPlayed.length, 50)*100;
    if(!winRate) winRate = 0;
    stats.push({
      text: "Win rate (Last 50 sets)",
      value: winRate.toLocaleString(i18n.language, {minimumFractionDigits: 2,maximumFractionDigits: 2})+"%"
    })

    let rivals = {};
    matchesPlayed.slice(0, 50).forEach((match)=>{
      if(!rivals.hasOwnProperty(match.opponent.apid)){
        rivals[match.opponent.apid] = {
          apid: match.opponent.apid,
          matches: 1,
          wins: match.won ? 1 : 0
        }
      } else {
        rivals[match.opponent.apid].matches += 1;
        rivals[match.opponent.apid].wins += match.won ? 1 : 0;
      }
    })
    rivals = Object.values(rivals).sort((a, b) => a.matches - b.matches);

    console.log(rivals)
    
    let rival = null;

    for(let i=0; i<rivals.length; i++){
      console.log(rivals[i].wins/rivals[i].matches)
      if(rivals[i].matches >= 3 &&
        rivals[i].wins/rivals[i].matches <= .60) {
        rival = this.props.allplayers["players"][rivals[i].apid]
        break;
      }
    }

    if(rival){
      stats.push({text: "Rival", value: (rival.org ? rival.org+" " : "") + rival.name})
    }

    // Achievements

    //TO
    let to = 0;

    if(this.props.alltournaments != null && this.player.smashgg_id){
      Object.values(this.props.alltournaments).forEach(liga => {
        Object.values(liga).forEach(torneio => {
          if(torneio.to && torneio.to == this.player.smashgg_id){
            to += 1;
          }
        })
      })
    }

    if(to > 0){
      achievements.push({
        "name": i18n.t("achievement-to"),
        "description": i18n.t("achievement-to-desc") + " ("+to+")",
        "icon": "to.svg"
      });
    }

    console.log("IS TO: "+to)

    //No of tournaments went
    if(tournamentsWent.length >= 75){
      achievements.push({
        "name": i18n.t("achievement-pro"),
        "description": i18n.t("achievement-pro-desc"),
        "icon": "competitor5.svg"
      });
    }
    else if(tournamentsWent.length >= 50){
      achievements.push({
        "name": i18n.t("achievement-veteran"),
        "description": i18n.t("achievement-veteran-desc"),
        "icon": "competitor4.svg"
      });
    }
    else if(tournamentsWent.length >= 35){
      achievements.push({
        "name": i18n.t("achievement-tryhard"),
        "description": i18n.t("achievement-tryhard-desc"),
        "icon": "competitor3.svg"
      });
    }
    else if(tournamentsWent.length >= 20){
      achievements.push({
        "name": i18n.t("achievement-competitor"),
        "description": i18n.t("achievement-competitor-desc"),
        "icon": "competitor2.svg"
      });
    }
    else if(tournamentsWent.length >= 10){
      achievements.push({
        "name": i18n.t("achievement-challenger"),
        "description": i18n.t("achievement-challenger-desc"),
        "icon": "competitor1.svg"
      });
    }
    else if(tournamentsWent.length >= 1){
      achievements.push({
        "name": i18n.t("achievement-beginner"),
        "description": i18n.t("achievement-beginner-desc"),
        "icon": "competitor0.svg"
      });
    }

    // Tournaments won
    let tournamentsWon = 0;
    let bestPlacing = Infinity;

    tournamentsWent.some(tournament=>{
      if(Number.parseInt(tournament.ranking) == 1){
        tournamentsWon += 1;
      }
      if(Number.parseInt(tournament.ranking) < bestPlacing){
        bestPlacing = Number.parseInt(tournament.ranking);
      }
    })

    if(tournamentsWon > 0){
      if(tournamentsWon < 5){
        achievements.push({
          "name": i18n.t("achievement-winner"),
          "description": i18n.t("achievement-winner-desc"),
          "icon": "champion1.svg"
        });
      } else if(tournamentsWon < 10){
        achievements.push({
          "name": i18n.t("achievement-champion"),
          "description": i18n.t("achievement-champion-desc"),
          "icon": "champion2.svg"
        });
      } else {
        achievements.push({
          "name": i18n.t("achievement-elite"),
          "description": i18n.t("achievement-elite-desc"),
          "icon": "champion3.svg"
        });
      }
    } else {
      if(bestPlacing == 2){
        achievements.push({
          "name": i18n.t("achievement-nexttime"),
          "description": i18n.t("achievement-nexttime-desc"),
          "icon": "2nd.svg"
        });
      } else if(bestPlacing == 3){
        achievements.push({
          "name": i18n.t("achievement-almostthere"),
          "description": i18n.t("achievement-almostthere-desc"),
          "icon": "3rd.svg"
        });
      } else if(bestPlacing < 8){
        achievements.push({
          "name": i18n.t("achievement-goodrun"),
          "description": i18n.t("achievement-goodrun-desc"),
          "icon": "top8.svg"
        });
      }
    }

    // Traveler
    let offlineNonBrStates = [];

    tournamentsWent.some(tournament=>{
      if(tournament.state != "wifi" && tournament.state != "BR"){
        if(!offlineNonBrStates.includes(tournament.state)){
          offlineNonBrStates.push(tournament.state);
        }
      }
    })

    console.log(offlineNonBrStates)

    if(offlineNonBrStates.length > 1){
      achievements.push({
        "name": i18n.t("achievement-traveler"),
        "description": i18n.t("achievement-traveler-desc"),
        "icon": "traveler.svg"
      });
    }

    // Wifiwarrior
    let wifiTournamentsWent = 0;

    tournamentsWent.some(tournament=>{
      let league = this.props.leagues.find(element => element.id == tournament.league);
      if(league.wifi){
        wifiTournamentsWent += 1;
      }
    })

    if(wifiTournamentsWent >= 50){
      achievements.push({
        "name": i18n.t("achievement-lanwarrior"),
        "description": i18n.t("achievement-lanwarrior-desc"),
        "icon": "wifiwarrior3.svg"
      });
    } else if(wifiTournamentsWent >= 25){
      achievements.push({
        "name": i18n.t("achievement-elitesmash"),
        "description": i18n.t("achievement-elitesmash-desc"),
        "icon": "wifiwarrior2.svg"
      });
    } else if(wifiTournamentsWent >= 15){
      achievements.push({
        "name": i18n.t("achievement-wifiwarrior"),
        "description": i18n.t("achievement-wifiwarrior-desc"),
        "icon": "wifiwarrior1.svg"
      });
    } else if(wifiTournamentsWent >= 1){
      achievements.push({
        "name": i18n.t("achievement-quickplayer"),
        "description": i18n.t("achievement-quickplayer-desc"),
        "icon": "wifiwarrior0.svg"
      });
    }

    // Character specialist
    if(this.player.bestPlayerCharacter && this.props.leagues){
      let leagues_best = []
      let character = []
      Object.entries(this.player.bestPlayerCharacter).forEach(entry=>{
        let league = this.props.leagues.find(element => element.id == entry[0]);
        if(league){
          leagues_best.push(league.name)
          character = entry
        }
      })
      if(leagues_best.length > 0){
        achievements.push({
          "name": i18n.t("achievement-specialist"),
          "description": i18n.t("achievement-specialist-desc")+" "+character[1][0]+" ("+leagues_best.join(", ")+")",
          "icon": "bestplayercharacter.svg",
          "icon_middle": GetCharacterCodename(this.props.game, character[1][1])+"_00"
        });
      }
    }

    console.log(achievements);

    this.state.exp = 0;
    
    tournamentsWent.forEach(tournament => {
      this.state.exp += tournament.player_number + 5 * (1 - tournament.ranking/tournament.player_number);
    });

    matchesPlayed.forEach(match => {
      this.state.exp += 8 * (1 + (match.won ? 0.4 : 0));
    })

    let level = Math.cbrt(this.state.exp * 5);
    console.log(level);

    //stats.push({text: "Player Level", value: level.toLocaleString(i18n.language)})

    this.state.playerData = this.player;
    this.state.tournaments = tournamentsWent.sort((a, b) => b.time - a.time);
    this.state.matches = matchesPlayed;
    this.state.stats = stats;
    this.state.achievements = achievements;

    console.log(this.state.level)

    this.setState(this.state);
  }

  getTwitterHandle(twitter){
    let parts = twitter.split('/');
    return parts[parts.length-1];
  }

  open(){
    window.jQuery("#playerModal").modal("toggle");
  }

  closeModal(){
    window.jQuery("#playerModal").modal("toggle");
  }

  getCharCodename(playerData, id){
    let skin = 0;

    if(playerData.hasOwnProperty("skins")){
      skin = playerData["skins"][playerData["mains"][id]];
      if(skin == undefined){
        skin = 0;
      }
    }
    
    return GetCharacterCodename(this.props.game, playerData["mains"][id])+"_0"+skin;
  }

  getCharName(name){
    return name.toLowerCase().replace(/ /g, "");
  }

  render (){
    const { theme } = this.props;
    const { classes } = this.props;

    return(
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        keepMounted={true}
        open={this.state.open}
        scroll="body"
        classes={{paper: classes.dialogRoot}}
        onClose={()=>{this.setState({open: false}); this.props.closeModal()}}
      >
        <DialogTitle style={{padding: 8, textAlign: "right"}}>
          <IconButton style={{width: "50px"}} onClick={()=>{this.setState({open: false}); this.props.closeModal()}}>
            ✕
          </IconButton>
        </DialogTitle>
        <DialogContent style={{padding: 0}}>
          {this.state.playerData && this.props.leagues && this.props.game ?
              <Box>
                <Box style={{
                  minHeight: "128px", display: "flex", alignItems: "center", position: "relative",overflow: "hidden",
                  paddingTop: 10, paddingBottom: 10
                }}>
                  <div style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/bg_diagonal.webp)`, overflow: "hidden",
                  position: "absolute", width: "100%", height: "100%", backgroundSize: "6px 6px", opacity: ".6"}}></div>

                  <Hidden xsDown>
                    {
                      this.state.playerData.avatar ?
                        <div style={{zIndex: 1}}>
                          <div
                            className={styles.avatar}
                            style={{
                              backgroundColor: "white",
                              backgroundImage: "url("+this.state.playerData.avatar+")"}}>
                          </div>
                        </div>
                    :
                      null
                    }
                  </Hidden>

                  <div style={{zIndex: 1, flexGrow: 1, marginLeft: "10px"}}>
                    <Hidden smUp>
                      {
                        this.state.playerData.avatar ?
                          <div style={{zIndex: 1}}>
                            <div
                              className={styles.avatar}
                              style={{
                                backgroundColor: "white",
                                backgroundImage: "url("+this.state.playerData.avatar+")"}}>
                            </div>
                          </div>
                      :
                        null
                      }
                    </Hidden>
                    <Typography className={styles.playerTag} variant="h6" component="h2"
                    style={{color: "white", display: "flex", flexWrap: "wrap"}}>
                      <div style={{display: "flex", flexWrap: "wrap"}}>
                        {this.state.playerData.org ?
                          <b style={{color: theme.palette.secondary.main}}>{this.state.playerData.org}<span>&nbsp;</span></b>
                        :
                          null
                        }
                        {this.state.playerData.name}
                      </div>

                      <div style={{display: "flex"}}>
                        {this.state.playerData.country_code && this.state.playerData.country_code != "null" ?
                          <div className={styles.stateFlag + " state-flag"} style={{
                            backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/country_flag/${this.state.playerData.country_code.toLowerCase()}.png)`,
                            width: "32px", height: "32px", display: "inline-block", backgroundSize: "contain", backgroundRepeat: "no-repeat",
                            backgroundPosition: "center", paddingTop: "22px", marginLeft: "10px", textAlign: "center", verticalAlign: "bottom"
                          }}></div>
                        :
                          null
                        }

                        {this.state.playerData.state && this.state.playerData.state != "null" ?
                          <div className={styles.stateFlag + " state-flag"} style={{
                            backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/state_flag/${this.state.playerData.country_code}/${this.state.playerData.state}.png)`,
                            width: "32px", height: "32px", display: "inline-block", backgroundSize: "contain", backgroundRepeat: "no-repeat",
                            backgroundPosition: "center", paddingTop: "22px", marginLeft: "10px", textAlign: "center", verticalAlign: "bottom"
                          }}></div>
                        :
                          null
                        }
                      </div>
                    </Typography>

                    {this.state.playerData.full_name?
                      <Typography variant="subtitle1" component="h2" className={styles.fullName}>
                        {this.state.playerData.full_name}
                      </Typography>
                    :
                      null
                    }

                    {this.state.playerData.city ? 
                      <div className={styles.tttag} style={{color: "white", fontSize: ".8rem"}}>
                        <div className={styles.ttlogo} style={{
                          backgroundImage: "url(/icons/location.svg)", width: 16, height: 16, bottom: 0, right: 0,
                          display: "inline-block", verticalAlign: "bottom", marginRight: "6px", backgroundSize: "cover"
                        }}>
                        </div>
                        {this.state.playerData.city}{" - "}{this.state.playerData.country}
                      </div>
                      :
                      null}
                    
                    {this.state.playerData.smashgg_slug ? 
                      <div className={styles.tttag} style={{color: "white", fontSize: ".8rem"}}>
                        <div className={styles.ttlogo} style={{
                          backgroundImage: "url(/icons/smashgg.svg)", width: 16, height: 16, bottom: 0, right: 0,
                          display: "inline-block", verticalAlign: "bottom", marginRight: "6px", backgroundSize: "cover",
                          borderRadius: "100%"
                        }}>
                        </div>
                        <a href={"http://smash.gg/"+this.state.playerData.smashgg_slug} target="_blank">
                          {this.state.playerData.smashgg_slug}
                        </a>
                      </div>
                      :
                      null}

                    {this.state.playerData.twitter ? 
                      <div className={styles.tttag} style={{color: "white", fontSize: ".8rem"}}>
                        <div className={styles.ttlogo} style={{
                          backgroundImage: "url(/icons/twitter.svg)", width: 16, height: 16, bottom: 0, right: 0,
                          display: "inline-block", verticalAlign: "bottom", marginRight: "6px", backgroundSize: "cover"
                        }}>
                        </div>
                        <a href={"http://twitter.com/"+this.getTwitterHandle(this.state.playerData.twitter)} target="_blank">
                          {this.getTwitterHandle(this.state.playerData.twitter)}
                        </a>
                      </div>
                      :
                      null}

                    {this.state.playerData.twitch ? 
                      <div className={styles.tttag} style={{color: "white", fontSize: ".8rem"}}>
                        <div className={styles.ttlogo} style={{
                          backgroundImage: "url(/icons/twitch.svg)", width: 16, height: 16, bottom: 0, right: 0,
                          display: "inline-block", verticalAlign: "bottom", marginRight: "6px", backgroundSize: "cover"
                        }}>
                        </div>
                        <a href={"http://twitch.tv/"+this.state.playerData.twitch} target="_blank">
                          {this.state.playerData.twitch}
                        </a>
                      </div>
                      :
                      null}

                    {this.state.playerData.discord ? 
                      <div className={styles.tttag} style={{color: "white", fontSize: ".8rem"}}>
                        <div className={styles.ttlogo} style={{
                          backgroundImage: "url(/icons/discord.svg)", width: 16, height: 16, bottom: 0, right: 0,
                          display: "inline-block", verticalAlign: "bottom", marginRight: "6px", backgroundSize: "cover"
                        }}>
                        </div>
                        {this.state.playerData.discord}
                      </div>
                      :
                      null}
                  </div>

                  <div className={styles.characterMain} style={{
                    marginRight: "12px", marginTop: "-10px", marginBottom: "-10px",
                    backgroundImage: `url(${process.env.PUBLIC_URL}/portraits/${this.props.game}/chara_1_${this.getCharCodename(this.state.playerData, 0)}.png)`,
                    right: 0, flexGrow: 0, flexShrink: 0, height: "auto", alignSelf: "normal",
                    backgroundColor: theme.palette.background.default
                  }}>
                  </div>
                  <div style={{
                    position: "absolute", right: "14px", zIndex: 9, bottom: "2px",
                    filter: "drop-shadow(black 2px 2px 0px)", display: "flex"
                  }}>
                    {this.state.playerData.mains.slice(1).map((main, i)=>(
                        <div class="" style={{
                          backgroundImage: `url(${process.env.PUBLIC_URL}/portraits/${this.props.game}/chara_2_${this.getCharCodename(this.state.playerData, i+1)}.png)`,
                          width: "24px", height: "24px", backgroundPosition: "center", backgroundSize: "cover",
                          flexGrow: 0, display: "flex", flexShrink: 1
                        }}></div>
                      ))}
                  </div>
                </Box>

                {this.state.achievements && this.state.achievements.length > 0 ?
                  <Box>
                    <Typography style={{padding: 12}} variant="h6" component="h3">
                      Achievements
                    </Typography>
                    <Box
                      style={{
                        padding: "12px", margin: 0, display: "flex", flexWrap: "wrap", alignItems: "flex-start",
                        justifyContent: "center", backgroundColor: theme.palette.background.default
                      }}
                    >
                      {this.state.achievements.map((achievement, i)=>(
                        <Tooltip title={achievement.description} placement="top" arrow>
                          <a key={this.state.playerData.name+i} style={{width: 72, textAlign: "center", display: "flex",
                          flexDirection: "column", alignItems: "center", placeContent: "center"}}>
                            <div style={{
                              width: 42, height: 42, backgroundSize: "cover", backgroundRepeat: "none",
                              marginLeft: 6, marginRight: 6,
                              backgroundImage: `url(${process.env.PUBLIC_URL}/icons/achievements/${achievement.icon})`,
                              display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                              {achievement.icon_middle ?
                                <div style={{
                                  width: 20, height: 20, backgroundSize: "contain",
                                  backgroundImage: `url(${process.env.PUBLIC_URL}/portraits/${this.props.game}/chara_2_${achievement.icon_middle}.png)`,
                                  filter: "grayscale(100%) brightness(80%) sepia(100%) hue-rotate(5deg) saturate(500%) contrast(.9)"
                                }}></div>
                                :
                                null
                              }
                            </div>
                            <small style={{textAlign: "center"}}>{achievement.name}</small>
                          </a>
                        </Tooltip>
                      ))}
                    </Box>
                  </Box>
                  :
                  null
                }
              
                {this.state.playerData.rank && Object.keys(this.state.playerData.rank).length > 0 ?
                  <Box>
                    <Typography style={{padding: 12}} variant="h6" component="h3">
                      {i18n.t("leagues")}
                    </Typography>
                    <Grid container style={{padding: 12, backgroundColor: theme.palette.background.default}}>
                      {Object.entries(this.state.playerData.rank).sort((a, b)=>{return a[1].rank-b[1].rank}).map((rank, i)=>(
                        <Grid item xs={12} sm={12} md={6} lg={4} style={{padding: "2px"}} id={i}>
                          {this.props.leagues != null && this.props.leagues.length > 0 ?
                            <Link to={`/${this.props.game}/leagues/${rank[0]}`}>
                              <Chip
                                fullWidth
                                classes={{root: classes.ChipLeague, avatar: classes.ChipLeagueAvatar}}
                                onClick={()=>{this.setState({open: false}); this.props.closeModal(false)}}
                                avatar={
                                  <div>
                                    <div style={{fontSize: 14, fontWeight: "bold", minWidth: "32px", textAlign: "center"}}>
                                      {rank[1].rank}
                                    </div>
                                    <Avatar style={{width: 28, height: 28}} src={`https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/games/${this.props.game}/league_icon/${rank[0]}.png`} />
                                  </div>}
                                label={this.props.leagues.find(element => element.id == rank[0]).name}
                              />
                            </Link>
                          :
                            <div>{Object.keys(this.state.playerData.rank)[i]}</div>
                          }
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                  :
                  null
                }

                {this.state.stats && this.state.stats.length > 0 ?
                  <Box>
                    <Typography style={{padding: 12}} variant="h6" component="h3">
                      Stats
                    </Typography>
                    <Grid
                      container
                      style={{
                        padding: "12px", margin: 0, justifyContent: "center",
                        backgroundColor: theme.palette.background.default,
                        width: "100%", placeContent: "flex-start"
                      }}
                    >
                      {this.state.stats.map(stat => (
                        <Grid item style={{padding: "2px"}} xs={12} sm={12} md={6} lg={6}>
                          <Chip
                            classes={{label: classes.ChipLabelGrow}}
                            style={{
                              width: "100%"
                            }}
                            label={
                              <div style={{display: "flex"}}>
                                <div style={{flexGrow: 1, flexShrink: 1, overflow: "hidden", textOverflow: "ellipsis"}}>
                                  {stat.text}
                                </div>
                                <div style={{flexGrow: 1, textAlign: "right"}}>
                                  {stat.value}
                                </div>
                              </div>
                            }
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                  :
                  null
                }

                {this.state.playerData.character_usage_percent &&
                this.state.playerData.character_usage_percent.length > 0 ?
                  <Box>
                    <Typography style={{padding: 12}} variant="h6" component="h3">
                      {i18n.t("char-usage-latest-30-sets")}
                    </Typography>
                    <Box
                      style={{
                        padding: "12px", margin: 0, display: "flex",
                        backgroundColor: theme.palette.background.default, flexWrap: "wrap",
                        justifyContent: "center"
                      }}
                    >
                      {this.state.playerData.character_usage_percent.map((character, i)=>(
                        <Tooltip title={character[0]} placement="top" arrow>
                          <a key={this.state.playerData.name+i} style={{textAlign: "center", display: "flex",
                          flexDirection: "column", alignItems: "center", placeContent: "center"}}>
                            <div class="" style={{
                              backgroundImage: `url(${process.env.PUBLIC_URL}/portraits/${this.props.game}/chara_2_${GetCharacterCodename(this.props.game, character[0])+"_00"}.png)`,
                              width: "24px", height: "24px", backgroundPosition: "center", backgroundSize: "cover",
                              flexGrow: 0, display: "flex", flexShrink: 1, margin: "0 20px 0 20px"
                            }}></div>
                            <small>{(100*character[1]).toFixed(2)}%</small>
                          </a>
                        </Tooltip>
                      ))}
                    </Box>
                  </Box>
                  :
                  null
                }

                {this.state.matches ?
                  <Box>
                    <Typography style={{padding: 12}} variant="h6" component="h3">
                      {"Sets played"}
                    </Typography>
                    <TableContainer>
                      <Table style={{backgroundColor: theme.palette.background.default}}>
                        <TableHead>
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell scope="col">Opponent</TableCell>
                            <TableCell scope="col">Tournament</TableCell>
                            <TableCell scope="col">{i18n.t("Date")}</TableCell>
                            <TableCell scope="col" style={{textAlign: "center"}}>Score</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {
                            (this.state.setsRowsPerPage > 0 ?
                              this.state.matches.slice(
                                this.state.setsPage * this.state.setsRowsPerPage,
                                this.state.setsPage * this.state.setsRowsPerPage + this.state.setsRowsPerPage,
                              )
                              :
                              this.state.matches
                            ).map((match, i)=>(
                              <TableRow id={i>=5? "collapse2" : ""} class={i>=5? "collapse" : ""}>
                                <TableCell>
                                  <b>
                                    {match.won ?
                                      "W" : "L"
                                    }
                                  </b>
                                </TableCell>
                                <TableCell>
                                  {match.wifi ?
                                    <span><FontAwesomeIcon icon={faWifi} /></span>
                                    :
                                    null
                                  }
                                </TableCell>
                                <TableCell>{match.opponent.org ? match.opponent.org+" " : ""}{match.opponent.name}</TableCell>
                                <TableCell>
                                  <a target="_blank" href={`https://braacket.com/tournament/${match.tournamentId}`} style={{color: "white", textDecoration: "none"}}>
                                    {match.tournamentName}
                                  </a>
                                </TableCell>
                                <TableCell>{i18n.t("date_format", {date: moment.unix(match.tournamentTime).toDate()})}</TableCell>
                                <TableCell style={{textAlign: "center"}}>{match.scoreMe} - {match.scoreOther}</TableCell>
                              </TableRow>
                            ))
                          }
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TablePagination
                              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                              colSpan={9999}
                              count={this.state.matches.length}
                              rowsPerPage={this.state.setsRowsPerPage}
                              page={this.state.setsPage}
                              SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' }
                              }}
                              onChangePage={(event, page)=>{this.setState({setsPage: page})}}
                              onChangeRowsPerPage={(event)=>{this.setState({setsRowsPerPage: parseInt(event.target.value, 10)})}}
                              ActionsComponent={TablePaginationActions}
                            />
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </TableContainer>
                  </Box>
                  :
                  null
                }

                {this.state.tournaments ?
                  <Box>
                    <Typography style={{padding: 12}} variant="h6" component="h3">
                      {i18n.t("Tournaments")}
                    </Typography>
                    <TableContainer>
                      <Table style={{backgroundColor: theme.palette.background.default}}>
                        <TableHead>
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>{i18n.t("Name")}</TableCell>
                            <TableCell>{i18n.t("Date")}</TableCell>
                            <TableCell align="center">{i18n.t("Placing")}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {
                            (this.state.tournamentsRowsPerPage > 0 ?
                              this.state.tournaments.slice(
                                this.state.tournamentsPage * this.state.tournamentsRowsPerPage,
                                this.state.tournamentsPage * this.state.tournamentsRowsPerPage + this.state.tournamentsRowsPerPage,
                              )
                              :
                              this.state.tournaments
                            )
                            .map((tournament, i)=>(
                              <TableRow id={i>=5? "collapse1" : ""} class={i>=5? "collapse" : ""}>
                                <TableCell>
                                  {tournament.ranking == 1 ?
                                    <span>🥇</span>
                                    :
                                    null
                                  }
                                  {tournament.ranking == 2 ?
                                    <span>🥈</span>
                                    :
                                    null
                                  }
                                  {tournament.ranking == 3 ?
                                    <span>🥉</span>
                                    :
                                    null
                                  }
                                </TableCell>
                                <TableCell>
                                  {tournament.state == "wifi" ?
                                    <span><FontAwesomeIcon icon={faWifi} /></span>
                                    :
                                    <span>{tournament.state}</span>
                                  }
                                </TableCell>
                                <TableCell><a target="_blank" href={`https://braacket.com/tournament/${tournament.id}`} style={{color: "white", textDecoration: "none"}}>
                                  {tournament.name}</a>
                                </TableCell>
                                <TableCell>{i18n.t("date_format", {date: moment.unix(tournament.time).toDate()})}</TableCell>
                                <TableCell align="center">{tournament.ranking}<small>/{tournament.player_number}</small></TableCell>
                              </TableRow>
                            ))
                          }
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TablePagination
                              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                              colSpan={9999}
                              count={this.state.tournaments.length}
                              rowsPerPage={this.state.tournamentsRowsPerPage}
                              page={this.state.tournamentsPage}
                              SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' }
                              }}
                              onChangePage={(event, page)=>{this.setState({tournamentsPage: page})}}
                              onChangeRowsPerPage={(event)=>{this.setState({tournamentsRowsPerPage: parseInt(event.target.value, 10)})}}
                              ActionsComponent={TablePaginationActions}
                            />
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </TableContainer>
                  </Box>
                  :
                  null
                }

                {this.state.playerData.tournaments ?
                  <row style={{display: "block", padding: "12px"}}>
                    <h5>Ranking Brasileiro</h5>
                    <table class="table table-striped table-sm" style={{color: "white"}}>
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Nome</th>
                          <th scope="col">Tier</th>
                          <th scope="col">Colocação</th>
                          <th scope="col">Pontuação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          this.state.playerData.tournaments.sort((a, b) => Number(b.name) - Number(a.name)).sort((a, b) => Number(b.points) - Number(a.points)).map((tournament, i)=>(
                            <tr class={i<10? "" : "text-muted"}>
                              <th scope="row">{i+1}</th>
                              <td>{tournament.name}</td>
                              <td>{tournament.rank}</td>
                              <td>{tournament.placing}</td>
                              {i<10?
                                <td><b>{tournament.points}</b></td>
                                :
                                <td>{tournament.points}</td>
                              }
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </row>
                  :
                  null
                }
              </Box>
            :
            <div class="loader"></div>
          }
        </DialogContent>
      </Dialog>
    )
  }
};

export default withStyles(useStyles, {withTheme: true})(PlayerModal)