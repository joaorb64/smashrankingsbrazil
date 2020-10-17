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
          Esse site agrega todos os resultados de cenas locais de Super Smash Bros Ultimate de todo o Brasil em um só lugar e usa esses dados para calcular um ranking nacional.
          Os dados utilizados são extraídos do Braacket e o ranking nacional é recalculado a cada 3h.
          A interface deste site é baseada fortemente no modo <i>Tourney</i> do Super Smash Bros. Ultimate.
        </p>
        <h2>
          Idealizadores
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
          </ul>
        </p>
        <h2>
          Meus dados no ranking estão vazios ou desatualizados!
        </h2>
        <p>
          <a class="btn btn-primary" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
            Formulário
          </a>
        </p>
        <div class="collapse" id="collapseExample">
          <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfwTV63ynY_kG9H3w-LUB8cAhz4QknJM2JMKWHWzGXA_7SRig/viewform?embedded=true" width="100%" height="1265" frameborder="0" marginheight="0" marginwidth="0">Carregando…</iframe>
        </div>
        <p>
          Para outros casos individuais, entre em contato com um dos idealizadores listados acima.
        </p>
        <h2>
          Metodologia do ranking brasileiro
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