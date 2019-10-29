import React,{ Component } from 'react';
import { Box } from '@material-ui/core';

class DummyLogin extends Component{
    constructor(props){
        super(props);
        this.state = {
            ingredients : null
        };
    }

    render(){

        return(
            <>
                <Box component="span">
                    Username
                    <input type="text" value = {this.props.creds.user} onChange = {(e)=>this.props.changeUsername(e)} />
                </Box>
                
                
                <Box>
                    password
                    <input type="password" value = {this.props.creds.pass} onChange = {(e)=>this.props.changePassword(e)} />
                </Box>

                <button onClick={this.props.loginUser}>
                    Login
                </button>
            </>
        );


    }
    

}

export default DummyLogin;