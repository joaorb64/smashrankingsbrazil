import React, { Component } from 'react';
import moment from "../../node_modules/moment-timezone/moment-timezone";
import styles from "./nextTournaments.module.css"
import { faCalendar, faEdit, faMapMarkerAlt, faUser, faWifi } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import i18n from '../locales/i18n';
import HelpButton from './HelpButton';
import LazyLoad from 'react-lazyload';

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
    return(
      <div class="slide-fade list-group-item" style={{
        backgroundColor: "#f0f0f000", borderRadius: "10px", border: 0, marginBottom: "5px", width: "100%",
        padding: "10px", paddingTop: 0, alignSelf: "center"
      }}>
        
        <div class="row" style={{marginLeft: -8, marginRight: -8}}>
          <h2 style={{color: "white"}}>
            {"Last week's top clips"} <HelpButton content="To have your clips properly listed on this page, you must set the game and language properly on your stream settings. All info including view count are updated once a week." />
          </h2>
          {this.state.clips ?
            <select class="form-control form-control-lg" onChange={(e)=>this.selectLanguage(e)} value={this.state.selectedLanguage}>
              <option value="all">{i18n.t("all") + " ("+this.state.totalClipsSize+")"}</option>
              {Object.keys(this.state.clips).map((language) => (
                <option value={language}>{i18n.localeToLanguage(language) + " ("+this.state.clips[language].length+")"}</option>
              ))}
            </select>
            :
            null
          }
        </div>
        <div class="row">
          {
            this.state.clipsFiltered != null ?
              this.state.clipsFiltered.slice(0,50).map((clip)=>(
                <div class="col-sm-6 col-md-6 col-xl-4" style={{padding: 2}}>
                  <a href={clip.url}>
                    <div className={styles.tournamentContainerHighlight} style={{cursor: "pointer"}}>
                      <div className={styles.tournamentContainer} style={{backgroundColor: "#ff5e24", border: "4px solid black", cursor: "pointer"}}>
                        <div style={{backgroundImage: "url("+(clip.thumbnail_url || "") +
                          ")", height: 140, margin: "4px",
                        backgroundSize: "cover", backgroundPosition: "center", backgroundColor: "black", position: "relative"}}>
                          <div style={{position: "absolute", margin: "2px",
                          backgroundColor: "#000000aa", right: 0, color: "white",
                          padding: 2, textAlign: "right", lineHeight: "1rem"}}>
                            <small>{clip.view_count} views</small>
                          </div>
                        </div>

                        <div style={{height: 40, display: "flex", flexDirection: "column", alignItems: "center", placeContent: "center",
                        paddingLeft: "8px", paddingRight: "8px", background: "rgb(255,113,40)",
                        background: "linear-gradient(180deg, rgba(255,113,40,1) 0%, rgba(221,87,37,1) 100%)"}}>
                          <div style={{color: "white", textAlign: "center", fontSize: "16px",
                          whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden",
                          textShadow: "2px 2px 0px #00000070", width: "100%"}}>
                            {clip.title}
                          </div>
                          <div style={{color: "white", textAlign: "center", fontSize: "12px",
                            whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden",
                            textShadow: "2px 2px 0px #00000070", width: "100%"}}>
                              {clip.broadcaster_name}
                          </div>
                        </div>

                        <div style={{display: "flex", color: "black", fontSize: "0.8rem", flexDirection: "column"}}>
                          <div style={{backgroundColor: "#dedede", padding: "2px", paddingLeft: "8px", flexGrow: 1}}>
                            Clip by {clip.creator_name}
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

export default Clips