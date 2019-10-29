import React from 'react';

import { Link } from 'react-router-dom';
import plansterLogo from '../../assets/images/Planster.png'
import burgerLogo from '../../assets/images/burger-logo.png';


import classes from './Logo.module.css';

const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <Link to="/user"><img src={plansterLogo} alt="MyBurger" /></Link>
    </div>
);

export default logo;