import React, { Component } from 'react'
import { browserHistory } from 'react-router';

import L from '../../node_modules/leaflet/dist/leaflet'
import LeafletAjax from '../../node_modules/leaflet-ajax/dist/leaflet.ajax'

import styles from './map.module.css'
import { withRouter } from 'react-router-dom'

import CHARACTERS from '../globals'

class Mapa extends Component {
  state = {
    leagues: {},
    allplayers : {}
  }

  mymap = null;
  estados = null;
  markers = [];

  componentDidUpdate(nextProps) {
    if(this.props !== nextProps){
      this.state.leagues = nextProps.leagues;
      this.state.allplayers = nextProps.allplayers;
      this.setState(this.state);
      this.updateData();
    }
  }

  updateData() {
    if(this.state.leagues.length == 0) return;
    if(this.state.allplayers.length == 0) return;

    Object.keys(this.state.leagues).forEach(league => {
      if(this.state.leagues[league].latlng != null && !this.state.leagues[league].wifi){
        fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/out/'+this.props.leagues[league].id+'/ranking.json')
        .then(res => res.json())
        .then((ranking) => {
          let geojson = new L.GeoJSON.AJAX("https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/geojson/"+this.props.leagues[league].id+".geojson");

          geojson.on('data:loaded', () => {
            function style(estado) {      
              return {
                fillColor: 'rgba(255, 183, 0, 0.8)',
                weight: 2,
                opacity: 1,
                color: 'black',
                dashArray: '3',
                fillOpacity: 1
              };
            }

            geojson.addTo(this.mymap);

            geojson.eachLayer(function (layer) {   
              layer.setStyle(style.call(this, layer));
            }, this);
          })

          let player = null;

          if(ranking.ranking.ranking != null){
            let best = null;
            Object.entries(ranking.ranking.ranking).forEach((player)=>{
              if(parseInt(player[1].rank) == 1){
                best = player[0];
                return;
              }
            })

            if(best != null){
              let playerId = this.state.allplayers["mapping"][this.props.leagues[league].id+":"+best];
              player = this.state.allplayers["players"][playerId];
            }
          }

          if(!player.mains || player.mains.length == 0){
            player.mains.push("Random");
          }

          let iconUrl = process.env.PUBLIC_URL+"/portraits/ssbu/chara_2_"+CHARACTERS[player.mains[0]]+"_00.png"

          let charIcon = L.icon({
            iconUrl: iconUrl,
            iconSize: [32, 32],
            popupAnchor: [0, -8],
            className: styles.mapCharIcon
          });

          window.routerHistory = this.props.history;

          let lat = this.state.leagues[league].latlng[0];
          let lng = this.state.leagues[league].latlng[1];

          let marker = L.marker([lat, lng], {icon: charIcon}).addTo(this.mymap);
          marker.bindPopup('<a onClick="window.routerHistory.push(\'/home/smash/'+this.props.leagues[league].id+'\');">'+this.props.leagues[league].name+'</a>');
          this.markers.push(marker);
        }).catch(console.log)
      }
    });
  }

  getTwitterHandle(twitter){
    let parts = twitter.split('/');
    return parts[parts.length-1];
  }

  getCharName(name){
    return name.toLowerCase().replace(/ /g, "");
  }

  componentDidMount() {
    if(!this.props.leagues) return;

    this.state.leagues = this.props.leagues;

    var mapOptions = {
      attributionControl: false,
      center: [-29.0529434318608, 152.01910972595218],
      zoom: 10
    };

    var baseMap = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        minZoom: 2,
        maxZoom: 19,
        id: "osm.streets"
      }
    );

    this.mymap = L.map('mapid', mapOptions);
    baseMap.addTo(this.mymap);

    this.estados = new L.GeoJSON.AJAX("https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/geojson/countries.geojson");

    this.estados.on('data:loaded', () => {
      function style(estado) {  
        return {
          fillColor: "rgba(0, 0, 0, 0.5)",
          weight: 2,
          opacity: 1,
          color: 'black',
          dashArray: '3',
          fillOpacity: 1
        };
      }

      this.estados.addTo(this.mymap);

      this.estados.eachLayer(function (layer) {   
        layer.setStyle(style.call(this, layer));
      }, this);

      this.mymap.fitBounds(this.estados.getBounds());
    });
  }

  render (){
    return(
      <div class="slide-fade list-group-item" style={{
        backgroundColor: "#f0f0f0", borderRadius: "10px", border: 0, marginBottom: "5px", width: "100%",
        padding: "10px", alignSelf: "center"
      }}>
        <div id="mapid" style={{height: "calc(80vh - 32px)"}}></div>
      </div>
    )
  }
};

export default withRouter(Mapa)