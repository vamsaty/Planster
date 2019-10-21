import React, { Component } from 'react';
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
            this.props.history.push('/user');
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
            <h1>
                here we are
            </h1>

        );
    }
}

export default HomePage;