import React, { Component } from 'react'

class Contacts extends Component {
  state = {
    selectedLeague: 0,
    players: []
  }

  componentDidUpdate(nextProps) {
    if(nextProps !== this.props) {
      this.updateData();
    }
  }

  updateData() {
    fetch('https://cdn.jsdelivr.net/gh/joaorb64/tournament_api/out/'+this.props.contacts[this.state.selectedLeague]+'.json')
    .then(res => res.json())
    .then((data) => {
      if(data){
        let players = [];

        Object.keys(data).forEach(function(player){
          players.push(data[player]);
        });

        this.setState({ players: players })
      }
    })
    .catch(console.log)
  }

  selectLeague(i){
    if(i != this.state.selectedLeague){
      this.state.selectedLeague = i;
      this.updateData();
    }
  }

  getCharName(name){
    return name.toLowerCase().replace(/ /g, "_");
  }

  render (){
    console.log(this.state.players);
    return(
      <div style={{textAlign: "center", fontFamily: "SmashFont"}}>
        <div class="btn-group" role="group" style={{margin: 10}}>
          {this.props.contacts.map((contact, i) => (
            <button onClick={()=>this.selectLeague(i)} type="button" class="btn btn-primary">{contact}</button>
          ))}
        </div>
        <ul class="list-group" style={{padding: "10px"}}>
          {this.state.players.map((player, i) => (
            <li key={this.state.selectedLeague+"_"+i} class="slide-fade list-group-item" style={{
              backgroundColor: "#f0f0f0", borderRadius: "10px", border: 0, marginBottom: "5px", width: "512px", height: "42px", lineHeight: "48px",
              padding: 0, display: "flex", alignSelf: "center", overflow: "hidden", animationDelay: (i/30.0)+"s"
            }}>
              <div style={{width: "45px", textAlign: "center", fontSize: "1.2rem"}}>{player.rank}</div>
              <div style={{flexGrow: 1}}>{player.name}</div>
              {player.mains.length > 0 ?
                <div style={{
                  backgroundImage: `url(./portraits-small/${this.getCharName(player.mains[0].name)}.png)`,
                  width: "128px", backgroundPosition: "center", backgroundSize: "cover", backgroundColor: "#ababab"
                }}></div>
                :
                <div style={{
                  backgroundImage: `url(./portraits-small/${"random"}.png)`,
                  width: "128px", backgroundPosition: "center", backgroundSize: "cover", backgroundColor: "#ababab"
                }}></div>
              }
            </li>
          ))}
        </ul>
      </div>
    )
  }
};

export default Contacts