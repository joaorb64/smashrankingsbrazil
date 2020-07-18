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
            Link para a liga no braacket: <a href={"https://braacket.com/league/" + this.props.info.id}>
              {"https://braacket.com/league/" + this.props.info.id}
            </a> <br/>
            {this.props.info.twitter ?
              <span>Twitter: <a href={this.props.info.twitter}>{this.props.info.twitter}</a><br/></span>
              :
              null
            }
            {this.props.info.facebook ?
              <span>Facebook: <a href={this.props.info.facebook}>{this.props.info.facebook}</a><br/></span>
              :
              null
            }
            {this.props.info.twitch ?
              <span>Twitch: <a href={this.props.info.twitch}>{this.props.info.twitch}</a><br/></span>
              :
              null
            }
            {this.props.info.youtube ?
              <span>Youtube: <a href={this.props.info.youtube}>{this.props.info.youtube}</a><br/></span>
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