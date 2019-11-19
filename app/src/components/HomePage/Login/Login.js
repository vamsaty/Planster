import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import axios from "axios";
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


const styles = theme => ({
    button: {
        margin: 'theme.spacing(1)',
        fontFamily:'Quicksand',
        fontWeight:'bold'
    },
    container: {
      display: 'flex-block',
      flexWrap: 'wrap',
      padding:40,
    },
    textField: {
      width: 300,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
  
});



class Login extends Component
{

    constructor(){
        super();
        this.state = {
            open:1,
            close:0,
            password:"",
            name:""
        }
        this.handleOpen = this.handleOpen.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);

    }


    handleChange(e) {
      this.setState({ [e.target.name] : e.target.value });
    }
      

    handleSubmit(event) {
      event.preventDefault()
      axios.post('http://localhost:5000/api/v1/login',
      {'username':this.state.name.trim() ,'password':this.state.password.trim()})
      .then( response => {
          let responseData = response;
          console.log(responseData)
            if(responseData.data.userData){
              sessionStorage.setItem("userData", responseData.data.userData);
              sessionStorage.setItem("Name", responseData.data.Name)
            }
            this.setState({
              open:0,
            });
            this.props.history.push('/user');
        })
        .catch(error => {
          alert(error.response.data)
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
        this.props.history.push(`/`)
    }



    render(){
      const { classes } = this.props;
      return (
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
            <form onSubmit={this.handleSubmit} className={classes.container}>
            <Typography component="h1" variant="h5" style={{fontFamily:'Quicksand'}}>
              Log In
            </Typography>

            <TextField
              required
              label="User Name"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
              className={classes.textField}
              margin="normal"
            />
            <br/>

            <TextField
              required
              className={classes.textField}
              name="password"
              label="Password"
              value={this.state.password}
              type="password"
              onChange={this.handleChange}
            />
            <p><br/></p>

            <Button type="submit" variant="contained" color="primary" className={classes.button}>
              LOG IN
            </Button>
            </form>
          </Paper>
          </Fade>
        </Modal>
      );
    }
  }

export default withStyles(styles)(Login);