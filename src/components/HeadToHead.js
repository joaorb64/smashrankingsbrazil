import React, { Component } from 'react'
import styles from './contacts.module.css'
import LazyLoad from 'react-lazyload';
import i18n from '../locales/i18n';
import PlayerElement from './playerElement';
import PlayerModal from './playermodal';
import { Box, Grid, TextField, InputAdornment, IconButton, Select, Typography, Paper, withStyles } from '@material-ui/core';
import SearchIcon from "@material-ui/icons/Search";
import { PureComponent } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { GetCharacterCodename, CHARACTERS_GG_TO_BRAACKET, GetCharacterAsset } from "../globals";
import { rating, rate, ordinal, predictWin } from 'openskill'
const queryString = require("query-string");

const fuzzysort = require('fuzzysort')

const useStyles = (theme) => ({
  playerContainer: {
    padding: 8,
    [theme.breakpoints.down('sm')]: {
      padding: 2
    }
  },
  playerTag: {
    [theme.breakpoints.down('sm')]: {
      fontSize: "1rem"
    }
  },
  charPortrait: {
    height: 300,
    [theme.breakpoints.down('sm')]: {
      height: 100
    }
  },
});

class HeadToHead extends Component {
  state = {
    playerModalOpened: false,
    playerModalPlayer: null,
    league: null,
    players: [],
    filtered: [[], []],
    search: "",
    ts: null,
    playerSlots: [null, null],
    winProbability: [null, null]
  }

  componentDidUpdate(prevProps) {
    if(!this.state.ts){
      this.fetchTs();
    }
  }

  componentDidMount() {
    this.fetchTs();
  }

