import React, { Component } from 'react'
import { browserHistory } from 'react-router';

import L from '../../node_modules/leaflet/dist/leaflet'
import '../../node_modules/leaflet.tilelayer.colorfilter/src/leaflet-tilelayer-colorfilter'
import LeafletAjax, { resolve } from '../../node_modules/leaflet-ajax/dist/leaflet.ajax'

import styles from './map.module.css'
import { withRouter } from 'react-router-dom'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';

import { GetCharacterAsset, GetCharacterCodename } from '../globals'
import { parse } from '@fortawesome/fontawesome-svg-core';
import { Box, withTheme, withStyles, ButtonGroup, Button, Select, MenuItem } from '@material-ui/core';
import { ThumbDownSharp } from '@material-ui/icons';

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

Math.getCentroid = function (arr) { 
  return arr.reduce(function (x,y) {
    return [x[0] + y[0]/arr.length, x[1] + y[1]/arr.length] 
  }, [0,0]) 
}

var myMarker = L.Marker.extend({
  _animateZoom: function (opt) {
		var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();
    this._newPos = null;
		this._setPos(pos);
	},
  update: function () {
		if (this._icon && this._map) {
      this._newPos = null;

      var pos = this._map.latLngToLayerPoint(this._latlng);

      let positions = []

      for(let i=0; i<Object.keys(this._map._layers).length; i+=1){
        let marker = Object.values(this._map._layers)[i];

        if(marker._latlng && marker != this && marker.options.icon != null){
          positions.push(marker._newPos ? marker._newPos : this._map.latLngToContainerPoint(marker._latlng));
        }
      }

      let mapCenter = Math.getCentroid(positions);
      
      for(let i=0; i<Object.keys(this._map._layers).length; i+=1){
        let other = Object.values(this._map._layers)[i];

        if(other._latlng && other != this && other.options.icon != null){
          let otherPos = other._newPos ? other._newPos : this._map.latLngToContainerPoint(other._latlng);
          
          if(other.pushPos){
            otherPos.y += other.pushPos.y;
            otherPos.x += other.pushPos.x;
          }

          let myPos = this._map.latLngToContainerPoint(this._latlng);

          if(this.pushPos){
            myPos.y += this.pushPos.y;
            myPos.x += this.pushPos.x;
          }

          let distance = Math.getDistance(
            otherPos.x, otherPos.y,
            myPos.x, myPos.y
          );

          let angle;

          if(distance == 0){
            angle = Math.angleRadians(
              {x: myPos.x, y: myPos.y},
              {x: otherPos.x, y: otherPos.y}
            )
          }

          let maxWidth = 32*(this._map._zoom-4)+Math.max(this.options.icon.options.iconSize[0], other.options.icon.options.iconSize[0])/2;

          if(distance < maxWidth){
            if(angle == undefined)
              angle = Math.angleRadians(myPos, otherPos);

            if(!this.pushPos){
              this.pushPos = {x: 0, y: 0};
            }

            if(this.pushPos){
              this.pushPos.y -= Math.sin(angle)*((maxWidth-distance)/2)/2;
              this.pushPos.x -= Math.cos(angle)*((maxWidth-distance)/2)/2;
            }

            if(!other.pushPos){
              other.pushPos = {x:0, y:0};
            }
            
            other.pushPos.y += Math.sin(angle)*((maxWidth-distance)/2)/2;
            other.pushPos.x += Math.cos(angle)*((maxWidth-distance)/2)/2;
          }
        }
      }

      if(this.pushPos){
        pos.x += parseInt(this.pushPos.x);
        pos.y += parseInt(this.pushPos.y);
      }

			this._setPos(pos);

      this._newPos = pos;

      if(this.line){
        this.line.remove(this._map)
      }

      if(this.circle){
        this.circle.remove(this._map)
      }

      if(this.pushPos){
        let point1 = this._map.containerPointToLatLng(
          this._map.layerPointToContainerPoint(this._newPos)
        )
        let point2 = this._latlng
        
        this.line = L.polyline(
          [
            point1,
            point2
          ],
          {
            weight: 2,
            lineCap: "round"
          }
        ).addTo(this._map);

        this.circle = L.circle(
          point2,
          {
            radius: 1,
            weight: 6,
            fillOpacity: 1
          }
        ).addTo(this._map);
      }

      this.pushPos = null;
		}

    if(this._map._zoom > 4){
      this._icon.classList.remove(styles["hide-text"]);
    } else {
      this._icon.classList.add(styles["hide-text"]);
    }

		return this;
	}
})

console.log(myMarker.update)

class Mapa extends Component {
  state = {
    leagues: null,
    allplayers : null,
    loading: false,
    selection: 0
  }

  mymap = null;
  estados = null;
  markers = [];
  circles = [];

  topbarSize = 0;

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

