import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import TopBar from './TopBar';
import { withStyles } from '@material-ui/styles';


const styles = theme => ({
    heading: {
    fontFamily:'Quicksand',
    fontSize:"3em",
    fontWeight:"bold",
    textAlign:"center",
    color:"#0A2151 "
    },
    subheading :{
    fontFamily:'Quicksand',
    fontSize:"1.4em",
    textAlign:"center",
    fontWeight:"bold",
    }
  });

  
class HomePage extends Component{

    constructor(){
        super();
        this.state = {
            loggedIn : false
        };
    }

    
    componentWillMount(){
        if(sessionStorage.getItem("userData")){
            this.setState({
                loggedIn : true
            });
        }else{
            this.setState({
                loggedIn : false
            });
        }
    }

    render(){
        const { classes } = this.props;

        return(
            
            <div >    
            <TopBar/>
            <div className={classes.heading}>
            One Place Destination For All Your Trips.
            </div><div><br/></div>
            <div className={classes.subheading}>
              <span style={{color:"#FF5733 "}}>PLAN.</span>
              <span style={{color:"#FFC300 "}}>  SCHEDULE.</span>
              <span style={{color:"#28B463 "}}>  TRACK.</span>
              <span style={{color:"#6C3483  "}}>  EXPLORE.</span>
            </div>
          </div>
        );
    }
}

export default withStyles(styles)(HomePage);