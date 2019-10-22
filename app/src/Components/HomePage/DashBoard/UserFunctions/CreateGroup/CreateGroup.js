import React, { useState,useEffect, Component } from "react";
import axios from "axios";
import { keys } from "@material-ui/core/styles/createBreakpoints";

class CreateGroup extends Component{

    constructor(){
        super();
        this.state = {
            groupName : ''
        }
    }

    createGroupHandler = () =>{
        axios.post('http://localhost:5000/api/v1/groups/create/' + String(sessionStorage.getItem("userData")),{
            'name' : this.state.groupName
        }).
        then(res => {
            const updatedInfo = res.data
            console.log(res)
            this.setState({
                groupName : '',
            });
            
        });  
    }

    render(){

        // console.log("groups",formElementsArray)

        // if(formElementsArray.length === 0){
        let disp = (
            
            <button onClick={this.createGroupHandler}>
                CREATE GROUP
            </button>
        );
        // }

        return(
            <div>
                <input type="text" onChange={(e)=>{this.setState({groupName : e.target.value})}} value={this.state.groupName} />
                {disp}
            </div>
        );
    }
};

export default CreateGroup;