import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/styles';
import tripimg from '../../assets/images/trip.jpg';
import Calendar from 'react-calendar';
import Button from '@material-ui/core/Button';
import TopBar from '../UserPage/TopBar';
import { Typography } from '@material-ui/core';
import axios from "axios";
const styles = theme => ({
  root: {
  },
  paper: {
    padding: 20,
   
    textAlign: 'center',
  },
});
class Trip extends React.Component {
  constructor(props) {
    super(props)
  
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSchedule = this.handleSchedule.bind(this);
    this.checkScheduled = this.checkScheduled.bind(this);
  }
  
  state = {
    date: new Date(),
    scheduled_dates:[]
  }

  handleSubmit(event) {
    event.preventDefault()
   // alert("ff")
      axios.post('http://localhost:5000/api/v1/trips/set_dates',
      {'username':String(sessionStorage.getItem("userData")),'tripname' : String(sessionStorage.getItem("trip")),'date':this.state.date
        }).then(res => {
          alert("Your preference is recorded")
           
          })
        .catch(error => {
          
          
         })
         
      }

      handleSchedule(event) {
        event.preventDefault()
       // alert("ff")
          axios.post('http://localhost:5000/api/v1/trips/schedule_trip',
          {'tripname' : String(sessionStorage.getItem("trip"))
            }).then(res => {
              alert("Your preference is recorded")
            this.checkScheduled();
               
              })
            .catch(error => {
              alert("Sorry Not able to schedule dates!")
              
             })
             
          }

      checkScheduled(){
        axios.get('http://localhost:5000/api/v1/trips/check_scheduled/'+ String(sessionStorage.getItem("trip")))
        .then(res => {
             // alert("Your preference is recorded")
              sessionStorage.setItem("is_scheduled",res.data.scheduled)
              this.setState({"scheduled_dates":res.data.scheduled_dates})
              //alert(res.data.scheduled_dates)
               
              })
            .catch(error => {
              //alert("Sorry Not able to schedule dates!")
              
             })
      }

      componentDidMount() {
        this.checkScheduled();
      }


  onChange = date => this.setState({ date })
  render() {
    const { classes } = this.props;
    const description = "Japan is an island nation in the Pacific Ocean with dense cities, imperial palaces, mountainous national parks and thousands of shrines and temples"
    let schedule
    let dates
    if(sessionStorage.getItem("is_admin")=="true")
    {
      schedule=(<form onSubmit={this.handleSchedule}><Button type="submit" variant="contained" color="secondary" className={classes.button}>
      Schedule Dates
    </Button></form>)
    }

    if(sessionStorage.getItem("is_scheduled")=="false")
    {
      dates=(<div><span>Select your preferred date</span><Calendar
        selectRange
        onChange={this.onChange}
        value={this.state.date}
      /><p><br/></p><form onSubmit={this.handleSubmit}><Button type="submit" variant="contained" color="secondary" className={classes.button}>
     Submit
    </Button></form></div>)
    }
    if(sessionStorage.getItem("is_scheduled")=="true")
    {
      dates=(<div><h4>Start: {String(this.state.scheduled_dates[0])}</h4>
      <h4>End: {String(this.state.scheduled_dates[1])}</h4>
      </div>)
    }
    
    return (
      <div>
      <TopBar/>
      <div>
      <Paper style={{position:"relative",top:"15em",margin:"2em"}}>
      <Grid container spacing={2}>
        <Grid style={{width:"40em",margin:"0"}} container item xs={10} spacing={5}>
        <Grid item xs={9}>
       
        <img width="950em" src={tripimg}></img>
      </Grid>
      <Grid container item xs={9} style={{margin:"1em"}}>
      <Grid item xs={4}>
      {dates}
      </Grid>
      <Grid item xs={3}>
      <Button style={{width:"10em",margin:"8em"}}variant="contained" color="primary" className={classes.button}>
   Recommend Places
  </Button>
      </Grid>
    <Grid item xs={3}>
    
    </Grid>
      </Grid>
      
        </Grid>
        <Grid style={{width:"20em",margin:"0"}} container item xs={2} spacing={1}>
        <Grid style={{position:"absolute",right:"9em"}} item xs={3}>
        
        <div>
        <h1>{String(sessionStorage.getItem("trip"))}</h1></div>
        <div>
        <h3>{String(sessionStorage.getItem("group"))}</h3></div>
        <div>
        <h4>Overview:</h4>
        <Typography style={{width:"10em"}}>{description}</Typography></div>
        <p><br/></p>
        {schedule}
      </Grid>
      
        </Grid>
       
      </Grid>
      </Paper>
      </div>
    </div>
    )
}
}

export default withStyles(styles)(Trip)