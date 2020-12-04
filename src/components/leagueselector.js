import React, { Component } from 'react'
import styles from './leagueselector.module.css'
import { Link } from 'react-router-dom'
import i18n from '../locales/i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

class LeagueSelector extends Component {
  state = {
    leagues: [],
    league_tree: {
      leagues: [],
      subleagues: {},
      icon: null
    }
  }

  componentDidUpdate(nextProps) {
    if(nextProps !== this.props) {
      this.buildLeagueTree();
    }
  }

  componentDidMount() {
    this.state.leagues = this.props.leagues;
    this.buildLeagueTree();
  }

  buildLeagueTree() {
    this.state.league_tree = {
      leagues: [],
      subleagues: {}
    };

    if(this.props.leagues){
      this.props.leagues.forEach(league=>{
        if(league.region){
          if(!this.state.league_tree["subleagues"][league.region]){
            this.state.league_tree["subleagues"][league.region] = {
              leagues: [],
              subleagues: {},
              name: i18n.t("region-"+league.region.toLowerCase())
            };
          }

          // se não tem país, é liga de região
          if(!league.country){
            this.state.league_tree["subleagues"][league.region]["leagues"].push(league);
          } else {
            if(!this.state.league_tree["subleagues"][league.region]["subleagues"][league.country]){
              this.state.league_tree["subleagues"][league.region]["subleagues"][league.country] = {
                leagues: [],
                subleagues: {},
                icon: `https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/country_flag/${league.country.toLowerCase()}.png`,
                show_count: true
              };
            }

            this.state.league_tree["subleagues"][league.region]["subleagues"][league.country]["leagues"].push(league);
          }
        }
      })

      this.setState(this.state);
    }
  }

  closeModal(){
    window.jQuery("#leagueSelectModal").modal("toggle");
  }

