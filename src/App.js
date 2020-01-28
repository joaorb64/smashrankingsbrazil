import React, { Component } from 'react';
import './App.css';
import Contacts from './components/contacts';
import TopBar from './components/topbar';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import About from './components/about';

class App extends Component {
  state = {
    leagues: []
  }

  componentWillMount() {
    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/master/leagues.json')
    .then(res => res.json())
    .then((data) => {
      Object.keys(data).forEach((league) => {
        fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/master/league_info/'+league+'.json')
        .then(res => res.json())
          .then((leagueInfo) => {
            this.state.leagues.push({
              id: league,
              name: leagueInfo.name
            });
          }).then(()=>{
            this.setState(this.state);
          })
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
          <source src="./background.mp4" type="video/mp4" />
        </video>

        <Router basename={process.env.PUBLIC_URL}>
          <TopBar />

          <div class="container" style={{
            marginBottom: "128px", paddingTop: "10px"
          }}>

            <Switch>
              <Route path="/home" exact render={
                (props) => <Contacts contacts={this.state.leagues}></Contacts>
              } />
              <Route path="/about" exact render={(props) => <About />} />
              <Redirect to="/home" />
            </Switch>

          </div>
        </Router>

        <nav class="navbar fixed-bottom" style={{
          color: "white", backgroundColor: "#be2018",
          fontFamily: "SmashFont", fontSize: "15px", textAlign: "right", display: "inline"
        }}>
          By João Ribeiro Bezerra (joaorb64@gmail.com, @joao_shino)
        </nav>
      </div>
    );
  }
}

export default App;
