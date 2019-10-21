import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';

import Aux from '../_Aux/_Aux';

import classes from './Layout.module.css';
import TopBar from '../../components/HomePage/DashBoard/TopBar/TopBar'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import axios from 'axios';

class DashLayout extends Component {
    state = {
        showSideDrawer: false,
        loading : true,
        defaultPage : null
        
    }

    sideDrawerClosedHandler = () => {
        this.setState( { showSideDrawer: false } );
    }

    checkLogin(){
        if(sessionStorage.getItem("userData")){
            return true;
        }else{
            return false;
        }
    }

    componentDidMount(){
        this.setState({
            loading : true
        });

        // if(this.checkLogin()){
        //     console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")

        //     axios.get('http://localhost:5000/').
        //     then( (result) =>{
        //         console.log("dash data - ",result)
        //     });

        // }else{

        // }


    }

    sideDrawerToggleHandler = () => {
        this.setState( ( prevState ) => {
            return { showSideDrawer: !prevState.showSideDrawer };
        } );
    }

    render () {
        return (
          <>
            {this.props.children}
          </>
        )
    }
}

export default DashLayout;