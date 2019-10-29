import React, { useState,useEffect, Component } from "react";
import axios from "axios";
import { keys } from "@material-ui/core/styles/createBreakpoints";
import {Paper,CircularProgress,CardContent,Typography, ListItem, Divider, List} from '@material-ui/core';


class ListFriends extends Component{

    constructor(){
        super();
        this.state = {
            friends : [],
            loading : false
        }
    }
    
    componentWillMount = () =>{
        this.setState({
            loading : true
        })
        axios.get('http://localhost:5000/api/v1/user/friends/' + String(sessionStorage.getItem("userData"))).
        then(res => {
            const friendList = []
            console.log(res.data.friends)
            for(let val in res.data.friends){
                console.log(res.data.friends[val])
                friendList.push(res.data.friends[val])
            }
            this.setState({
                friends : friendList,
                loading : false
            })

        });  
    }

    render(){

        let disp = (
            <p> FRIENDS </p>
        );

        let friends = <p>ALONE</p> ;

        if(this.state.friends){
            friends = (
                this.state.friends.map( (val, ind) => {
                    return (
                        <>
                        <Paper>
                            <ListItem button>
                                {val}
                            </ListItem>
                        </Paper>
                        <br></br>
                        </>
                    )
                })
            );
        }
        if(this.state.loading){
            friends = <CircularProgress />
            disp = null;
        }

        if(this.state.friends.length){
            disp = <p>No friends</p>;
        }

        return(
            <div>
                {disp}
                {friends}
            </div>
        );
    }
};

export default ListFriends;