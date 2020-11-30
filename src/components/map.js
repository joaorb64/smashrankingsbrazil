import React, { Component } from 'react'
import { browserHistory } from 'react-router';

import L from '../../node_modules/leaflet/dist/leaflet'
import '../../node_modules/leaflet.tilelayer.colorfilter/src/leaflet-tilelayer-colorfilter'
import LeafletAjax from '../../node_modules/leaflet-ajax/dist/leaflet.ajax'

import styles from './map.module.css'
import { withRouter } from 'react-router-dom'

import CHARACTERS from '../globals'
import { parse } from '@fortawesome/fontawesome-svg-core';

Math.getDistance = function( x1, y1, x2, y2 ) {
	var xs = x2 - x1, ys = y2 - y1;		
	xs *= xs;
	ys *= ys;
	return Math.sqrt( xs + ys );
};

// angle in radians
Math.angleRadians = function(p1, p2){return Math.atan2(p2.y - p1.y, p2.x - p1.x);}

// angle in degrees
Math.angleDeg = function(p1, p2){return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;}

var myMarker = L.Marker.extend({
  update: function () {
		if (this._icon && this._map) {
      var pos = this._map.latLngToLayerPoint(this._latlng);
      
      for(let i=0; i<Object.keys(this._map._layers).length; i+=1){
        let other = Object.values(this._map._layers)[i];

        if(other._latlng && other != this && other._icon){
          let otherPos = this._map.latLngToContainerPoint(other._latlng);
          let myPos = this._map.latLngToContainerPoint(this._latlng);

          let distance = Math.getDistance(
            otherPos.x, otherPos.y,
            myPos.x, myPos.y
          );

          console.log(distance)

          if(distance<32){
            let angle = Math.angleRadians(myPos, otherPos);
            pos.y -= Math.sin(angle)*((32-distance)/4);
            pos.x -= Math.cos(angle)*((32-distance)/4);
          }
        }
      }

			this._setPos(pos);
		}

		return this;
	}
})

console.log(myMarker.update)

class Mapa extends Component {
  state = {
    leagues: null,
    allplayers : null
  }

  mymap = null;
  estados = null;
  markers = [];

  componentDidUpdate(nextProps) {
    if(this.props !== nextProps){
      this.state.leagues = nextProps.leagues;
      this.state.allplayers = nextProps.allplayers;
      this.setState(this.state);
      this.setupMap();
      this.updateData();
    }
  }

  updateData() {
    if(!this.props.leagues) return;
    if(!this.props.allplayers) return;

    Object.keys(this.state.leagues).forEach(league => {
      if(this.state.leagues[league].latlng != null && !this.state.leagues[league].wifi){
        fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/out/'+this.props.leagues[league].id+'/ranking.json')
        .then(res => res.json())
        .then((ranking) => {
          fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/out/'+this.props.leagues[league].id+'/players.json')
          .then(res => res.json())
          .then((players) => {
            /*let geojson = new L.GeoJSON.AJAX("https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/geojson/"+this.props.leagues[league].id+".geojson");

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
            })*/

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

            let found = false;
            
            this.markers.forEach(marker=>{
              if(marker._latlng.lat == lat && marker._latlng.lng == lng){
                lng+=0.001;
              }
            })

            let radius = 150000 + 200 * Object.keys(players.players).length;

            L.circle([lat,lng], radius, {color: "rgba(255, 183, 0, 0.8)", fillColor: "rgba(255, 183, 0, 0.8)"}).addTo(this.mymap);

            let marker = new myMarker([lat, lng], {icon: charIcon}).addTo(this.mymap);
            marker.bindPopup('\
              <div style="display: flex; align-items: center">\
                <div style="width: 32px; height: 32px; background-image: url(https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/league_icon/'+this.props.leagues[league].id+'.png); background-size: cover; background-position: center; border-radius: 8px"></div>\
                <div style="display: flex; align-items: left; flex-direction: column; padding-left: 10px">\
                  <a onClick="window.routerHistory.push(\'/home/smash/'+this.props.leagues[league].id+'\');">'+this.props.leagues[league].name+'</a>'+
                  (this.props.leagues[league].city ? this.props.leagues[league].city+", " : "")+
                  (this.props.leagues[league].state ? this.props.leagues[league].state+", " : "")+
                  (this.props.leagues[league].country ? this.props.leagues[league].country : "")
                +'</div>\
              </div>\
            ');

            this.markers.push(marker);
            this.zoomFitMarkers();
          }).catch(console.log)
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
    if(!this.props.allplayers) return;

    this.state.leagues = this.props.leagues;
    this.state.allplayers = this.props.allplayers;

    this.setState(this.state);

    this.setupMap();
    this.updateData();
  }

  setupMap(){
    if(this.mymap != null) return;

    var mapOptions = {
      attributionControl: false,
      center: [-29.0529434318608, 152.01910972595218],
      zoom: 10
    };

    let myFilter = [
      'hue:180deg',
      'invert:100%',
    ]

    var baseMap = L.tileLayer.colorFilter(
      "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        minZoom: 2,
        maxZoom: 19,
        id: "osm.streets",
        filter: myFilter
      }
    );

    this.mymap = L.map('mapid', mapOptions);
    baseMap.addTo(this.mymap);
  }

  zoomFitMarkers(){
    this.mymap.fitBounds(new L.featureGroup(this.markers).getBounds());
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