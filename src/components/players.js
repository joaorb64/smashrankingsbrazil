import React, { Component } from 'react'
import styles from './contacts.module.css'
import {GetCharacterCodename, GetCharacterEyeHeight} from "../globals";
import LazyLoad from 'react-lazyload';
import i18n from '../locales/i18n';
import PlayerElement from './playerElement';
import PlayerModal from './playermodal';
import { Box, Grid, TextField, InputAdornment, IconButton } from '@material-ui/core';
import SearchIcon from "@material-ui/icons/Search";
import { PureComponent } from 'react';
import {Helmet} from "react-helmet";

const fuzzysort = require('fuzzysort')

class Players extends Component {
  state = {
    playerModalOpened: false,
    playerModalPlayer: null,
    league: null,
    players: [],
    filtered: [],
    search: ""
  }

  constructor(){
    super();
    this.playerModal = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if(prevProps != this.props && (!prevProps.allplayers || prevProps.allplayers.length == 0 || !prevProps.allplayers.players || !this.props.allplayers)){
      this.fetchPlayers();
    }
  }

  componentDidMount() {
    this.fetchPlayers();
  }
  
  fetchPlayers() {
    if(this.props.allplayers && this.props.allplayers.players && Object.keys(this.props.allplayers.players).length > 0){
      let players = [];

      let ap = this.props.players ? this.props.players : this.props.allplayers["players"];

      ap.forEach(function(p){

        p.avatars = [];

        if(p.twitter) {
          p.avatars.push(`http://unavatar.now.sh/twitter/${this.getTwitterHandle(p.twitter)}?fallback=false`);
          p.avatars.push(`https://api.microlink.io/?url=https://twitter.com/${this.getTwitterHandle(p.twitter)}&embed=image.url`);
        }
        if(p.smashgg_image) {
          p.avatars.push(p.smashgg_image);
        }

        if(!p.mains || p.mains.length == 0 || p.mains[0] == ""){
          p.mains = ["Random"]
        }

        p.mainnames = p.mains.join(" ");

        if(this.props.match){
          if(this.props.match.params["id"]){
            p.braacket_links.forEach(link => {
              let linkLeague = link.split(":")[0];
              let linkId = link.split(":")[1];
    
              if(linkLeague == this.props.match.params["id"]){
                p.league_id = linkId;
              }
            })
          } else {
            if(p.braacket_links.length > 0){
              p.league_id = p.braacket_links[0];
            } else {
              p.league_id = 0;
            }
          }
        }

        players.push(p);
      }, this)

      players.sort((a, b) => {return a.org+a.name > b.org+b.name ? -1 : 1});

      this.setState({players: players, filtered: players})
    }
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

  getTwitterHandle(twitter){
    let parts = twitter.split('/');
    return parts[parts.length-1];
  }

  normalizePlayerName(name){
    return name.normalize("NFKD").replace(/ /g, '_').replace(/@/g, "_At_").replace(/~/g, "_Tilde_").replace(RegExp('[^0-9a-zA-Z_-]'), '').replace("|", "")
  }

  openPlayerModal(player){
    this.props.history.push(
      player.league_id
    );
    
    this.playerModal.current.setState({open: true, player: player});
  }

  closePlayerModal(){
    this.setState({playerModalOpened: false});

    this.props.history.goBack();
  }

  search(e){
    this.state.search = e;

    if(this.state.search.length == 0){
      this.state.filtered = this.state.players;
    } else {
      let result = fuzzysort.go(this.state.search, Object.values(this.state.players), {
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
      this.state.filtered = []
      Object.values(result).forEach((val)=>{
        if (val["obj"] != null)
          this.state.filtered.push(val["obj"]);
      })
    }

    this.setState(this.state);
  }

  render (){
    return(
      <Box>
        <Helmet>
          <meta property="og:title" content="Players - PowerRankings.gg" />
          <meta property="og:image" content={process.env.PUBLIC_URL+"/favicon.svg"} />
          <meta property="og:description" content="Search players on PowerRankings.gg!" />
        </Helmet>

        {this.state.players && Object.entries(this.state.players).length > 0 ?
          <>
            <TextField
              fullWidth
              style={{marginBottom: 2}}
              placeholder={i18n.t("search-in")+Object.entries(this.state.players).length+i18n.t("search-players")}
              variant="outlined"
              type="search"
              onChange={(e)=>this.search(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment>
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Grid container>
              {Object.values(this.state.filtered).slice(0, 64).map((player, i) => (
                <PlayerElement game={this.props.game} onClick={()=>this.openPlayerModal(player)} player={player} />
              ))}
            </Grid>
          </>
          :
          null
        }
        <PlayerModal game={this.props.game} ref={this.playerModal} open={this.state.playerModalOpened} closeModal={this.closePlayerModal.bind(this)} player={this.state.playerModalPlayer} leagues={this.props.leagues} allplayers={this.props.allplayers} alltournaments={this.props.alltournaments} history={this.props.history} />
      </Box>
    )
  }
};

export default Players