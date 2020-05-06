import React, { Component } from 'react'
import { Link, NavLink } from 'react-router-dom'
import styles from './topbar.module.css'

class TopBar extends Component {
  state = {
    games: [
      {id: "smash", name: "Smash Ultimate"},
      {id: "granblue", name: "Granblue"}
    ],
    game: "smash"
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
      <nav class="navbar navbar-expand-md navbar-dark" style={{
        color: "white", backgroundColor: "#be2018", fontFamily: "SmashFont"
      }}>
        <div class="dropdown">
          <button class="btn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{
            backgroundColor: "#00000000", padding: 0, marginRight: "10px"
          }}>
            <div style={{
              backgroundImage: `url(/icons/games/${this.state.game}.png)`, backgroundSize: "cover",
              width: 48, height: 48, bottom: 0, right: 0, borderRadius: "12px"
            }}></div>
          </button>
          <div className={styles["menu-dropdown-background"]+" dropdown-menu"} aria-labelledby="dropdownMenuButton">
            {this.state.games.map((game)=>(
              <Link className={styles["menu-dropdown"]+" dropdown-item"} to={`/home/${game.id}`}
              style={{display: "flex"}} onClick={()=>{this.setState({game: game.id})}}>
                <div style={{
                  backgroundImage: `url(/icons/games/${game.id}.png)`, backgroundSize: "cover",
                  width: 32, height: 32, bottom: 0, right: 0, borderRadius: "8px",
                  display: "inline-block", marginRight: "10px"
                }}></div>
                <div style={{alignSelf: "center"}}>
                  {game.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
        <Link class="navbar-brand" style={{color: "white"}} to="/home/smash/prbth">
          Power Rankings Brasil
        </Link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false">
          <span class="navbar-toggler-icon" style={{fontFamily: "'Montserrat', sans-serif"}}></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <NavLink className="nav-item nav-link" activeClassName="nav-item nav-link active" to="/home/smash/prbth" href="/home/smash/prbth">
              <div class="nav-link">Home</div>
            </NavLink>
            <NavLink className="nav-item nav-link" activeClassName="nav-item nav-link active" to="/map/" href="/map/">
              <div class="nav-link">Mapa</div>
            </NavLink>
            <NavLink className="nav-item nav-link" activeClassName="nav-item nav-link active" to="/statistics/" href="/statistics/">
              <div class="nav-link">Estatísticas</div>
            </NavLink>
            <NavLink className="nav-item nav-link" activeClassName="nav-item nav-link active" to="/about/" href="/about/">
              <div class="nav-link">Sobre</div>
            </NavLink>
          </ul>
        </div>
      </nav>
    )
  }
};

export default TopBar