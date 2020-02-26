import React, { Component } from 'react'

import L from '../../node_modules/leaflet/dist/leaflet'
import LeafletAjax from '../../node_modules/leaflet-ajax/dist/leaflet.ajax'

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

          Object.keys(data).forEach(function(player){
            if(data[player].avatar){
              data[player].avatar = `https://raw.githubusercontent.com/joaorb64/tournament_api/master/${data[player].avatar}`;
            } else if (data[player].twitter) {
              data[player].avatar = `https://avatars.io/twitter/${this.getTwitterHandle(data[player].twitter)}`;
            }

            if(!data[player].mains){
              data[player].mains = [];
            }

            if(data[player].mains.length == 0){
              data[player].mains.push({name: "Random", icon: ""});
            }

            if((data[player]["rank"])){
              data[player]["score"] = data[player]["rank"][this.props.leagues[element].id]["score"];
              data[player]["ranking"] = data[player]["rank"][this.props.leagues[element].id]["rank"];
              if(data[player]["ranking"]){
                players.push(data[player]);
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
          Object.keys(this.estados._layers).forEach(layer => {
            if(this.props.leagues[element].state == this.estados._layers[layer].feature.properties.sigla){
              if(this.props.leagues[element].players){
                let charIcon = L.icon({
                  iconUrl: "http://braacket.com/"+this.props.leagues[element].players[0].mains[0].icon,
              
                  iconSize:     [48, 48], // size of the icon
                  //iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                });

                console.log(this.estados._layers[layer]._bounds.getCenter())
    
                let marker = L.marker(this.estados._layers[layer]._bounds.getCenter(), {icon: charIcon}).addTo(this.mymap);
                this.markers.push(marker);
              }
            };
          });

          //console.log(this.state)
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

    this.estados = new L.GeoJSON.AJAX("/geojson/brazil-states.geojson");

    this.estados.on('data:loaded', () => {
      this.estados.addTo(this.mymap);
      this.mymap.fitBounds(this.estados.getBounds());
      this.updateData();
    });
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

export default Mapa