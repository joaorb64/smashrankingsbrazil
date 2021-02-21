import React, { Component } from 'react'
import styles from './playerElement.module.css'
import {GetCharacterCodename, GetCharacterEyeHeight} from "../globals";
import LazyLoad from 'react-lazyload';
import i18n from '../locales/i18n';
import { Box, Paper, Typography, withStyles, Avatar, Grid, Card, CardActionArea } from '@material-ui/core';

class PlayerElement extends Component {
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
                                    {player.avatars && player.avatars.length > 0 ?
                                        <div class="player-avatar" style={{
                                            backgroundImage: "url("+player.avatars.join("), url(")+")",
                                            width: "64px", height: "100%", display: "inline-block", backgroundSize: "cover", backgroundRepeat: "no-repeat",
                                            backgroundPosition: "center", backgroundColor: "gray",
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
                                            backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/state_flag/${player.country_code}/${player.state}.png)`
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
                                            backgroundImage: 
                                                this.props.big ?
                                                    `url(${process.env.PUBLIC_URL}/portraits/${this.props.game}/chara_1_${this.getCharCodename(player, 0)}.png)`
                                                :
                                                    `url(${process.env.PUBLIC_URL}/portraits/${this.props.game}/chara_0_${this.getCharCodename(player, 0)}.png)`
                                            ,
                                            width: "128px", height: "100%", backgroundPositionX: "center", backgroundSize: "cover", backgroundColor: "#ababab", overflow: "hidden",
                                            backgroundPositionY: (GetCharacterEyeHeight(this.props.game, player.mains[0], player.skins)+"%" || "center")
                                        }}>
                                            <div style={{overflow: "hidden", display: "flex", height: "100%", alignItems: "flex-end", justifyContent: "flex-end"}}>
                                            {player.mains.slice(1).map((main, i)=>(
                                                <div class="player-main-mini" style={{
                                                backgroundImage: `url(${process.env.PUBLIC_URL}/portraits/${this.props.game}/chara_2_${this.getCharCodename(player, i+1)}.png)`,
                                                width: "24px", height: "24px", backgroundPosition: "center", backgroundSize: "cover",
                                                flexGrow: 0, display: "flex", flexShrink: 1
                                                }}></div>
                                            ))}
                                            </div>
                                        </div>
                                        :
                                        <div style={{
                                            backgroundImage: `url(${process.env.PUBLIC_URL}/portraits/${this.props.game}/chara_0_random.png)`,
                                            width: "128px", backgroundPosition: "center", backgroundSize: "cover", backgroundColor: "#ababab"
                                        }}></div>
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