import React, { Component } from 'react';
import DashLayout from '../../../hoc/Layout/DashLayout';
import axios from 'axios';

class DashBoard extends Component{

    state = {
        loggedIn : false
    }

    componentWillMount(){
        if(sessionStorage.getItem("userData")){
            this.setState({
                loggedIn : true
            });
        }else{
            this.props.history.push('/');
            this.setState({
                loggedIn : false
            });
        }
    }

    showUser(){
        console.log(sessionStorage("userData"));
    }

    render(){

        return(
            <DashLayout>
                <button onClick={this.showUser}>
                    get it
                </button>
                <h1>asdf</h1>
            </DashLayout>
        );
    }

}

export default DashBoard;