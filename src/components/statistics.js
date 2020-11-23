import React, { Component } from 'react'

import L from '../../node_modules/leaflet/dist/leaflet'
import LeafletAjax from '../../node_modules/leaflet-ajax/dist/leaflet.ajax'

import styles from './statistics.module.css'
import Chart from '../../node_modules/chart.js/dist/Chart'

import CHARACTERS from '../globals'

class Statistics extends Component {
  state = {
    statistics: null
  }

  colorValues = [
    "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#000000", 
    "#800000", "#008000", "#000080", "#808000", "#800080", "#008080", "#808080", 
    "#C00000", "#00C000", "#0000C0", "#C0C000", "#C000C0", "#00C0C0", "#C0C0C0", 
    "#400000", "#004000", "#000040", "#404000", "#400040", "#004040", "#404040", 
    "#200000", "#002000", "#000020", "#202000", "#200020", "#002020", "#202020", 
    "#600000", "#006000", "#000060", "#606000", "#600060", "#006060", "#606060", 
    "#A00000", "#00A000", "#0000A0", "#A0A000", "#A000A0", "#00A0A0", "#A0A0A0", 
    "#E00000", "#00E000", "#0000E0", "#E0E000", "#E000E0", "#00E0E0", "#E0E0E0", 
  ];

  chartRef = React.createRef();
  chartSecondaryRef = React.createRef();
  chartStatesRef = React.createRef();
  chartCountriesRef = React.createRef();

  getCharName(name){
    return name.toLowerCase().replace(/ /g, "");
  }

  componentDidMount() {
    if(this.props.statistics && this.state.statistics == null){
      let data = {}
      Object.assign(data, this.props.statistics);

      console.log(data)

      // char usage
      let chars = []
      let chars_secondary = []

      Object.keys(data["char_usage"]).forEach(char => {
        let obj = {
          name: char,
          usage: data["char_usage"][char]["usage"],
          icon: data["char_usage"][char]["name"]
        }
        chars.push(obj);
        let obj2 = {
          name: char,
          usage_secondary: data["char_usage"][char]["secondary"],
          icon: data["char_usage"][char]["name"]
        }
        chars_secondary.push(obj2);
      });

      data["char_usage"] = chars;
      data["char_usage_secondary"] = chars_secondary;

      data["char_usage"].sort(function(a, b) {
        return b.usage - a.usage;
      });

      data["char_usage_secondary"].sort(function(a, b) {
        return b.usage_secondary - a.usage_secondary;
      });

      data["usage_labels"] = []
      data["usage_values"] = []
      data["usage_icon"] = []

      data["char_usage"].forEach((chara) => {
        data["usage_labels"].push(chara.name);
        data["usage_values"].push(chara.usage);
        data["usage_icon"].push(chara.icon);
      })

      data["secondary_labels"] = []
      data["secondary_values"] = []
      data["secondary_icon"] = []

      data["char_usage_secondary"].forEach((chara) => {
        data["secondary_labels"].push(chara.name);
        data["secondary_values"].push(chara.usage_secondary);
        data["secondary_icon"].push(chara.icon);
      })

      if("players_per_league" in data){
        data["players_per_league"] = Object.entries(data["players_per_league"])
        data["players_per_league"].sort(function(a, b) {
          return b[1] - a[1];
        });
      }

      if("score_per_league" in data){
        data["score_per_league"] = Object.entries(data["score_per_league"])
        data["score_per_league"].sort(function(a, b) {
          return b[1]["average"] - a[1]["average"];
        });
      }

      if("players_per_country" in data){
        data["players_per_country"] = Object.entries(data["players_per_country"])

        data["players_per_country"].sort(function(a, b) {
          return b[1] - a[1];
        });
      }

      if("players_per_state" in data){
        data["players_per_state"] = Object.entries(data["players_per_state"])

        data["players_per_state"].sort(function(a, b) {
          return b[1]["count"] - a[1]["count"];
        });
      }

      console.log(data)

      this.setState({statistics: data}, ()=>{
        this.UpdateCharts();
      })

    }
  }

  componentWillUnmount(){
    //this.state.statistics = null;
  }

