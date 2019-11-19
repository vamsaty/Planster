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
import DeleteIcon from '@material-ui/icons/Delete';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel'

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
  formControl: {
    margin: "10px",
    
    display: 'flex-block',
        flexWrap: 'wrap',
        padding:40,
  },
  
});



class Add_Del_Friend extends Component
{

  constructor(){
    super();
    this.state = {
        open:0,
        open1:0,
        value:" ",
        value1:" ",
    }
    this.handleOpen = this.handleOpen.bind(this);
    this.handleOpen1 = this.handleOpen1.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleClose1 = this.handleClose1.bind(this);

}

    handleChange(event) {
        this.setState({value: event.target.value});
      }
      
      handleChange1(event) {
        console.log(event.target.value)
        this.setState({value1: event.target.value});
      
      }
    
      handleSubmit(event) {
      axios.post('http://localhost:5000/api/v1/user/friend/add/' + String(sessionStorage.getItem("userData")),{
            'friend_username' : this.state.value.trim()
        }).then(res => {
          
            const updatedInfo = res.data
            console.log(res)
            
            this.setState({
                value : '',
                open:0,
            });
          })
        .catch(error => {
          console.log("gfd")
          alert(error.response.data) 
          
         })
         this.props.change_friends();  
      }

      handleDelete(event) {
       
        axios.delete('http://localhost:5000/api/v1/user/friend/del/' + this.state.value1,{data:{
              'username' : String(sessionStorage.getItem("userData"))
          }}).
          then(res => {
              const updatedInfo = res.data
              console.log(res)
              
              this.setState({
                  value1 : '',
                  open1:0,
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
    handleOpen1 = () =>{
      this.setState({
          open1:1
      }) 
     
  }

  handleClose1 = () =>{
      this.setState({
          open1:0
      }) 
     
  }

    componentDidMount()
    {
      this.props.change_friends()
    }
  
    render(){
    const { classes } = this.props;
    return (
      <ListSubheader>
      <Paper  className={classes.paper1} > 
       
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

      
      
      <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={this.state.open1}
      onClose={this.handleClose1}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}>
      <Fade in={this.state.open1}>
     <Paper>
     <FormControl component="fieldset" className={classes.formControl}>
     <Typography component="h1" variant="h5" style={{fontFamily:'Quicksand'}}>
     Remove Friend
   </Typography>
     <p><br/></p><RadioGroup aria-label="gender" name="gender1" value={this.state.value1} onChange={this.handleChange1}>
     {this.props.friends.map( (val, ind) => (
      <FormControlLabel control={<Radio color="primary" />} value={val} control={<Radio />} label={val} />
      
  ))}
     </RadioGroup><p><br/></p>
     <Button type="submit" variant="contained" color="primary" className={classes.button} onClick={this.handleDelete}>
     Remove
   </Button>
   </FormControl>
  
      </Paper>
    </Fade>
    </Modal>
    
      </ListSubheader>
           
  );
}
}

export default withStyles(styles)(Add_Del_Friend);