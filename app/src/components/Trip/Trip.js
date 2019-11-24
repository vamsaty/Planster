import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/styles';
import tripimg from '../../assets/images/bg6.jpg';
import Calendar from 'react-calendar';
import Button from '@material-ui/core/Button';
import TopBar from '../UserPage/TopBar';
import { Typography } from '@material-ui/core';
import axios from "axios";
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
const styles = theme => ({
  root: {
  },
  paper: {
    padding: 20,
   
    textAlign: 'center',
  }, textField: {
    marginLeft: `theme.spacing(1)`,
    marginRight: `theme.spacing(1)`,
    width: 200,
  },
});
class Trip extends React.Component {
  constructor(props) {
    super(props)
  
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSchedule = this.handleSchedule.bind(this);
    this.checkScheduled = this.checkScheduled.bind(this);
    this.recommend=this.recommend.bind(this)
    this.handleChange=this.handleChange.bind(this)
  }
  
  state = {
    date: new Date(),
    scheduled_dates:[],
    url:"",
    query:""
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


     get_image(){
        axios.get('http://localhost:5000/get_image/'+ String(sessionStorage.getItem("trip")))
        .then(res => {
             // alert("Your preference is recorded")
              //sessionStorage.setItem("url",res.data.url)
              this.setState({"url":res.data.url})
              //alert(res.data.scheduled_dates)
               
              })
            .catch(error => {
              //alert("Sorry Not able to schedule dates!")
              
             })
      }

      recommend(){
        var t=document.getElementById("place")
        t.innerHTML="Loading..."
        axios.get('http://localhost:5000/api/v1/places/recommend/'+ this.state.query)
        .then(res => {
             t.innerHTML=res.data.recom
              })
            .catch(error => {
          
             })
      }
      handleChange(e) {
        this.setState({ [e.target.name] : e.target.value });
      }

      componentDidMount() {
        this.checkScheduled();
   
      }


  onChange = date => this.setState({ date })
  render() {
    const { classes } = this.props;
    const description = "Welcome! Enter your query and we will recommend a restraunt based on that.Enter your preferred date for the trip!"
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
      dates=(<div><h3>Scheduled Dates</h3><h4>Start: {String(this.state.scheduled_dates[0])}</h4>
      <h4>End: {String(this.state.scheduled_dates[1])}</h4>
      </div>)
    }
    
    return (
      <div>
      <TopBar/>
      <div>

      <Paper style={{backgroundImage:"url("+tripimg+")" ,backgroundPosition: 'center',backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',position:"relative",top:"2em",height:"40em",margin:"2em"}}>
     
      
    
      <Card style={{position:"absolute",width:"20em",margin:"2em"}}>
      <div style={{margin:"2em"}}><div>
      <h1>{String(sessionStorage.getItem("trip"))}</h1></div>
      <div>
      <h3>{String(sessionStorage.getItem("group"))}</h3></div>
      <div>
      
      <Typography style={{width:"10em"}}>{description}</Typography></div>
      <p><br/></p>
      {schedule}</div>
      </Card>
  
    
     
      
   
    <Card  style={{position:"absolute",left:"30em",width:"20em",padding:"1.2em",margin:"2em"}}>
    <TextField
          
          id="standard"
          label="Your query...."
          value={this.state.query}
          onChange={this.handleChange}
          className={classes.textField}
          margin="normal"
          name="query"
        />
        <p><br/></p>
    <Button variant="contained" onClick={this.recommend} color="primary" className={classes.button}>
 Recommend
</Button>
<p><br/></p>
<h4 id="place"></h4></Card>
   

      
      <Card style={{position:"absolute",left:"60em",margin:"2em",width:"20em",padding:"1.2em"}} >
      {dates}
      </Card>
     


      

      
    
     
      
       
      </Paper>
      </div>
    </div>
    )
}
}

export default withStyles(styles)(Trip)