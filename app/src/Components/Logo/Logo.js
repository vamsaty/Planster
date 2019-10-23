import React from 'react';
// 
import plansterLogo from '../../assets/images/Planster.png'
import burgerLogo from '../../assets/images/burger-logo.png';
// import {  } from "../../assets/images/";
// import burgerLogo from '../../'
import classes from './Logo.module.css';

const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={plansterLogo} alt="MyBurger" />
    </div>
);

export default logo;