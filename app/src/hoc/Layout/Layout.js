import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';

import Aux from '../_Aux/_Aux';
// import Aux from '../../hoc/_Aux/_Aux'
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';

// import AppToolBar from '../../components/Navigation/Toolbar/AppToolBar';

import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';


class Layout extends Component {
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

    // handleDrawerOpen = () => {
    //     setOpen(true);
    // };
    
    // handleDrawerClose = () => {
    //     setOpen(false);
    // };

    render () {
        return (
            <Aux>
                <Toolbar  drawerToggleClicked={this.sideDrawerToggleHandler} />
                <SideDrawer
                    open={this.state.showSideDrawer}
                    closed={this.sideDrawerClosedHandler} />
                <main className={classes.Content}>

                    {this.props.children}
                    
                </main>
            </Aux>
        )
    }
}

export default Layout;