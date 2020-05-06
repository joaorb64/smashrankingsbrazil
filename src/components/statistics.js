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
  pieRef = React.createRef();

  componentWillMount() {
    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/master/out/statistics.json')
    .then(res => res.json())
    .then((data) => {
      // char usage
      let chars = []

      Object.keys(data["char_usage"]).forEach(char => {
        let obj = {
          name: char,
          usage: data["char_usage"][char]["usage"],
          icon: data["char_usage"][char]["icon"]
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

      data["players_per_region"] = Object.entries(data["players_per_region"])
      data["players_per_region"].sort(function(a, b) {
        return b[1] - a[1];
      });

      data["score_per_region"] = Object.entries(data["score_per_region"])
      data["score_per_region"].sort(function(a, b) {
        return b[1] - a[1];
      });

      for(let i=0; i<data["players_per_region"].length; i+=1){
        data["score_per_region"][i].push(Number(data["score_per_region"][i][1])/
          Number(data["players_per_region"][i][1]).toFixed(1))
      }

      data["score_per_region"].sort(function(a, b) {
        return b[2] - a[2];
      });

      this.setState({statistics: data});
    })
    .catch(console.log)
  }

  componentDidUpdate() {
    if(this.chartRef == null) return;
    if(this.chartRef.current == null) return;
    if(this.chartRef2 == null) return;
    if(this.chartRef2.current == null) return;
    if(this.state.statistics == null) return;
    if(this.myChartRef != null) return;

    // Players per league chart
    var myPieChart = new Chart(this.pieRef.current.getContext("2d"), {
      type: 'pie',
      responsive: true,
      maintainAspectRatio: false,
      data: {
        datasets: [{
          data: this.state.statistics.players_per_region.map((a)=>{return a[1]}),
          "backgroundColor": this.colorValues
        }],
        labels: this.state.statistics.players_per_region.map((a)=>{return a[0]})
      },
      options: Chart.defaults.pie
    });

    // Character Usage Chart
    this.myChartRef = this.chartRef.current.getContext("2d");

    if(this.myChartRef){
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
          "https://www.braacket.com/"+icon
        );
        $img.onload = function(){
          this.draw();
        }
        window.jQuery("#pics").append($img);
      }

      var originalBarController = Chart.controllers.bar;
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
          t.chart.ctx.fillText(dataset[bar._index].toFixed(1), bar._model.x,bar._view.y-12)
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

    // Points per league chart
    this.myChartRef2 = this.chartRef2.current.getContext("2d");

    if(this.myChartRef2){
      var chartData = {
        "labels": this.state.statistics.score_per_region.map((a)=>{return a[0]}),
        "datasets": [{
          "data": this.state.statistics.score_per_region.map((a)=>{return a[2]}),
          "fill": false,
          "backgroundColor": "rgba(255, 183, 0, 1)",
          "borderWidth": 0
        }],
        "icons": this.state.statistics.score_per_region.map((a)=>{return a[0]})
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
          t.chart.ctx.fillText(dataset[bar._index], bar._model.x,bar._view.y-12)
        });
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
    }
  }

  render (){
    return(
      <div class="slide-fade list-group-item" style={{
        backgroundColor: "#f0f0f0", borderRadius: "10px", border: 0, marginBottom: "5px", width: "100%",
        padding: "30px", alignSelf: "center"
      }}>
        {this.state.statistics ?
          <div>
            <div class="row mb-3 mt-3">
              <div class="col">
                <h5>Número de jogadores por liga</h5>
                <p>(No ranking Brasileiro)</p>
                <canvas style={{width: "100%", height: "200px"}} ref={this.pieRef} />
              </div>
            </div>

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
                      Object.entries(this.state.statistics.best_player_character).sort((a, b) => {return a[1].rank.prbth.rank - b[1].rank.prbth.rank}).map((line)=>(
                        <tr>
                          <td><img src={`https://braacket.com/${line[1].mains[0].icon}`} style={{width: 32, height: 32}} /> {line[0]}</td>
                          <td>{line[1].name}</td>
                          <td>{line[1].rank.prbth.rank}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
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