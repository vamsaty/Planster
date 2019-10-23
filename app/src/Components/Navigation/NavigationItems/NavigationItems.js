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
        this.setState({
            showLogin : true
        });
        this.props.history.push("/");
    }
    

    render(){

        
        let displayLoginReg = (
            <>
                
                <NavigationItem home link="/">home</NavigationItem>
                <NavigationItem link="/login">login</NavigationItem>
                <NavigationItem link="/register">register</NavigationItem>
            </>
        );

        if(!this.state.showLogin){
            displayLoginReg = (
                <>
                    <NavigationItem exact home link="/user" exact>home</NavigationItem>
                    <NavigationItem logout handleLogout = {this.logOut} link="/" >logout</NavigationItem>
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
