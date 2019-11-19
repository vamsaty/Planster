import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TopBar from './TopBar';
import Navigation from './Navigation'
import Groups from './Groups'
import Friends from './Friends';
import Tags from './Tags'
import axios from "axios";

const styles = theme => ({
  root: {
    display:"flex"
  },
  paper: {
    padding: 20,
    margin: 30,
    textAlign: 'center',
  },
});


class FriendsPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
       navigate:"groups",
       latitude:0,
       longitude:0,
    }
    this.handleNavigation= this.handleNavigation.bind(this);
    this.setLocation=this.setLocation.bind(this);
  }

  setLocation()
  {
    navigator.geolocation.getCurrentPosition(
      position => {
        const location = JSON.stringify(position);
        console.log(position)
        let lat=position.coords.latitude
        let long =position.coords.longitude
      this.setState({latitude:position.coords.latitude,longitude:position.coords.longitude})
        
  
      },
      error => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    
    axios.post('http://localhost:5000/api/v1/setlocation/'+String(sessionStorage.getItem("Name")),
      {'latitude':this.state.latitude ,'longitude':this.state.longitude })
      .then( response => {
        })
        .catch(error => {
         
        });
      
  }
  handleNavigation= (nav) => {
    this.setState({navigate:nav});
  }
  
  componentDidMount() {
    this.setLocation()
    setTimeout(this.setLocation,3000)
    //setInterval(this.setLocation, 10000);
  }
  render(){
    const { classes } = this.props;
    let middle;
    if(this.state.navigate=="groups")
      {
        middle = (
          <div>
          <Paper className={classes.paper}>
            <Groups />
          </Paper>
          
          </div>
        );
      }
      if(this.state.navigate=="friends")
      {
        middle = (
          <div>
          <Paper className={classes.paper}>
            <Friends />
          </Paper>
          
          </div>
        );
      }


    return (
      <Paper style={{margin:"2em",height:"32em",backgroundColor:"#516b7761"}}>  <div className={classes.root}>
        <TopBar/>
        <Grid container spacing={3} style={{position:"relative",top:20}} >
          <Grid item lg={4} style={{position:"fixed"}}>
            <Navigation handleNavigation={this.handleNavigation}/>
          </Grid>
          <Grid item lg={4} style={{position:"relative",left:350}}>
          <div>
          <Paper className={classes.paper}>
            <Groups />
          </Paper>
          
          </div>
          </Grid>
          <Grid item lg={4} style={{position:"relative",left:310}}>
          <div>
          <Paper className={classes.paper}>
            <Friends />
          </Paper>
          
          </div>
          
          </Grid>
        </Grid>
    </div>
    </Paper>
  );
}
}

export default withStyles(styles)(FriendsPage);