  renderTree(head, recursion=0){
    //console.log(head)
    if(head.leagues == null || head.subleagues == null){
      return;
    }
    return(
      <>
        {head.leagues.map((contact, i)=>(
          <Link class={"dropdown-item " + styles.teste} to={`/leagues/smash/${contact.id}`} href={`/leagues/smash/${contact.id}`} onClick={()=>{this.props.selectLeague(this.props.leagues.indexOf(contact)); this.closeModal()}} style={{
            display: "flex", lineHeight: "32px", paddingLeft: (32*(recursion)+32)+"px"
          }} key={"league_"+contact.name}>
            <div style={{
              width: "32px", height: "32px", display: "inline-block", backgroundSize: "cover", backgroundRepeat: "no-repeat",
              backgroundPosition: "center", verticalAlign: "inherit", backgroundColor: "white", borderRadius: "6px", marginRight: "10px",
              backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/league_icon/${contact.id}.png)`,
              display: "flex", flexShrink: 0
            }}></div>
            <div style={{
              flexShrink: 1, flexGrow: 1, textOverflow: "ellipsis", overflow: "hidden",
              textAlign: "left"
            }}>{contact.name}</div>
            {
              contact.wifi ? 
                <div style={{
                  width: "24px", height: "24px", display: "inline-block", backgroundSize: "cover", backgroundRepeat: "no-repeat",
                  backgroundPosition: "center", verticalAlign: "inherit", borderRadius: "100%",
                  backgroundColor: "white", marginTop: "2px", marginRight: "4px",
                  display: "flex", flexShrink: 0
                }}>
                  <div style={{
                    width: "16px", height: "16px", display: "inline-block", backgroundSize: "cover", backgroundRepeat: "no-repeat",
                    backgroundPosition: "center", verticalAlign: "inherit",
                    backgroundImage: `url(${process.env.PUBLIC_URL}/icons/wifi.svg)`,
                    position: "relative", top: "4px", left: "4px"
                  }}></div>
                </div>
              :
                null
            }
            <div style={{
              width: "32px", height: "32px", display: "inline-block",
              backgroundPosition: "center", verticalAlign: "inherit",
              display: "flex", flexShrink: 0
            }}>
              {contact.state}
            </div>
          </Link>
        ))}
        {Object.entries(head.subleagues).map((league, i) => (
          <>
            <div class={"dropdown-item " + styles.teste} 
            data-toggle="collapse" data-target={"#collapse_"+recursion+"_"+i} aria-controls={"#collapse_"+recursion+"_"+i}
            style={{
              display: "flex", lineHeight: "32px", paddingLeft: (32*(recursion)+32)+"px"
            }}>
              <div class={styles["folder-icon"]}>
                <FontAwesomeIcon icon={faCaretRight} />
              </div>
              {league[1].icon?
                <div style={{
                  width: "32px", height: "32px", display: "inline-block", backgroundSize: "cover", backgroundRepeat: "no-repeat",
                  backgroundPosition: "center", verticalAlign: "inherit", backgroundColor: "white", borderRadius: "6px", marginRight: "10px",
                  backgroundImage: `url(${league[1].icon})`,
                  display: "flex", flexShrink: 0
                }}></div>
                :
                null
              }
              <div style={{
                flexShrink: 1, flexGrow: 1, textOverflow: "ellipsis", overflow: "hidden",
                textAlign: "left"
              }}>
                {league[1].name ?
                  league[1].name
                :
                  league[0]
                }
              </div>
              {league[1].show_count ?
                <div style={{
                  width: "32px", height: "32px", display: "inline-block",
                  backgroundPosition: "center", verticalAlign: "inherit",
                  display: "flex", flexShrink: 0, placeContent: "flex-end"
                }}>
                  {Object.keys(league[1].leagues).length}
                </div>
                :
                null
              }
            </div>
            <div class="collapse" id={"collapse_"+recursion+"_"+i}>
              {this.renderTree(league[1], recursion+1)}
            </div>
          </>
        ))}
      </>
    )
  }

  render(){
    return(
      <div>
        <div class="col-12" style={{padding: "0 10px"}}>
          <button class={styles.teste + " btn btn-secondary col-12 dropdown-toggle"} type="button" id="dropdownMenuButton"
            data-toggle="modal" data-target="#leagueSelectModal" aria-haspopup="true" aria-expanded="false">
            {this.state.leagues && this.state.leagues.length > 0 ?
              <div class={styles.title} style={{display: "flex", lineHeight: "32px"}}>
                <div style={{
                  width: "32px", height: "32px", display: "inline-block", backgroundSize: "cover", backgroundRepeat: "no-repeat",
                  backgroundPosition: "center", verticalAlign: "inherit", backgroundColor: "white", borderRadius: "6px", marginRight: "10px",
                  backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/league_icon/${this.props.leagues[this.props.selectedLeague].id}.png)`,
                  display: "flex", flexShrink: 0
                }}></div>
                <div style={{
                  flexShrink: 1, flexGrow: 1, textOverflow: "ellipsis", overflow: "hidden"
                }}>{this.state.leagues[this.props.selectedLeague].name}</div>
                {
                  this.state.leagues[this.props.selectedLeague].wifi ? 
                    <div style={{
                      width: "24px", height: "24px", display: "inline-block", backgroundSize: "cover", backgroundRepeat: "no-repeat",
                      backgroundPosition: "center", verticalAlign: "inherit", borderRadius: "100%",
                      backgroundColor: "white", marginTop: "2px", marginRight: "4px",
                      display: "flex", flexShrink: 0
                    }}>
                      <div style={{
                        width: "16px", height: "16px", display: "inline-block", backgroundSize: "cover", backgroundRepeat: "no-repeat",
                        backgroundPosition: "center", verticalAlign: "inherit",
                        backgroundImage: `url(${process.env.PUBLIC_URL}/icons/wifi.svg)`,
                        position: "relative", top: "4px", left: "4px"
                      }}></div>
                    </div>
                  :
                    null
                }
                <div style={{
                  width: "32px", height: "32px", display: "inline-block",
                  backgroundPosition: "center", verticalAlign: "inherit",
                  display: "flex", flexShrink: 0
                }}>{this.state.leagues[this.props.selectedLeague].state}</div>
              </div>
              :
              "Loading..."
            }
          </button>
        </div>

        <div class="modal fade" id="leagueSelectModal" tabindex="-1" role="dialog" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header" style={{backgroundColor: "#be2018",
              borderBottom: "1px solid #801e19", color: "white"}}>
                <h5 class="modal-title" id="exampleModalLongTitle">Select a league</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true" style={{color: "white"}}>&times;</span>
                </button>
              </div>
              <div class="modal-body" style={{padding: 0, backgroundColor: "#be2018"}}>
                {/*<div class={"col-md-12 " + styles.teste} style={{padding: 10}}>
                  <input class="form-control" type="text" placeholder={"Pesquisar"}
                  value={this.state.search} />
                </div>*/}
                {this.renderTree(this.state.league_tree)}
              </div>
              <div class="modal-footer" style={{backgroundColor: "#be2018", borderTop: 0}}>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
};

export default LeagueSelector