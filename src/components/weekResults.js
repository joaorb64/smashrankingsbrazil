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
import { icon, parse } from '@fortawesome/fontawesome-svg-core';
import { Box, withTheme, withStyles, ButtonGroup, Button, Select, MenuItem, TextField } from '@material-ui/core';

import kmeans from 'kmeansjs'

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

var myRenderer = L.canvas({ padding: 0.5 });

var myMarkerText = L.Marker.extend({
  _animateZoom: function (opt) {
		var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();
    this._newPos = null;
		this._setPos(pos);
	},
  update: function () {
		if (this._icon && this._map) {
      this._newPos = null;

      var pos = this._map.latLngToLayerPoint(this._latlng);

      if(this._map._zoom > 3){
        let foundItself = false;

        for(let i=0; i<this._cluster.length; i+=1){
          let other = this._cluster[i];
          if(other == this){
            foundItself = true;
            continue;
          }

          if(!foundItself){
            continue;
          }

          if(other._latlng && other != this && other.options.icon != null){
            let otherPos = other._newPos ? other._newPos : this._map.latLngToContainerPoint(other._latlng);
            
            if(other.pushPos && !other._newPos){
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
      } else {
        this.pushPos = {x: 0, y: 0}
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

      if(this.pushPos && (this.pushPos.x != 0 || this.pushPos.y != 0)){
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
            renderer: myRenderer,
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

    let minZoom = 4;

    if(this._entrants && this._entrants >= 64){
      minZoom = 2;
    } else if(this._entrants && this._entrants >= 32){
      minZoom = 3;
    }

    if(this._map._zoom > minZoom){
      this._icon.classList.remove(styles["hide-text"]);
    } else {
      this._icon.classList.add(styles["hide-text"]);
    }

		return this;
	}
})

class WeekResults extends Component {
  state = {
    leagues: null,
    allplayers : null,
    loading: false,
    selection: 0,
    minSize: 8
  }

  mymap = null;
  estados = null;
  markers = [];
  markerClusters = [];
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
        if(marker.line){
          marker.line.remove(marker._map)
        }
    
        if(marker.circle){
          marker.circle.remove(marker._map)
        }
        marker.remove();
      })
      this.markers = [];
      this.markerClusters = [];
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

          if(tournament.numEntrants >= this.state.minSize){

            let character = "random";

            if(tournament.character){
              character = tournament.character;
            }

            let iconUrl = `url(${GetCharacterAsset(this.props.game, character, 0, "icon")})`
        
            let iconSize = 16;
            
            iconSize += tournament.numEntrants/6;

            iconSize = Math.min(42, iconSize)
        
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
                      background-color: rgba(0,0,0,1);
                    ">
                      ${tournament.winner}
                    </div>
                  </div>
                `,
                iconSize: [iconSize, iconSize],
                popupAnchor: [0, -8],
                className: styles.mapCharIcon,
                zIndexOffset: 1000-iconSize
            });
        
            window.routerHistory = this.props.history;

            let lat = parseFloat(tournament.lat);
            let lng = parseFloat(tournament.lng);
        
            let marker = new myMarkerText([lat, lng], {icon: charIcon}).addTo(this.mymap);

            marker._entrants = tournament.numEntrants;
            
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

        let markersForKmeans = this.markers.map((marker)=> [marker._latlng.lat, marker._latlng.lng])

        kmeans(markersForKmeans, 10, (err, res, centroids)=>{
          res.forEach((cluster)=>{
            let markerCluster = []

            markersForKmeans.forEach((marker, index)=>{
              if(cluster.find((m)=>m[0]==marker[0] && m[1]==marker[1])){
                markerCluster.push(this.markers[index])
                this.markers[index]._cluster = markerCluster
              }
            })

            this.markerClusters.push(markerCluster)
          })

          this.zoomFitMarkers();
          this.updating = false;
          this.setState({loading: false});
        })
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
      preferCanvas: true,
      attributionControl: false,
      center: [-29.0529434318608, 152.01910972595218],
      zoom: 10,
      minZoom: -10,
      maxZoom: 20,
    };

    let myFilter = [
      'hue:180deg',
      'invert:100%',
    ]

    var baseMap = L.tileLayer.colorFilter(
      "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        minZoom: -10,
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
          <Box style={{zIndex: 999, position: "absolute", right: 10, top: 10, gap: 16}} display={"flex"} flexDirection={"column"}>
            <Select
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
            <TextField
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              defaultValue={this.state.minSize}
              onChange={(e)=>{this.setState({minSize: e.target.value}); this.updateData(this.state.selection);}}
              label={"Min participants"}
            />
          </Box>
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