import React, { Component } from 'react';
import moment from "../../node_modules/moment-timezone/moment-timezone";
import styles from "./nextTournaments.module.css"
import { faCalendar, faEdit, faMapMarkerAlt, faUser, faWifi } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import i18n from '../locales/i18n';
import HelpButton from './HelpButton';
import LazyLoad from 'react-lazyload';
import { Box, Grid, MenuItem, Select, withStyles,
  Link, Chip, Card, CardActionArea, CardMedia, CardContent, Typography, LinearProgress } from '@material-ui/core';

let useStyles = (props) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 180,
  },
  barRoot: {
    height: 10,
    borderRadius: 5,
  },
  barIncomplete: {
    borderRadius: 5,
  },
  barComplete: {
    borderRadius: 5,
    backgroundColor: "green"
  },
  couponChip: {
    margin: 6,
    position: "absolute",
    right: 0,
    bottom: 0
  },
  select: {
    fontSize: '1.4rem',
    marginBottom: '1rem'
  }
});

class Clips extends Component {
  state = {
    clips: null,
    clipsFiltered: [],
    selectedLanguage: "all",
    totalClipsSize: null
  }

  componentDidUpdate(prevProps) {
    
  }

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/out/twitchclips.json')
    .then(res => res.json())
    .then((data) => {
      console.log(data);

      let totalClipsSize = 0;

      Object.keys(data).forEach(language => {
        totalClipsSize += data[language].length;
      })

      this.setState({
        clips: data,
        totalClipsSize: totalClipsSize
      })

      if(this.props.match && this.props.match.params && this.props.match.params.lang){
        if(this.state.clips && this.state.clips[this.props.match.params.lang] != null){
          this.state.selectedLanguage = this.props.match.params.lang;
        }
      }

      this.selectLanguage({target: {value: this.state.selectedLanguage}})
    })
    .catch(console.log)
  }

  selectLanguage(e){
    this.state.selectedLanguage = e.target.value;
    this.filterClips(e.target.value);
  }

  filterClips(value){
    let selectedClips = [];

    if(value == "all"){
      Object.keys(this.state.clips).forEach(language => {
        this.state.clips[language].forEach((clip) => {
          selectedClips.push(clip)
        })
      })
    } else {
      selectedClips = this.state.clips[value];
    }
    
    selectedClips = selectedClips.sort((a, b) => (a.view_count < b.view_count) ? 1 : -1);

    this.state.clipsFiltered = selectedClips;

    this.setState(this.state);

    this.props.history.push('/clips/'+this.state.selectedLanguage);
  }

  render (){
    const { classes } = this.props;

    return(
      <Box>
        <Box>
          <h2 style={{color: "white"}}>
            {"Last week's top clips"} <HelpButton content="To have your clips properly listed on this page, you must set the game and language properly on your stream settings. All info including view count are updated once a week." />
          </h2>
          {this.state.clips ?
            <Select className={classes.select} fullWidth onChange={(e)=>this.selectLanguage(e)} value={this.state.selectedLanguage}>
              <MenuItem value="all">{i18n.t("all") + " ("+this.state.totalClipsSize+")"}</MenuItem>
              {Object.keys(this.state.clips).map((language) => (
                <MenuItem value={language}>{i18n.localeToLanguage(language) + " ("+this.state.clips[language].length+")"}</MenuItem>
              ))}
            </Select>
            :
            null
          }
        </Box>
        <Box>
          <Grid container justify="flex-start" spacing={2} width="100%">
            {
              this.state.clipsFiltered != null ?
                this.state.clipsFiltered.slice(0,50).map((clip)=>(
                  <Grid item lg={4} md={6} sm={6} xs={12}>
                    <Link underline="none" href={clip.url} target="_blank">
                      <Card className={classes.root}>
                        <CardActionArea>
                          <CardMedia
                            className={classes.media}
                            image={clip.thumbnail_url || ""}
                            title={clip.title}>
                              <Box style={{position: "relative", width: "100%", height: "100%"}}>
                                <Chip
                                  className={classes.couponChip}
                                  label={clip.view_count + " views"}
                                />
                              </Box>
                          </CardMedia>
                          <CardContent>
                            <Typography noWrap gutterBottom variant="h6" component="h2">
                              {clip.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {clip.broadcaster_name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Clip by {clip.creator_name}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Link>
                  </Grid>
                ))
                :
                null
            }
          </Grid>
        </Box>
      </Box>
    )
  }
};

export default withStyles(useStyles)(Clips)