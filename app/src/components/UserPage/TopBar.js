import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar'
import { ListItem, Grid } from '@material-ui/core'
import plansterLogo from '../../assets/images/Planster.png'
import { makeStyles } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';


const theme = createMuiTheme({
    palette: {
      primary: { main: '#ffffff'}, 
      
    }
     
  });

  

class TopBar extends Component {

    render() {
      return (
        <ThemeProvider theme={theme}>
        <div>
        <AppBar  color="primary" position="fixed">
        <Grid container justify="center" direction="row" alignItems="center" >
        <Grid item>
                <img style={{width:"9em"}}  src={plansterLogo} alt="Logo" />
        </Grid>
        </Grid>
        </AppBar>
        </div>
        </ThemeProvider>
      )
    }
  }
  
  export default TopBar
  