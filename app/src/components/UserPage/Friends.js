import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import axios from "axios";
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import dp from '../../assets/images/avatar.png';
import Add_Del_Friend from './UserFunctions/Add_Del_Friend'
import Typography from '@material-ui/core/Typography';
import {withRouter} from 'react-router-dom'

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: 'theme.palette.background.paper',
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
  },
  paper:{
 display:"inline-flex",
    width:"100%",
  },
  tooltip:{
    cursor:"pointer",position:"relative",top:9,
  }
  
});



class Friends extends Component
{

  constructor(){
    super();
    this.state = {
        friends : [],
        frinds_u:[],
        loaded:0,
        friend:"",
        friend_n:"",
    }
    this.routeChange = this.routeChange.bind(this);
  }


  listFriendsHandler = () =>{
    axios.get('http://127.0.0.1:5000/api/v1/user/friends/list/' + String(sessionStorage.getItem("userData"))).
    then(res => {
      const friendsList = []
      let data = res.data.friends
      for(let x in data){
        friendsList.push(data[x])
          
      }
      const friendsList1 = []
      data = res.data.friends_u
      for(let x in data){
        friendsList1.push(data[x])
          
      }
      this.setState({
        friends : friendsList,
        friends_u:friendsList1,
          loaded:1

      })


  });  
}

componentDidMount() {
  this.listFriendsHandler();
}

routeChange() {
  sessionStorage.setItem("friend",this.state.friend )
  sessionStorage.setItem("friend_n",this.state.friend_n)
  this.props.history.push("/users/friend");
}


render(){

  const { classes } = this.props;

  return (
    <List className={classes.root}>
    <Add_Del_Friend change_friends={this.listFriendsHandler} friends={this.state.friends}/>
        {this.state.friends.map( (val, ind) => (
              <div><ListItem alignItems="flex-start">
              <ListItemAvatar>
              <Avatar alt="" src={dp} />
              </ListItemAvatar>
              <Typography style={{cursor:"pointer",fontFamily:'Quicksand',position:"relative",top:"1.1em"}}
              onMouseEnter={()=>{this.setState({friend_n:val,friend:this.state.friends_u[ind]})}} onClick={this.routeChange}>{val}</Typography>
              </ListItem>
              <Divider variant="inset" component="li" /></div>
      ))}
    </List>
  );
}
}

export default withRouter(withStyles(styles)(Friends));