import React, {useState, useEffect} from "react";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {withStyles, makeStyles} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {Typography} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {withRouter} from "react-router-dom";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import {usernames} from "../../Assets/data.json";
import UsernameNotFound from "../UsernameNotFound/usernameNotFound";

const MemberReports = (props) => {
  const theme = createMuiTheme({
    palette: {
      type: "dark",
    },
  });

  let path = props.location.pathname;
  let username = path.replace(/\/\w+\//, "");
  let memberName = usernames[username];

  let [loading, setLoading] = useState(true);
  const [report, setReport] = useState([]);

  async function fetchUrl(url) {
    const response = await fetch(url);
    const data = await response.json();
    setReport(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchUrl(`https://polar-depths-36905.herokuapp.com/reports/${username}`);
  }, [username]);

  if (username in usernames === false) loading = false;

  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.background.default,
      },
    },
  }))(TableRow);

  let rows = [];
  if (Object.keys(report).length > 0) {
    function createData(id, date, osl, past, future, fun, reporter) {
      return {id, date, osl, past, future, fun, reporter};
    }
    Object.keys(report).forEach((currentDate) => {
      if (report[currentDate]["timeStamp"]) {
        const {osl, past, future, fun, reporter, date} = report[currentDate];
        rows.push(
          createData(
            date._seconds,
            new Date(date._seconds * 1000).toUTCString().substring(4, 16),
            osl[0].toUpperCase() + osl.slice(1),
            past.replace(/\n/g, "<br>"),
            future.replace(/\n/g, "<br>"),
            fun.replace(/\n/g, "<br>"),
            reporter
          )
        );
      }
    });
  }

  function sortRowsByDate(array) {
    return array.sort(function(a, b) {
      var x = a.id;
      var y = b.id;
      return x > y ? -1 : x < y ? 1 : 0;
    });
  }

  rows = sortRowsByDate(rows);

  const useStyles = makeStyles({
    container: {
      "&::-webkit-scrollbar": {
        width: "0.4em",
      },
      "&::-webkit-scrollbar-track": {
        boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
        webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgb(81, 81, 81);",
        outline: "1px solid rgb(81, 81, 81);",
      },
    },
    table: {
      minWidth: 1100,
    },
    space: {
      marginBottom: 30,
    },
    spinner: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: "-50px",
      marginLeft: "-50px",
    },
  });

  const classes = useStyles();

  return (
    <>
      {loading ? (
        <Loader
          type="Puff"
          color="#EEE"
          height={100}
          width={100}
          className={classes.spinner}
        />
      ) : username in usernames ? (
        <ThemeProvider theme={theme}>
          <Typography
            color="textPrimary"
            align="center"
            variant="h2"
            className="heading"
          >
            {memberName}
          </Typography>
          <div className={classes.space} />
          <TableContainer className={classes.container} component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Date </StyledTableCell>
                  <StyledTableCell align="center">Visited OSL </StyledTableCell>
                  <StyledTableCell>Last Week </StyledTableCell>
                  <StyledTableCell>This Week </StyledTableCell>
                  <StyledTableCell>Fun Stuff </StyledTableCell>
                  <StyledTableCell align="center">Reporter </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <StyledTableRow key={row.date}>
                    <StyledTableCell align="center">{row.date}</StyledTableCell>
                    <StyledTableCell align="center">{row.osl}</StyledTableCell>
                    <StyledTableCell>
                      <div dangerouslySetInnerHTML={{__html: row.past}} />
                    </StyledTableCell>
                    <StyledTableCell>
                      <div dangerouslySetInnerHTML={{__html: row.future}} />
                    </StyledTableCell>
                    <StyledTableCell>
                      <div dangerouslySetInnerHTML={{__html: row.fun}} />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.reporter}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ThemeProvider>
      ) : (
        <UsernameNotFound />
      )}
    </>
  );
};

export default withRouter(MemberReports);
