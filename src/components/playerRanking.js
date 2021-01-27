import React, { Component } from 'react'
import styles from './contacts.module.css'
import { Link, useParams, useLocation } from 'react-router-dom';
import LeagueSelector from './leagueselector';
import moment from "../../node_modules/moment-timezone/moment-timezone";
import {CHARACTERS, CHARACTER_EYE_HEIGHT_PERCENTAGE} from "../globals";
import LazyLoad from 'react-lazyload';
import { Grid, Paper, Box, Card, CardActionArea, Typography, BottomNavigation,
  BottomNavigationAction, Container } from '@material-ui/core';
import PlayerElement from './playerElement';
import { useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { ThemeProvider } from "@material-ui/styles";
import PlayerModal from './playermodal';
import { PureComponent } from 'react';

let useStyles = (props) => ({
  userNick: {
      lineHeight: "normal",
      [props.breakpoints.down("sm")]: {
          fontSize: 12
      }
  },
  userName: {
      [props.breakpoints.down("sm")]: {
          fontSize: 10
      }
  },
  top3Outer: {
    height: 240,
    [props.breakpoints.down("sm")]: {
      height: 220
    },
    [props.breakpoints.up("lg")]: {
      height: 260
    },
    [props.breakpoints.up("xl")]: {
      height: 340
    }
  }
});

class PlayerRanking extends PureComponent {
  state = {
    selectedLeague: 0,
    players: [],
    top3Colors: ["#D6AF36", "#D7D7D7", "#A77044"],
    top3Colors2: ["#AF9500", "#B4B4B4", "#6A3805"],
    top3Colors3: ["#C9B037", "#A7A7AD", "#824A02"]
  }

  constructor() {
    super();
    this.playerModal = React.createRef();
  }

  componentDidMount() {
    if(this.props.ranking){
      this.state.players = this.props.ranking;
    } else {
      this.state.players = null;
    }

    if(this.props.updateTime){
      this.state.updateTime = this.props.updateTime;
    } else {
      this.state.updateTime = null;
    }

    this.setState(this.state);
  }

  selectLeague(i){
    if(i != this.state.selectedLeague){
      this.state.selectedLeague = i;
      this.updateData();
    }
  }

  componentDidUpdate(prevProps){
    if(this.props.ranking && this.props.ranking.length > 0){
      console.log(this.props.match.params)
      if(this.props.match.params["player_id"] && this.playerModal.current.state.open == false){
        console.log(this.props.match.params["player_id"])

        let div = document.getElementById("ranking_player_"+this.props.ranking.findIndex((p)=>p.league_id == this.props.match.params["player_id"]));
        console.log(div)

        if(div)
          window.scrollTo({behavior: "smooth", top: div.offsetTop})

        let p = this.props.ranking.find((p)=>p.league_id == this.props.match.params["player_id"]);
        console.log(p);

        if(p)
          this.playerModal.current.setState({open: true, player: p});
      }
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

  openPlayerModal(player){
    window.history.replaceState(null, null,
      '/leagues/smash/'+this.props.match.params["id"]+'/'+
      this.props.match.params["tab"]+"/"+player.league_id
    );
    
    this.playerModal.current.setState({open: true, player: player});
  }

  closePlayerModal(){
    window.history.replaceState(null, null,
      '/leagues/smash/'+this.props.match.params["id"]+'/'+
      this.props.match.params["tab"]+"/"
    );
  }

  render (){
    const theme = this.props.theme;
    const { classes } = this.props;

    this.state.players = this.props.ranking;
    this.state.updateTime = this.props.updateTime;

    return(
      <div>
        {this.state.players && this.state.players.length > 0 ?
          <Container maxWidth="lg" disableGutters>
            <Grid container>
              {this.state.players.slice(0,3).map((player, i) => (
                <Grid item lg={4} md={4} sm={4} xs={12} style={{padding: "2px", overflow: "hidden"}}>
                  <Card style={{
                    position: "relative", overflow: "hidden", backgroundColor: this.state.top3Colors[i]
                  }}>
                    <CardActionArea
                      onClick={()=>this.openPlayerModal(player)}
                      dataToggle="modal"
                      data-target="#playerModal"
                      key={this.state.selectedLeague+'_'+i}
                      id={"ranking_player_"+i}
                      className={classes.top3Outer}
                      style={{
                        position: "relative", overflow: "hidden", textAlign: "center"
                      }}>
                      <div style={{
                        backgroundColor: this.state.top3Colors2[i], position: "absolute",
                        top: 0, bottom: 0, left: 0, right: 0,
                        clipPath: "polygon(0 0, 0% 100%, 100% 100%)"
                      }}></div>
                      <div style={{
                        backgroundColor: this.state.top3Colors3[i], position: "absolute",
                        top: 0, bottom: 0, left: 0, right: 0,
                        clipPath: "polygon(0 60%, 0% 100%, 100% 100%)"
                      }}></div>
                      <div style={{
                        backgroundImage: `url(${process.env.PUBLIC_URL}/portraits/ssbu/chara_1_${this.getCharCodename(player, 0)}.png)`, display: "flex",
                        width: "calc(100% + 10px)", height: "calc(100% + 10px)", backgroundPosition: "center", backgroundSize: "cover",
                        filter: "drop-shadow(10px 10px 0px #000000AF)", marginLeft: "-10px", marginTop: "-10px"
                      }}></div>
                    
                      <div style={{
                        backgroundColor: theme.palette.background.paper,
                        alignItems: "center", display: "flex", flexDirection: "column",
                        height: "60px", position: "absolute", left: "0px", right: "0px", bottom: 0, justifyContent: "center",
                        paddingLeft: "10px", paddingRight: "10px"
                      }}>
                        <Box display="flex" justifyContent="center" noWrap>
                          {player.org ?
                            <Typography noWrap variant="h6" color="secondary" className={classes.userNick}>{player.org}&nbsp;</Typography>
                            :
                            null
                          }
                          <Typography noWrap variant="h6" color="textPrimary" className={classes.userNick}>{player.name}</Typography>
                        </Box>
                        <Typography noWrap variant="body2" color="textSecondary" className={classes.userName} style={{lineHeight: "normal"}}>
                          {player.full_name}
                        </Typography>
                      </div>

                      <div style={{
                        width: "200px", height: "200px", position: "absolute", 
                        backgroundColor: theme.palette.background.paper, top: -110, left: -110,
                        transform: "rotate(-45deg)"
                      }}>
                      </div>
                      <div style={{
                        width: "100px", height: "100px", position: "absolute", top: 0
                      }}>
                        <div style={{
                          width: 100, height: 100, backgroundImage: `url(${process.env.PUBLIC_URL}/icons/rank${i+1}.png)`,
                          backgroundSize: "cover", position: "absolute"
                        }}></div>
                      </div>

                      <div style={{
                        position: "absolute", left: "0px", right: "0px", bottom: "60px",
                        color: "white", display: "flex", whiteSpace: "nowrap", lineHeight: "32px"
                      }}>
                        <div style={{
                          display: "flex", flexGrow: 1, flexWrap: "wrap", alignSelf: "flex-end",
                          padding: "10px", filter: "drop-shadow(2px 2px 0px black)",
                        }}>
                          {player.mains.length > 0 ?
                            player.mains.slice(1).map((main, i)=>(
                              <div style={{
                                backgroundImage: `url(${process.env.PUBLIC_URL}/portraits/ssbu/chara_2_${this.getCharCodename(player, i+1)}.png)`,
                                width: "32px", height: "32px", backgroundPosition: "center", backgroundSize: "cover",
                                flexGrow: 0, display: "inline-block"
                              }}></div>
                            ))
                            :
                            null
                          }
                        </div>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-end"}}>
                          <div style={{
                            display: "flex", justifyContent: "flex-end",
                            filter: "drop-shadow(0px 0px 2px black)"
                          }}>
                            {player.country_code && player.country_code != "null" ?
                            <div class="" style={{
                              width: "48px", display: "flex", justifyContent: "center", alignItems: "center", padding: "8px", alignSelf: "flex-end"
                            }}>
                              <div class="flag" style={{
                                backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/country_flag/${player.country_code.toLowerCase()}.png)`
                              }}><span>{player.country_code}</span></div>
                            </div>
                            :
                            null
                          }
                          {player.state && player.state != "null" ?
                            <div class="" style={{
                              width: "48px", display: "flex", justifyContent: "center", alignItems: "center", padding: "8px", alignSelf: "flex-end"
                            }}>
                              <div class="flag" style={{
                                backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/state_flag/${player.country_code}/${player.state}.png)`
                              }}><span>{player.state}</span></div>
                            </div>
                            :
                            null
                          }
                          </div>
                          <div style={{
                            fontSize: "1.2rem", backgroundColor: "black", color: "white", textAlign: "right",
                            alignSelf: "flex-end", padding: "6px", paddingTop: "2px", paddingBottom: "2px"
                          }}>
                            {player.score} pts.
                          </div>
                        </div>
                      </div>

                      {player.avatars && player.avatars.length > 0 ?
                        <div style={{
                          backgroundImage: "url("+player.avatars.join("), url(")+")",
                          width: "80px", height: "80px", backgroundSize: "cover", backgroundPosition: "center",
                          borderRadius: "100%", position: "absolute", right: 10, top: 10, border: "2px #f0f0f0 solid",
                          backgroundColor: "gray"
                        }}>
                        </div>
                      :
                        null
                      }
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Grid container>
                {this.state.players.slice(3).map((player, i)=>(
                  <PlayerElement player={player} onClick={()=>this.openPlayerModal(player)} />
                ))}
            </Grid>
            {console.log("rerender")}

            <div style={{textAlign: "right", color: "white"}}>
              <div class="col-12" style={{padding: "0 0px"}}>
                Dados atualizados em: {moment(this.state.updateTime).subtract(3, "hours").format("DD/MM/YY HH:mm") + " (GMT-3)"}
              </div>
            </div>
          </Container>
          :
            this.state.updateTime ?
              <div class={"col-12"} style={{paddingTop: 10}}>
                <div class={styles.listItem} style={{padding: "10px 10px", lineHeight: "24px", height: "auto"}}>
                  Não foi encontrado ranking para esta liga no Braacket. Para solução de problemas, entre em contato com os TOs da sua região.
                </div>
              </div>
            :
            <div class="loader"></div>
        }
        <PlayerModal ref={this.playerModal} open={this.state.playerModalOpened} closeModal={this.closePlayerModal.bind(this)} leagues={this.props.contacts} allplayers={this.props.allplayers} alltournaments={this.props.alltournaments} history={this.props.history} />
      </div>
    )
  }
};

export default withTheme(withStyles(useStyles)(PlayerRanking))