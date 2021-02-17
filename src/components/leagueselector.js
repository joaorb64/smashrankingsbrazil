import React, { Component } from 'react'
import styles from './leagueselector.module.css'
import { Link } from 'react-router-dom'
import i18n from '../locales/i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { Box, Button, Dialog, DialogContent, DialogTitle, List, Modal, Collapse,
ListItem, ListItemIcon, ListItemText, TextField, Typography, Icon, AppBar,
Toolbar, withStyles, Hidden, Tabs, Tab, Divider } from '@material-ui/core';
import { StarBorder, ExpandLess, ExpandMore, Public, Wifi } from '@material-ui/icons'
import HideOnScroll from './HideOnScroll';

const useStyles = (props) => ({
  leagueSelectorTopbar: {
    marginBottom: props.spacing(1),
    [props.breakpoints.down("sm")]: {
      top: 48,
      zIndex: 1
    }
  },
  topTabs: {
    minWidth: 130
  }
})

class LeagueSelector extends Component {
  state = {
    leagues: [],
    league_tree: {
      leagues: [],
      subleagues: {},
      icon: null
    },
    modalOpened: false,
    searchText: ""
  }

  componentDidUpdate(nextProps) {
    if(nextProps !== this.props) {
      this.buildLeagueTree();
    }
  }

  componentDidMount() {
    this.state.leagues = this.props.leagues;
    this.buildLeagueTree();
  }

  buildLeagueTree() {
    this.state.league_tree = {
      leagues: [],
      subleagues: {}
    };

    if(this.props.leagues){
      this.props.leagues.forEach(league=>{
        if(league.region){
          if(!this.state.league_tree["subleagues"][league.region]){
            this.state.league_tree["subleagues"][league.region] = {
              leagues: [],
              subleagues: {},
              open: false,
              name: i18n.t("region-"+league.region.toLowerCase())
            };
          }

          // se não tem país, é liga de região
          if(!league.country){
            this.state.league_tree["subleagues"][league.region]["leagues"].push(league);
          } else {
            if(!this.state.league_tree["subleagues"][league.region]["subleagues"][league.country]){
              this.state.league_tree["subleagues"][league.region]["subleagues"][league.country] = {
                leagues: [],
                subleagues: {},
                open: false,
                icon: `https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/country_flag/${league.country.toLowerCase()}.png`,
                show_count: true
              };
            }

            this.state.league_tree["subleagues"][league.region]["subleagues"][league.country]["leagues"].push(league);
          }
        }
      })

      this.setState(this.state);
    }
  }

  filterLeagues(text){
    this.state.searchText = text;
    this.setState({searchText: text});
  }

  openModal(){
    this.setState({modalOpened: true});
  }

  closeModal(){
    this.setState({modalOpened: false});
  }

