import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import classes from './UserSideBar.module.css';
import UserNavItems from '../UserNavItems/UserNavItems';

import axios from 'axios';
import { identifier } from '@babel/types';

class UserSideBar extends Component{

    constructor(){
        super();
        
    }

    componentWillMount(){
        axios.get('http://localhost:5000/').
        then(res => {

        });
    }

    render(){



        const fetchedDetails = []
        const data = {...this.props.userInfo}
        for(let x in data){
            fetchedDetails.push(
                ...data[x],
            )
        }
        console.log(data)

        return(
            <div className={classes.sideBar}>
                {/* <ul> */}
                    {/* {userInfo} */}
                {/* </ul> */}
                <p>
                    UserDetails
                </p>
                <UserNavItems userInfo = {this.props} />
                
            </div>
        );

    }
}

export default UserSideBar;