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
import { FormControlLabel, Checkbox, Avatar, Box, CardHeader, TextField, Chip, Grid, LinearProgress, Link, MenuItem, ListSubheader, Select, ListItem, ListItemIcon, ListItemText, Container, Paper } from '@material-ui/core';
import countriesJson from '../locales/countries.json';
import Autocomplete from '@material-ui/lab/Autocomplete';

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
  cardHeader: {
    overflow: "hidden"
  }
});

class NextTournaments extends Component {
  state = {
    tournaments: [],
    selectedCountry: null,
    selectedOnline: "both",
    selectedIncludeRegion: true,
    selections: {},
    alltournaments: null,
  }

  componentDidUpdate(nextProps) {
    if(this.props.game != nextProps.game){
      this.loadData();
    }

    if(this.props.userCountry != nextProps.userCountry && nextProps.userCountry != null){
      this.state.selectedCountry = this.state.countries.find((e)=>e[0].toLowerCase() == nextProps.userCountry.toLowerCase());
      this.filterTournaments();
    }
  }

  componentDidMount() {
    this.state.countries = Object.entries(countriesJson);
    this.loadData();
  }

  loadData(){
    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/out/'+this.props.game+'/nexttournaments.json')
    .then(res => res.json())
    .then((data) => {
      console.log(data);

      data.events.forEach((event)=>{
        if(!event.country_code){
          event.country_code = "NULL"
        }
      })
      this.state.alltournaments = data.events;

      this.setState(this.state);
      
      if(this.props.match && this.props.match.params && this.props.match.params.country){
        this.state.selectedCountry = this.state.countries.find((e)=>e[0].toLowerCase() == this.props.match.params.country);
      } else {
        if(this.props.userCountry){
          this.state.selectedCountry = this.state.countries.find((e)=>e[0].toLowerCase() == this.props.userCountry.toLowerCase());
        }
      }

      this.filterTournaments();
    })
    .catch(console.log)
  }

  selectCountry(e){
    this.state.selectedCountry = e.target.value;
    this.filterTournaments(e.target.value);
  }

  filterTournaments(value){
    if(!this.state.selectedCountry) return;
    if(!value) value = this.state.selectedCountry[0];

    console.log(value)
    value = value.toLowerCase();

    let selectedTournaments = [];

    this.state.alltournaments.forEach((tournament)=>{
      if(tournament.country_code == value.toUpperCase() ||
      (tournament.region_lock && this.state.selectedIncludeRegion && tournament.region_lock.includes(value.toUpperCase()))) {
        selectedTournaments.push(tournament);
      }
    })

    if(this.state.selectedOnline != "both"){
      selectedTournaments = selectedTournaments.filter((t)=>{
        if(this.state.selectedOnline == "online" && t.isOnline) return true;
        if(this.state.selectedOnline == "offline" && !t.isOnline) return true;
        return false
      })
    }
    
    selectedTournaments = selectedTournaments.sort((a, b) => (a.startAt > b.startAt) ? 1 : -1);

    this.state.tournaments = selectedTournaments;

    this.setState(this.state);

    console.log(this.state.tournaments);

    this.props.history.push('/'+this.props.game+'/nexttournaments/'+this.state.selectedCountry[0].toLowerCase());
  }

  render (){
    const { classes } = this.props;

    return(
      <Container maxWidth="xl" disableGutters>
        <ScrollTop />
        <Box marginBottom={1}>
          <h2 style={{color: "white"}}>
            {i18n.t("next-tournaments")} <HelpButton content="To have your tournaments listed on this page, set their location to your country, even for online tournaments." />
          </h2>
          <Autocomplete
            options={this.state.countries ? this.state.countries : []}
            value={this.state.selectedCountry}
            getOptionLabel={(option) => option[1].name + " ("+option[1].native+")"}
            renderOption={(option) =>
              option ?
                <div style={{"contentVisibility": "auto", "containIntrinsicSize": "24px", display: "flex"}}>
                  <img style={{placeSelf: "center", marginRight: "6px"}} width="24px" height="16px" src={`https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/country_flag/${option[0].toLowerCase()}.png`} />
                  {option[1].name + " ("+option[1].native+")"}
                </div>
                :
                ""
            }
            onChange={(event, newValue)=>{
              this.state.selectedCountry = newValue;
              this.filterTournaments()
            }}
            renderInput={(params) => <TextField {...params} label={"Filter by country"} variant="outlined"/>}
          />

          <Select variant="outlined" className={classes.select} fullWidth value={this.state.selectedOnline}
          onChange={(e)=>{this.state.selectedOnline = e.target.value; this.filterTournaments()}}>
            <MenuItem value={"both"}>Online and Offline</MenuItem>
            <MenuItem value={"online"}>Online</MenuItem>
            <MenuItem value={"offline"}>Offline</MenuItem>
          </Select>

          <FormControlLabel
            control={<Checkbox
              fullWidth
              checked={this.state.selectedIncludeRegion}
              onChange={(e)=>{this.state.selectedIncludeRegion = e.target.checked; this.filterTournaments();}}
            />}
            label="Include region locked events"
          />

          {this.state.selectedCountry == "br" ? 
            <Paper style={{padding: 8, minHeight: 64, display: "flex", alignItems: "center", marginBottom: 8}} component="a" href="https://twitter.com/smash_bot_br">
              <img src="/images/bot.png" style={{height: 48, width: 48, borderRadius: 8, marginRight: 8}} />
              <div>Siga o @smash_bot_br para ser notificado de próximos eventos e resultados de torneios em tempo real!</div>
            </Paper>
            :
            null
          }

          {this.state.tournaments ?
            <h3 style={{color: "white"}}>Total: {this.state.tournaments.length}</h3>
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
                          avatar={<Avatar src={`https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/country_flag/${tournament.country_code.toLowerCase()}.png`} />}
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