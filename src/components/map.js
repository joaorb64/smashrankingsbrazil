import React, { Component } from 'react'
import { browserHistory } from 'react-router';

import L from '../../node_modules/leaflet/dist/leaflet'
import '../../node_modules/leaflet.tilelayer.colorfilter/src/leaflet-tilelayer-colorfilter'
import LeafletAjax, { resolve } from '../../node_modules/leaflet-ajax/dist/leaflet.ajax'

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

          let angle;

          if(distance == 0){
            angle = Math.angleRadians(
              {x: this._latlng.lng, y: this._latlng.lat},
              {x: other._latlng.lng, y: other._latlng.lat}
            )
          }

          if(distance<32){
            if(angle == undefined)
              angle = Math.angleRadians(myPos, otherPos);
            console.log(angle);
            console.log(distance);
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
    allplayers : null,
    loading: false
  }

  mymap = null;
  estados = null;
  markers = [];
  circles = [];

  componentDidUpdate(nextProps) {
    if(this.props !== nextProps){
      this.state.leagues = nextProps.leagues;
      this.state.allplayers = nextProps.allplayers;
      this.setState(this.state);
      this.setupMap();
      this.updateData();
    }
  }

  updateData(online=false) {
    if(this.updating) return;
    this.updating = true;
    this.setState({loading: true});
    if(!this.props.leagues) return;
    if(!this.props.allplayers) return;

    if(this.markers){
      this.markers.forEach((marker)=>{
        marker.remove();
      })
      this.markers = [];
    }

    if(this.circles){
      this.circles.forEach((circle)=>{
        circle.remove();
      })
      this.circles = [];
    }

    let promises = []

    console.log(this.state.leagues);

    Object.keys(this.state.leagues).forEach(league => {
      if(this.state.leagues[league].latlng != null && online == !!this.state.leagues[league].wifi){
        promises.push(
          async() => {
            console.log(this.state.leagues[league].id)

            let ranking = await fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/out/'+this.props.leagues[league].id+'/ranking.json').then(res => res.json())
            let players = await fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/out/'+this.props.leagues[league].id+'/players.json').then(res => res.json())

            let player = null;

            if(ranking.ranking != null && ranking.ranking.ranking != null){
              console.log(ranking.ranking.ranking)
              
              let best = null;

              try {
                best = Object.entries(ranking.ranking.ranking)[0][0];
                let lowestNum = parseInt(Object.entries(ranking.ranking.ranking)[0][1].rank);

                Object.entries(ranking.ranking.ranking).forEach((player)=>{
                  if(parseInt(player[1].rank) < lowestNum){
                    best = player[0];
                    lowestNum = parseInt(player[1].rank);
                  }
                })
              } catch(e) {
                console.log(e);
              }

              if(best != null){
                let playerId = this.state.allplayers["mapping"][this.props.leagues[league].id+":"+best];
                player = this.state.allplayers["players"][playerId];
              }
            }

            if(player == null || !player.mains || player.mains.length == 0){
              if(player == null){player = {mains: []}}
              player.mains.push("Random");
            }

            let iconUrl = process.env.PUBLIC_URL+"/portraits/ssbu/chara_2_"+(CHARACTERS[player.mains[0]] || "random")+"_00.png"

            let iconSize = 36;

            if(!online && this.state.leagues[league].state != null) iconSize = 24;
            else if(online && this.state.leagues[league].country != null) iconSize = 24;

            let charIcon = L.icon({
              iconUrl: iconUrl,
              iconSize: [iconSize, iconSize],
              popupAnchor: [0, -8],
              className: styles.mapCharIcon
            });

            window.routerHistory = this.props.history;

            let lat = this.state.leagues[league].latlng[0];
            let lng = this.state.leagues[league].latlng[1];

            let found = false;
            
            this.markers.forEach(marker=>{
              if(marker._latlng.lat == lat && marker._latlng.lng == lng){
                lng+=0.005;
              }
            })

            let radius;
            if(!online) radius = 150000 + 200 * Object.keys(players.players).length;
            else radius = 400000 + 1000 * Object.keys(players.players).length;

            radius *= iconSize/24;

            let color;
            if(!online) color = "rgba(255, 183, 0, 0.9)"
            else color = "rgba(170, 220, 255, 0.9)"

            let circle = L.circle([lat,lng], radius, {color: color, fillColor: color}).addTo(this.mymap);
            this.circles.push(circle);

            let marker = new myMarker([lat, lng], {icon: charIcon}).addTo(this.mymap);
            marker.bindPopup('\
              <div style="display: flex; align-items: center">\
                <div style="width: 32px; height: 32px; background-image: url(https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/league_icon/'+this.props.leagues[league].id+'.png); background-size: cover; background-position: center; border-radius: 8px"></div>\
                <div style="display: flex; align-items: left; flex-direction: column; padding-left: 10px">\
                  <a onClick="window.routerHistory.push(\'/leagues/smash/'+this.props.leagues[league].id+'\');">'+this.props.leagues[league].name+'</a>'+
                  (this.props.leagues[league].city ? this.props.leagues[league].city+", " : "")+
                  (this.props.leagues[league].state ? this.props.leagues[league].state+", " : "")+
                  (this.props.leagues[league].country ? this.props.leagues[league].country : "")
                +'</div>\
              </div>\
            ');

            this.markers.push(marker);

            return(true);
          }
        )
      }
    });

    async function todos(){
      let calls = [];
      for(let i=0; i<promises.length; i++){
        calls.push(promises[i]());
      }
      for(let i=0; i<calls.length; i++){
        await calls[i];
      }
      this.zoomFitMarkers();
      this.updating = false;
      this.setState({loading: false});
    }

    todos.call(this);

    /*Promise.all(promises).then(()=>{
      console.log(promises);
      console.log(this.markers);
      this.zoomFitMarkers();
    })*/
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

    this.mymap.setZoom(2);
    this.mymap.panTo(new L.LatLng(0,0))
  }

  zoomFitMarkers(){
    if(this.markers.length > 0){
      this.mymap.fitBounds(new L.featureGroup(this.markers).getBounds());
    }
  }

  render (){
    return(
      <div class="slide-fade list-group-item" style={{
        backgroundColor: "#f0f0f0", borderRadius: "10px", border: 0, marginBottom: "5px", width: "100%",
        padding: "10px", alignSelf: "center"
      }}>
        <div id="mapid" style={{height: "calc(80vh - 32px)"}}>
          <div class="btn-group btn-group-toggle" style={{zIndex: 9999, position: "absolute", right: 10, top: 10}} data-toggle="buttons">
            <label onClick={(e)=>{e.preventDefault(); this.updateData()}} class="btn btn-primary active">
              <input type="radio" name="options" id="option1" autocomplete="off" checked />
              Offline
            </label>
            <label onClick={(e)=>{e.preventDefault(); this.updateData(true)}} class="btn btn-primary">
              <input type="radio" name="options" id="option2" autocomplete="off" />
              Online
            </label>
          </div>
          {this.state.loading ?
            <div style={{
              zIndex: 9999, position: "absolute", left: 0, right: 0, top:0, bottom: 0,
              backgroundColor: "#00000088", display: "flex", alignItems: "center"
            }}>
              <div class="loader"></div>
            </div>
            :
            null
          }
        </div>
      </div>
    )
  }
};

export default withRouter(Mapa)