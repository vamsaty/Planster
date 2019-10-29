import React, { useState,useEffect, Component } from "react";
import axios from "axios";
import { keys } from "@material-ui/core/styles/createBreakpoints";
import { Paper, CircularProgress,CardContent,Typography, ListItem, Divider, List} from '@material-ui/core';


class ListGroups extends Component{

    constructor(){
        super();
        this.state = {
            groups : [],
            loading : false
        }
    }

    componentWillMount = () =>{
        this.setState({
            loading : true
        });

        axios.get('http://localhost:5000/api/v1/groups/list/' + String(sessionStorage.getItem("userData"))).
        then(res => {
            const groupList = []
            const data = res.data.groups
            for(let x in data){
                // for( let v in data[x]){
                    groupList.push(data[x])
                // }
            }
            
            this.setState({
                loading : false,
                groups : groupList
            });

        });  
    }

    render(){

        let disp = (
            <p>It looks like you don't have any groups</p>
        );


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
            Groups = <Paper>{Groups}</Paper>;
        }
        if(this.state.loading){
            Groups = <CircularProgress />
            disp = null; 
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