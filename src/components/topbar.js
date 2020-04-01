import React, { Component } from 'react'
import { Link, NavLink } from 'react-router-dom'

class TopBar extends Component {
  state = {
  }

  componentDidUpdate(nextProps) {
  }

  render (){
    return(
      <nav class="navbar navbar-expand-md navbar-dark" style={{
        color: "white", backgroundColor: "#be2018", fontFamily: "SmashFont"
      }}>
        <Link class="navbar-brand" style={{color: "white"}} to="/home/smash/prbth">
          Power Rankings Brasil
        </Link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false">
          <span class="navbar-toggler-icon" style={{fontFamily: "'Montserrat', sans-serif"}}></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <NavLink className="nav-item nav-link" activeClassName="nav-item nav-link active" to="/home/smash/prbth">
              <div class="nav-link">Home</div>
            </NavLink>
            <NavLink className="nav-item nav-link" activeClassName="nav-item nav-link active" to="/map/">
              <div class="nav-link">Mapa</div>
            </NavLink>
            <NavLink className="nav-item nav-link" activeClassName="nav-item nav-link active" to="/statistics/">
              <div class="nav-link">Estatísticas</div>
            </NavLink>
            <NavLink className="nav-item nav-link" activeClassName="nav-item nav-link active" to="/about/">
              <div class="nav-link">Sobre</div>
            </NavLink>
          </ul>
        </div>
      </nav>
    )
  }
};

export default TopBar