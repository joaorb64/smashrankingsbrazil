import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import styles from './playermodal.module.css';
import CHARACTERS from "../globals";
import moment from "../../node_modules/moment-timezone/moment-timezone";

class PlayerModal extends Component {
  state = {
    playerData: null,
    alltournaments: {},
    tournaments: {},
    achievements: {}
  }

  componentDidUpdate(nextProps) {
    if(nextProps !== this.props) {
      this.setState({alltournaments: this.props.alltournaments});
    }
  }

  componentDidMount() {
    window.playerModal = this;
  }

  fetchPlayer(){
    if(this.player == null) return;

    let tournamentsWent = [];
    let achievements = [];

    let myIds = []

    if(this.state.alltournaments != null){
      console.log(this.state.alltournaments);

      this.player.braacket_links.forEach(link => {
        let linkLeague = link.split(":")[0];
        let linkId = link.split(":")[1];

        if(Object.keys(this.state.alltournaments).includes(linkLeague)){
          Object.values(this.state.alltournaments[linkLeague]).forEach(tournament => {
            if(Object.keys(tournament.ranking).includes(linkId)){
              let tournamentEntry = {};
              Object.assign(tournamentEntry, tournament);
              tournamentEntry["ranking"] = tournament.ranking[linkId].rank;
              tournamentsWent.push(tournamentEntry);
            }
          })
        }
      });
    }

    console.log("Tournaments: "+tournamentsWent.length);

    // Achievements
    if(tournamentsWent.length >= 50){
      achievements.push({
        "name": "Pro",
        "description": "Participou de 50 torneios ou mais",
        "icon": "competitor3.svg"
      });
    }
    else if(tournamentsWent.length >= 25){
      achievements.push({
        "name": "Tryhard",
        "description": "Participou de 25 torneios ou mais",
        "icon": "competitor2.svg"
      });
    }
    else if(tournamentsWent.length >= 10){
      achievements.push({
        "name": "Competidor",
        "description": "Participou de 10 torneios ou mais",
        "icon": "competitor1.svg"
      });
    }
    else if(tournamentsWent.length >= 5){
      achievements.push({
        "name": "Iniciante",
        "description": "Participou de 5 torneios ou mais",
        "icon": "competitor0.svg"
      });
    }

    tournamentsWent.some(tournament=>{
      if(Number.parseInt(tournament.ranking) == 1){
        achievements.push({
          "name": "Campeão",
          "description": "1º lugar em um torneio",
          "icon": "champion.svg"
        });
        return true;
      }
    })

    console.log(achievements);

    this.state.playerData = this.player;
    this.state.tournaments = tournamentsWent;
    this.state.achievements = achievements;

    this.setState(this.state);
  }

  getTwitterHandle(twitter){
    let parts = twitter.split('/');
    return parts[parts.length-1];
  }

  closeModal(){
    window.jQuery("#playerModal").modal("toggle");
  }

  getCharCodename(playerData, id){
    let skin = 0;

    if(playerData.hasOwnProperty("skins")){
      skin = playerData["skins"][id];
    }
    
    return CHARACTERS[playerData["mains"][id]]+"_0"+skin;
  }

