import React, { Component } from 'react';
import DashLayout from '../../../hoc/Layout/DashLayout';


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

    render(){


        return(
            <DashLayout>
                <p>asdf</p>
            </DashLayout>
        );
    }

}

export default DashBoard;