import React, { Component } from 'react'
import styles from './leagueselector.module.css'
import { Link } from 'react-router-dom'

class LeagueSelector extends Component {
  state = {
  }

  componentDidUpdate(nextProps) {
    if(nextProps !== this.props) {
    }
  }

  componentDidMount() {
  }

  closeModal(){
    window.jQuery("#leagueSelectModal").modal("toggle");
  }

  render (){
    return(
      <div>
        <div class="col-12" style={{padding: "0 10px"}}>
          <button class={styles.teste + " btn btn-secondary col-12 dropdown-toggle"} type="button" id="dropdownMenuButton"
            data-toggle="modal" data-target="#leagueSelectModal" aria-haspopup="true" aria-expanded="false">
            {this.props.leagues && this.props.leagues.length > 0 ?
              <div class={styles.title} style={{display: "flex", lineHeight: "32px"}}>
                <div style={{
                  width: "32px", height: "32px", display: "inline-block", backgroundSize: "cover", backgroundRepeat: "no-repeat",
                  backgroundPosition: "center", verticalAlign: "inherit", backgroundColor: "white", borderRadius: "100%", marginRight: "10px",
                  backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/master/league_icon/${this.props.leagues[this.props.selectedLeague].id}.png)`,
                  display: "flex", flexShrink: 0
                }}></div>
                <div style={{
                  flexShrink: 1, flexGrow: 1, textOverflow: "ellipsis", overflow: "hidden"
                }}>{this.props.leagues[this.props.selectedLeague].name}</div>
                <div style={{
                  width: "32px", height: "32px", display: "inline-block",
                  backgroundPosition: "center", verticalAlign: "inherit",
                  display: "flex", flexShrink: 0
                }}>{this.props.leagues[this.props.selectedLeague].state}</div>
              </div>
              :
              "Loading..."
            }
          </button>
        </div>

        <div class="modal fade" id="leagueSelectModal" tabindex="-1" role="dialog" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header" style={{backgroundColor: "#be2018",
              borderBottom: "1px solid #801e19", color: "white"}}>
                <h5 class="modal-title" id="exampleModalLongTitle">Selecione uma liga</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true" style={{color: "white"}}>&times;</span>
                </button>
              </div>
              <div class="modal-body" style={{padding: 0}}>
                {this.props.leagues.map((contact, i) => (
                  <Link class={"dropdown-item " + styles.teste} to={`/home/smash/${contact.id}`} href={`/home/smash/${contact.id}`} onClick={()=>{this.props.selectLeague(i); this.closeModal()}} style={{
                    display: "flex", lineHeight: "32px"
                  }} key={"league_"+contact.name}>
                    <div style={{
                      width: "32px", height: "32px", display: "inline-block", backgroundSize: "cover", backgroundRepeat: "no-repeat",
                      backgroundPosition: "center", verticalAlign: "inherit", backgroundColor: "white", borderRadius: "100%", marginRight: "10px",
                      backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/master/league_icon/${contact.id}.png)`,
                      display: "flex", flexShrink: 0
                    }}></div>
                    <div style={{
                      flexShrink: 1, flexGrow: 1, textOverflow: "ellipsis", overflow: "hidden"
                    }}>{contact.name}</div>
                    <div style={{
                      width: "32px", height: "32px", display: "inline-block",
                      backgroundPosition: "center", verticalAlign: "inherit",
                      display: "flex", flexShrink: 0
                    }}>{contact.state}</div>
                  </Link>
                ))}
              </div>
              <div class="modal-footer" style={{backgroundColor: "#be2018", borderTop: 0}}>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
};

export default LeagueSelector