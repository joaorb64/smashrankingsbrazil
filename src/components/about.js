import React, { Component } from 'react'
import i18n from '../locales/i18n';

class About extends Component {
  state = {
    tournaments: null,
    tournamentColor: {
      "S": "red",
      "A": "orange",
      "B": "brown",
      "C": "darkbrown",
      "D": "gray",
    }
  }

  componentDidUpdate(nextProps) {
  }

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/out/tournament/prbth.json')
    .then(res => res.json())
    .then((data) => {
      this.state.tournaments = Object.keys(data).map(function(_) { return data[_]; })
      
      this.state.tournaments.forEach(tournament => {
        if(!tournament.rank){
          if(tournament.player_number >= 65) tournament.rank = "S"
          else if(tournament.player_number >= 49) tournament.rank = "A"
          else if(tournament.player_number >= 33) tournament.rank = "B"
          else if(tournament.player_number >= 25) tournament.rank = "C"
          else tournament.rank = "D"
        }
      });

      this.state.tournaments = Object.values(this.state.tournaments).sort((a, b) => (a.name > b.name) ? 1 : -1);

      console.log(this.state.tournaments);

      this.setState(this.state);
    })
    .catch(console.log)
  }

  render (){
    return(
      <div class="slide-fade list-group-item" style={{
        backgroundColor: "#f0f0f0", borderRadius: "10px", border: 0, marginBottom: "5px", width: "100%",
        padding: "30px", alignSelf: "center"
      }}>
        <h2>
          {i18n.t("about")}
        </h2>
        <p dangerouslySetInnerHTML={{__html: i18n.t("about-text")}}>
        </p>
        <h2>
          {i18n.t("creators")}
        </h2>
        <p>
          <ul>
            <li>
              Shino (João Ribeiro) <a href="https://twitter.com/joao_shino">@joao_shino</a> - Criador e desenvolvedor do site, manutenção dos dados
            </li>
            <li>
              frodO (Andrey Brouwenstyn) <a href="https://twitter.com/andreyfrodo">@andreyfrodo</a> - Divulgação nas redes sociais, manutenção dos dados
            </li>
            <li>
              SKPeter (Samuel Petersen) <a href="https://twitter.com/skpeter_">@skpeter_</a> - Suporte técnico, manutenção dos dados
            </li>
            <li>
              Samwa (Vitor Menezello) <a href="https://twitter.com/vitinmenezello">@vitinmenezello</a> - Manutenção dos dados
            </li>
            <li>
              Piu (Gabriel Amoedo) <a href="https://twitter.com/piuzera_">@piuzera_</a> - Divulgação, ideias
            </li>
          </ul>
        </p>
        <h2>
          {i18n.t("faq-old-data")}
        </h2>
        <p>
          {i18n.t("faq-old-data-desc")}
        </p>
        <h2>
          {i18n.t("faq-duplicated")}
        </h2>
        <p>
          {i18n.t("faq-duplicated-desc")}
        </p>
      </div>
    )
  }
};

export default About