  selectPlayer(slotIndex, selectedPlayer){
    if(!selectedPlayer) return;

    let player = {};
    Object.assign(player, selectedPlayer);

    let tournamentsWent = [];
    let matchesPlayed = [];

    if(this.props.alltournaments != null && this.props.allplayers != null){
      player.rank = {}
      player.matches = []

      if(player.braacket_links){
        player.braacket_links.forEach(link => {
          let linkLeague = link.split(":")[0];
          let linkId = link.split(":")[1];

          fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/out/'+this.props.game+'/'+linkLeague+'/ranking.json')
          .then(res => res.json())
          .then((data) => {
            if(data.ranking.ranking[linkId]){
              player.rank[linkLeague] = {rank: data.ranking.ranking[linkId].rank, score: data.ranking.ranking[linkId].score};
              this.setState(this.state);
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

    player.tournamentsWent = tournamentsWent;
    player.matchesPlayed = matchesPlayed;

    this.state.playerSlots[slotIndex] = player;

    this.updateSlots();
  }

  updateSlots(){
    if(this.state.playerSlots[0] && this.state.playerSlots[1] &&
      this.state.playerSlots[0].ts && this.state.playerSlots[1].ts){
      this.state.playerSlots.forEach((player, slotIndex) => {
        let otherSlot = 1;
        if(slotIndex == 1) {otherSlot = 0;}
    
        player.setWins = 0;
    
        if(this.state.playerSlots[otherSlot] != null){
          player.matchesPlayed.forEach((match) => {
            if(match.opponent.apid == this.state.playerSlots[otherSlot].apid){
              if(match.won){
                player.setWins += 1;
              }
            }
          })
        }
      })

      let winProb = predictWin([
        [rating({mu: this.state.playerSlots[0].mu, sigma: this.state.playerSlots[0].sigma})],
        [rating({mu: this.state.playerSlots[1].mu, sigma: this.state.playerSlots[1].sigma})]
      ])
      console.log("sigmas", this.state.playerSlots[0].sigma, this.state.playerSlots[1].sigma)
      console.log(winProb)
      this.state.winProbability = winProb
    } else {
      this.state.winProbability = [null, null];
    }

    this.setState({
      playerSlots: this.state.playerSlots,
      winProbability: this.state.winProbability
    });
  }
  
  fetchTs() {
    if(this.props.allplayers && this.props.allplayers.players && Object.keys(this.props.allplayers.players).length > 0){
      let searchParams = queryString.parse(this.props.history.location.search);
      if(searchParams.p1){
        if(searchParams.p1.includes(":")){
          let p = this.props.allplayers.mapping[searchParams.p1];
          this.selectPlayer(0, this.props.allplayers.players[p]);
        } else {
          let sggid = parseInt(searchParams.p1);
          let p = this.props.allplayers.players.find(player => player.smashgg_id == sggid);
          this.selectPlayer(0, p);
        }
      }
      if(searchParams.p2){
        if(searchParams.p2.includes(":")){
          let p = this.props.allplayers.mapping[searchParams.p2];
          this.selectPlayer(1, this.props.allplayers.players[p]);
        } else {
          let sggid = parseInt(searchParams.p2);
          let p = this.props.allplayers.players.find(player => player.smashgg_id == sggid);
          this.selectPlayer(1, p);
        }
      }
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

  search(i, text){
    if(text.length == 0){
      this.state.filtered[i] = [];
    } else {
      let result = fuzzysort.go(text, this.props.allplayers.players, {
        keys: [
          'name',
          'full_name',
          'org',
          'country',
          'state',
          'mainnames'
        ],
        threshold: -10000,
        limit: 20,
        scoreFn(a){
          return Math.max(
            a[0]?a[0].score:-1000,
            a[1]?a[1].score-10:-1000,
            a[2]?a[2].score-10:-1000,
            a[3]?a[3].score-100:-1000,
            a[4]?a[4].score-100:-1000,
            a[5]?a[5].score-10:-1000,
          )}
      })
      this.state.filtered[i] = []
      Object.values(result).forEach((val)=>{
        if (val["obj"] != null){
          this.state.filtered[i].push(val["obj"]);
        }
      })
    }

    this.setState({filtered: this.state.filtered});
  }

  render (){
    const { theme } = this.props;
    const { classes } = this.props;

    let fullscreenStyle = {
      position: "fixed",
      zIndex: 999,
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: theme.palette.background.default
    }

    let searchParams = queryString.parse(this.props.history.location.search);

    return(
      <Box style={searchParams.fullscreen ? fullscreenStyle : null}>
        {this.props.allplayers ?
          <>
            <Grid container justify="space-evenly" >
              {this.state.playerSlots.map((player, i) => (
                <Grid item xs={6} sm={5} md={4} lg={3} xl={2} className={classes.playerContainer}>
                  <Autocomplete
                    filterOptions={(x) => x}
                    onChange={(event, newValue) => {
                      this.selectPlayer(i, newValue);
                    }}
                    fullWidth
                    onInputChange={(event, newInputValue) => {
                      this.search(i, newInputValue);
                    }}
                    options={this.state.filtered[i]}
                    getOptionLabel={(option) => option.org? option.org+" "+option.name : option.name}
                    renderOption={(option) =>
                      <div style={{"contentVisibility": "auto", "containIntrinsicSize": "24px", display: "flex"}}>
                        <div style={{
                          backgroundSize: "cover",
                          width: 24,
                          height: 24,
                          marginRight: 8,
                          backgroundImage: `url(${GetCharacterAsset(this.props.game, option.mains[0] || "random", 0, "icon")})`
                        }}></div>
                        {option.org? option.org+" "+option.name : option.name}
                        {option.country_code && option.country_code != null && option.country_code != "null" ?
                          <img style={{placeSelf: "center", marginLeft: "4px"}} width="24px" height="16px" src={`https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/country_flag/${option.country_code.toLowerCase()}.png`} />
                          :
                          null}
                      </div>
                    }
                    renderInput={(params) => <TextField {...params} label={"Player "+(i+1)} variant="outlined"/>}
                  />
                  {player ?
                    <Paper style={{marginTop: 8}}>
                      <Box p={1} style={{height: 80}} noWrap>
                        <Box display="flex" style={{placeContent: "center"}} noWrap>
                          {player.org ?
                            <Typography align="right" className={classes.playerTag} noWrap color="secondary" variant="h6">{player.org}&nbsp;</Typography>
                            :
                            null
                          }
                          <Typography align="left" className={classes.playerTag} noWrap variant="h6">{player.name}</Typography>
                        </Box>
                        <Typography align="center" noWrap variant="h6" color="textSecondary">
                          {player.full_name || ' '}
                        </Typography>
                      </Box>
                      <Box style={{
                        width: "100%",
                        backgroundPosition: "center", backgroundSize: "cover",
                        backgroundColor: theme.palette.action.disabledBackground,
                        backgroundImage: `url(${GetCharacterAsset(this.props.game, player.mains[0] || "random", 0, "full")})`
                      }} className={classes.charPortrait}>
                      </Box>
                      <Box p={1}>
                        <Typography align="center" noWrap variant="body2" color="textSecondary">
                          Set wins
                        </Typography>
                        <Typography align="center" noWrap variant="h2">
                          {player.setWins}
                        </Typography>
                        <Typography align="center" noWrap variant="body2" color="textSecondary">
                          {player.ts ?
                            <>
                              Win probability <br/>
                              Confiability: {
                                player.sigma > 2 ? "Ultra low" :
                                player.sigma > 1.5? "Very low" :
                                player.sigma > 1 ? "Low" :
                                "Ok"
                              }
                            </>
                          :
                            <>
                              No match data
                            </>
                          }
                        </Typography>
                        <Typography align="center" noWrap variant="h4">
                          {this.state.winProbability[i] ?
                            (this.state.winProbability[i] * 100).toFixed(2) + "%"
                          :
                            "-"
                          }
                        </Typography>
                      </Box>
                    </Paper>
                    :
                    null
                  }
                </Grid>
              ))}
            </Grid>
          </>
          :
          null
        }
      </Box>
    )
  }
};

export default withStyles(useStyles, {withTheme: true})(HeadToHead)