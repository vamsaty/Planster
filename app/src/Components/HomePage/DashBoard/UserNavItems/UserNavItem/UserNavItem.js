import React from 'react';
import { Route, Link, NavLink } from 'react-router-dom';
import classes from './UserNavItem.module.css';

const userNavItem = (props) =>{
    let item = (
        <Link 
            to={props.link}
            exact={props.exact}
            activeClassName={classes.active}>
                {props.children}
        </Link>
    );
    return(
        <li className={classes.UserNavItem}>
            {item}
        </li>
    );

}

export default userNavItem;