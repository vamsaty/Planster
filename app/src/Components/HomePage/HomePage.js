import React, { Component } from 'react';
import './HomePage.css'
import { Redirect } from 'react-router-dom';
import DefaultHome from './DefaultHome/DefaultHome';
import DashBoard from './DashBoard/DashBoard';


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

        return(
            <div>    <div id="container">
            One Place Destination For All Your Trips.
            <div id="flip">
              <div><div>PLAN</div></div>
              <div><div>SCHEDULE</div></div>
              <div><div>TRACK</div></div>
              <div><div>EXPLORE</div></div>

            </div>
            
          </div>
          
          <p> a css3 animation demo</p></div>
        );
    }
}

export default HomePage;