import React, { Component } from 'react';
import moment from "../../node_modules/moment-timezone/moment-timezone";
import styles from "./nextTournaments.module.css"
import { faCalendar, faEdit, faMapMarkerAlt, faUser, faWifi } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import i18n from '../locales/i18n';
import HelpButton from './HelpButton';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ScrollTop from './ScrollTop';
import { Avatar, Box, CardHeader, Chip, Grid, LinearProgress, Link, MenuItem, ListSubheader, Select, ListItem, ListItemIcon, ListItemText, Container, Paper } from '@material-ui/core';
import countriesJson from '../locales/countries.json';

let useStyles = (props) => ({
  root: {
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
  },
  cardHeader: {
    overflow: "hidden"
  }
});

class NextTournaments extends Component {
  state = {
    tournaments: [],
    selectedCountry: "all",
    selections: {},
    alltournaments: null
  }

  componentDidUpdate(nextProps) {
    if(this.props.game != nextProps.game){
      this.loadData();
    }
  }

  componentDidMount() {
    this.loadData();
  }

  loadData(){
    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/out/'+this.props.game+'/nexttournaments.json')
    .then(res => res.json())
    .then((data) => {
      console.log(data);

      Object.entries(data).forEach(country => {
        country[1].events.forEach((event)=>{
          event.country = country[0];
        })
      })

      this.state.alltournaments = data;

      let selections = {}

      Object.entries(data).forEach(country => {
        if(!selections.hasOwnProperty(country[1].region)){
          selections[country[1].region] = []
        }
        selections[country[1].region].push(country[0])
      });

      this.state.selections = selections;

      this.setState(this.state);
      
      if(this.props.match && this.props.match.params && this.props.match.params.country){
        this.state.selectedCountry = this.props.match.params.country.toLowerCase();
      }

      this.filterTournaments(this.state.selectedCountry);
    })
    .catch(console.log)
  }

  selectCountry(e){
    this.state.selectedCountry = e.target.value;
    this.filterTournaments(e.target.value);
  }

  filterTournaments(value){
    value = value.toLowerCase();

    let selectedTournaments = [];

    if(value.startsWith("region_")){
      Object.entries(this.state.alltournaments).forEach((country)=>{
        if(country[1].region.toLowerCase() == value.split("region_")[1]){
          selectedTournaments = selectedTournaments.concat(country[1].events)
        }
      })
    } else if(Object.keys(this.state.alltournaments).includes(value.toUpperCase())) {
      selectedTournaments = this.state.alltournaments[value.toUpperCase()].events;
    } else {
      Object.entries(this.state.alltournaments).forEach((country)=>{
        selectedTournaments = selectedTournaments.concat(country[1].events)
      })
    }
    
    selectedTournaments = selectedTournaments.sort((a, b) => (a.startAt > b.startAt) ? 1 : -1);

    this.state.tournaments = selectedTournaments;

    this.setState(this.state);

    this.props.history.push('/'+this.props.game+'/nexttournaments/'+this.state.selectedCountry.toLowerCase());
  }

