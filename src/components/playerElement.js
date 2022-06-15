import React, { Component } from 'react'
import styles from './playerElement.module.css'
import {GetCharacterAsset, GetCharacterCodename, GetCharacterEyeHeight, GetCharacterEyesight, GetPlayerSkin} from "../globals";
import LazyLoad from 'react-lazyload';
import i18n from '../locales/i18n';
import GameAsset from './GameAsset';
import { Box, Paper, Typography, withStyles, Avatar, Grid, Card, CardActionArea } from '@material-ui/core';

class PlayerElement extends Component {

    render(){
        const player = this.props.player;
    
        return(
            <Grid item xs={12} class={styles.containerOuter}>
                {player ?
                    <Card style={{overflow: "hidden"}}>
                        <CardActionArea style={{overflow: "hidden", textAlign: "center"}} onClick={this.props.onClick}>
                            <Grid container noWrap overflow="hidden" alignItems="center" className={styles.container}>
                                {player.ranking ?
                                    <div class={styles.playerRanking}>{player.ranking}</div>
                                    :
                                    null
                                }
                                <Grid item style={{alignSelf: "stretch", maxHeight: "100%", width: "64px"}}>
                                    {player.avatar ?
                                        <div class="player-avatar" style={{
                                            backgroundImage: "url("+player.avatar+")",
                                            width: "64px", height: "100%", display: "inline-block", backgroundSize: "cover", backgroundRepeat: "no-repeat",
                                            backgroundPosition: "center", backgroundColor: "white",
                                        }}>
                                        </div>
                                        :
                                        null
                                    }
                                </Grid>
                                <Grid item>
                                    <div class="flags-container">
                                        <div class="state-flag-container" style={{
                                        width: "40px", display: "flex", justifyContent: "center", alignItems: "center", padding: "6px"
                                        }}>
                                        {player.country_code && player.country_code != "null" ?
                                            <div class="flag" style={{
                                            backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/country_flag/${player.country_code.toLowerCase()}.png)`
                                            }}><span>{player.country_code}</span></div>
                                        :
                                            null
                                        }
                                        </div>

                                        <div class="state-flag-container" style={{
                                        width: "40px", display: "flex", justifyContent: "center", alignItems: "center", padding: "6px"
                                        }}>
                                        {player.state && player.state != "null" ?
                                            <div class="flag" style={{
                                            backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/world-state-flags/main/out/${player.country_code.toUpperCase()}/${player.state}.png)`
                                            }}><span>{player.state}</span></div>
                                        :
                                            null
                                        }
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs justifyContent="center" style={{overflow: "hidden"}}>
                                    <Box display="flex" justifyContent="center" noWrap>
                                        {player.org ?
                                            <Typography noWrap variant="h6" color="secondary" className={styles.userNick}>{player.org}&nbsp;</Typography>
                                            :
                                            null
                                        }
                                        <Typography noWrap variant="h6" color="textPrimary" className={styles.userNick}>{player.name}</Typography>
                                    </Box>
                                    <Typography noWrap variant="body2" color="textSecondary" className={styles.userName} style={{lineHeight: "normal"}}>
                                        {player.full_name}
                                    </Typography>
                                </Grid>
                                {player.score ?
                                    <Grid item style={{height: "100%", display: "flex"}}>
                                        <div class="player-score" style={{width: "110px", padding: "5px", display: "flex", flexDirection: "column", justifyContent: "center", flexShrink: 0}}>
                                            <div style={{backgroundColor: "black", flexGrow: 1, display: "flex"}}>
                                            <div style={{
                                                backgroundColor: "black", color: "white", fontSize: "1rem", lineHeight: "1rem", flexGrow: 1, alignSelf: "center", width: "100%"
                                            }}>{player.score} pts.</div>
                                            </div>
                                        </div>
                                    </Grid>
                                    :
                                    null
                                }
                                <Grid item style={{alignSelf: "stretch", maxHeight: "100%"}}>
                                    {player.mains.length > 0 ?
                                        <div class="player-main" style={{
                                            width: "128px", height: "100%", backgroundSize: "cover", backgroundColor: "#ababab", overflow: "hidden", position: "relative"
                                        }}>
                                            <GameAsset game={this.props.game} character={player["mains"][0]} skin={GetPlayerSkin(player, 0)} asset={this.props.big ? "full" : "portrait"}></GameAsset>
                                            <div style={{overflow: "hidden", display: "flex", height: "100%", alignItems: "flex-end", justifyContent: "flex-end", position: "absolute", top: 0, right: 0}}>
                                                {player.mains.slice(1).map((main, i)=>(
                                                    <div class="player-main-mini" style={{
                                                    width: "24px", height: "24px", backgroundPosition: "center", backgroundSize: "cover",
                                                    flexGrow: 0, display: "flex", flexShrink: 1
                                                    }}>
                                                        <GameAsset game={this.props.game} character={player["mains"][i+1]} skin={GetPlayerSkin(player, i+1)} asset={"icon"}></GameAsset>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        :
                                        <div style={{
                                            width: "128px", backgroundColor: "#ababab"
                                        }}>
                                            <GameAsset game={this.props.game} character={"random"} skin={0} asset={this.props.big ? "full" : "portrait"}></GameAsset>
                                        </div>
                                    }
                                </Grid>
                            </Grid>
                        </CardActionArea>
                    </Card>
                    :
                    null
                }
            </Grid>
        )
    }
}

export default PlayerElement;