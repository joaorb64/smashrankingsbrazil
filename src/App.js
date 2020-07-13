import React, { Component } from 'react';
import './App.css';
import Contacts from './components/contacts';
import TopBar from './components/topbar';
import { BrowserRouter as Router, Switch, Route, Redirect, HashRouter } from 'react-router-dom';
import About from './components/about';
import PlayerModal from './components/playermodal';
import Mapa from './components/map';
import Statistics from './components/statistics';
import Granblue from './components/granblue';
import Players from './components/players';

class App extends Component {
  state = {
    leagues: [],
    allplayers: null
  }

  componentWillMount() {
    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/master/leagues.json')
    .then(res => res.json())
    .then((data) => {
      let promises = [];

      Object.keys(data).forEach((league) => {
        promises.push(fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/master/league_info/'+league+'.json')
        .then(res => res.json())
          .then((leagueInfo) => {
            data[league]["info"] = {
              id: league,
              name: leagueInfo.name,
              state: data[league].state,
              city: data[league].city,
              codigo_uf: data[league].codigo_uf,
              wifi: data[league].wifi
            };
          }))
      })

      Promise.all(promises).then(()=>{
        Object.keys(data).forEach((league) => {
          this.state.leagues.push(data[league]["info"]);
        })
        this.setState(this.state);
      })
    })
    .catch(console.log)

    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/master/allplayers.json')
    .then(res => res.json())
    .then((data) => {
      this.state.allplayers = data;
      this.setState(this.state);
    })
    .catch(console.log)
  }

  componentDidMount() {
    document.getElementById('myVideo').play();
  }

  render () {
    return (
      <div>
        <video loop muted autoplay oncanplay="this.play()" onloadedmetadata="this.muted=true" id="myVideo">
          <source src="/background.mp4" type="video/mp4" />
        </video>

        <HashRouter basename={process.env.PUBLIC_URL}>
          <Route path="/" render={(props) => <TopBar match={props} />} />

          <div class="container" style={{
            marginBottom: "128px", paddingTop: "10px"
          }}>

            <Switch>
              <Route path="/home/smash/:id?" exact render={
                (props) => <Contacts contacts={this.state.leagues} allplayers={this.state.allplayers} match={props}></Contacts>
              } />
              <Route path="/players/" exact render={(props) => <Players leagues={this.state.leagues} allplayers={this.state.allplayers} />} />
              <Route path="/home/granblue/" exact render={(props) => <Granblue />} />
              <Route path="/map/" exact render={(props) => <Mapa leagues={this.state.leagues} />} />
              <Route path="/statistics/" exact render={(props) => <Statistics leagues={this.state.leagues} />} />
              <Route path="/about/" exact render={(props) => <About />} />
              <Redirect to="/home/smash/" />
            </Switch>

            <PlayerModal leagues={this.state.leagues} allplayers={this.state.allplayers} />

            <Route path="/" render={({location}) => {
              if ("ga" in window) {
                if ("getAll" in window.ga) {
                  let tracker = window.ga.getAll()[0];
                  if (tracker)
                    tracker.send('pageview', location.pathname);
                }
              }
              return "";
            }} />

          </div>
        </HashRouter>

        <nav class="navbar bottom-bar fixed-bottom">
          By João Ribeiro Bezerra (joaorb64@gmail.com, <a style={{color: "white"}} href="https://twitter.com/joao_shino">@joao_shino</a>)
        </nav>
      </div>
    );
  }
}

export default App;
