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

      this.setState({statistics: data});
    })
    .catch(console.log)
  }

  componentDidUpdate() {
    if(this.chartRef == null) return;
    if(this.chartRef.current == null) return;
    if(this.state.statistics == null) return;
    if(this.myChartRef != null) return;

    // Linked players chart
    var myPieChart = new Chart(this.pieRef.current.getContext("2d"), {
      type: 'pie',
      data: {
        datasets: [{
          data:[
            this.state.statistics.linkage.total - this.state.statistics.linkage.unlinked.length,
            this.state.statistics.linkage.unlinked.length
          ],
          "backgroundColor": [
            "rgba(255, 183, 0, 1)",
            "rgba(0, 0, 0, 0.6)"
          ]
        }],
        labels: [
          "Encontrados em pelo menos uma liga",
          "Não existentes em nenhuma das ligas"
        ]
      },
      options: Chart.defaults.pie
    });

    // Character Usage Chart
    this.myChartRef = this.chartRef.current.getContext("2d");

    if(this.myChartRef){
      var chartData = {
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
        var $img = $("<img/>").attr("id", lab).attr(
          "src",
          "https://www.braacket.com/"+icon
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
        t.chart.ctx.imageSmoothingQuality = "high"
        t.chart.ctx.textAlign = "center";
        meta.data.forEach(function(bar, index) {
          var lab = bar._model.label;
          var img = document.getElementById(lab);
          if(img != null && img.complete && img.naturalHeight !== 0){
            t.chart.ctx.drawImage(img,bar._model.x-12,bar._view.y-12,24,24);
            t.chart.ctx.fillText(dataset[bar._index], bar._model.x,bar._view.y-12)
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
          layout: {padding: "32"},
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
                <h5>Jogadores do ranking brasileiro com nome encontrado em ligas locais</h5>
                <p>(Usado para a importação de informações como mains, twitter)</p>
                <canvas style={{width: "100%", height: 200}} ref={this.pieRef} />
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