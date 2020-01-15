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
      this.setState({ leagues: data.leagues })
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
        <div class="container" style={{backgroundColor: "#2a2335"}}>
          <Contacts contacts={this.state.leagues} />
        </div>
      </div>
    );
  }
}

export default App;