    Object.keys(this.props.leagues).forEach(league => {
      if(this.props.leagues[league].latlng != null && online == !!this.props.leagues[league].wifi){
        promises.push(
          async() => {
            console.log(this.props.leagues[league].id)

            let ranking = await fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/out/'+this.props.game+'/'+this.props.leagues[league].id+'/ranking.json').then(res => res.json())
            let players = await fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/out/'+this.props.game+'/'+this.props.leagues[league].id+'/players.json').then(res => res.json())

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
                let playerId = this.props.allplayers["mapping"][this.props.leagues[league].id+":"+best];
                player = this.props.allplayers["players"][playerId];
              }
            }

            if(player == null || !player.mains || player.mains.length == 0){
              if(player == null){player = {mains: []}}
              player.mains.push("Random");
            }

            let iconUrl = `url(${GetCharacterAsset(this.props.game, player.mains[0], 0, "icon")})`

            let iconSize = 28;

            if(!online && this.props.leagues[league].state != null) iconSize = 18;
            else if(online && this.props.leagues[league].country != null) iconSize = 18;

            let charIcon = new L.DivIcon({
              html: `
                <div>
                  <div style="
                    width: ${iconSize}px; height: ${iconSize}px; background-image: ${iconUrl};
                    background-size: cover; background-repeat: no-repeat;
                    ">
                  </div>
                  <div class="${styles["icon-text"]}" style="
                    white-space: nowrap;
                    font-weight: bold;
                    width: 100px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    left: 0;
                    margin-left: 50%;
                    transform: translateX(-50%);
                    text-align: center;
                    direction: rtl;
                    background-color: rgba(0,0,0,0.5);
                  ">
                    ${player.org? player.org+" | " : ""}${player.name}
                  </div>
                </div>
              `,
              iconSize: [iconSize, iconSize],
              popupAnchor: [0, -8],
              className: styles.mapCharIcon
            });

            window.routerHistory = this.props.history;

            let lat = this.props.leagues[league].latlng[0];
            let lng = this.props.leagues[league].latlng[1];

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
                <div style="width: 32px; height: 32px; background-image: url(https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/games/'+this.props.game+'/league_icon/'+this.props.leagues[league].id+'.png); background-size: cover; background-position: center; border-radius: 8px"></div>\
                <div style="display: flex; align-items: left; flex-direction: column; padding-left: 10px">\
                  <a onClick="window.routerHistory.push(\'/'+this.props.game+'/leagues/'+this.props.leagues[league].id+'\');">'+this.props.leagues[league].name+'</a>'+
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

  componentDidMount(){
    this.firstUpdate();
  }

  componentDidUpdate(nextProps) {
    if(nextProps.leagues != this.props.leagues){
      this.firstUpdate();
    }
  }

  firstUpdate(){
    if(!this.props.leagues) return;
    if(!this.props.allplayers) return;

    this.state.leagues = this.props.leagues;
    this.state.allplayers = this.props.allplayers;

    this.setState(this.state);

    this.setupMap();
    this.updateData(this.state.selection);
  }

  setupMap(){
    if(this.mymap != null) return;

    var mapOptions = {
      attributionControl: false,
      center: [-29.0529434318608, 152.01910972595218],
      zoom: 10,
      minZoom: 0,
      maxZoom: 20,
    };

    let myFilter = [
      'hue:180deg',
      'invert:100%',
    ]

    var baseMap = L.tileLayer.colorFilter(
      "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        minZoom: 0,
        maxZoom: 20,
        id: "osm.streets",
        filter: myFilter
      }
    );

    this.mymap = L.map('mapid', mapOptions);
    baseMap.addTo(this.mymap);

    this.topbarSize = 0;
    
    this.listener = window.addEventListener("resize", ()=>{
      let topbar = document.getElementById("topbar");
      this.topbarSize = 0;
      if(topbar){
        this.topbarSize = topbar.clientHeight;
      }
    })

    this.mymap.setZoom(2);
    this.mymap.panTo(new L.LatLng(0,0))
  }

  zoomFitMarkers(){
    if(this.markers.length > 0){
      this.mymap.fitBounds(new L.featureGroup(this.markers).getBounds());
    }
  }

  render (){
    let { theme } = this.props;

    return(
      <Box>
        <Box id="mapid" style={{height: "calc(100vh - "+this.topbarSize+"px)", margin: "-8px"}} xs>
          <Select
            style={{zIndex: 999, position: "absolute", right: 10, top: 10}}
            value={this.state.selection}
            onChange={(e)=>{this.setState({selection: e.target.value})}}
          >
            <MenuItem value={0} onClick={(e)=>{this.updateData()}}>
              Offline
            </MenuItem>
            <MenuItem value={1} onClick={(e)=>{this.updateData(true)}}>
              Online
            </MenuItem>
          </Select>
          {this.state.loading ?
            <div style={{
              zIndex: 999, position: "absolute", left: 0, right: 0, top:0, bottom: 0,
              backgroundColor: "#00000088", display: "flex", alignItems: "center"
            }}>
              <div class="loader"></div>
            </div>
            :
            null
          }
        </Box>
      </Box>
    )
  }
};

export default withRouter(withStyles(null, { withTheme: true })(Mapa))