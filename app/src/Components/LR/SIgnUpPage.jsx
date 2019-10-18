import React, { Component } from 'react';
import SignInSide from '../Login/Login';
import appcss from '../../Containers/App.module.css';
import Login from '../Login/Login';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Register from '../Register/Register';

class SignUpPage extends Component{
    constructor(){
        super();
        this.state = {
            
            showLogin : false,
            showSignUp : false

        }
    }

    
    toggleLoginHandler=()=>{
        const loginVal = this.state.toggleLogin;
        this.setState({
            showLogin : true,
            showSignUp : false
        })
    }

    toggleSignupHandler=()=>{
        const signupVal = this.state.toggleSignup;
        this.setState({
            showLogin : false,
            showSignup : true
        })
    }

    render(){

        let contentToShow = null;

        if(!this.props.displayPage){

            contentToShow = (
                <>
                    <Button variant="contained" 
                        color="primary" 
                        className={appcss.homeButton} 
                        onClick={this.toggleLoginHandler}
                    >
                        LOG IN
                    </Button>
            
                    <Button variant="contained" 
                        color="secondary" 
                        className={appcss.homeButton} 
                        onClick={this.toggleSignupHandler}
                    >
                        SIGN UP
                    </Button>
                </>
            );

        }else if(this.state.showLogin){
            contentToShow = (
                <Login />
            );
        }else if(this.state.showSignUp){
            contentToShow = (
                <Register 
                    showSignup={this.toggleSignupHandler}
                />
            );
        }

        return (
            <>
                <Box color={"text.primary"} className={appcss.mainWrapper}>
                    {contentToShow}
                </Box>
            </>
        );
    }


}

export default SignUpPage;