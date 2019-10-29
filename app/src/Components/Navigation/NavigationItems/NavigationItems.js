import React, { Component } from 'react';
import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

import {withRouter} from 'react-router-dom';


class NavigationItems extends Component {

    constructor(props){
        super(props);

        this.state = {
            showLogin : true
        }
    }

    componentWillMount(){
        
        if(sessionStorage.getItem("userData")){
            this.setState({
                showLogin : false
            });
        }else{
            this.setState({
                showLogin : true
            });
        }
        
    }

    logOut = () =>{
        
        sessionStorage.setItem("userData",'');
        sessionStorage.clear();
        console.log("LOGOUT")
        this.setState({
            showLogin : true
        });
        this.props.history.push("/");
    }
    

    render(){

        
        let displayLoginReg = (
            <>  
                <NavigationItem exact link="/">home</NavigationItem>
                <NavigationItem exact link="/login">login</NavigationItem>
                <NavigationItem exact link="/register">register</NavigationItem>
            </>
        );

        if(!this.state.showLogin){
            console.log("SHOW LOGIN CHECK")
            displayLoginReg = (
                <>
                    <NavigationItem exact link="/user" exact>home</NavigationItem>
                    <NavigationItem handleLogout = {this.logOut} logout link="/">logout</NavigationItem>
                </>
            );
        }
        
        
        return (
             <ul className={classes.NavigationItems}>
                {displayLoginReg}
            </ul>
        );
    };
};

export default withRouter(NavigationItems);
