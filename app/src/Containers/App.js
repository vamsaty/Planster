import React,{Component} from 'react';
// import logo from '../logo.svg';
import './App.css';

import axios from 'axios';
import DummyLogin from './DummyLogin';


// let express = require('express');
// let cors = require('cors');
  
// app = 

class App extends Component{
  
  constructor(){
    super();

    this.state = {
      loginInput : {
        username : '',
        password : ''
      }
    }

  }
  
  updateUsernameHandler = (e) =>{
    const newUsername = e.target.value;
    const newLogin = this.state.loginInput;
    newLogin.username = newUsername;

    this.setState({
      loginInput : newLogin
    });

  }
  
  updatePasswordHandler = (e) =>{
    const newPassword = e.target.value;
    const newLogin = this.state.loginInput;
    newLogin.password = newPassword;

    this.setState({
      loginInput : newLogin
    });
    
  }

  submitLoginRequest = (e) => {
    console.log(this.state.loginInput)
    e.preventDefault();
    
    axios.post('http://localhost:5000/login',{
      username : this.state.loginInput.username,
      password : this.state.loginInput.password
    }).then((response)=>{
        console.log(response);
    })

  }

  render(){
    

    return (
      <>
        <DummyLogin 
          creds = {this.state.loginInput}
          changeUsername = {(e)=>this.updateUsernameHandler(e)}
          changePassword = {(e)=>this.updatePasswordHandler(e)}
          loginUser = {(e)=>this.submitLoginRequest(e)}

        />

      </>
    );
  }
}

export default App;
