import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import axios from "axios";
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import dp from '../../assets/images/background.jpg';
import AddGroups from './UserFunctions/AddGroups.js'
import Typography from '@material-ui/core/Typography';


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
  }
  
});



class Groups extends Component
{

  constructor(){
    super();
    this.state = {
        groups : [],
        loaded:0
    }
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


render(){

  const { classes } = this.props;

 
  return (
    <List className={classes.root}>
      <AddGroups change_groups={this.listGroupsHandler}/>
           {this.state.groups.map( (val, ind) => (
                <div><ListItem alignItems="flex-start">
                <ListItemAvatar>
                <Avatar alt="" src={dp} />
                </ListItemAvatar>
                <Typography style={{fontFamily:'Quicksand',position:"relative",top:"1.1em"}}>{val}</Typography>
                </ListItem>
                <Divider variant="inset" component="li" /></div>
            ))}
    </List>
  );
}
}

export default withStyles(styles)(Groups);