import React from 'react';
import { NavLink,Link } from 'react-router-dom';
import classes from './NavigationItem.module.css';

import Button from '@material-ui/core/Button';

const navigationItem = ( props ) => {

    let item = (
           <Button
                variant="contained"
                color="primary"
                className={[classes.button, classes.buttonActive].join(' ')}
                >
                <NavLink 
                    to={props.link}
                    exact={props.exact}
                    activeClassName={classes.active}>
                       {props.children}
                </NavLink>
            </Button>
        
    );

    if(props.logout){
        item = (
            
                    <Button
                        variant="contained"
                        color="primary"
                        className={[classes.button, classes.active].join(' ')}
                        ><NavLink
                        to = {props.link}
                        onClick = {props.handleLogout}
                        >
                       {props.children}
                       </NavLink>
                    </Button>

            
        );
    }
    if(props.home){
        item = (
            <Button
                 variant="outlined"
                 color="primary"
                 className={[classes.button, classes.buttonActive].join(' ')}
                 >
                 <NavLink 
                     to={props.link}
                     exact={props.exact}
                     activeClassName={classes.active}>
                        {props.children}
                 </NavLink>
             </Button>
         
     );
 
    }

    return(
        <li className={classes.NavigationItem}>
          {item}
        </li>
    );
};

export default navigationItem;