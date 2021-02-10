import React, { Component } from 'react';
import moment from "../../node_modules/moment-timezone/moment-timezone";
import HelpButton from './HelpButton';
import styles from "./nextTournaments.module.css"
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ScrollTop from './ScrollTop';
import { Avatar, Box, CardHeader, Chip, Grid, LinearProgress, Link, MenuItem, Select } from '@material-ui/core';

let useStyles = (props) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  barRoot: {
    height: 10,
    borderRadius: 5,
  },
  barIncomplete: {
    borderRadius: 5,
    backgroundColor: "blue"
  },
  barComplete: {
    borderRadius: 5,
    backgroundColor: "green"
  },
  couponChip: {
    margin: 6
  },
  select: {
    fontSize: '1.4rem',
    marginBottom: '1rem'
  }
});

class Matcherino extends Component {
  state = {
    matcherinos: {},
    selected: null,
    tournaments: {},
    loading: false
  }

  componentDidUpdate(nextProps) {
  }

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/matcherinos.json')
    .then(res => res.json())
    .then((data) => {
      console.log(data);

      this.setState({
        matcherinos: data,
        selected: Object.keys(data)[0]
      });

      if(this.props.match && this.props.match.params && this.props.match.params.country){
        if(this.state.matcherinos && this.state.matcherinos[this.props.match.params.country.toUpperCase()] != null){
          this.state.selected = this.props.match.params.country.toUpperCase();
        }
      }

      this.selectCountry({target: {value: this.state.selected}});

      /*let offset = 0;
      let perPage = 10;
      this.fetchPage(this.state.selected, offset, perPage);*/
    });
  }

  fetchPage(stateSelection, offset, perPage) {
    if(this.state.selected == null || this.state.selected != stateSelection) return;
    
    if(offset == 0){
      this.state.tournaments[stateSelection] = [];
      this.state.loading = true;
      this.setState(this.state);
    }

    let promises = [];

    this.state.matcherinos[this.state.selected].forEach((accountId)=>{
      promises.push(fetch('https://matcherino.com/__api/bounties/list?offset='+offset+'&size='+perPage+'&creatorId='+accountId+'&published=true')
      .then(res => res.json())
      .then((data) => {
        console.log(data);

        data.body = data.body.filter((tournament) => {
          if(tournament.status=="ready" && [112,115].includes(tournament.gameId)){
            return true;
          }
          return false;
        });

        console.log(data.body)

        data.body.forEach(tournament => {
          let used = 0;

          if(tournament.transactions){
            tournament.transactions.forEach(transaction => {
              if(transaction.action == "coupon:use"){
                used += 1;
              }
            })
          }

          tournament.usedCoupons = used;

          let coupon = tournament.description.match(/(cupom|coupon|cupon|cupón):[\s][a-zA-Z|0-9]+/gi);

          if(coupon != null){
            coupon = coupon[0].split(":")[1].trim()
          }

          tournament.coupon = coupon;
        });

        data.body.forEach((tournament) => {
          this.state.tournaments[stateSelection].push(tournament);
        })
      })
      .catch((err)=>{
        console.log(err);
      }))
    })

    Promise.all(promises).then(()=>{
      this.setState(this.state);
      
      offset+=10;

      if(offset < 200){
        this.fetchPage(stateSelection, offset, perPage);
      } else {
        this.setState({loading: false});
      }
    })
  };

  selectCountry(e){
    this.state.selected = e.target.value;
    this.setState({selected: e.target.value});
    this.props.history.push('/matcherino/'+this.state.selected.toLowerCase());

    let offset = 0;
    let perPage = 10;
    this.fetchPage(e.target.value, offset, perPage);
  }

  render(){
    const { classes } = this.props;

    return(
      <Box>
        <ScrollTop />

        <Box gutterBottom>
          <div>
            <h2 style={{color: "white"}}>
              Campanhas ativas no Matcherino <HelpButton content="To have your Matcherino campains listed on this page, contact @joao_shino on twitter" />
            </h2>
          </div>
          <Select className={classes.select} fullWidth value={this.state.selected} onChange={(e)=>this.selectCountry(e)}>
            {Object.keys(this.state.matcherinos).map((country) => (
              <MenuItem value={country}>{country}</MenuItem>
            ))}
          </Select>
        </Box>
        <Box>
          <Grid container justify="flex-start" spacing={2} width="100%">
            {
              this.state.tournaments[this.state.selected] != null ?
                this.state.tournaments[this.state.selected].map((tournament)=>(
                  <Grid item component={Link} lg={4} md={6} sm={6} xs={12}
                  underline="none" href={"https://matcherino.com/tournaments/"+tournament.id} target="_blank"
                  style={{display: "flex", justifyContent: "center"}}>
                    <Card fullWidth className={classes.root} style={{width: "100%"}}>
                      <CardActionArea>
                        <CardHeader
                          avatar={<Avatar src={tournament.creator.avatar} />}
                          title={tournament.creator.displayName}
                        />
                        <CardMedia
                          className={classes.media}
                          image={tournament.meta.backgroundImg}
                          title={tournament.title}>
                          {tournament.coupon ?
                            <Link underline="none" href="#">
                              <Chip
                                className={classes.couponChip}
                                label={"Coupon: "+tournament.coupon}
                                color="secondary"
                                clickable
                                onClick={(event)=>{}}
                              />
                            </Link>
                            :
                            null
                          }
                        </CardMedia>
                        <CardContent>
                          <Typography noWrap gutterBottom variant="h6" component="h2">
                            {tournament.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" component="p">
                            {tournament.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Utilized coupons: {tournament.usedCoupons}/50
                          </Typography>
                          <Box display="flex" alignItems="center">
                            <Box width="100%" mr={1}>
                              <LinearProgress variant="determinate"
                              classes={{
                                root: classes.barRoot,
                                barColorPrimary: tournament.balance/100.0/50.0 >= 1.0 ? classes.barComplete : classes.barIncomplete
                              }}
                              value={Math.min(tournament.balance/100.0/50.0*100.0, 100)} />
                            </Box>
                            <Box minWidth={35}>
                              <Typography variant="body2" color="textSecondary">{`${"$"+(tournament.balance/100.0).toFixed(2)}`}</Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))
                :
                null
            }
          </Grid>
        </Box>
        {this.state.loading ?
          <div class="loader"></div>
          :
          null
        }
      </Box>
    )
  }
};

export default withStyles(useStyles)(Matcherino)