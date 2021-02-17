import React, { Component, useEffect } from 'react'
import { Link, NavLink, Redirect, Route, Switch } from 'react-router-dom'
import styles from './topbar.module.css'
import i18n from '../locales/i18n';
import { faHome, faUsers, faMap, faCalendar, faCoins, faInfoCircle, faInfo, faChartLine, faTrophy, faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';
import { Drawer, makeStyles, useTheme, withStyles, SwipeableDrawer, Box, Chip } from '@material-ui/core';

import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Contacts from './contacts';
import About from './about';
import Mapa from './map';
import Statistics from './statistics';
import Granblue from './granblue';
import Players from './players';
import NextTournaments from './nextTournaments';
import Matcherino from './matcherino';
import Clips from './clips';
import HeadToHead from './HeadToHead';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    zIndex: 999
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    maxWidth: "100%"
  },
  navLinkItem: {
    '&:hover': {
      color: "inherit",
      textDecoration: "none"
    }
  },
  ListItemIcon: {
    minWidth: 42
  }
}));

function TopBar(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const[game, setGame] = React.useState(props.game);
  const[allplayers, setAllplayers] = React.useState([]);
  const[alltournaments, setAllTournaments] = React.useState([]);
  const[userCountry, setUserCountry] = React.useState(null);

  const[leagues, setLeagues] = React.useState([]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/out/'+game+'/allleagues.json')
    .then(res => res.json())
    .then((data) => {
      Object.keys(data).forEach(league => {
        setLeagues(leagues => [...leagues, {
          id: league,
          name: data[league].name,
          region: data[league].region,
          state: data[league].state,
          city: data[league].city,
          country: data[league].country,
          wifi: data[league].wifi,
          twitter: data[league].twitter,
          twitch: data[league].twitch,
          youtube: data[league].youtube,
          facebook: data[league].facebook,
          latlng: data[league].latlng
        }]);
      });
    })
    .catch(console.log)

    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/out/'+game+'/allplayers.json')
    .then(res => res.json())
    .then((data) => {
      setAllplayers(data);
    })
    .catch(console.log)

    fetch('https://raw.githubusercontent.com/joaorb64/tournament_api/multigames/out/'+game+'/alltournaments.json')
    .then(res => res.json())
    .then((data) => {
      setAllTournaments(data);
    })
    .catch(console.log)

    // Get user country
    fetch('http://get.geojs.io/v1/ip/country.json').then(res => res.json()).then((data) => {
      if(data && data.country){
        setUserCountry(data.country);
      }
    }).catch(console.log())
  }, [])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeDrawer = () => {
    setMobileOpen(false);
  };

  const scrollToTop = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  const drawer = (
    <div style={{height: "100%"}}>
      <div className={classes.toolbar} style={{display: "flex", padding: 8}}>
        <Box style={{alignSelf: "center"}}>
          <Typography variant="h6" noWrap style={{display: "flex"}}>
            <img src="/favicon.svg" style={{height: "26px", marginRight: "8px"}}></img>
            PowerRankings
          </Typography>
        </Box>
      </div>
      <Divider />
      <List>
        <ListItem onClick={()=>{scrollToTop(); closeDrawer();}} className={classes.navLinkItem} button component={NavLink} activeClassName="Mui-selected" to={"/"+game+"/leagues/"}>
          <ListItemIcon className={classes.ListItemIcon}><FontAwesomeIcon icon={faTrophy}/></ListItemIcon>
          <ListItemText primary={i18n.t("leagues")} />
        </ListItem>

        <ListItem onClick={()=>{scrollToTop(); closeDrawer();}} className={classes.navLinkItem} button component={NavLink} activeClassName="Mui-selected" to={"/"+game+"/players/"}>
          <ListItemIcon className={classes.ListItemIcon}><FontAwesomeIcon icon={faUsers}/></ListItemIcon>
          <ListItemText primary={i18n.t("players")} />
        </ListItem>

        <ListItem onClick={()=>{scrollToTop(); closeDrawer();}} className={classes.navLinkItem} button component={NavLink} activeClassName="Mui-selected" to={"/"+game+"/headtohead/"}>
          <ListItemIcon className={classes.ListItemIcon}><FontAwesomeIcon icon={faExchangeAlt}/></ListItemIcon>
          <ListItemText primary={i18n.t("headtohead")} />
          <Chip label="Beta!" size="small" color="secondary" />
        </ListItem>

        <ListItem onClick={()=>{scrollToTop(); closeDrawer();}} className={classes.navLinkItem} button component={NavLink} activeClassName="Mui-selected" to={"/"+game+"/map/"}>
          <ListItemIcon className={classes.ListItemIcon}><FontAwesomeIcon icon={faMap}/></ListItemIcon>
          <ListItemText primary={i18n.t("map")} />
        </ListItem>

        <ListItem onClick={()=>{scrollToTop(); closeDrawer();}} className={classes.navLinkItem} button component={NavLink} activeClassName="Mui-selected" to={"/"+game+"/nexttournaments/"}>
          <ListItemIcon className={classes.ListItemIcon}><FontAwesomeIcon icon={faCalendar}/></ListItemIcon>
          <ListItemText primary={i18n.t("next-tournaments")} />
        </ListItem>

        <ListItem onClick={()=>{scrollToTop(); closeDrawer();}} className={classes.navLinkItem} button component={NavLink} activeClassName="Mui-selected" to={"/"+game+"/clips/"}>
          <ListItemIcon className={classes.ListItemIcon}><FontAwesomeIcon icon={faTwitch}/></ListItemIcon>
          <ListItemText primary={"Top Clips"} />
        </ListItem>

        <ListItem onClick={()=>{scrollToTop(); closeDrawer();}} className={classes.navLinkItem} button component={NavLink} activeClassName="Mui-selected" to={"/"+game+"/matcherino/"}>
          <ListItemIcon className={classes.ListItemIcon}><FontAwesomeIcon icon={faCoins}/></ListItemIcon>
          <ListItemText primary={"Matcherino"} />
        </ListItem>
        
        <ListItem onClick={()=>{scrollToTop(); closeDrawer();}} className={classes.navLinkItem} button component={NavLink} activeClassName="Mui-selected" to={"/"+game+"/about/"}>
          <ListItemIcon className={classes.ListItemIcon}><FontAwesomeIcon icon={faInfoCircle}/></ListItemIcon>
          <ListItemText primary={i18n.t("about")} />
        </ListItem>
      </List>

      <Box style={{position: "absolute", bottom: 0, padding: 8, display: "flex", flexWrap: "wrap"}}>
        <div style={{flexGrow: 1, margin: 2}}>
          By João "Shino" (joaorb64@gmail.com, <a style={{color: "white"}} href="https://twitter.com/joao_shino">@joao_shino</a>) <br/>
        </div>
        <div style={{flexGrow: 0, margin: 2}}>
          <a href='https://ko-fi.com/W7W22YK26' target='_blank'>
            <img style={{border: 0, height: 32}} src='https://cdn.ko-fi.com/cdn/kofi1.png?v=2' border='0' alt='Buy Me a Coffee at ko-fi.com'></img>
          </a>
        </div>
        <div style={{flexGrow: 0, margin: 2}}>
          <a href="https://picpay.me/joaorb64">
            <img src="/images/donate_picpay.png" style={{height: 32, borderRadius: 5}}></img>
          </a>
        </div>
      </Box>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Hidden mdUp>
        <AppBar id="topbar" position="fixed" className={classes.appBar} elevation={0}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <img src="/favicon.svg" style={{height: "26px", marginRight: "8px"}}></img>
            <Typography variant="h6" noWrap>
              PowerRankings
            </Typography>
          </Toolbar>
        </AppBar>
      </Hidden>
      <nav className={classes.drawer}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden mdUp implementation="css">
          <SwipeableDrawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onOpen={handleDrawerToggle}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </SwipeableDrawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <Hidden mdUp>
          <div className={classes.toolbar} />
        </Hidden>
        <Switch>
          <Route path="/:game/leagues/:id?/:tab?/:player_id?" exact render={
            (history) => 
              <>
                <Contacts game={history.match.params["game"]} contacts={leagues} allplayers={allplayers} alltournaments={alltournaments} usercountry={userCountry} match={history}></Contacts>
              </>
          } />
          <Route path="/:game/players/:player_id?" exact render={
            (history) => 
              <>
                <Players game={history.match.params["game"]} leagues={leagues} alltournaments={alltournaments} allplayers={allplayers} match={history.match} history={history.history} />
              </>
          } />
          <Route path="/:game/headtohead/:player_id?" exact render={
            (history) => 
              <>
                <HeadToHead game={game} leagues={leagues} alltournaments={alltournaments} allplayers={allplayers} match={history.match} history={history.history} />
              </>
          } />
          <Route path="/:game/map/" exact render={(history) => <Mapa game={game} allplayers={allplayers} leagues={leagues} />} />
          <Route path="/:game/matcherino/:country?" exact render={(history) => <Matcherino game={game} match={history.match} history={history.history} />} />
          <Route path="/:game/nexttournaments/:country?" exact render={(history) => <NextTournaments game={game} match={history.match} history={history.history} />} />
          <Route path="/:game/clips/:lang?" exact render={(history) => <Clips game={game} match={history.match} history={history.history} />} />
          <Route path="/:game/about/" exact render={(history) => <About />} />
          <Redirect to={"/"+props.game+"/leagues/"} />
        </Switch>

        <Route path="/" render={({location}) => {
          if(window){
            if ("ga" in window) {
              if ("getAll" in window.ga) {
                let tracker = window.ga.getAll()[0];
                if (tracker)
                  tracker.send('pageview', location.pathname);
              }
            }
            return "";
          }
        }} />
      </main>
    </div>
  );
}

export default TopBar;