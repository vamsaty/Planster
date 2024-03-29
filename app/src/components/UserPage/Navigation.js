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

const styles = theme => ({
  root: {
    width: '100%',
    alignItems:'center',
    justifyContent:'center',
  },
  bigAvatar: {
    width: "120px",
    position:"fixed",
    left:"90px",
    top:"100px",
    height: "120px",
  },
  add:{
    position:"fixed",
    top:"200px",
    left:"220px",
    color:"black",

  },
  box:
  {
    position:"fixed",
    top:"230px",
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
     open:0
    }
    this.groups=this.groups.bind(this)
    this.friends=this.friends.bind(this)
    this.files=this.files.bind(this)
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.logout = this.logout.bind(this);
    
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

handleClose = () =>{
    this.setState({
        open:0,
        p_color: "black",
      c_color:"#464444",
     f_color:"#464444",
     l_color:"#464444"
    }) 
   
}

  
  render(){
  
  const {classes} = this.props;




  return (
    <div className={classes.root} style={{textAlign:"center"}} >
    
    
     <div className={classes.box} >
     <Avatar alt="" src={avatar} className={classes.bigAvatar} />
     <Tooltip title="Change Photo">
     <EditIcon className={classes.add}/></Tooltip>
     <br/>
     <div className={classes.box}>
     <p>{String(sessionStorage.getItem("Name"))}</p>
     <br/><br/><br/>
     <p style={{color:this.state.p_color,cursor:"pointer"}} onClick={this.groups}>Groups</p>
     <p style={{color:this.state.c_color ,cursor:"pointer"}} onClick={this.friends}>Friends</p>
     <p style={{color:this.state.l_color,cursor:"pointer"}}  onClick={this.handleOpen}>Logout</p>
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