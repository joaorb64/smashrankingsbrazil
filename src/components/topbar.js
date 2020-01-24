import React, { Component } from 'react'

class TopBar extends Component {
  state = {
  }

  componentDidUpdate(nextProps) {
  }

  render (){
    return(
      <nav class="navbar navbar-expand-lg" style={{
        color: "white", backgroundColor: "#be2018", fontFamily: "SmashFont"
      }}>
        <a class="navbar-brand" style={{color: "white"}} href="#">Power Rankings Brasil</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      </nav>
    )
  }
};

export default TopBar