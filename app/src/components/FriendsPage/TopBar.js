import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar'
import { ListItem, Grid } from '@material-ui/core'
import plansterLogo from '../../assets/images/Planster.png'
import Tooltip from '@material-ui/core/Tooltip';
import back from '../../assets/images/back.png'
import logout from '../../assets/images/logout.png'
import { makeStyles } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {withRouter} from 'react-router-dom'
import Button from '@material-ui/core/Button';

const theme = createMuiTheme({
  palette: {
  secondary: { main: '#ffffff'}, 
    primary :{ main : '#061642'}
  },
});



class TopBar extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
    
     open:0,


     
    }
   
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.logout = this.logout.bind(this);
  
  }
  logout()
  {
    this.props.history.push('/')
  }
  

  handleOpen = () =>{
    this.setState({
        open:1,
     
    }) 
   
}
  handleClose = () =>{
    this.setState({
        open:0,
        
    }) 
   
}
    render() {
      //const { goBack } = this.props.navigation;
      return (
        <ThemeProvider theme={theme}>
        <div>
        <AppBar  color="secondary" position="fixed">
        <Grid container justify="center" direction="row" alignItems="center" >
        <Grid item>
                <img style={{width:"9em"}}  src={plansterLogo} alt="Logo" />
        </Grid>
        
       
       
        </Grid>
        <div>
        <Tooltip onClick={() => this.props.history.go(-1)} style={{cursor:"pointer",position:"fixed",top:"0.6em",left:"0.6em",width:"2.2em"}}   title="Back" >
        <img src={back} alt="Logo" />
        </Tooltip>
        <Button onClick={this.handleOpen} style={{cursor:"pointer",position:"fixed",right:"1em",top:"0.8em",width:"2.4em",padding:"2.5px"}}  variant="contained" color="primary" className={theme.button}>
               LOGOUT
                </Button>
       </div>
        </AppBar>


        <Dialog
     open={this.state.open}
     onClose={this.handleClose}
     aria-labelledby="alert-dialog-title"
     aria-describedby="alert-dialog-description"
     >
      <DialogTitle id="alert-dialog-title">{"Log Out"}</DialogTitle>
      <DialogContent>
       <DialogContentText id="alert-dialog-description">
         Are you sure you want to Log Out?
       </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={this.logout} color="primary">
         Yes
        </Button>
        <Button onClick={this.handleClose} color="primary" autoFocus>
         No
        </Button>
      </DialogActions>
      </Dialog>
        </div>
        </ThemeProvider>
      )
    }
  }
  
  export default withRouter(TopBar)
  