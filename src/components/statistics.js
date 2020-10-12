import React, { Component } from 'react'

import L from '../../node_modules/leaflet/dist/leaflet'
import LeafletAjax from '../../node_modules/leaflet-ajax/dist/leaflet.ajax'

import styles from './statistics.module.css'
import Chart from '../../node_modules/chart.js/dist/Chart'

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
  chartRef2 = React.createRef();
  chartStatesRef = React.createRef();

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

      Object.keys(data["char_usage"]).forEach(char => {
        let obj = {
          name: char,
          usage: data["char_usage"][char]["usage"],
          icon: data["char_usage"][char]["name"]
        }
        chars.push(obj);
      });

      data["char_usage"] = chars;

      data["char_usage"].sort(function(a, b) {
        return b.usage - a.usage;
      });

      data["usage_labels"] = []
      data["usage_values"] = []
      data["usage_icon"] = []

      data["char_usage"].forEach((chara) => {
        data["usage_labels"].push(chara.name);
        data["usage_values"].push(chara.usage);
        data["usage_icon"].push(chara.icon);
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

      if("players_per_state" in data){
        data["players_per_state"] = Object.entries(data["players_per_state"])

        data["players_per_state"].sort(function(a, b) {
          return b[1] - a[1];
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

    // Players per league chart
    if("players_per_league" in this.state.statistics && this.chartRef2 != null){
      // Points per league chart
      this.myChartRef2 = this.chartRef2.current.getContext("2d");

      if(this.myChartRef2){
        var chartData = {
          "labels": this.state.statistics.score_per_league.map((a)=>{return a[0]}),
          "datasets": [{
            "data": this.state.statistics.score_per_league.map((a)=>{return a[1]["average"]}),
            "fill": false,
            "backgroundColor": "rgba(255, 183, 0, 1)",
            "borderWidth": 0
          }],
          "icons": this.state.statistics.score_per_league.map((a)=>{return a[0]})
        };
      
        for (var i in chartData.labels) {
          let lab = chartData.labels[i];
          let icon = chartData.icons[i];
          var $img = window.jQuery("<img/>").attr("id", lab).attr(
            "src",
            "https://raw.githubusercontent.com/joaorb64/tournament_api/master/league_icon/"+icon+".png"
          );
          window.jQuery("#pics").append($img);
        }
      
        var myBar = new Chart(this.myChartRef2, {
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

        Chart.controllers.bar = originalBarController.extend({
          draw: function() {
            originalBarController.prototype.draw.call(this, arguments);
            drawFlags1(this);
          }
        });
        
        function drawFlags1(t) {
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
            t.chart.ctx.fillText(parseFloat(dataset[bar._index]).toFixed(1), bar._model.x,bar._view.y-12)
          });
        }
      }
    }

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
          process.env.PUBLIC_URL+"/portraits-mini/"+this.getCharName(icon)+".png"
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

    // players per state chart
    if("players_per_state" in this.state.statistics){
      // Points per league chart
      this.myChartStatesRef = this.chartStatesRef.current.getContext("2d");

      if(this.myChartStatesRef){
        var chartData = {
          "labels": this.state.statistics.players_per_state.map((a)=>{return a[0]}),
          "datasets": [{
            "data": this.state.statistics.players_per_state.map((a)=>{return a[1]}),
            "fill": false,
            "backgroundColor": "rgba(255, 183, 0, 1)",
            "borderWidth": 0
          }],
          "icons": this.state.statistics.players_per_state.map((a)=>{return a[0]})
        };
      
        for (var i in chartData.labels) {
          let lab = chartData.labels[i];
          let icon = chartData.icons[i];
          var $img = window.jQuery("<img/>").attr("id", lab).attr(
            "src",
            "https://raw.githubusercontent.com/joaorb64/tournament_api/master/state_icon/"+icon+".png"
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
            {"score_per_league" in this.state.statistics ?
              <div class="row mb-3 mt-3">
                <div class="col">
                  <h5>Média de pontos por liga</h5>
                  <div style={{width: "100%", overflowX: "scroll", backgroundColor: "#e4e4e4"}}>
                    <div style={{width: 600, height:300}}>
                      <canvas style={{width: 600, height: 300}} ref={this.chartRef2} id="myChart2" />
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
                        Object.entries(this.state.statistics.best_player_character).sort((a, b) => {return a[1].rank[this.props.league].rank - b[1].rank[this.props.league].rank}).map((line)=>(
                          <tr>
                            <td><img src={process.env.PUBLIC_URL+"/portraits-mini/"+this.getCharName(line[1].mains[0])+".png"}
                              style={{width: 32, height: 32}} /> {line[0]}</td>
                            <td>{line[1].name}</td>
                            <td>{line[1].rank[this.props.league].rank}</td>
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