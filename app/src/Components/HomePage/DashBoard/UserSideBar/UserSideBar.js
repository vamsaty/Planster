import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import classes from './UserSideBar.module.css';
import UserNavItems from '../UserNavItems/UserNavItems';

import Card from '@material-ui/core/Card';

import axios from 'axios';
import { identifier } from '@babel/types';
import { element, instanceOf } from 'prop-types';
import { CircularProgress,CardContent,Typography, ListItem, Divider, List} from '@material-ui/core';
// import {Button} from '@material-ui/core';

import { Face } from '@material-ui/icons';

class UserSideBar extends Component{

    constructor(){
        super();
        this.state = {
            userInfo : {
                name : null,
                age : null,
                email : null,
                address : null
            },
        }
        
    }

    render(){

        const fetchedDetails = []
        const data = {...this.props.userInfo}
        
        for(let x in data){
            fetchedDetails.push({
                id : x,
                config : data[x]
            })
        }

        let userInfo = (
            <Card>
                <CardContent>
                    <List>
                        <ListItem><Face /></ListItem>
                {
                    fetchedDetails.map(info => {
                        if(info.id != "groups"){
                            return(   
                                <ListItem button dense>
                                <>
                                    <Typography component ="h5" color="textPrimary" gutterBottom>
                                        {info.id} : {data[info.id]}
                                    </Typography>
                                </>
                                </ListItem>
                            )
                        }
                    })
                }
                </List>
                </CardContent>
            </Card>
        )
        
        let attatchedClasses = [classes.sideBar, classes.Close];
        if(this.props.show){
            attatchedClasses = [classes.sideBar, classes.Open];
        }

        if(this.props.loading){
            userInfo = <CircularProgress className={classes.progress} />
        }

        return(
            <div className={attatchedClasses.join(' ')}>
                {userInfo}
                <Divider variant="fullWidth"/>
                <Divider />
                <Card>
                    <UserNavItems userInfo = {this.props} />
                </Card>
                
            </div>
    
        );

    }
}

export default UserSideBar;