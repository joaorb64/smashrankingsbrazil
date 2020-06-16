import React, { Component } from 'react'
import { browserHistory } from 'react-router';

import L from '../../node_modules/leaflet/dist/leaflet'
import LeafletAjax from '../../node_modules/leaflet-ajax/dist/leaflet.ajax'

import styles from './map.module.css'
import { withRouter } from 'react-router-dom'

class Mapa extends Component {
  state = {
    leagues: {}
  }

  mymap = null;
  estados = null;
  markers = [];

  componentDidUpdate(nextProps) {
    if(this.props !== nextProps){
      this.state.leagues = nextProps.leagues;
      this.updateData();
    }
  }

  updateData() {
    if(this.state.leagues.length == 0) return;

    Object.keys(this.state.leagues).forEach(element => {
      fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/master/out/'+this.props.leagues[element].id+'.json')
      .then(res => res.json())
      .then((data) => {
        if(data){
          let players = [];

          Object.keys(data["ranking"]).forEach(function(player){
            if(data["ranking"][player].avatar){
              data["ranking"][player].avatar = `https://raw.githubusercontent.com/joaorb64/tournament_api/master/${data["ranking"][player].avatar}`;
            } else if (data["ranking"][player].twitter) {
              data["ranking"][player].avatar = `https://twivatar.glitch.me/${this.getTwitterHandle(data["ranking"][player].twitter)}`;
            }

            if(!data["ranking"][player].mains){
              data["ranking"][player].mains = [];
            }

            if(data["ranking"][player].mains.length == 0){
              data["ranking"][player].mains.push({name: "Random", icon: "assets/images/game/ssbu/characters/random.png"});
            }

            if((data["ranking"][player]["rank"])){
              data["ranking"][player]["score"] = data["ranking"][player]["rank"][this.props.leagues[element].id]["score"];
              data["ranking"][player]["ranking"] = data["ranking"][player]["rank"][this.props.leagues[element].id]["rank"];
              if(data["ranking"][player]["ranking"]){
                players.push(data["ranking"][player]);
              }
            }
          }, this);
          
          players.sort(function(a, b){
            return Number(a["ranking"]) - Number(b["ranking"]);
          });

          //console.log(players)

          this.state.leagues[element]["players"] = players;

          this.setState(this.state);

          // add marker
          let found = null;

          if(this.props.leagues[element].codigo_uf){
            found = this.municipios.find(cidade => cidade.nome == this.props.leagues[element].city && cidade.codigo_uf == this.props.leagues[element].codigo_uf);
          } else {
            found = this.municipios.find(cidade => cidade.nome == this.props.leagues[element].city);
          }

          if(found){
            if(this.props.leagues[element].players){
              let iconUrl = "http://braacket.com/assets/images/game/ssbu/characters/random.png"

              if(this.props.leagues[element].players.length > 0){
                iconUrl = "http://braacket.com/"+this.props.leagues[element].players[0].mains[0].icon
              }

              let charIcon = L.icon({
                iconUrl: iconUrl,
                iconSize: [32, 32],
                popupAnchor: [0, -8],
                className: styles.mapCharIcon
              });

              window.routerHistory = this.props.history;
  
              let marker = L.marker([found.latitude, found.longitude], {icon: charIcon}).addTo(this.mymap);
              marker.bindPopup('<a onClick="window.routerHistory.push(\'/home/smash/'+this.props.leagues[element].id+'\');">'+this.props.leagues[element].name+'</a>');
              this.markers.push(marker);
            }
          };
        }
      })
      .catch(console.log)
    });
  }

  getTwitterHandle(twitter){
    let parts = twitter.split('/');
    return parts[parts.length-1];
  }

  componentDidMount() {
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

    fetch('/geojson/municipios.json')
    .then(res => res.json()).then((data) => {
      this.municipios = data;

      this.estados = new L.GeoJSON.AJAX("/geojson/brazil-states.geojson");

      this.estados.on('data:loaded', () => {
        function style(estado) {
          let sigla = estado.feature.properties.sigla;

          let achou = this.state.leagues.find(
            league => sigla == league.state
          );
  
          return {
            fillColor: achou ? 'rgba(255, 183, 0, 0.8)' : "rgba(0, 0, 0, 0.6)",
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
        this.updateData();
      });
    })
  }

  render (){
    return(
      <div class="slide-fade list-group-item" style={{
        backgroundColor: "#f0f0f0", borderRadius: "10px", border: 0, marginBottom: "5px", width: "100%",
        padding: "30px", alignSelf: "center"
      }}>
        <div id="mapid" style={{height: "500px"}}></div>
      </div>
    )
  }
};

export default withRouter(Mapa)