import React, { Component } from 'react'

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
    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/master/out/tournament/prbth.json')
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
          Sobre
        </h2>
        <p>
          Esse site é uma tentativa de agregar todos os resultados de cenas locais de Super Smash Bros Ultimate de todo o Brasil em um só lugar, e de usar esses dados para calcular um ranking nacional.
          Os dados utilizados são extraídos do Braacket e o ranking nacional é recalculado de 12 em 12h.
          A interface deste site é baseada fortemente no modo <i>Tourney</i> do próprio jogo.
        </p>
        <h2>
          Meus dados no ranking estão vazios!
        </h2>
        <p>
          Primeiramente, entre em contato com o TO da sua região. Ele poderá adicionar seu twitter e seus mains ao braacket da sua liga local.
        </p>
        <p>
          Para adição de nome completo e estado, peça para que o TO entre em contato com <a href="https://twitter.com/piuzera_">Piu</a>.
        </p>
        <p>
          Para outros casos individuais, utilize o seguinte link para enviar mudanças: <a href="https://forms.gle/57aGTDPFvwzRNvB59">Forms</a>
        </p>
        <h2>
          Metodologia do ranking
        </h2>
        <p>
          O cálculo do ranking é realizado seguindo a seguinte lógica:
          <ul>
            <li>Para cada torneio da lista em que o jogador participou, calcular a quantidade de pontos obtidos neste torneio (utilizando a tabela de Tiers)</li>
            <li>A pontuação final do jogador é a soma das 10 maiores pontuações obtidas</li>
          </ul>
          Campeonatos utilizados para cálculo do ranking nacional:
        </p>
        <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">Jogadores</th>
              <th scope="col">Tier</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.tournaments != null ?
                this.state.tournaments.map((tournament)=>(
                  <tr>
                    <td><a target="_blank" href={`https://braacket.com/tournament/${tournament.id}`}>{tournament.name}</a></td>
                    <td>{tournament.player_number}</td>
                    <td style={{color: this.state.tournamentColor[tournament.rank]}}><b>{tournament.rank}</b></td>
                  </tr>
                ))
                :
                null
            }
          </tbody>
        </table>
        <p>
          Tabela de pontuação dos torneios:
        </p>
        <div style={{textAlign: "center"}}>
          <img src="/images/ranking-tiers.jpg" />
        </div>
      </div>
    )
  }
};

export default About