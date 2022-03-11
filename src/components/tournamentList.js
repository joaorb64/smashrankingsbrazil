import React, { Component } from 'react'
import styles from './statistics.module.css'
import moment from "../../node_modules/moment-timezone/moment-timezone";
import i18n from '../locales/i18n';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

class TournamentList extends Component {
  state = {
  }

  componentDidMount() {
  }

  render (){
    return(
      <div>
        {this.props.tournaments ?
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>{i18n.t("Name")}</TableCell>
                    <TableCell>{i18n.t("Date")}</TableCell>
                    <TableCell align="right">{i18n.t("Participants")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.values(this.props.tournaments).sort((a,b)=>{return b.time - a.time}).map((tournament)=>(
                    <TableRow component="a" hover role="checkbox" style={{textDecoration: "none", color: "white"}} target="_blank" href={`https://braacket.com/tournament/${tournament.id}`}>
                      <TableCell>{
                        tournament.link ?
                          <img src={
                            tournament.link.includes("braacket") ? "https://braacket.com/favicon.ico" :
                            tournament.link.includes("smash.gg") ? "https://smash.gg/favicon.ico" :
                            tournament.link.includes("challonge") ? "https://assets.challonge.com/favicon-32x32.png" :
                            null
                          } width="16px" height="16px" />
                        :
                        null
                      }</TableCell>
                      <TableCell>{tournament.name}</TableCell>
                      <TableCell>{moment.unix(tournament.time).add(1, "day").format("DD/MM/YY")}</TableCell>
                      <TableCell align="right">{tournament.player_number}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          :
          null
        }
      </div>
    )
  }
};

export default TournamentList