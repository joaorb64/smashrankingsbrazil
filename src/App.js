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
import NextTournaments from './components/nextTournaments';
import Matcherino from './components/matcherino';

class App extends Component {
  state = {
    leagues: [],
    allplayers: null,
    alltournaments: null
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
              wifi: data[league].wifi,
              twitter: data[league].twitter,
              twitch: data[league].twitch,
              youtube: data[league].youtube,
              facebook: data[league].facebook
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

    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/master/alltournaments.json')
    .then(res => res.json())
    .then((data) => {
      this.state.alltournaments = data;
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
        <div style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}tournament_bg.png)`, backgroundPosition: "center", backgroundSize: "cover",
          width: "100%", height: "100%", position: "fixed"
        }}></div>

        <video loop muted autoplay oncanplay="this.play()" onloadedmetadata="this.muted=true" class="videobg" id="myVideo">
          <source src="/background.mp4" type="video/mp4" />
        </video>

        <HashRouter basename={process.env.PUBLIC_URL}>
          <Route path="/" render={(props) => <TopBar match={props} />} />

          <div class="main-container" style={{
            marginBottom: "64px"
          }}>

            <Switch>
              <Route path="/home/smash/:id?/:tab?" exact render={
                (props) => <Contacts contacts={this.state.leagues} allplayers={this.state.allplayers} alltournaments={this.state.alltournaments} match={props}></Contacts>
              } />
              <Route path="/players/" exact render={(props) => <Players leagues={this.state.leagues} alltournaments={this.state.alltournaments} allplayers={this.state.allplayers} />} />
              <Route path="/home/granblue/" exact render={(props) => <Granblue />} />
              <Route path="/map/" exact render={(props) => <Mapa allplayers={this.state.allplayers} leagues={this.state.leagues} />} />
              <Route path="/matcherino/" exact render={(props) => <Matcherino />} />
              <Route path="/nexttournaments/" exact render={(props) => <NextTournaments />} />
              <Route path="/about/" exact render={(props) => <About />} />
              <Redirect to="/home/smash/" />
            </Switch>

            <PlayerModal leagues={this.state.leagues} allplayers={this.state.allplayers} alltournaments={this.state.alltournaments} />

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

        <nav class="navbar bottom-bar fixed-bottom" style={{display: "flex", flexFlow: "nowrap"}}>
          <div style={{flexGrow: 0}}>
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
              <input type="hidden" name="cmd" value="_donations" />
              <input type="hidden" name="business" value="ZV95C3G67WXBA" />
              <input type="hidden" name="currency_code" value="BRL" />
              <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" height="32px" />
              <img alt="" border="0" src="https://www.paypal.com/en_BR/i/scr/pixel.gif" width="1" height="1" />
            </form>
          </div>
          <div style={{flexGrow: 0}}>
            <a href="https://picpay.me/joaorb64">
              <img src="/images/donate_picpay.png" style={{height: 32}}></img>
            </a>
          </div>
          <div style={{flexGrow: 1}}>
            By João "Shino" (joaorb64@gmail.com, <a style={{color: "white"}} href="https://twitter.com/joao_shino">@joao_shino</a>) <br/>
          </div>
        </nav>
      </div>
    );
  }
}

export default App;
