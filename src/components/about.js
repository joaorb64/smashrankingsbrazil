import React, { Component } from 'react'

class About extends Component {
  state = {
  }

  componentDidUpdate(nextProps) {
  }

  render (){
    return(
      <li class="slide-fade list-group-item" style={{
        backgroundColor: "#f0f0f0", borderRadius: "10px", border: 0, marginBottom: "5px", width: "100%",
        padding: "10px", alignSelf: "center"
      }}>
        <h1>
          Sobre
        </h1>
        <p>
          asdasdasd
        </p>
        <h1>
          Metodologia
        </h1>
        <p>
          asdasdasd
        </p>
      </li>
    )
  }
};

export default About