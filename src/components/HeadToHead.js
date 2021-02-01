import React, { Component } from 'react'
import styles from './contacts.module.css'
import {CHARACTERS, CHARACTER_EYE_HEIGHT_PERCENTAGE} from "../globals";
import LazyLoad from 'react-lazyload';
import i18n from '../locales/i18n';
import PlayerElement from './playerElement';
import PlayerModal from './playermodal';
import { Box, Grid, TextField, InputAdornment, IconButton, Select } from '@material-ui/core';
import SearchIcon from "@material-ui/icons/Search";
import { PureComponent } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';

const fuzzysort = require('fuzzysort')

class HeadToHead extends Component {
  state = {
    playerModalOpened: false,
    playerModalPlayer: null,
    league: null,
    players: [],
    filtered: [],
    search: "",
    ts: null,
    player1: null,
    player2: null
  }

  componentDidUpdate(prevProps) {
    if(!this.state.ts){
      this.fetchTs();
    }
  }

  componentDidMount() {
    this.fetchTs();
  }

  ncdf(x, mean, std) {
    var x = (x - mean) / std
    var t = 1 / (1 + .2315419 * Math.abs(x))
    var d =.3989423 * Math.exp( -x * x / 2)
    var prob = d * t * (.3193815 + t * ( -.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
    if( x > 0 ) prob = 1 - prob
    return prob
  }

  winProbability(p1, p2, beta, mu, sigma){
    let delta_mu = p1.mu - p2.mu;
    let sum_sigma = p1.sigma ** 2 + p2.sigma ** 2;
    let size = 2;
    let denom = Math.sqrt(size * (beta * beta) + sum_sigma);
    return this.ncdf(delta_mu / denom, mu, sigma);
  }

  winProbabilityPercent(p1, p2, beta, mu, sigma){
    let p1prob = this.winProbability(p1, p2, beta, mu, sigma);
    let p2prob = this.winProbability(p2, p1, beta, mu, sigma);

    let total = p1prob+p2prob;
    return [p1prob/total, p2prob/total];
  }
  
  fetchTs() {
    if(this.props.allplayers && this.props.allplayers.players && Object.keys(this.props.allplayers.players).length > 0){
      fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/out/ts_env.json')
      .then(res => res.json())
      .then((data) => {
        this.setState({ts: data});
      })
      .catch(console.log)
    }
  }

  getCharCodename(playerData, id){
    let skin = 0;

    if(playerData.hasOwnProperty("skins")){
      skin = playerData["skins"][id];
    }
    
    return CHARACTERS[playerData["mains"][id]]+"_0"+skin;
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
        {this.props.allplayers && this.state.ts ?
          <>
            <Autocomplete
              value={this.state.player1}
              onChange={(event, newValue) => {
                this.setState({player1: newValue});
              }}
              options={this.props.allplayers.players}
              getOptionLabel={(option) => option.org? option.org+" "+option.name : option.name}
              style={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined"/>}
            />
            <Autocomplete
              value={this.state.player2}
              onChange={(event, newValue) => {
                this.setState({player2: newValue});
              }}
              options={this.props.allplayers.players}
              getOptionLabel={(option) => option.org? option.org+" "+option.name : option.name}
              style={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined"/>}
            />
            {this.state.player1? this.state.player1.name + " (" + this.state.player1.sigma + ")" : null} <br/>
            {this.state.player2? this.state.player2.name + " (" + this.state.player2.sigma + ")" : null} <br/>
            {this.state.player1 && this.state.player2 ?
              <>
                {this.winProbabilityPercent(this.state.player1, this.state.player2, this.state.ts.beta, this.state.ts.mu, this.state.ts.sigma).map((prob) => (
                  <Box>{prob}</Box>
                ))}
                <Box>{(1-this.state.player1.sigma/this.state.ts.sigma) + " " + (1-this.state.player2.sigma/this.state.ts.sigma)}</Box>
              </>
            :
              null
            }
          </>
          :
          null
        }
      </Box>
    )
  }
};

export default HeadToHead