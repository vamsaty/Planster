import React, { useState,useEffect, Component } from "react";
import axios from "axios";
import { keys } from "@material-ui/core/styles/createBreakpoints";
import { CircularProgress,CardContent,Typography, ListItem, Divider, List} from '@material-ui/core';


class ListGroups extends Component{

    constructor(){
        super();
        this.state = {
            groups : []
        }
    }

    listFriendHandler = () =>{
        axios.get('http://localhost:5000/api/v1/groups/list/' + String(sessionStorage.getItem("userData"))).
        then(res => {
            const groupList = []
            const data = res.data.groups
            for(let x in data){
                for( let v in data[x]){
                    groupList.push(data[x][v])
                }
            }

            // for(let val in data){
            //     console.log(data)
            //     groupList.push(data)
            // }
            this.setState({
                groups : groupList
            })

        });  
    }

    render(){

        let disp = (
            
            <button onClick={this.listFriendHandler}>
                LIST GROUPS
            </button>
        );
        // }

        let Groups = null;

        if(this.state.groups){
            Groups = (
                this.state.groups.map( (val, ind) => {
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
                {Groups}
            </div>
        );
    }
};

export default ListGroups;