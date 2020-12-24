import React, { Component } from 'react'
import { Link, NavLink } from 'react-router-dom'
import styles from './topbar.module.css'
import i18n from '../locales/i18n';
import { faHome, faUsers, faMap, faCalendar, faCoins, faInfoCircle, faInfo, faChartLine, faTrophy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';

class TopBar extends Component {
  state = {
    games: [
      {id: "smash", name: "Smash Ultimate"},
      {id: "granblue", name: "Granblue"}
    ],
    game: "smash",
    hidden: true
  }

  componentDidUpdate(nextProps) {
    if(nextProps !== this.props) {
      if(this.props.match){
        let game = window.location.hash.split("/")[2];
        if(this.state.games.findIndex((x)=>x.id==game) != -1){
          this.state.game = game;
        } else {
          this.state.game = "smash";
        }

        this.setState(this.state);
      }
    }
  }

  componentDidMount(){
    
  }

  render(){
    return(
      <nav class={"sidenav-container navbar-dark col-2"} style={{
        color: "white", backgroundColor: "#be2018", fontFamily: "SmashFont"
      }}>
        <div onClick={()=>this.setState({hidden: true})} class={"sidenav-container-bg d-block d-md-none" + (this.state.hidden ? "" : " sidenav-container-bg-show")}></div>
        
        <button onClick={()=>this.setState({hidden: !this.state.hidden})} class="navbar-toggler d-block d-md-none" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false">
          <span class="navbar-toggler-icon" style={{fontFamily: "'Montserrat', sans-serif"}}></span>
        </button>

        <Link class="navbar-brand" style={{color: "white", flexGrow: 1}} to="/leagues/smash/">
          Power Rankings
        </Link>

        <ul className={"sidenav navbar-nav" + (this.state.hidden ? " sidenav-hidden" : "")}>
          <NavLink onClick={()=>this.setState({hidden: true})} className="nav-item nav-link" activeClassName="nav-item nav-link active" to="/leagues/smash/" href="/leagues">
            <div class="nav-link"><FontAwesomeIcon icon={faTrophy}/> {i18n.t("leagues")}</div>
          </NavLink>
          <NavLink onClick={()=>this.setState({hidden: true})} className="nav-item nav-link" activeClassName="nav-item nav-link active" to="/players" href="/players">
            <div class="nav-link"><FontAwesomeIcon icon={faUsers}/> {i18n.t("players")}</div>
          </NavLink>
          <NavLink onClick={()=>this.setState({hidden: true})} className="nav-item nav-link" activeClassName="nav-item nav-link active" to="/map/" href="/map">
            <div class="nav-link"><FontAwesomeIcon icon={faMap}/> {i18n.t("map")}</div>
          </NavLink>
          <NavLink onClick={()=>this.setState({hidden: true})} className="nav-item nav-link" activeClassName="nav-item nav-link active" to="/nexttournaments/" href="/nexttournaments">
            <div class="nav-link"><FontAwesomeIcon icon={faCalendar}/> {i18n.t("next-tournaments")}</div>
          </NavLink>
          <NavLink onClick={()=>this.setState({hidden: true})} className="nav-item nav-link" activeClassName="nav-item nav-link active" to="/clips/" href="/clips">
            <div class="nav-link"><FontAwesomeIcon icon={faTwitch}/> Top Clips</div>
          </NavLink>
          <NavLink onClick={()=>this.setState({hidden: true})} className="nav-item nav-link" activeClassName="nav-item nav-link active" to="/matcherino/" href="/matcherino">
            <div class="nav-link"><FontAwesomeIcon icon={faCoins}/> Matcherino</div>
          </NavLink>
          <NavLink onClick={()=>this.setState({hidden: true})} className="nav-item nav-link" activeClassName="nav-item nav-link active" to="/about/" href="/about">
            <div class="nav-link"><FontAwesomeIcon icon={faInfoCircle}/> {i18n.t("about")}</div>
          </NavLink>
        </ul>
      </nav>
    )
  }
};

export default TopBar