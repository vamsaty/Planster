import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar'
import { ListItem, Grid } from '@material-ui/core'
import plansterLogo from '../../assets/images/Planster.png'
import { makeStyles } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { Link,Route } from 'react-router-dom';
import Login from './Login/Login'
import Register from './Register/Register'

const theme = createMuiTheme({
    palette: {
    secondary: { main: '#ffffff'}, 
      primary :{ main : '#061642'}
    },
  });

  

class TopBar extends Component {

    render() {
      return (
        <ThemeProvider theme={theme}>
        <div>
          <AppBar  color="secondary" position="fixed">
          <Grid  >
            <Grid item>
              <img style={{width:"9em"}}  src={plansterLogo} alt="Logo" />
            </Grid>
            <Grid item style={{position:"fixed",right:"0px",margin:"10px"}}>
            <nav>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button style={{position:"relative",bottom:"4.5em",margin:"5px"}}  variant="contained" color="primary" className={theme.button}>
                LOGIN
                </Button>
              </Link>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Button style={{position:"relative",bottom:"4.5em",margin:"5px"}} variant="outlined" color="primary" className={theme.button}>
                REGISTER
                </Button>
              </Link>
            </nav>
            </Grid>
          </Grid>
          </AppBar>
        </div>
        </ThemeProvider>
      )
    }
  }
  
export default TopBar;
  