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
    color:"#051d50 "
    },
    subheading :{
    fontFamily:'Quicksand',
    fontSize:"1.9em",
    textAlign:"center",
    fontWeight:"bolder",
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
              <span style={{color:"#91190D",fontWeight:"bolder"}}>PLAN.</span>
              <span style={{color:"#b17f0c"}}>  SCHEDULE.</span>
              <span style={{color:"#094614"}}>  TRACK.</span>
              <span style={{color:"#6C3483  "}}>  EXPLORE.</span>
            </div>
          </div>
        );
    }
}

export default withStyles(styles)(HomePage);