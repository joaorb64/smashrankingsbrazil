import React, { Component } from 'react';
import './App.css';
import Contacts from './components/contacts';
import TopBar from './components/topbar';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import About from './components/about';
import PlayerModal from './components/playermodal';
import Mapa from './components/map';
import Statistics from './components/statistics';

class App extends Component {
  state = {
    leagues: []
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
              city: data[league].city
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

        <Router basename={process.env.PUBLIC_URL}>
          <TopBar />

          <div class="container" style={{
            marginBottom: "128px", paddingTop: "10px"
          }}>

            <Switch>
              <Route path="/home/:id" exact render={
                (props) => <Contacts contacts={this.state.leagues} match={props}></Contacts>
              } />
              <Route path="/map/" exact render={(props) => <Mapa leagues={this.state.leagues} />} />
              <Route path="/statistics/" exact render={(props) => <Statistics leagues={this.state.leagues} />} />
              <Route path="/about/" exact render={(props) => <About />} />
              <Redirect to="/home/" />
            </Switch>

          </div>
        </Router>

        <nav class="navbar bottom-bar fixed-bottom">
          By João Ribeiro Bezerra (joaorb64@gmail.com, <a style={{color: "white"}} href="https://twitter.com/joao_shino">@joao_shino</a>)
        </nav>

        <PlayerModal leagues={this.state.leagues} />
      </div>
    );
  }
}

export default App;
