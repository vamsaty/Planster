import React, { Component } from 'react';
import { Route,Switch} from 'react-router-dom'
import {withRouter} from 'react-router-dom'
import { withStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import avatar from '../../assets/images/avatar.jpg';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import HomePage from '../HomePage/HomePage'


const styles = theme => ({
  root: {
    width: '100%',
    alignItems:'center',
    justifyContent:'center',
  },
  bigAvatar: {
    width: "130px",
    position:"fixed",
    left:"80px",
    top:"100px",
    height: "130px",
  },
  add:{
    position:"fixed",
    top:"200px",
    left:"230px",

  },
  box:
  {
    position:"fixed",
    top:"230px",
    left:'110px',
    fontFamily:'Quicksand',
    alignItems:'center',
    fontWeight:'bold',
    color:"white",
    

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
     c_color:"white",
     f_color:"white",
     l_color:"white",
     open:0
    }
    this.profile=this.profile.bind(this)
    this.calendar=this.calendar.bind(this)
    this.files=this.files.bind(this)
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.logout = this.logout.bind(this);
    
  }

  profile()
  {
    this.props.handleNavigation("profile")
    this.setState({
      p_color: "black",
      c_color:"white",
     f_color:"white",
     l_color:"white"

    })
   
  }
  calendar()
  {
    this.props.handleNavigation("calendar")
    this.setState({
      p_color: "white",
      c_color:"black",
     f_color:"white",
     l_color:"white"
    })
  }
  files()
  {
    this.props.handleNavigation("files")
    this.setState({
      p_color: "white",
      c_color:"white",
     f_color:"black",
     l_color:"white"
    })
  }
  logout()
  {
    this.props.history.push('/')
  }

  
  handleOpen = () =>{
    this.setState({
        open:1,
        p_color: "white",
      c_color:"white",
     l_color:"black",
     f_color:"white"
    }) 
   
}

handleClose = () =>{
    this.setState({
        open:0,
        p_color: "black",
      c_color:"white",
     f_color:"white",
     l_color:"white"
    }) 
   
}

  
  render(){
  
  const {classes} = this.props;




  return (
    <div className={classes.root} style={{textAlign:"center"}} >
    
    
     <div className={classes.box} >
     <Avatar alt="Remy Sharp" src={avatar} className={classes.bigAvatar} />
  
     <AddCircleIcon className={classes.add}/>
     <br/>
     <div className={classes.box}>
     <p>{String(sessionStorage.getItem("Name"))}</p>
     <br/><br/><br/>
     <p style={{color:this.state.p_color,cursor:"pointer"}} onClick={this.profile}>Profile</p>
     <p style={{color:this.state.c_color ,cursor:"pointer"}} onClick={this.calendar}>Calendar</p>
     <p style={{color:this.state.f_color,cursor:"pointer"}}  onClick={this.files}>Files</p>
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
         Are you Sure You want to Log Out?
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