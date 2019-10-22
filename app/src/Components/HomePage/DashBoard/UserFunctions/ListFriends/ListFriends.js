import React, { useState,useEffect, Component } from "react";
import axios from "axios";
import { keys } from "@material-ui/core/styles/createBreakpoints";
import { CircularProgress,CardContent,Typography, ListItem, Divider, List} from '@material-ui/core';


class ListFriends extends Component{

    constructor(){
        super();
        this.state = {
            friends : []
        }
    }

    listFriendHandler = () =>{
        axios.get('http://localhost:5000/api/v1/user/friends/' + String(sessionStorage.getItem("userData"))).
        then(res => {
            const friendList = []
            console.log(res.data.friends)
            for(let val in res.data.friends){
                console.log(res.data.friends[val])
                friendList.push(res.data.friends[val])
            }
            this.setState({
                friends : friendList
            })

        });  
    }

    render(){

        let disp = (
            
            <button onClick={this.listFriendHandler}>
                LIST FRIENDS
            </button>
        );
        // }

        let friends = null;

        if(this.state.friends){
            friends = (
                this.state.friends.map( (val, ind) => {
                    return (
                        <ListItem button>
                            {val}
                        </ListItem>
                    )
                })
            );
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