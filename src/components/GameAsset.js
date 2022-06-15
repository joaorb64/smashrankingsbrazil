import React, { Component } from 'react'
import styles from './playerElement.module.css'
import {CenterImage, GetCharacterAsset, GetCharacterCodename, GetCharacterEyeHeight, GetCharacterEyesight} from "../globals";
import LazyLoad from 'react-lazyload';
import i18n from '../locales/i18n';
import { Box, Paper, Typography, withStyles, Avatar, Grid, Card, CardActionArea } from '@material-ui/core';

class GameAsset extends Component {

    constructor(props){
        super();
        this.image = React.createRef();
    }
    
    getPlayerSkin(playerData, id){
        let skin = 0;
    
        if(playerData.hasOwnProperty("skins")){
            skin = playerData["skins"][playerData["mains"][id]];
            if(skin == undefined){
                skin = 0;
            }
        }
        
        return skin;
    }

    componentDidMount(){
        CenterImage(
            this.image.current,
            GetCharacterEyesight(this.props.game, this.props.character, this.props.skin, this.props.asset),
            this.props.game,
            this.props.asset,
            this.props.zoom || 1
        );

        window.jQuery(window).resize(()=>{
            CenterImage(
                this.image.current,
                GetCharacterEyesight(this.props.game, this.props.character, this.props.skin, this.props.asset),
                this.props.game,
                this.props.asset,
                this.props.zoom || 1
            );
        })
    }

    componentDidUpdate(){
        CenterImage(
            this.image.current,
            GetCharacterEyesight(this.props.game, this.props.character, this.props.skin, this.props.asset),
            this.props.game,
            this.props.asset,
            this.props.zoom || 1
        );
    }

    render(){
        return(
            <div ref={this.image} style={{
                backgroundImage: `url(${GetCharacterAsset(this.props.game, this.props.character, this.props.skin, this.props.asset)})`,
                position: "relative",
                width: "100%", height: "100%", backgroundSize: "cover", backgroundColor: this.props.backgroundColor, overflow: "hidden"
            }}>
            </div>
        )
    }
}

export default GameAsset;