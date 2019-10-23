import React, { Component } from 'react';
import axios from 'axios';


import AddFriend from './UserFunctions/AddFriend/AddFriend';
import ListFriends from './UserFunctions/ListFriends/ListFriends';
import ListGroups from './UserFunctions/ListGroups/ListGroups';
import CreateGroup from './UserFunctions/CreateGroup/CreateGroup';

// import Cookies from 'universal-cookie';

import {ArrowForward,ArrowBack}  from '@material-ui/icons';
import {Button,CircularProgress} from '@material-ui/core';
import DehazeIcon from '@material-ui/icons/Dehaze';
import Fab from '@material-ui/core/Fab';

import UserSideBar from './UserSideBar/UserSideBar';
import classes from './DashBoard.module.css';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';

class DashBoard extends Component{

    constructor(){
        super();
        this.state = {
            userInfo : {
                name : null,
                age : null,
                email : null,
                address : null,
                groups : null
            },
            
            showBar : false,
            loading : true,
            loadingUserData : true
        }
    }


    getUserInfo = () => {
        axios.get('http://localhost:5000/api/v1/details/' + String(sessionStorage.getItem("userData"))).
        then(res => {
            const updatedInfo = res.data.details
            console.log(updatedInfo)
            this.setState({
                userInfo : updatedInfo,
                loadingUserData : false
            });
            
        });        
    }


    componentWillMount(){
        if(sessionStorage.getItem("userData")){
            this.setState({
                loggedIn : true,
                loadingUserData : true
            });
            
            this.getUserInfo();

        }else{
            this.setState({
                loggedIn : false
            });
        }
    }

    showUser(){
        console.log(sessionStorage("userData"));
    }

    render(){
        
        if(!sessionStorage.getItem("userData")){
            return(
                <Redirect to="/" />
            );
        }


        
        const userFunctionalities = (
            <Switch>

                <Route 
                    path = {this.props.match.path+'/add-friends'}  
                    component ={AddFriend} /> 

                <Route 
                    path = {this.props.match.path+'/create-group'}  
                    render ={(props)=><CreateGroup {...props} userInfo = {this.state.userInfo} /> } /> 
                
                <Route 
                    path = {this.props.match.path+'/list-group'}  
                    component ={ListGroups} /> 
                
                <Route 
                    path = {this.props.match.path+'/list-friends'}  
                    component ={ListFriends} />

            </Switch>
        );

        let buttonClass = classes.forward;
        let contentClass = [classes.Content, classes.Grow]
        let arrow = (
            <DehazeIcon  />
        )
        if(this.state.showBar){
            arrow = (
                <DehazeIcon />
            )
            buttonClass = classes.backward;
            contentClass = [classes.Content, classes.Shrink]
        }
        

        return(
                <div className={classes.mainWrapper}>

                    <Fab size="small" color="primary" className={buttonClass} onClick = {()=>{this.setState({ showBar : !this.state.showBar})}}>
                        {arrow}
                   </Fab>           

                    <UserSideBar
                        loading = {this.state.loadingUserData}
                        userInfo = {this.state.userInfo} 
                        show = {this.state.showBar}
                    />



                    <main className={contentClass.join(' ')}>
                        {userFunctionalities}
                    </main>
                    
                </div>
        );
    }

}

export default DashBoard;