import React, { Component } from 'react'
import { Link } from 'react-router-dom'

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
        <a class="navbar-brand" style={{color: "white"}} href="/">Power Rankings Brasil</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Alterna navegação">
          <span class="navbar-toggler-icon" style={{fontFamily: "'Montserrat', sans-serif"}}></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item active">
              <Link class="nav-link" to="/">Home <span class="sr-only">(Página atual)</span></Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link" to="/about">Sobre</Link>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
};

export default TopBar