  renderSearch(){
    return(
      Object.values(this.props.leagues).filter((a)=>{
        return(
          a.name.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
          (a.state != null && a.state.toLowerCase().includes(this.state.searchText.toLowerCase())) ||
          (a.country != null && a.country.toLowerCase().includes(this.state.searchText.toLowerCase()))
        )
      }).map((contact)=>(
        <Link
          to={`${this.props.game}/leagues/${contact.id}`}
          href={`${this.props.game}/leagues/${contact.id}`}
          onClick={()=>{this.props.selectLeague(this.props.leagues.indexOf(contact)); this.closeModal()}}
          key={"league_"+contact.name}
          style={{color: "white", textDecoration: "none"}}
        >
          <ListItem button onClick={()=>{}}>
            <ListItemIcon>
              <div style={{
                width: "32px", height: "32px", display: "inline-block", backgroundSize: "cover", backgroundRepeat: "no-repeat",
                backgroundPosition: "center", verticalAlign: "inherit", backgroundColor: "white", borderRadius: "6px", marginRight: "10px",
                backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/${this.props.game}/league_icon/${contact.id}.png)`,
                display: "flex", flexShrink: 0
              }}></div>
            </ListItemIcon>
            <ListItemText primary={contact.name} />
            <Typography>{contact.state}</Typography>
            {contact.wifi?
              <Wifi />
              :
              null}
          </ListItem>
          <Divider variant="inset" />
        </Link>
      ))
    )
  }

  renderTree(head, recursion=0){
    //console.log(head)
    if(head.leagues == null || head.subleagues == null){
      return;
    }
    return(
      <>
        {head.leagues.map((contact, i)=>(
          <Link
            to={`/${this.props.game}/leagues/${contact.id}`}
            href={`/${this.props.game}/leagues/${contact.id}`}
            onClick={()=>{this.props.selectLeague(this.props.leagues.indexOf(contact)); this.closeModal()}}
            key={"league_"+contact.name}
            style={{color: "white", textDecoration: "none"}}
          >
            <ListItem button onClick={()=>{}}>
              <ListItemIcon>
                <div style={{
                  width: "32px", height: "32px", display: "inline-block", backgroundSize: "cover", backgroundRepeat: "no-repeat",
                  backgroundPosition: "center", verticalAlign: "inherit", backgroundColor: "white", borderRadius: "6px", marginRight: "10px",
                  backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/games/${this.props.game}/league_icon/${contact.id}.png)`,
                  display: "flex", flexShrink: 0
                }}></div>
              </ListItemIcon>
              <ListItemText primary={contact.name} />
              <Typography>{contact.state}</Typography>
              {contact.wifi?
                <Wifi />
                :
                null}
            </ListItem>
            <Divider variant="inset" component="li" />
          </Link>
        ))}
        {Object.entries(head.subleagues).map((league, i) => (
          <>
            <ListItem button onClick={()=>{head.subleagues[league[0]].open = !head.subleagues[league[0]].open; this.setState(this.state);}}>
              <ListItemIcon>
                {league[1].icon?
                  <div style={{
                    width: "32px", height: "32px", display: "inline-block", backgroundSize: "cover", backgroundRepeat: "no-repeat",
                    backgroundPosition: "center", verticalAlign: "inherit", backgroundColor: "white", borderRadius: "6px", marginRight: "10px",
                    backgroundImage: `url(${league[1].icon})`,
                    display: "flex", flexShrink: 0
                  }}></div>
                  :
                  <Public />
                }
              </ListItemIcon>
              <ListItemText primary={league[1].name ? league[1].name : league[0]} />
              {head.subleagues[league[0]].open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Divider variant="inset" component="li" />
            <Collapse style={{paddingLeft: "32px"}} in={head.subleagues[league[0]].open} timeout="auto" unmountOnExit>
              {this.renderTree(league[1], recursion+1)}
            </Collapse>
          </>
        ))}
      </>
    )
  }

  render(){
    const { classes } = this.props;

    return(
      <HideOnScroll {...this.props}>
        <AppBar classes={{root: classes.leagueSelectorTopbar}} elevation={0} style={{
          position: "sticky", marginLeft: -8, marginTop: -8, width: "calc(100% + 16px)"
        }}>
          <Toolbar>
            <Button fullWidth onClick={()=>{this.openModal()}}>
              {this.state.leagues && this.state.leagues.length > 0 && this.props.selectedLeague != -1 ?
                <div style={{display: "flex", lineHeight: "32px", justifySelf: "left", width: "100%"}}>
                  <div style={{
                    width: "32px", height: "32px", display: "inline-block", backgroundSize: "cover", backgroundRepeat: "no-repeat",
                    backgroundPosition: "center", verticalAlign: "inherit", backgroundColor: "white", borderRadius: "6px", marginRight: "10px",
                    backgroundImage: `url(https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/games/${this.props.game}/league_icon/${this.props.leagues[this.props.selectedLeague].id}.png)`,
                    display: "flex", flexShrink: 0
                  }}></div>
                  <div style={{
                    flexShrink: 1, flexGrow: 1, textOverflow: "ellipsis", overflow: "hidden"
                  }}>{this.state.leagues[this.props.selectedLeague].name}</div>
                  {this.state.leagues[this.props.selectedLeague].state ?
                    <div style={{
                      width: "32px", height: "32px", display: "inline-block",
                      backgroundPosition: "center", verticalAlign: "inherit",
                      display: "flex", flexShrink: 0
                    }}>{this.state.leagues[this.props.selectedLeague].state}</div>
                    :
                    null
                  }
                  {
                    this.state.leagues[this.props.selectedLeague].wifi ? 
                      <div style={{
                        width: "24px", height: "24px", display: "inline-block", backgroundSize: "cover", backgroundRepeat: "no-repeat",
                        backgroundPosition: "center", verticalAlign: "inherit", borderRadius: "100%",
                        backgroundColor: "white", marginTop: "2px", marginRight: "4px",
                        display: "flex", flexShrink: 0
                      }}>
                        <div style={{
                          width: "16px", height: "16px", display: "inline-block", backgroundSize: "cover", backgroundRepeat: "no-repeat",
                          backgroundPosition: "center", verticalAlign: "inherit",
                          backgroundImage: `url(${process.env.PUBLIC_URL}/icons/wifi.svg)`,
                          position: "relative", top: "4px", left: "4px"
                        }}></div>
                      </div>
                    :
                      null
                  }
                  <div style={{
                    width: "24px", height: "24px", display: "inline-block",
                    display: "flex", flexShrink: 0, alignSelf: "center"
                  }}>
                    <Icon><ExpandMore /></Icon>
                  </div>
                </div>
                :
                "Loading..."
              }
            </Button>
          </Toolbar>

          <Hidden xsDown>
            <Tabs
              value={this.props.selectedTab}
              onChange={(event, value)=>this.props.handleTabChange(value)}
              centered
            >
              <Tab classes={{root: classes.topTabs}} value="ranking" label={i18n.t("Ranking")} />
              <Tab classes={{root: classes.topTabs}} value="players" label={i18n.t("players")} />
              <Tab classes={{root: classes.topTabs}} value="tournaments" label={i18n.t("Tournaments")} />
              <Tab classes={{root: classes.topTabs}} value="statistics" label={i18n.t("Statistics")} />
              <Tab classes={{root: classes.topTabs}} value="info" label={i18n.t("Info")} />
            </Tabs>
          </Hidden>

          <Dialog open={this.state.modalOpened} onClose={()=>{this.setState({modalOpened: false})}}>
            <DialogTitle>{i18n.t("select-league")}</DialogTitle>
            <DialogContent dividers>
              <TextField autoComplete={false} fullWidth label="Search" onChange={(event)=>{this.filterLeagues(event.target.value)}} />
              <List>
                {this.state.searchText <= 0 ?
                  this.renderTree(this.state.league_tree)
                  :
                  this.renderSearch()
                }
              </List>
            </DialogContent>
          </Dialog>
        </AppBar>
      </HideOnScroll>
    )
  }
};

export default withStyles(useStyles)(LeagueSelector)