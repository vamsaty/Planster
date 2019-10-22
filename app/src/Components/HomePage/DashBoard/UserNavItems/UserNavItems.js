import React, { Component } from 'react';
import classes from './UserNavItems.module.css';
import UserNavItem from './UserNavItem/UserNavItem';
import { withRouter, Link } from 'react-router-dom';
import { object } from 'prop-types';
import { Button } from '@material-ui/core';
import { GroupAddIcon } from '@material-ui/icons';

// import NavigationItem from './NavigationItem/NavigationItem';


class UserNavItems extends Component{
    constructor(){
        super();
    }

    render(){


        return(
            <ul className={classes.UserNavItems}>
                <UserNavItem link = {this.props.match.url+'/add-friends'}> Add Friends </UserNavItem>
                <UserNavItem link = {this.props.match.url+'/create-group'}> Create Group </UserNavItem>                
                <UserNavItem link = {this.props.match.url+'/list-group'}> Show Group </UserNavItem>
                <UserNavItem link = {this.props.match.url+'/list-friends'}> Show Friends </UserNavItem>
                {/* <UserInfo data = {this.state.userInfo} /> */}
            </ul>
        );
    };

}

export default withRouter(UserNavItems);