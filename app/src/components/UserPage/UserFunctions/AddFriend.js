import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import axios from "axios";
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


const styles = theme => ({
    button: {
        margin: 'theme.spacing(1)',
        fontFamily:'Quicksand',fontWeight:'bold'
      },
    container: {
        display: 'flex-block',
        flexWrap: 'wrap',
        padding:40,
      },
    textField: {
        marginLeft: 'theme.spacing(2)',
        marginRight: 'theme.spacing(2)',
        width: 300,
      },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    paper1:{
      display:"inline-flex",
      width:"100%",
    },
    tooltip:{
      cursor:"pointer",position:"relative",top:9,
    },
    paper: {
      backgroundColor: '#ffffff',
      border: '1px',
      borderColor : 'black',
  },
  
});



class AddFriend extends Component
{

    constructor(){
        super();
        this.state = {
            open:0,
            close:0,
            value:" "
        }
        this.handleOpen = this.handleOpen.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);

    }


    handleChange(event) {
        this.setState({value: event.target.value});
      }
    
      handleSubmit(event) {
      axios.post('http://localhost:5000/api/v1/user/friend/add/' + String(sessionStorage.getItem("userData")),{
            'friend_username' : this.state.value.trim()
        }).
        then(res => {
            const updatedInfo = res.data
            console.log(res)
            
            this.setState({
                value : '',
                open:0,
            });
            this.props.change_friends()
            
        });  
      }

    handleOpen = () =>{
        this.setState({
            open:1
        }) 
       
    }

    handleClose = () =>{
        this.setState({
            open:0
        }) 
       
    }
  
    render(){
    const { classes } = this.props;
    return (
      <ListSubheader>
      <Paper  className={classes.paper1} > 
        <Tooltip title="Add Friend" className={classes.tooltip} onClick={this.handleOpen}>
        <ListItemAvatar><AddCircleIcon/></ListItemAvatar>
        </Tooltip>
      <span style={{position:"relative",left:"30%",fontFamily:'Quicksand',fontWeight:'bold'}}>
        Friends</span>
      </Paper>
    
    <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={this.state.open}
        onClose={this.handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        <Fade in={this.state.open}>
       <Paper>
          
        <form onSubmit={this.handleSubmit} className={classes.container} noValidate autoComplete="off">
        <Typography component="h1" variant="h5" style={{fontFamily:'Quicksand'}}>
          Add Friend
        </Typography>
        <TextField
        id="standard-name"
        label="Name"
        name="name"
        className={classes.textField}
        value={this.state.value}
       onChange={this.handleChange}
        margin="normal"
        />
      <p><br/></p>
        <Button type="submit" variant="contained" color="primary" className={classes.button}>
        Add
      </Button>
      </form>
        </Paper>
      </Fade>
      </Modal>
      </ListSubheader>
           
  );
}
}

export default withStyles(styles)(AddFriend);