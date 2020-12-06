import { faFacebook, faTwitch, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component } from 'react'
import styles from './statistics.module.css'

class Information extends Component {
  state = {
    
  }

  componentDidMount() {
    console.log(this.props.info)
  }

  render (){
    return(
      <div class="slide-fade list-group-item" style={{
        backgroundColor: "#f0f0f0", borderRadius: "10px", border: 0, marginBottom: "5px", margin: "10px",
        padding: "30px", alignSelf: "center", textAlign: "left", fontFamily: "Roboto, sans-serif"
      }}>
        {this.props.info ?
          <p>
            <FontAwesomeIcon icon={faExternalLinkSquareAlt} /> <a href={"https://braacket.com/league/" + this.props.info.id}>
              Braacket
            </a><br/>
            {this.props.info.twitter ?
              <span><FontAwesomeIcon icon={faTwitter} /> <a href={this.props.info.twitter}>{this.props.info.twitter}</a><br/></span>
              :
              null
            }
            {this.props.info.facebook ?
              <span><FontAwesomeIcon icon={faFacebook} /> <a href={this.props.info.facebook}>{this.props.info.facebook}</a><br/></span>
              :
              null
            }
            {this.props.info.twitch ?
              <span><FontAwesomeIcon icon={faTwitch} /> <a href={this.props.info.twitch}>{this.props.info.twitch}</a><br/></span>
              :
              null
            }
            {this.props.info.youtube ?
              <span><FontAwesomeIcon icon={faYoutube} /> <a href={this.props.info.youtube}>{this.props.info.youtube}</a><br/></span>
              :
              null
            }
          </p>
        :
          null
        }
      </div>
    )
  }
};

export default Information