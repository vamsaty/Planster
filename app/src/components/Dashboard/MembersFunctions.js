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
import DateFnsUtils from '@date-io/date-fns';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';  
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import dp from '../../assets/images/avatar.png';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import axios from "axios";
import {withRouter} from 'react-router-dom';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import GridList from '@material-ui/core/GridList';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel'
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
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
    
  },
  gridList: {
    width: 300,
    height: 300,
  },
    
  });

class MembersFunctions extends Component{

    constructor(){
        super();
        this.state = {
            open:0,
            selectedDate:new Date(),
            setSelectedDate:0,
            date: new Date(),
            name:"",
            description:"",
            members:[],
            trip:"",
            suggestion:[],
            open1:0,
            value1:" ",
            
           
        }
        this.handleOpen = this.handleOpen.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.listTripsHandler=this.listTripsHandler.bind(this);
        this.listSuggestions=this.listSuggestions.bind(this);
        this.routeChange=this.routeChange.bind(this);
        this.handleOpen1 = this.handleOpen1.bind(this);
        this.handleChange1 = this.handleChange1.bind(this);
        this.handleClose1 = this.handleClose1.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
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

  handleChange1(event) {
    console.log(event.target.value)
    this.setState({value1: event.target.value});
  
  }
    handleSubmit(event) {
      event.preventDefault()
        axios.post('http://localhost:5000/api/v1/groups/add_friend/'+String(sessionStorage.getItem("group")),
        {'friendname':this.state.name
          }).then(res => {
            
              const updatedInfo = res.data
              console.log(res)
              
              this.setState({
                  name : '',
                  open:0,
              });
              this.listTripsHandler()
              this.listSuggestions();
            })
          .catch(error => {
            console.log("gfd")
            alert(error.response.data) 
            
           })
           
        }


        handleDelete(event) {
          event.preventDefault()
           axios.delete('http://localhost:5000/api/v1/groups/del_user/'+String(sessionStorage.getItem("group")).trim()
           +'/'+this.state.value1.trim())
             .then(res => {
                 const updatedInfo = res.data
                 console.log(res)
                 
                 this.setState({
                     value1 : '',
                     open1:0,
                 });
                 this.listTripsHandler();
                 this.listSuggestions();
                 
             })
             .catch(error => {
               
              });   
           }


        listTripsHandler = () => { 
          axios.get('http://127.0.0.1:5000/api/v1/groups/list/members/'+String(sessionStorage.getItem("group"))).
          then(res => {
              const membersList = []
              const data = res.data.members
              for(let x in data){
                membersList.push(data[x])
                  
              }
              this.setState({
                members : membersList,
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


    listSuggestions()
    {

      axios.post('http://127.0.0.1:5000/api/v1/groups/add_friend/suggest',
      {"admin":String(sessionStorage.getItem("userData")),"group":String(sessionStorage.getItem("group"))}).
          then(res => {
              console.log("gg")
              const suggestionList = []
              const data = res.data.suggested
              for(let x in data){
                suggestionList.push(data[x])
                  
              }
              this.setState({
                suggestion : suggestionList,
                  loaded:1
        
              }) 
              
             
        
            });  

    }
    componentDidMount() {
      this.listTripsHandler();
      this.listSuggestions();
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
      let functions;
      if(sessionStorage.getItem("is_admin")=="true")
      {
        
        functions=(<Grid item xs={9}>
          <Button onClick={this.handleOpen} style={{position:"fixed",left:"35em",height:"6em",top:"40em",margin:"1em"}} variant="contained" color="primary" className={classes.button}>
         Add Member 
        </Button>

        <Button onClick={this.handleOpen1}  style={{position:"fixed",height:"6em",top:"40em",margin:"1em",right:"15em"}} variant="contained" color="secondary" className={classes.button}>
          Delete Member
        </Button>
          </Grid>)
      }
      
       
        return (
           <div className={classes.root}>
            <Grid container spacing={3}>
            
            
            <Grid item xs={12}>
            <Paper style={{"position":"relative","top":"5em",left:"4em"}}>
            <Card><CardContent style={{position:"relative",fontSize:"1em",left:"46%"}}><strong>Members</strong></CardContent></Card>
             <div>
    <List className={classes.root1}>
    <Paper >
    {this.state.members.map( (val, ind) => (
                <div> <Divider/><ListItem alignItems="flex-start">
                <ListItemAvatar>
                <Avatar alt="" src={dp} />
                </ListItemAvatar>
                <Typography style={{cursor:'pointer' ,fontFamily:'Quicksand',position:"relative",top:"1.1em"}} 
                onMouseEnter={()=>{this.setState({trip:val})}} 
                // onClick={this.routeChange}
                >{val}
                </Typography>
              </ListItem>  
               </div>
                ))}   
                
          
                </Paper>
    </List>
   
    </div></Paper>
   
            </Grid>
            
           {functions}
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
        Add Member
      </Typography><p><br/></p>
            <p><TextField
          id="standard-basic"
          className={classes.textField}
          label="Name"
          name="name"
          value={this.state.name}
          onChange={this.handleChange.bind(this)}
         
        /></p>
        <p><br/></p>
        <Typography  style={{fontFamily:'Quicksand'}}>
        Some Suggestions
      </Typography>

        <GridList cellHeight={110}  className={classes.gridList}>
        {this.state.suggestion.map(tile => (
          <GridListTile  style={{marginRight:"1.7em","width":"110px"}}>
          
          <Avatar style={{height:"100px","width":"100px"}} alt="" src={dp} />
         
            <GridListTileBar
              title={tile}
              
              
            />
          </GridListTile>
        ))}
      
        </GridList>
     
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
    Members
   </Typography>
     <p><br/></p>
     <RadioGroup aria-label="gender" name="gender1" value={this.state.value1} onChange={this.handleChange1}>
     {this.state.members.map( (val, ind) => (
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
          </div>
        )
    }
}

export default  withRouter(withStyles(styles)(MembersFunctions));