import React,{Component} from 'react';
import { withStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
// import DateFnsUtils from '@date-io/date-fns';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';  
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import dp from '../../assets/images/background.jpg';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import axios from "axios";
import {withRouter} from 'react-router-dom'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Calendar from 'react-calendar';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
const styles = theme => ({
    root: {
        flexGrow: 1,
        width:"60em",
        height:"40em",
        
      },
      paper: {
        padding: `theme.spacing(2)`,
        textAlign: 'center',
        color: `theme.palette.text.secondary`,
        height:"10em",
        maxheight:"30em",
        margin:"1em 1em 0em 1em"
      },
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
   
  formControl: {
    margin: "10px",
    
    display: 'flex-block',
        flexWrap: 'wrap',
        padding:40,
  },
  root1:{
    width: '100%',
    backgroundColor: 'theme.palette.background.paper',
    position: 'relative',
    overflow: 'auto',
    maxHeight: 230,
  }
    
    
  });

class TripsFunction extends Component{

    constructor(){
        super();
        this.state = {
            open:0,
            selectedDate:new Date(),
            setSelectedDate:0,
            date: new Date(),
            location:"",
            description:"",
            trips:[],
            trip:"",
           
        }
        this.handleOpen = this.handleOpen.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.listTripsHandler=this.listTripsHandler.bind(this);
        this.routeChange=this.routeChange.bind(this)
        
    }
    

    handleSubmit(event) {
      event.preventDefault()
        axios.post('http://localhost:5000/api/v1/trips/create',
        {'admin':String(sessionStorage.getItem("userData")),'description' : this.state.description.trim(),'date':this.state.date,'location':this.state.location,'group':String(sessionStorage.getItem("group"))
          }).then(res => {
            
              const updatedInfo = res.data
              console.log(res)
              
              this.setState({
                  value : '',
                  open:0,
              });
              this.listTripsHandler()
            })
          .catch(error => {
            console.log("gfd")
            alert(error.response.data) 
            
           })
           
        }

        listTripsHandler = () => { 
          axios.get('http://127.0.0.1:5000/api/v1/groups/get_trips/'+String(sessionStorage.getItem("group"))).
          then(res => {
              const tripsList = []
              const data = res.data.trips
              for(let x in data){
                      tripsList.push(data[x])
                  
              }
              this.setState({
                  trips : tripsList,
                  loaded:1
        
              })
        
          });  
          this.handleChange = this.handleChange.bind(this);
        }
    
    handleOpen = () =>{
        this.setState({
            open:1
        }) 
       
    }
    componentDidMount() {
      this.listTripsHandler();
    }
    onChange = date => 
    {this.setState({ date })
    console.log(this.state.date)
    console.log(this.state.address)
}

    handleClose = () =>{
        this.setState({
            open:0
        }) 
       
    }
    handleChange(e) {
      this.setState({ [e.target.name] : e.target.value });
   }

    handleDateChange = date => {
        this.setState({setSelectedDate:date});
      };

      routeChange() {
        sessionStorage.setItem("trip",this.state.trip );
        this.props.history.push("/dashboard/trip");
      }
    
    render(){
        
        const { classes } = this.props;
        return (
           <div className={classes.root}>
            <Grid container spacing={3}>
            
            
            <Grid item xs={9}>
            <Paper style={{"position":"relative","top":"5em",left:"4em"}}>
            <Card><CardContent style={{position:"relative",fontSize:"1em",left:"46%"}}><strong>Trips</strong></CardContent></Card>
             <div>
    <List className={classes.root1}>
    <Paper >
    {this.state.trips.map( (val, ind) => (
                <div> <Divider/><ListItem alignItems="flex-start">
                <ListItemAvatar>
                <Avatar alt="" src={dp} />
                </ListItemAvatar>
                <Typography style={{cursor:'pointer' ,fontFamily:'Quicksand',position:"relative",top:"1.1em"}} 
                onMouseEnter={()=>{this.setState({trip:val})}} onClick={this.routeChange}>{val}</Typography>
              </ListItem>  
               </div>
                ))}   
                
          
                </Paper>
    </List>
   
    </div></Paper>
   
            </Grid>
            <Grid item xs={3}>
            <Button onClick={this.handleOpen} style={{position:"absolute",top:"15em",right:"5em"}} variant="contained" color="primary" className={classes.button}>
           Create Trip
          </Button>

          <Button style={{position:"absolute",top:"20em",right:"5em"}} variant="contained" color="secondary" className={classes.button}>
            Delete Trip
          </Button>
            </Grid>
           
          </Grid>

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
        Create Trip
      </Typography><p><br/></p>
            <p><TextField
          id="standard-basic"
          className={classes.textField}
          label="Location"
          name="location"
          value={this.state.location}
          onChange={this.handleChange.bind(this)}
         
        /></p>
    
        <TextField
        id="standard-multiline-flexible"
        label="Place Description"
        multiline
        rowsMax="10"
        name="description"
       
        className={classes.textField}
        margin="normal"
        value={this.state.description}
        onChange={this.handleChange.bind(this)}
      />
      
     
     <p>Tentative Date Range</p>
        <Calendar
        selectRange
        
          onChange={this.onChange}
          value={this.state.date}
        />
        <p><br/></p>
        <Button type="submit" variant="contained" color="primary" className={classes.button}>
        Create
      </Button>
      
      </form>
        </Paper>
      </Fade>
      </Modal>
          </div>
        )
    }
}

export default  withRouter(withStyles(styles)(TripsFunction));