  UpdateCharts() {
    //if(this.chartRef == null) return;
    //if(this.chartRef.current == null) return;
    if(this.state.statistics == null) return;
    //if(this.myChartRef != null) return;

    console.log("a")

    if(this.originalBarController == null)
      this.originalBarController = Chart.controllers.bar;
    let originalBarController = this.originalBarController;

    // Character Usage Chart
    this.myChartRef = this.chartRef.current.getContext("2d");

    console.log(this.myChartRef);

    if(this.myChartRef){
      console.log("b")
      var chartData = {
        maintainAspectRatio: false,
        "labels": this.state.statistics["usage_labels"],
        "datasets": [{
          "data": this.state.statistics["usage_values"],
          "fill": false,
          "backgroundColor": "rgba(255, 183, 0, 1)",
          "borderWidth": 0
        }],
        "icons": this.state.statistics["usage_icon"]
      };
      
      for (var i in chartData.labels) {
        let lab = chartData.labels[i];
        let icon = chartData.icons[i];
        var $img = window.jQuery("<img/>").attr("id", lab).attr(
          "src",
          `${process.env.PUBLIC_URL}/portraits/ssbu/chara_2_${CHARACTERS[icon]}_00.png`
        );
        $img.onload = function(){
          this.draw();
        }
        window.jQuery("#pics").append($img);
      }

      Chart.controllers.bar = Chart.controllers.bar.extend({
        draw: function() {
          originalBarController.prototype.draw.call(this, arguments);
          drawFlags(this);
        }
      });
      
      function drawFlags(t) {
        if(!t) return;
        if(!t.chart.ctx) return;
        var chartInstance = t.chart;
        var dataset = chartInstance.config.data.datasets[0].data;
        var meta = chartInstance.controller.getDatasetMeta(0);
        t.chart.ctx.imageSmoothingQuality = "high"
        t.chart.ctx.textAlign = "center";
        meta.data.forEach(function(bar, index) {
          var lab = bar._model.label;
          var img = document.getElementById(lab);
          if(img != null && img.naturalHeight !== 0){
            t.chart.ctx.drawImage(img,bar._model.x-12,bar._view.y-12,24,24);
          }
          t.chart.ctx.fillText(dataset[bar._index].toFixed(0), bar._model.x,bar._view.y-12)
        });
      }
      
      var myBar = new Chart(this.myChartRef, {
        "type": "bar",
        "data": chartData,
        gridLines: {"drawBorder": false},
        borderWidth: 0,
        border: 0,
        "options": {
          legend: { display: false },
          layout: { padding: "32" },
          "scales": {
            "yAxes": [{
              id: "y0",
              "ticks": {
                "beginAtZero": true
              }
            }]
          }
        }
      });
    }

    // Secondary Usage Chart
    this.chartSecondaryRef = this.chartSecondaryRef.current.getContext("2d");

    if(this.chartSecondaryRef){
      var chartData = {
        maintainAspectRatio: false,
        "labels": this.state.statistics["secondary_labels"],
        "datasets": [{
          "data": this.state.statistics["secondary_values"],
          "fill": false,
          "backgroundColor": "rgba(50, 50, 200, 1)",
          "borderWidth": 0
        }],
        "icons": this.state.statistics["secondary_icon"]
      };
      
      for (var i in chartData.labels) {
        let lab = chartData.labels[i];
        let icon = chartData.icons[i];
        var $img = window.jQuery("<img/>").attr("id", lab).attr(
          "src",
          `${process.env.PUBLIC_URL}/portraits/ssbu/chara_2_${CHARACTERS[icon]}_00.png`
        );
        $img.onload = function(){
          this.draw();
        }
        window.jQuery("#pics").append($img);
      }

      Chart.controllers.bar = Chart.controllers.bar.extend({
        draw: function() {
          originalBarController.prototype.draw.call(this, arguments);
          drawFlags(this);
        }
      });
      
      function drawFlags(t) {
        if(!t) return;
        if(!t.chart.ctx) return;
        var chartInstance = t.chart;
        var dataset = chartInstance.config.data.datasets[0].data;
        var meta = chartInstance.controller.getDatasetMeta(0);
        t.chart.ctx.imageSmoothingQuality = "high"
        t.chart.ctx.textAlign = "center";
        meta.data.forEach(function(bar, index) {
          var lab = bar._model.label;
          var img = document.getElementById(lab);
          if(img != null && img.naturalHeight !== 0){
            t.chart.ctx.drawImage(img,bar._model.x-12,bar._view.y-12,24,24);
          }
          t.chart.ctx.fillText(dataset[bar._index].toFixed(0), bar._model.x,bar._view.y-12)
        });
      }
      
      var myBar = new Chart(this.chartSecondaryRef, {
        "type": "bar",
        "data": chartData,
        gridLines: {"drawBorder": false},
        borderWidth: 0,
        border: 0,
        "options": {
          legend: { display: false },
          layout: { padding: "32" },
          "scales": {
            "yAxes": [{
              id: "y0",
              "ticks": {
                "beginAtZero": true
              }
            }]
          }
        }
      });
    }

    // players per country chart
    if("players_per_country" in this.state.statistics){
      // Points per league chart
      this.myChartCountriesRef = this.chartCountriesRef.current.getContext("2d");

      if(this.myChartCountriesRef){
        var chartData = {
          "labels": this.state.statistics.players_per_country.map((a)=>{return a[0]}),
          "datasets": [{
            "data": this.state.statistics.players_per_country.map((a)=>{return a[1]}),
            "fill": false,
            "backgroundColor": "rgba(255, 183, 0, 1)",
            "borderWidth": 0
          }],
          "icons": this.state.statistics.players_per_country.map((a)=>{return a[0]})
        };
      
        for (var i in chartData.labels) {
          let lab = chartData.labels[i];
          let icon = chartData.icons[i];
          var $img = window.jQuery("<img/>").attr("id", lab).attr(
            "src",
            "https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/country_flag/"+lab.toLowerCase()+".png"
          );
          window.jQuery("#pics").append($img);
        }

        Chart.controllers.bar = originalBarController.extend({
          draw: function() {
            originalBarController.prototype.draw.call(this, arguments);
            drawFlags3(this);
          }
        });
        
        function drawFlags3(t) {
          if(!t) return;
          if(!t.chart.ctx) return;
          var chartInstance = t.chart;
          var dataset = chartInstance.config.data.datasets[0].data;
          var meta = chartInstance.controller.getDatasetMeta(0);
          t.chart.ctx.imageSmoothingQuality = "high"
          t.chart.ctx.textAlign = "center";
          meta.data.forEach(function(bar, index) {
            var lab = bar._model.label;
            var img = document.getElementById(lab);
            if(img != null && img.naturalHeight !== 0){
              t.chart.ctx.drawImage(img,bar._model.x-12,bar._view.y-12,24,24);
            }
              t.chart.ctx.fillText(parseFloat(dataset[bar._index]).toFixed(0), bar._model.x,bar._view.y-12)
          });
        }
      
        var myBar = new Chart(this.myChartCountriesRef, {
          "type": "bar",
          "data": chartData,
          gridLines: {"drawBorder": false},
          borderWidth: 0,
          border: 0,
          "options": {
            legend: { display: false },
            layout: { padding: "32" },
            "scales": {
              "yAxes": [{
                id: "y0",
                "ticks": {
                  "beginAtZero": true
                }
              }]
            }
          }
        });
      }
    }

    // players per state chart
    if("players_per_state" in this.state.statistics){
      // Points per league chart
      this.myChartStatesRef = this.chartStatesRef.current.getContext("2d");

      if(this.myChartStatesRef){
        var chartData = {
          "labels": this.state.statistics.players_per_state.map((a)=>{return a[1]["country_code"]+"_"+a[0]}),
          "datasets": [{
            "data": this.state.statistics.players_per_state.map((a)=>{return a[1]["count"]}),
            "fill": false,
            "backgroundColor": "rgba(255, 183, 0, 1)",
            "borderWidth": 0
          }],
          "icons": this.state.statistics.players_per_state.map((a)=>{return a[1]["country_code"]+"/"+a[0]})
        };
      
        for (var i in chartData.labels) {
          let lab = chartData.labels[i];
          let icon = chartData.icons[i];
          console.log(icon)
          var $img = window.jQuery("<img/>").attr("id", lab).attr(
            "src",
            "https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/state_flag/"+icon+".png"
          );
          window.jQuery("#pics").append($img);
        }

        Chart.controllers.bar = originalBarController.extend({
          draw: function() {
            originalBarController.prototype.draw.call(this, arguments);
            drawFlags3(this);
          }
        });
        
        function drawFlags3(t) {
          if(!t) return;
          if(!t.chart.ctx) return;
          var chartInstance = t.chart;
          var dataset = chartInstance.config.data.datasets[0].data;
          var meta = chartInstance.controller.getDatasetMeta(0);
          t.chart.ctx.imageSmoothingQuality = "high"
          t.chart.ctx.textAlign = "center";
          meta.data.forEach(function(bar, index) {
            var lab = bar._model.label;
            var img = document.getElementById(lab);
            if(img != null && img.naturalHeight !== 0){
              t.chart.ctx.drawImage(img,bar._model.x-12,bar._view.y-12,24,24);
            }
              t.chart.ctx.fillText(parseFloat(dataset[bar._index]).toFixed(0), bar._model.x,bar._view.y-12)
          });
        }
      
        var myBar = new Chart(this.myChartStatesRef, {
          "type": "bar",
          "data": chartData,
          gridLines: {"drawBorder": false},
          borderWidth: 0,
          border: 0,
          "options": {
            legend: { display: false },
            layout: { padding: "32" },
            "scales": {
              "yAxes": [{
                id: "y0",
                "ticks": {
                  "beginAtZero": true
                }
              }]
            }
          }
        });
      }
    }
  }

