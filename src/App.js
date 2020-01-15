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

  render () {
    return (
      <div class="container" style={{backgroundColor: "#2a2335"}}>
        <Contacts contacts={this.state.leagues} />
      </div>
    );
  }
}

export default App;
