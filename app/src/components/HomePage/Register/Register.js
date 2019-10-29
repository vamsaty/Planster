import React, { Component } from 'react';
import { BrowserRouter,Redirect } from 'react-router-dom'
import { withStyles } from '@material-ui/styles';
import axios from "axios";
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

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
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width:"70%"
  }
  
});



class Register extends Component
{

    constructor(){
        super();
        this.state = {
            open:1,
            password:"",
            name:"",
            adresss:"",
            email:"",
            phone:"",
            city:"",
            age:"",
            username:""

        }
        this.handleOpen = this.handleOpen.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    handleSubmit(event) {
        event.preventDefault()
        axios.post('http://localhost:5000/api/v1/register',
        {'username':this.state.username.trim() ,'password':this.state.password.trim(),
          'email':this.state.email.trim(),'age':this.state.age.trim(),
          'phone':this.state.phone.trim(),'address':this.state.address.trim(),
          'city':this.state.city.trim(),'name':this.state.name.trim()})
        .then( response => {
            let responseData = response;
            if(responseData.data.userData){
                sessionStorage.setItem("userData", responseData.data.userData)
            }
            this.setState({
                open:0,
            })
            this.props.history.push('/');
          })
            .catch(error => {
              alert(error.response.data)
              this.props.history.push('/');
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

    handleChange(e) {
        this.setState({ [e.target.name] : e.target.value });
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

        <Paper style={{position:'absolute',left:"400px"}}>
          <form onSubmit={this.handleSubmit} className={classes.container} noValidate autoComplete="off">
            <Typography component="h1" variant="h5" style={{fontFamily:'Quicksand'}}>
            Sign Up
            </Typography>
            
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="name"
                  label="Name"
                  value={this.state.name}
                  onChange={this.handleChange.bind(this)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="email"
                  label="Email"
                  value={this.state.email}
                  onChange={this.handleChange.bind(this)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="username"
                  label="User Name"
                  value={this.state.username}
                  onChange={this.handleChange.bind(this)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  name="password"
                  label="Password"
                  value={this.state.password}
                  type="password"
                  id="password"
                  onChange={this.handleChange.bind(this)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  name='address'
                  fullWidth
                  multiline
                  rowsMax="4"
                  value={this.state.address}
                  onChange={this.handleChange.bind(this)}
                  margin="normal"
                /> 
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Ph No"
                  name="phone"
                  value={this.state.phone}
                  onChange={this.handleChange.bind(this)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={this.state.city}
                  onChange={this.handleChange.bind(this)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  name="age"
                  value={this.state.age}
                  onChange={this.handleChange.bind(this)}
                  margin="normal"
                />
              </Grid>
            </Grid>
            <p><br/></p>
          <Button type="submit" variant="contained" color="primary" className={classes.button}>
           SIGN UP
          </Button>
        </form>
      </Paper>
    </Fade>
  </Modal>         
  );
}
}

export default withStyles(styles)(Register);