import React from 'react';
import { Route, Link, NavLink } from 'react-router-dom';
import classes from './UserNavItem.module.css';
import { Button } from '@material-ui/core';

const userNavItem = (props) =>{
    let item = (
            <NavLink 
                to={props.link}
                exact={props.exact}
                activeClassName={classes.active}>
                    {props.children}
            </NavLink>
    );
    return(
        <li className={classes.UserNavItem}>
            <Button variant="outlined" color="default" style={{padding:'0'}}>
                {item}
            </Button>
        </li>
    );

}

export default userNavItem;