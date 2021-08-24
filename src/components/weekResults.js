import React, { Component } from 'react'
import { browserHistory } from 'react-router';

import L from '../../node_modules/leaflet/dist/leaflet'
import '../../node_modules/leaflet.tilelayer.colorfilter/src/leaflet-tilelayer-colorfilter'
import LeafletAjax, { resolve } from '../../node_modules/leaflet-ajax/dist/leaflet.ajax'

import styles from './map.module.css'
import { withRouter } from 'react-router-dom'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';

import { GetCharacterCodename } from '../globals'
import { icon, parse } from '@fortawesome/fontawesome-svg-core';
import { Box, withTheme, withStyles, ButtonGroup, Button, Select, MenuItem } from '@material-ui/core';

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

          let maxWidth = Math.max(this._icon.width, other._icon.width);
          console.log(maxWidth)

          if(distance < maxWidth){
            if(angle == undefined)
              angle = Math.angleRadians(myPos, otherPos);
            console.log(angle);
            console.log(distance);

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
        pos.x += this.pushPos.x;
        pos.y += this.pushPos.y;
      }

			this._setPos(pos);

      this.pushPos = null;

      this._newPos = pos;
		}

		return this;
	}
})

console.log(myMarker.update)

class WeekResults extends Component {
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

  updateData(region="both") {
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

    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/out/'+this.props.game+'/week_tournament_results.json').then(res => res.json()).then((tournaments)=>{
        tournaments.forEach((tournament)=>{
          if(region == "online" && !tournament.isOnline) return;
          if(region == "offline" && tournament.isOnline) return;

          if(tournament.numEntrants >= 0){

            let character = "random";

            if(tournament.character){
              character = tournament.character;
            }

            let iconUrl = process.env.PUBLIC_URL+"/portraits/"+this.props.game+"/chara_2_"+(GetCharacterCodename(this.props.game, character) || "random")+"_00.png"
        
            let iconSize = 16;
            
            iconSize += tournament.numEntrants/8;

            iconSize = Math.min(42, iconSize)
        
            let charIcon = L.icon({
                iconUrl: iconUrl,
                iconSize: [iconSize, iconSize],
                popupAnchor: [0, -8],
                className: styles.mapCharIcon
            });
        
            window.routerHistory = this.props.history;

            let lat = parseFloat(tournament.lat);
            let lng = parseFloat(tournament.lng);
            
            this.markers.forEach(marker=>{
                if(marker._latlng.lat == lat && marker._latlng.lng == lng){
                    lng+=0.005;
                }
            })
        
            let marker = new myMarker([lat, lng], {icon: charIcon}).addTo(this.mymap);
            marker.bindPopup(`
                <div style="display: flex; align-items: center">
                <div style="display: flex; align-items: left; flex-direction: column; padding-left: 10px">
                    <div>
                      <b>${tournament.tournament} - ${tournament.name}</b>
                    </div>
                    <div>
                      Winner: ${tournament.winner}
                    </div>
                    <div>
                      Participants: ${tournament.numEntrants}
                    </div>
                    <div>
                      Country: ${tournament.country_code}
                    </div>
                </div>
            `);
        
            this.markers.push(marker);
          }
        })

        this.zoomFitMarkers();
        this.updating = false;
        this.setState({loading: false});
    })
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
      maxZoom: 10,
      minZoom: 0
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
            <MenuItem value={0} onClick={(e)=>{this.updateData("both")}}>
              Offline+Online
            </MenuItem>
            <MenuItem value={1} onClick={(e)=>{this.updateData("offline")}}>
              Offline
            </MenuItem>
            <MenuItem value={2} onClick={(e)=>{this.updateData("online")}}>
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

export default withRouter(withStyles(null, { withTheme: true })(WeekResults))