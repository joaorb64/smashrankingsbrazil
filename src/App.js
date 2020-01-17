import React, { Component } from 'react';
import './App.css';
import Contacts from './components/contacts';

class App extends Component {
  state = {
    leagues: []
  }

  componentWillMount() {
    fetch('https://cdn.jsdelivr.net/gh/joaorb64/tournament_api/leagues.json')
    .then(res => res.json())
    .then((data) => {
      data.leagues.forEach(league => {
        fetch('https://cdn.jsdelivr.net/gh/joaorb64/tournament_api@master/league_info/'+league+'.json')
        .then(res => res.json())
          .then((leagueInfo) => {
            this.state.leagues.push({
              id: league,
              name: leagueInfo.name
            });
            this.setState(this.state)
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

        <div class="container" style={{backgroundColor: "#2a2335", marginBottom: "128px"}}>
          <Contacts contacts={this.state.leagues} />
        </div>

        <nav class="navbar fixed-bottom" style={{color: "white", backgroundColor: "#be2018", fontFamily: "SmashFont", fontSize: "15px", textAlign: "right", display: "inline"}}>
          By João Ribeiro Bezerra (joaorb64@gmail.com, @joao_shino)
        </nav>
      </div>
    );
  }
}

export default App;
