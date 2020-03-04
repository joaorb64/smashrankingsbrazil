import React, { Component } from 'react'

import $ from '../../node_modules/jquery/dist/jquery';

import L from '../../node_modules/leaflet/dist/leaflet'
import LeafletAjax from '../../node_modules/leaflet-ajax/dist/leaflet.ajax'

import styles from './statistics.module.css'
import Chart from '../../node_modules/chart.js/dist/Chart'

class Statistics extends Component {
  state = {
    statistics: null
  }

  chartRef = React.createRef();

  componentWillMount() {
    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/master/out/statistics.json')
    .then(res => res.json())
    .then((data) => {
      let chars = []

      Object.keys(data["char_usage"]).forEach(char => {
        let obj = {
          name: char,
          usage: data["char_usage"][char]
        }
        chars.push(obj);
      });

      data["char_usage"] = chars;

      data["char_usage"].sort(function(a, b) {
        return b.usage - a.usage;
      });

      data["usage_labels"] = []
      data["usage_values"] = []

      data["char_usage"].forEach((chara) => {
        data["usage_labels"].push(chara.name);
        data["usage_values"].push(chara.usage);
      })

      this.setState({statistics: data});
    })
    .catch(console.log)
  }

  componentDidUpdate() {
    if(this.chartRef == null) return;
    if(this.chartRef.current == null) return;
    if(this.state.statistics == null) return;

    this.myChartRef = this.chartRef.current.getContext("2d");

    if(this.myChartRef){
      var chartData = {
        "labels": this.state.statistics["usage_labels"],
        "datasets": [{
          "data": this.state.statistics["usage_values"],
          "fill": false,
          "backgroundColor": "rgba(255, 183, 0, 1)",
          "borderWidth": 0
        }]
      };
      
      for (var i in chartData.labels) {
        var lab = chartData.labels[i];
        var $img = $("<img/>").attr("id", lab).attr(
          "src",
          "https://www.braacket.com/assets/images/game/ssbu/characters/"+
            lab.toLowerCase().replace(/"."/g, "").replace(/ & /, "-")+".png"
        );
        $("#pics").append($img);
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
        var y0 = chartInstance.scales.y0.top+chartInstance.scales.y0.height;
        t.chart.ctx.imageSmoothingQuality = "high"
        t.chart.ctx.textAlign = "center";
        meta.data.forEach(function(bar, index) {
          var lab = bar._model.label;
          var img = document.getElementById(lab);
          if(img != null && img.complete && img.naturalHeight !== 0){
            t.chart.ctx.drawImage(img,bar._model.x-12,bar._view.y-12,24,24);
            t.chart.ctx.fillText(dataset[bar._index], bar._model.x,bar._view.y-12)
            t.chart.ctx.stroke();
          }
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
          layout: {padding: 32},
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
            <h5>Jogadores com nome condizente com braacket da cena local</h5>
            {this.state.statistics.linkage.total - this.state.statistics.linkage.unlinked.length}/{this.state.statistics.linkage.total}
            
            <h5>Uso de personagens</h5>
            <div class="col-12" style={{overflowX: "scroll"}}>
              <div style={{width: 2000, height:300}}>
                <canvas style={{width: 2000, height: 300}} ref={this.chartRef} id="myChart" />
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