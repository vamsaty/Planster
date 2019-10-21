import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';

import Aux from '../_Aux/_Aux';

import classes from './Layout.module.css';
import TopBar from '../../components/HomePage/DashBoard/TopBar/TopBar'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';


class DashLayout extends Component {
    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState( { showSideDrawer: false } );
    }

    sideDrawerToggleHandler = () => {
        this.setState( ( prevState ) => {
            return { showSideDrawer: !prevState.showSideDrawer };
        } );
    }

    render () {
        return (
          <>

          </>
        )
    }
}

export default DashLayout;