import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';

import {withRouter} from 'react-router-dom'
import List from '@material-ui/core/List';  
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import axios from "axios";
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import dp from '../../assets/images/background.jpg';
import Add_Del_Group from './UserFunctions/Add_Del_Group.js'
import Typography from '@material-ui/core/Typography';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Dashboard from '../Dashboard/Dashboard';
import { Route,Switch} from 'react-router-dom';
import HomePage from '../HomePage/HomePage'

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: 'theme.palette.background.paper',
    position: 'relative',
    overflow: 'auto',
    maxHeight: 180,
  },
  paper:{
    display:"inline-flex",
    width:"100%",
  },
  tooltip:{
    cursor:"pointer",position:"relative",top:9,
  },

  
  
});



class Groups extends Component
{

  constructor(props) {
    super(props)
    this.state = {
        groups : [],
        loaded:0,
        group:"",
       
    }
    this.routeChange = this.routeChange.bind(this);
}


listGroupsHandler = () =>{
  axios.get('http://127.0.0.1:5000/api/v1/groups/list/' + String(sessionStorage.getItem("userData"))).
  then(res => {
      const groupList = []
      const data = res.data.groups
      for(let x in data){
              groupList.push(data[x])
          
      }
      this.setState({
          groups : groupList,
          loaded:1

      })

  });  
}

componentDidMount() {
  this.listGroupsHandler();
}

routeChange() {
  sessionStorage.setItem("group",this.state.group );
  this.props.history.push("/dashboard");
}

render(){

  const { classes } = this.props;

 
  return (
    <div>
    <List className={classes.root}>
      <Add_Del_Group change_groups={this.listGroupsHandler} groups={this.state.groups}/>
           {this.state.groups.map( (val, ind) => (
                <div><ListItem alignItems="flex-start">
                <ListItemAvatar>
                <Avatar alt="" src={dp} />
                </ListItemAvatar>
                <Typography style={{cursor:'pointer' ,fontFamily:'Quicksand',position:"relative",top:"1.1em"}} onMouseEnter={()=>{this.setState({group:val})}} onClick={this.routeChange}>{val}</Typography>
                </ListItem>
                <Divider variant="inset" component="li" /></div>
            ))}
            
    </List>
   
    </div>
  );
}
}

export default withRouter(withStyles(styles)(Groups));