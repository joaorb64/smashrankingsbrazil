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
    alltournaments: null,
    userCountry: null
  }

  componentWillMount() {
    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/leagues.json')
    .then(res => res.json())
    .then((data) => {
      let promises = [];

      Object.keys(data).forEach((league) => {
        promises.push(fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/out/'+league+'/data.json')
        .then(res => res.json())
          .then((leagueInfo) => {
            data[league]["info"] = {
              id: league,
              name: leagueInfo.name,
              region: data[league].region,
              state: data[league].state,
              city: data[league].city,
              country: data[league].country,
              wifi: data[league].wifi,
              twitter: data[league].twitter,
              twitch: data[league].twitch,
              youtube: data[league].youtube,
              facebook: data[league].facebook,
              latlng: data[league].latlng
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

    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/out/allplayers.json')
    .then(res => res.json())
    .then((data) => {
      this.setState({allplayers: data});
    })
    .catch(console.log)

    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/out/alltournaments.json')
    .then(res => res.json())
    .then((data) => {
      this.setState({alltournaments: data});
    })
    .catch(console.log)

    // Get user country
    fetch('http://get.geojs.io/v1/ip/country.json').then(res => res.json()).then((data) => {
      if(data && data.country){
        this.setState({userCountry: data.country});
      }
    }).catch(console.log())
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

        <Router basename={process.env.PUBLIC_URL}>
          <Route path="/" render={(props) => <TopBar match={props} />} />

          <div class="container main-container" style={{
            marginBottom: "64px"
          }}>

            <Switch>
              <Route path="/leagues/smash/:id?/:tab?/:player_id?" exact render={
                (props) => 
                  <>
                    <Contacts contacts={this.state.leagues} allplayers={this.state.allplayers} alltournaments={this.state.alltournaments} usercountry={this.state.userCountry} match={props}></Contacts>
                    <PlayerModal leagues={this.state.leagues} allplayers={this.state.allplayers} alltournaments={this.state.alltournaments} props={props} />
                  </>
              } />
              <Route path="/players/:player_id?" exact render={
                (props) => 
                  <>
                    <Players leagues={this.state.leagues} alltournaments={this.state.alltournaments} allplayers={this.state.allplayers} match={props.match} history={props.history} />
                    <PlayerModal leagues={this.state.leagues} allplayers={this.state.allplayers} alltournaments={this.state.alltournaments} props={props} />
                  </>
              } />
              <Route path="/leagues/granblue/" exact render={(props) => <Granblue />} />
              <Route path="/map/" exact render={(props) => <Mapa allplayers={this.state.allplayers} leagues={this.state.leagues} />} />
              <Route path="/matcherino/" exact render={(props) => <Matcherino />} />
              <Route path="/nexttournaments/" exact render={(props) => <NextTournaments />} />
              <Route path="/about/" exact render={(props) => <About />} />
              <Redirect to="/leagues/smash/" />
            </Switch>

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
        </Router>

        <nav class="navbar bottom-bar fixed-bottom" style={{display: "flex", flexFlow: "nowrap"}}>
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
        </nav>
      </div>
    );
  }
}

export default App;