  render (){
    return(
      <div class="modal fade" id="playerModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle"></h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              {this.state.playerData ?
                  <div>
                    <div style={{
                      height: "128px", background: "black", display: "flex", alignItems: "center", position: "relative",overflow: "hidden",
                      borderBottom: "1px solid #3d5466"
                    }}>
                      <div style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/bg_diagonal.webp)`, overflow: "hidden",
                      position: "absolute", width: "100%", height: "100%", backgroundSize: "6px 6px"}}></div>

                      {
                        this.state.playerData.twitter ?
                          <a style={{zIndex: 1}} href={this.state.playerData.twitter}>
                            <div className={styles.avatar} style={{backgroundImage: `url(${this.state.playerData.avatar})`}}>
                            </div>
                          </a>
                      :
                        null
                      }

                      <div style={{zIndex: 1, flexGrow: 1, marginLeft: "10px"}}>
                        <h3 className={styles.playerTag} style={{color: "white"}}>
                          <b style={{color: "#bb0000"}}>{this.state.playerData.org} </b>

                          {this.state.playerData.name}

                          {this.state.playerData.state ?
                            <div className={styles.stateFlag + " state-flag"} style={{
                              backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/master/state_icon/${this.state.playerData.state}.png)`,
                              width: "32px", height: "32px", display: "inline-block", backgroundSize: "contain", backgroundRepeat: "no-repeat",
                              backgroundPosition: "center", paddingTop: "22px", marginLeft: "10px", textAlign: "center", verticalAlign: "bottom"
                            }}></div>
                          :
                            null
                          }
                        </h3>

                        {this.state.playerData.full_name?
                          <div className={styles.fullName}>{this.state.playerData.full_name}</div>
                        :
                          null
                        }

                        {this.state.playerData.twitter ? 
                        <div className={styles.tttag} style={{color: "white", fontSize: ".8rem"}}>
                          <div className={styles.ttlogo} style={{
                            backgroundImage: "url(/icons/twitter.svg)", width: 16, height: 16, bottom: 0, right: 0,
                            display: "inline-block", verticalAlign: "bottom", marginRight: "6px"
                          }}>
                          </div>
                          @{this.getTwitterHandle(this.state.playerData.twitter)}
                        </div>
                        :
                        null}
                      </div>

                      <div className={styles.characterMain} style={{
                        marginRight: "12px", borderBottom: "1px solid #3d5466",
                        backgroundImage: `url(${process.env.PUBLIC_URL}/portraits/ssbu/chara_1_${this.getCharCodename(this.state.playerData, 0)}.png)`
                      }}></div>
                    </div>

                    {this.state.achievements && this.state.achievements.length > 0 ?
                      <div class="row" style={{padding: "10px", margin: 0, backgroundColor: "black", borderBottom: "1px solid #3d5466"}}>
                        {this.state.achievements.map((achievement, i)=>(
                          <a key={this.state.playerData.name+i} style={{width: 72, height: 52, textAlign: "center", display: "flex",
                          flexDirection: "column", alignItems: "center", placeContent: "center"}}
                          data-toggle="tooltip" data-placement="top" title={achievement.description}>
                            <div style={{
                              width: 32, height: 32, backgroundSize: "cover", backgroundRepeat: "none",
                              marginLeft: 6, marginRight: 6,
                              backgroundImage: `url(${process.env.PUBLIC_URL}/icons/achievements/${achievement.icon})`
                            }}>
                              
                            </div>
                            <small style={{textAlign: "center"}}>{achievement.name}</small>
                          </a>
                        ))}
                      </div>
                      :
                      null
                    }
                  
                    {this.state.playerData.rank ?
                      <div class="row" style={{padding: "10px", margin: 0, backgroundColor: "black", borderBottom: "1px solid #3d5466"}}>
                        {Object.entries(this.state.playerData.rank).sort((a, b)=>{return a[1].rank-b[1].rank}).map((rank, i)=>(
                          <div class="col-lg-4 col-md-6" style={{padding: "2px"}} id={i}>
                            {this.props.leagues ?
                              <Link 
                                to={`/home/smash/${rank[0]}`}
                                onClick={()=>this.closeModal()}
                                style={{display: "flex"}}>
                                  <div style={{width: "42px", textAlign: "center", fontSize: "1.5rem",
                                  backgroundColor: "lightgray", display: "flex", flexShrink: 0, color: "black"}}>
                                    <div style={{alignSelf: "center", width: "100%"}}>
                                      {rank[1].rank}
                                    </div>
                                  </div>
                                  <div style={{
                                    width: "48px", height: "48px", display: "inline-block", backgroundSize: "cover", backgroundPosition: "center",
                                    flexShrink: 0,
                                    backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/master/league_icon/${rank[0]}.png)`}}></div>
                                  <div style={{display: "flex", flexDirection: "column", overflow: "hidden", width: "100%", backgroundColor: "lightgray"}}>
                                    <div style={{paddingLeft: "5px", textOverflow: "ellipsis", fontSize: "0.8rem", 
                                    whiteSpace: "nowrap", overflow: "hidden", backgroundColor: "gray", color: "white"}}>
                                      {this.props.leagues.find(element => element.id == rank[0]).name}
                                    </div>
                                    <div style={{paddingLeft: "5px", color: "black", flexGrow: 1, fontSize: "1.2rem"}}>
                                      {rank[1].score} pts.
                                    </div>
                                  </div>
                              </Link>
                            :
                              <div>{Object.keys(this.state.playerData.rank)[i]}</div>
                            }
                          </div>
                        ))}
                      </div>
                      :
                      <div>Este jogador não foi encontrado em nenhuma liga.</div>
                    }

                    {this.state.tournaments ?
                      <row style={{display: "block", padding: "12px"}}>
                        <h5>Torneios</h5>
                        <table class="table table-striped table-sm" style={{color: "white"}}>
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Nome</th>
                              <th scope="col">Data</th>
                              <th scope="col" style={{textAlign: "center"}}>Colocação</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              this.state.tournaments.sort((a, b) => b.time - a.time).sort((a, b) => Number(b.points) - Number(a.points)).map((tournament, i)=>(
                                <tr>
                                  <th scope="row">{i+1}</th>
                                  <td><a target="_blank" href={`https://braacket.com/tournament/${tournament.id}`}>{tournament.name}</a></td>
                                  <td>{moment.unix(tournament.time).add(1, "day").format("DD/MM/YY")}</td>
                                  <td style={{textAlign: "center"}}>{tournament.ranking+"/"+tournament.player_number}</td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                      </row>
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
                  </div>
                :
                null
              }
            </div>
            <div class="modal-footer">
            </div>
          </div>
        </div>
      </div>
    )
  }
};

export default PlayerModal