import React, { Component } from 'react';
import './App.css';
import TopBar from './components/topbar';
import { BrowserRouter as Router, Switch, Route, Redirect, HashRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline'
import { Container, createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from "@material-ui/styles";
import {Helmet} from "react-helmet";

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#b12026',
    },
    secondary: {
      main: '#ffb700',
    },
    background: {
      default: '#212121',
      paper: '#424242',
    },
  },
});

class App extends Component {
  state = {
    leagues: [],
    allplayers: null,
    alltournaments: null,
    userCountry: null
  }

  componentWillMount() {
    
  }

  componentDidMount() {
    
  }

  render () {
    return (
      <ThemeProvider theme={theme}>
        <div>
          <CssBaseline />

          <Helmet>
            <meta property="og:title" content="PowerRankings.gg" />
            <meta property="og:image" content={process.env.PUBLIC_URL+"/favicon.svg"} />
            <meta property="og:description" content="Check out player and league information on PowerRankings.gg!" />
            <meta name="twitter:card" content="summary" />
          </Helmet>

          <Router basename={process.env.PUBLIC_URL}>
            <Route path="/" render={(props) =>
              <TopBar
                leagues={this.state.leagues}
                allplayers={this.state.allplayers}
                alltournaments={this.state.alltournaments}
                userCountry={this.state.userCountry}
                match={props}
              />} />
          </Router>

          {/* <nav class="navbar bottom-bar fixed-bottom" style={{display: "flex", flexFlow: "nowrap"}}>
            <div style={{flexGrow: 0, margin: 2}}>
              <a href='https://ko-fi.com/W7W22YK26' target='_blank'>
                <img style={{border: 0, height: 32}} src='https://cdn.ko-fi.com/cdn/kofi1.png?v=2' border='0' alt='Buy Me a Coffee at ko-fi.com'></img>
              </a>
            </div>
            <div style={{flexGrow: 0, margin: 2}}>
              <a href="https://picpay.me/joaorb64">
                <img src="/images/donate_picpay.png" style={{height: 32, borderRadius: 5}}></img>
              </a>
            </div>
            <div style={{flexGrow: 1, margin: 2}}>
              By João "Shino" (joaorb64@gmail.com, <a style={{color: "white"}} href="https://twitter.com/joao_shino">@joao_shino</a>) <br/>
            </div>
          </nav> */}
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
