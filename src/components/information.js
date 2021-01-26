import { faFacebook, faTwitch, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Paper } from '@material-ui/core'
import React, { Component } from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import styles from './statistics.module.css'

let useStyles = (theme) => ({
  root: {
    padding: theme.spacing(3, 2),
  },
});

class Information extends Component {
  state = {
    
  }

  componentDidMount() {
    console.log(this.props.info)
  }

  render (){
    const { classes } = this.props;

    return(
      <Paper className={classes.root}>
        {this.props.info ?
          <>
            <Typography noWrap gutterBottom variant="body1" component="h2">
              <a href={"https://braacket.com/league/" + this.props.info.id} style={{color: "white", textDecoration: "none"}}>
                <FontAwesomeIcon icon={faExternalLinkSquareAlt} />&nbsp;
                Braacket
              </a>
            </Typography>
            {this.props.info.twitter ?
              <Typography noWrap gutterBottom variant="body1" component="h2">
                <a href={this.props.info.twitter} style={{color: "white", textDecoration: "none"}}>
                  <FontAwesomeIcon icon={faTwitter} />&nbsp;
                  {this.props.info.twitter}
                </a>
              </Typography>
              :
              null
            }
            {this.props.info.facebook ?
              <Typography noWrap gutterBottom variant="body1" component="h2">
                <a href={this.props.info.facebook} style={{color: "white", textDecoration: "none"}}>
                  <FontAwesomeIcon icon={faFacebook} />&nbsp;
                  {this.props.info.facebook}
                </a>
              </Typography>
              :
              null
            }
            {this.props.info.twitch ?
              <Typography noWrap gutterBottom variant="body1" component="h2">
                <a href={this.props.info.twitch} style={{color: "white", textDecoration: "none"}}>
                  <FontAwesomeIcon icon={faTwitch} />&nbsp;
                  {this.props.info.twitch}
                </a>
              </Typography>
              :
              null
            }
            {this.props.info.youtube ?
              <Typography noWrap gutterBottom variant="body1" component="h2">
                <a href={this.props.info.youtube} style={{color: "white", textDecoration: "none"}}>
                  <FontAwesomeIcon icon={faYoutube} />&nbsp;
                  {this.props.info.youtube}
                </a>
              </Typography>
              :
              null
            }
          </>
        :
          null
        }
      </Paper>
    )
  }
};

export default withStyles(useStyles)(Information)