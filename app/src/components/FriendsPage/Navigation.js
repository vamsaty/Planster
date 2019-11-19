import React, { Component } from 'react';
import { Route,Switch} from 'react-router-dom'
import {withRouter} from 'react-router-dom'
import { withStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import avatar from '../../assets/images/avatar.png';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import HomePage from '../HomePage/HomePage'
import Tooltip from '@material-ui/core/Tooltip';
import axios from "axios";
const styles = theme => ({
  root: {
    width: '100%',
    alignItems:'center',
    justifyContent:'center',
  },
  bigAvatar: {
    width: "120px",
    position:"fixed",
    left:"120px",
    top:"130px",
    height: "120px",
  },
  add:{
    position:"fixed",
    top:"220px",
    left:"220px",
    color:"black",

  },
  box:
  {
    position:"fixed",
    top:"250px",
    left:'110px',
    fontFamily:'Quicksand',
    alignItems:'center',
    fontWeight:'bolder',
    color:"black",
    fontSize:"1em"
    

  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: '#ffffff',
    border: '1px',
    borderColor : 'black',
  },

 
  
});

class Navigation extends Component {


  constructor(props) {
    super(props)
  
    this.state = {
     p_color:"black",
     c_color:"#464444",
     f_color:"#464444",
     l_color:"#464444",
     open:0,


     "username":"",
     "email":"",
     "address":"",
     "phone":"",
     "age":0,
     "city":"",
     "email":""
    }
    this.groups=this.groups.bind(this)
    this.friends=this.friends.bind(this)
    this.files=this.files.bind(this)
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.logout = this.logout.bind(this);
    this.handleInfo=this.handleInfo.bind(this)
  }

  groups()
  {
    this.props.handleNavigation("groups")
    this.setState({
      p_color: "black",
      c_color:"#464444",
     f_color:"#464444",
     l_color:"#464444"

    })
   
  }
  friends()
  {
    this.props.handleNavigation("friends")
    this.setState({
      p_color: "#464444",
      c_color:"black",
     f_color:"#464444",
     l_color:"#464444"
    })
  }
  files()
  {
    this.props.handleNavigation("files")
    this.setState({
      p_color: "#464444",
      c_color:"#464444",
     f_color:"black",
     l_color:"#464444"
    })
  }
  logout()
  {
    this.props.history.push('/')
  }

  
  handleOpen = () =>{
    this.setState({
        open:1,
        p_color: "#464444",
      c_color:"#464444",
     l_color:"black",
     f_color:"#464444"
    }) 
   
}

handleInfo()
{
  axios.get('http://127.0.0.1:5000/api/v1/details/' + String(sessionStorage.getItem("friend"))).
    then(res => {
      
      this.setState({
        username:res.data.details.username,
        email:res.data.details.email,
        age:res.data.details.age,
        phone:res.data.details.phone,
        address:res.data.details.address,
        city:res.data.details.city,
      })


  });  
}

handleClose = () =>{
    this.setState({
        open:0,
        p_color: "black",
      c_color:"#464444",
     f_color:"#464444",
     l_color:"#464444"
    }) 
   
}

componentDidMount()
{
  this.handleInfo()
}
  
  render(){
  
  const {classes} = this.props;




  return (
    <div className={classes.root} style={{textAlign:"center"}} >
    
    
     <div className={classes.box} >
     <Avatar alt="" src={avatar} className={classes.bigAvatar} />
    
     <br/>
     <p style={{position:"absolute",left:"50px"}}>{String(sessionStorage.getItem("friend_n"))}</p>
     <p><br/></p>  
     <div className={classes.box}>
     <p><br/></p>
     <br/><br/><br/>
     <p>
     Username : {this.state.username}</p>
     <p>Email : {this.state.email}</p>
     <p>Age : {this.state.age}</p>
     <p>Address : {this.state.address}</p>
     <p>City : {this.state.city}</p>
     <p>PhNo : {this.state.phone}</p>
     
    
     
     
     </div>
     </div>
     
     <Dialog
     open={this.state.open}
     onClose={this.handleClose}
     aria-labelledby="alert-dialog-title"
     aria-describedby="alert-dialog-description"
     >
      <DialogTitle id="alert-dialog-title">{"Log Out"}</DialogTitle>
      <DialogContent>
       <DialogContentText id="alert-dialog-description">
         Are you sure you want to Log Out?
       </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={this.logout} color="primary">
         Yes
        </Button>
        <Button onClick={this.handleClose} color="primary" autoFocus>
         No
        </Button>
      </DialogActions>
      </Dialog>
   <Switch>
   <Route exact path="/" component = {HomePage} />
   </Switch>
  </div>
  );
  }
}

export default withRouter(withStyles(styles)(Navigation));