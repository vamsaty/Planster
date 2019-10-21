import React, { Component } from 'react';
import DashLayout from '../../../hoc/Layout/DashLayout';
import axios from 'axios';


import AddFriend from './UserFunctions/AddFriend/AddFriend';
import ListFriends from './UserFunctions/ListFriends/ListFriends';
import ListGroups from './UserFunctions/ListGroups/ListGroups';
import CreateGroup from './UserFunctions/CreateGroup/CreateGroup';
import Content from './UserFunctions/UserContent/UserContent';

import UserSideBar from './UserSideBar/UserSideBar';
import classes from './DashBoard.module.css';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';

class DashBoard extends Component{

    constructor(){
        super();
        this.state = {
            userInfo : {
                name : 'Satyam',
                age : 21,
                email : 'sae@gmail.com',
                address : 'asdfasdf'
            }
        }
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
            // this.props.history.push('/');
        }
    }

    showUser(){
        console.log(sessionStorage("userData"));
    }

    render(){
        

        const userFunctionalities = (
            <Switch>
                <Route path = {this.props.match.path+'/add-friends'}  component ={AddFriend} /> 
                <Route path = {this.props.match.path+'/create-group'}  component ={CreateGroup} /> 
                <Route path = {this.props.match.path+'/list-group'}  component ={ListGroups} /> 
                <Route path = {this.props.match.path+'/list-friends'}  component ={ListFriends} /> 
            </Switch>
        );

        return(
                <div className={classes.mainWrapper}>
                    <UserSideBar userInfo = {this.state.userInfo} />

                    <main className={classes.Content}>
                        
                        {userFunctionalities}

                    </main>
                    
                </div>
        );
    }

}

export default DashBoard;