  render (){
    return(
      <div class="slide-fade list-group-item" style={{
        backgroundColor: "#f0f0f0", borderRadius: "10px", border: 0, marginBottom: "5px", margin: "10px",
        padding: "30px", alignSelf: "center", textAlign: "left", fontFamily: "Roboto, sans-serif"
      }}>
        {this.state.statistics ?
          <div>
            {"players_per_country" in this.state.statistics ?
              <div class="row mb-3 mt-3">
                <div class="col">
                  <h5>Jogadores por país</h5>
                  <div style={{width: "100%", overflowX: "scroll", backgroundColor: "#e4e4e4"}}>
                    <div style={{width: 800, height:300}}>
                      <canvas style={{width: 800, height: 300}} ref={this.chartCountriesRef} id="myChartCountries" />
                    </div>
                  </div>
                </div>
              </div>
              :
              null
            }

            {"players_per_state" in this.state.statistics ?
              <div class="row mb-3 mt-3">
                <div class="col">
                  <h5>Jogadores por Estado</h5>
                  <div style={{width: "100%", overflowX: "scroll", backgroundColor: "#e4e4e4"}}>
                    <div style={{width: 800, height:300}}>
                      <canvas style={{width: 800, height: 300}} ref={this.chartStatesRef} id="myChartStates" />
                    </div>
                  </div>
                </div>
              </div>
              :
              null
            }
            
            <div class="row mb-3 mt-3">
              <div class="col">
                <h5>Uso de personagens</h5>
                <div style={{width: "100%", overflowX: "scroll", backgroundColor: "#e4e4e4"}}>
                  <div style={{width: 2000, height:300}}>
                    <canvas style={{width: 2000, height: 300}} ref={this.chartRef} id="myChart" />
                  </div>
                </div>
              </div>
            </div>

            <div class="row mb-3 mt-3">
              <div class="col">
                <h5>Personagens secundários</h5>
                <div style={{width: "100%", overflowX: "scroll", backgroundColor: "#e4e4e4"}}>
                  <div style={{width: 2000, height:300}}>
                    <canvas style={{width: 2000, height: 300}} ref={this.chartSecondaryRef} id="mySecondaryChart" />
                  </div>
                </div>
              </div>
            </div>

            {"best_player_character" in this.state.statistics && this.props.league ?
              <div class="row mb-3 mt-3">
                <div class="col">
                  <h5>Jogador melhor colocado com cada personagem</h5>
                  <table class="table table-striped table-sm">
                    <thead>
                      <tr>
                        <th scope="col">Personagem</th>
                        <th scope="col">Jogador</th>
                        <th scope="col">Colocação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        Object.entries(this.state.statistics.best_player_character).sort((a, b) => {return a[1].rank - b[1].rank}).map((line)=>(
                          <tr>
                            <td><img src={`${process.env.PUBLIC_URL}/portraits/ssbu/chara_2_${CHARACTERS[line[1].mains[0]]}_00.png`}
                              style={{width: 32, height: 32}} /> {line[0]}</td>
                            <td>{line[1].name}</td>
                            <td>{line[1].rank}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
              :
              null
            }
          </div>
        :
          <div>Loading...</div>
        }
        <div id="pics" style={{display: "none"}}></div>
      </div>
    )
  }
};

export default Statistics