import React, { Component } from 'react'

import L from '../../node_modules/leaflet/dist/leaflet'
import LeafletAjax from '../../node_modules/leaflet-ajax/dist/leaflet.ajax'

import styles from './statistics.module.css'
import Chart from '../../node_modules/chart.js/dist/Chart'

import i18n from '../locales/i18n';

import { GetCharacterAsset, GetCharacterCodename, GetCharacterName } from '../globals'

import { Paper, Box, Typography, withStyles, Divider, makeStyles, Icon } from '@material-ui/core'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

let useStyles = (theme) => ({
  root: {
    padding: theme.spacing(3, 2),
  },
});

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
    this.updateData();
  }

  componentDidUpdate(nextProps){
    if(this.props.statistics != nextProps.statistics){
      this.state.statistics = null;
      this.updateData();
    }
  }

  updateData(){
    if(this.props.statistics && this.state.statistics == null){
      let data = {}
      Object.assign(data, this.props.statistics);

      console.log(data)

      // char usage
      let chars = []
      let chars_secondary = []

      Object.keys(data["char_usage"]).forEach(char => {
        let obj = {
          name: GetCharacterName(this.props.game, char),
          usage: data["char_usage"][char]["usage"],
          icon: char
        }
        chars.push(obj);
        let obj2 = {
          name: GetCharacterName(this.props.game, char),
          usage_secondary: data["char_usage"][char]["secondary"],
          icon: char
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

      if("players_per_country" in data){
        if(data["players_per_country"]["null"]){delete data["players_per_country"]["null"]}
        data["players_per_country"] = Object.entries(data["players_per_country"])

        data["players_per_country"].sort(function(a, b) {
          return b[1] - a[1];
        });
      }

      if("players_per_state" in data){
        if(data["players_per_state"]["null"]){delete data["players_per_state"]["null"]}
        data["players_per_state"] = Object.entries(data["players_per_state"])

        console.log(data["players_per_state"])

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
          GetCharacterAsset(this.props.game, icon, 0, "icon")
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
          GetCharacterAsset(this.props.game, icon, 0, "icon")
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

          if(lab == "null"){
            lab = "null"
            icon = "null"
          }

          var $img = window.jQuery("<img/>").attr("id", lab).attr(
            "src",
            "https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/country_flag/"+lab.toLowerCase()+".png"
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
          "labels": this.state.statistics.players_per_state.map((a)=>{return a[0]}),
          "datasets": [{
            "data": this.state.statistics.players_per_state.map((a)=>{return a[1]}),
            "fill": false,
            "backgroundColor": "rgba(255, 183, 0, 1)",
            "borderWidth": 0
          }],
          "icons": this.state.statistics.players_per_state.map((a)=>{return a[0].split("_")[0]+"/"+a[0].split("_")[1]})
        };
      
        for (var i in chartData.labels) {
          let lab = chartData.labels[i];
          let icon = chartData.icons[i];
          if(lab == "null"){
            lab = "Unknown"
            icon = "null"
          }
          console.log(icon)
          var $img = window.jQuery("<img/>").attr("id", lab).attr(
            "src",
            "https://raw.githubusercontent.com/joaorb64/world-state-flags/main/out/"+icon+".png"
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
    const {classes} = this.props;
    const {theme} = this.props;

    return(
      <Paper className={classes.root}>
        {this.state.statistics ?
          <Box>
            {"players_per_country" in this.state.statistics ?
              <Box display="grid" xs={12} mb={theme.spacing(0.5)}>
                <Typography gutterBottom variant="h5" component="h3">
                  {i18n.t("players-per-country")}
                </Typography>
                <Box style={{overflowX: "scroll", backgroundColor: "#e4e4e4"}}>
                  <Box style={{width: Math.max(42*this.state.statistics.players_per_country.length, 240), height:300}}>
                    <canvas style={{width: Math.max(42*this.state.statistics.players_per_country.length, 240), height: 300}} ref={this.chartCountriesRef} id="myChartCountries" />
                  </Box>
                </Box>
              </Box>
              :
              null
            }

            {"players_per_state" in this.state.statistics ?
              <Box display="grid" xs={12} mb={theme.spacing(0.5)}>
                <Typography gutterBottom variant="h5" component="h3">
                  {i18n.t("players-per-state")}
                </Typography>
                <Box style={{overflowX: "scroll", backgroundColor: "#e4e4e4"}}>
                  <Box style={{width: Math.max(42*this.state.statistics.players_per_state.length, 240), height:300}}>
                    <canvas style={{width: Math.max(42*this.state.statistics.players_per_state.length, 240), height: 300}} ref={this.chartStatesRef} id="myChartStates" />
                  </Box>
                </Box>
              </Box>
              :
              null
            }
            
            <Box display="grid" xs={12} mb={theme.spacing(0.5)}>
              <Typography gutterBottom variant="h5" component="h3">
                {i18n.t("character-usage")}
              </Typography>
              <Box style={{overflowX: "scroll", backgroundColor: "#e4e4e4"}}>
                <Box style={{width: 32*this.state.statistics.char_usage.length, height:300}}>
                  <canvas style={{width: 32*this.state.statistics.char_usage.length, height: 300}} ref={this.chartRef} id="myChart" />
                </Box>
              </Box>
            </Box>

            <Box display="grid" xs={12} mb={theme.spacing(0.5)}>
              <Typography gutterBottom variant="h5" component="h3">
                {i18n.t("character-usage-secondary")}
              </Typography>
              <Box style={{overflowX: "scroll", backgroundColor: "#e4e4e4"}}>
                <Box style={{width: 32*this.state.statistics.char_usage_secondary.length, height:300}}>
                  <canvas style={{width: 32*this.state.statistics.char_usage_secondary.length, height: 300}} ref={this.chartSecondaryRef} id="mySecondaryChart" />
                </Box>
              </Box>
            </Box>

            {"best_player_character" in this.state.statistics && this.props.league ?
              <Box display="grid" xs={12} mb={theme.spacing(0.5)}>
                <Typography gutterBottom variant="h5" component="h3">
                  {i18n.t("best-player-ranked-character")}
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{i18n.t("Character")}</TableCell>
                        <TableCell>{i18n.t("Player")}</TableCell>
                        <TableCell>{i18n.t("Placing")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        Object.entries(this.state.statistics.best_player_character).sort((a, b) => {return a[1].rank - b[1].rank}).map((line)=>(
                          <TableRow>
                            <TableCell>
                              <div style={{display: "flex", alignItems: "center"}}>
                                <Box xs mr={1}><img src={`${GetCharacterAsset(this.props.game, line[1].mains[0], 0, "icon")}`}
                                style={{width: "24px", height: "24px"}} /></Box>
                                <Box xs>{GetCharacterName(this.props.game, line[0])}</Box>
                              </div>
                            </TableCell>
                            <TableCell>{line[1].org} {line[1].name}</TableCell>
                            <TableCell>{line[1].rank}</TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              :
              null
            }
          </Box>
        :
          <div class="loader"></div>
        }
        <div id="pics" style={{display: "none"}}></div>
      </Paper>
    )
  }
};

export default withStyles(useStyles, { withTheme: true })(Statistics)