  render (){
    const { classes } = this.props;

    return(
      <Container maxWidth="xl" disableGutters>
        <ScrollTop />
        <Box>
          <h2 style={{color: "white"}}>
            {i18n.t("next-tournaments")} <HelpButton content="To have your tournaments listed on this page, set their location to your country, even for online tournaments." />
          </h2>
          <Select className={classes.select} fullWidth value={this.state.selectedCountry} onChange={(e)=>this.selectCountry(e)}>
            <MenuItem value="all">{i18n.t("all")}</MenuItem>
            {Object.keys(this.state.selections).map((region) => (
              [<ListSubheader>{i18n.t("region-"+region.toLowerCase())}</ListSubheader>,
              <MenuItem value={"region_"+region.toLowerCase()}>{i18n.t("all")} ({i18n.t("region-"+region.toLowerCase())})</MenuItem>,
              this.state.selections[region].map((country) => (
                <MenuItem value={country.toLowerCase()}>{countriesJson[country].native+" ("+countriesJson[country].name+")"+" ["+this.state.alltournaments[country].events.length+"]"}</MenuItem>
              ))]
            ))}
          </Select>
          {this.state.selectedCountry == "br" ? 
            <Paper style={{padding: 8, minHeight: 64, display: "flex", alignItems: "center", marginBottom: 8}} component="a" href="https://twitter.com/smash_bot_br">
              <img src="/images/bot.png" style={{height: 48, width: 48, borderRadius: 8, marginRight: 8}} />
              <div>Siga o @smash_bot_br para ser notificado de próximos eventos e resultados de torneios em tempo real!</div>
            </Paper>
            :
            null
          }          
        </Box>
        <Box>
          {
            this.state.tournaments != null ?
              <Grid container justify="flex-start" spacing={2}>
                {this.state.tournaments.filter(t=>{return t.url != null && moment(t.startAt * 1000) > moment()}).map((tournament)=>(
                  <Grid item style={{display: "grid"}} component={Link} xs={12} sm={6} md={6} lg={4} xl={3}
                  underline="none" href={tournament.url} target="_blank">
                    <Card fullWidth style={{width: "100%"}}>
                      <CardActionArea>
                        <CardHeader noWrap style={{height: 84}} classes={{content: classes.cardHeader}}
                          avatar={<Avatar src={`https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/country_flag/${tournament.country.toLowerCase()}.png`} />}
                          title={<Typography noWrap variant="h6" component="h2">
                            {tournament.tournament}
                          </Typography>}
                          subheader={
                            tournament.tournament_multievent ?
                              tournament.name
                              :
                              null
                          }
                        />
                        <CardMedia
                          className={classes.media}
                          image={(tournament.images ? ((tournament.images.find(img => img["type"]=="banner") || tournament.images[tournament.images.length-1])?.url || "") : "")}
                          title={tournament.title}>
                          {tournament.coupon ?
                            <Link underline="none" href="#">
                              <Chip
                                className={classes.couponChip}
                                label={"Coupon: "+tournament.coupon}
                                color="primary"
                                clickable
                                onClick={(event)=>{}}
                              />
                            </Link>
                            :
                            null
                          }
                        </CardMedia>
                        <CardContent>
                          {tournament.isOnline ?
                            <ListItem dense disableGutters alignItems="flex-start">
                              <ListItemIcon style={{minWidth: 32}}><FontAwesomeIcon icon={faWifi}/></ListItemIcon>
                              <ListItemText primary="Online" />
                            </ListItem>
                            :
                            <ListItem dense disableGutters alignItems="flex-start">
                              <ListItemIcon style={{minWidth: 32}}><FontAwesomeIcon icon={faMapMarkerAlt}/></ListItemIcon>
                              <ListItemText primary={(tournament.tournament_venueName ? tournament.tournament_venueName+" - " : "") + tournament.tournament_addrState} />
                            </ListItem>
                          }

                          <ListItem dense disableGutters alignItems="flex-start">
                            <ListItemIcon style={{minWidth: 32}}><FontAwesomeIcon icon={faCalendar}/></ListItemIcon>
                            <ListItemText primary={i18n.t("weekday-"+moment(tournament.startAt * 1000).format("ddd").toLowerCase())+" "+i18n.t("date_format", {date: moment.unix(tournament.startAt).toDate()})+" "+moment(tournament.startAt * 1000).format("HH:mm")+" GMT"+moment(tournament.startAt * 1000).format("Z")} />
                          </ListItem>

                          <ListItem dense disableGutters alignItems="flex-start">
                            <ListItemIcon style={{minWidth: 32}}><FontAwesomeIcon icon={faEdit}/></ListItemIcon>
                            <ListItemText primary={i18n.t("weekday-"+moment(tournament.tournament_registrationClosesAt * 1000).format("ddd").toLowerCase())+" "+i18n.t("date_format", {date: moment.unix(tournament.tournament_registrationClosesAt).toDate()})+" "+moment(tournament.tournament_registrationClosesAt * 1000).format("HH:mm")+" GMT"+moment(tournament.tournament_registrationClosesAt * 1000).format("Z")} />
                          </ListItem>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                  // <div class="col-md-6 col-xl-4" style={{padding: 2}}>
                  //   <a href={tournament.url} target="_blank">
                  //     <div className={styles.tournamentContainerHighlight} style={{cursor: "pointer"}}>
                  //       <div className={styles.tournamentContainer} style={{backgroundColor: "#ff5e24", border: "4px solid black", cursor: "pointer"}}>
                  //         <div style={{backgroundImage: "url("+
                  //           (tournament.images ? ((tournament.images.find(img => img["type"]=="banner") || tournament.images[tournament.images.length-1])?.url || "") : "") +
                  //           ")", height: 140, margin: "4px",
                  //         backgroundSize: "cover", backgroundPosition: "center", backgroundColor: "black"}}>
                  //           <div style={{position: "absolute", width: 50, height: 30, backgroundPosition: "center", backgroundSize: "cover", margin: "2px", border: "2px solid black",
                  //           backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/sudamerica/country_flag/${tournament.country.toLowerCase()}.png)`}}></div>
                  //         </div>

                  //         <div style={{height: 48, display: "flex", flexDirection: "column", alignItems: "center", placeContent: "center",
                  //         paddingLeft: "8px", paddingRight: "8px", background: "rgb(255,113,40)",
                  //         background: "linear-gradient(180deg, rgba(255,113,40,1) 0%, rgba(221,87,37,1) 100%)"}}>
                  //           {tournament.tournament_multievent ?
                  //             <div style={{color: "white", textAlign: "center", fontSize: "12px",
                  //             whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden",
                  //             textShadow: "2px 2px 0px #00000070", width: "100%"}}>
                  //               {tournament.tournament}
                  //             </div>
                  //             :
                  //             null}
                  //           <div style={{color: "white", textAlign: "center", fontSize: "16px",
                  //           whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden",
                  //           textShadow: "2px 2px 0px #00000070", width: "100%"}}>
                  //             {tournament.tournament_multievent ? tournament.name : tournament.tournament}
                  //           </div>
                  //         </div>

                  //         <div style={{display: "flex", color: "black", fontSize: "0.8rem", flexDirection: "column"}}>
                  //           <div style={{backgroundColor: "#dedede", padding: "2px", paddingLeft: "8px", flexGrow: 1}}>
                  //             {tournament.isOnline ?
                  //               <span><FontAwesomeIcon icon={faWifi}/> Online</span>
                  //               :
                  //               <span><FontAwesomeIcon icon={faMapMarkerAlt}/> {(tournament.tournament_venueName ? tournament.tournament_venueName+" - " : "") + tournament.tournament_addrState}</span>
                  //             }
                  //           </div>

                  //           <div style={{backgroundColor: "#dedede", padding: "2px", paddingRight: "8px", paddingLeft: "8px", flexGrow: 1, textAlign: "left"}}>
                  //             <FontAwesomeIcon icon={faCalendar}/> {i18n.t("starts-time")}: {i18n.t("weekday-"+moment(tournament.startAt * 1000).format("ddd").toLowerCase())} {i18n.t("date_format", {date: moment.unix(tournament.startAt).toDate()})} {moment(tournament.startAt * 1000).format("HH:mm")} GMT{moment(tournament.startAt * 1000).format("Z")}
                  //           </div>
                            
                  //           <div style={{backgroundColor: "#dedede", padding: "2px", paddingRight: "8px", paddingLeft: "8px", flexGrow: 1, textAlign: "left"}}>
                  //             <FontAwesomeIcon icon={faEdit}/> {i18n.t("register-due")}: {i18n.t("weekday-"+moment(tournament.tournament_registrationClosesAt * 1000).format("ddd").toLowerCase())} {i18n.t("date_format", {date: moment.unix(tournament.tournament_registrationClosesAt).toDate()})} {moment(tournament.tournament_registrationClosesAt * 1000).format("HH:mm")} GMT{moment(tournament.tournament_registrationClosesAt * 1000).format("Z")}
                  //           </div>
                  //         </div>
                  //       </div>
                  //     </div>
                  //   </a>
                  // </div>
                ))}
              </Grid>
              :
              null
          }
        </Box>
      </Container>
    )
  }
};

export default withStyles(useStyles)(NextTournaments)