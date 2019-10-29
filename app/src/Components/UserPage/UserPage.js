import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TopBar from './TopBar';
import Navigation from './Navigation'
import Groups from './Groups'
import Friends from './Friends';
import Tags from './Tags'


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


class UserPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
       navigate:"profile"
    }
    this.handleNavigation= this.handleNavigation.bind(this);
  }


  handleNavigation= (nav) => {
    this.setState({navigate:nav});
  }
  
  render(){
    const { classes } = this.props;
    let middle;
    if(this.state.navigate=="profile")
      {
        middle = (
          <div>
          <Paper className={classes.paper}>
            <Groups />
          </Paper>
          <Paper className={classes.paper}>
            <Friends/>
          </Paper>
          </div>
        );
      }


    return (
      <div className={classes.root}>
        <TopBar/>
        <Grid container spacing={3} style={{position:"relative",top:20}} >
          <Grid item lg={3} style={{position:"fixed"}}>
            <Navigation handleNavigation={this.handleNavigation}/>
          </Grid>
          <Grid item lg={6} style={{position:"relative",left:350}}>
            {middle}
          </Grid>
          <Grid item lg={3} style={{position:"relative",left:310}}>
            <Paper className={classes.paper} style={{position:"fixed",top:"4em"}}>
              <Tags />
            </Paper>
          </Grid>
        </Grid>
    </div>
  );
}
}

export default withStyles(styles)(UserPage);