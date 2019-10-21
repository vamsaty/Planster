import React from 'react';
import { NavLink,Link } from 'react-router-dom';
import classes from './NavigationItem.module.css';

const navigationItem = ( props ) => {

    let item = (
        <NavLink 
            to={props.link}
            exact={props.exact}
            activeClassName={classes.active}>
                {props.children}
        </NavLink>
    );

    if(props.logout){
        item = (
            <NavLink
                to = {props.link}
                onClick = {props.handleLogout}
                >

                    {props.children}

            </NavLink>
        );
    }

    return(
        <li className={classes.NavigationItem}>
          {item}
        </li>
    );
};

export default navigationItem;