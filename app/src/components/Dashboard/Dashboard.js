import React,{Component} from 'react';
import { withStyles } from '@material-ui/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import TopBar from '../UserPage/TopBar';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from "axios";
import Track from './Track'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import Trip from '../Trip/Trip'
import TripsFunction from './TripsFunction';
import MembersFunctions from './MembersFunctions'
import Chat from '../Chat/Chat';
import {Fab} from '@material-ui/core';
import FileUpload from '../FileUpload/FileUpload';
import { ChatBubble } from '@material-ui/icons';
const drawerWidth = 300;


const styles = theme => ({
    root: {
        display: 'flex',
      },
     
      drawer: {
          zIndex : "-1",
          flexShrink: 0,
          
      
      },
      paper: {
    backgroundColor: "#a2adff",
    color: 'white'
  },
      
      content: {
        flexGrow: 1,
        padding: 40,
        margin:20,
        position:"absolute",
        left:"15em",
        top:"1em"
      },
      
      chatBox: {
        position : 'absolute',
        right:'40px',
        bottom:'25px',
        cursor:'pointer',

      }
      
    
    
  });

class Dashboard extends Component{
    constructor(props) {
      super(props)
    
      this.state = {
          members:[],
          navigate:"",
          trips:[],
          toggleChat : false
         
      }
      this.listMembersHandler=this.listMembersHandler.bind(this);
      this.handleNavigation=this.handleNavigation.bind(this);
      this.handleElse=this.handleElse.bind(this)
    }

    listMembersHandler = () =>{
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
      }

     

      componentDidMount() {
        this.listMembersHandler();
      }

      handleNavigation(){
          this.setState({"navigate":"track"})
      }

      handleElse(){
        this.setState({"navigate":""})
      }
    
    render(){
        let middle
        if(this.state.navigate=="track")
        {
            middle=(<div><Track members={this.state.members}/></div>)
        }
        if(this.state.navigate=="trips")
        {
            middle=(<div><TripsFunction  /></div>)
        }
        if(this.state.navigate=="members")
        {
            middle=(<div><MembersFunctions  /></div>)
        }
        if(this.state.navigate == 'files'){
          middle = (<div><FileUpload /></div>)
        }
        const { classes } = this.props;
        let chatBox = (this.state.toggleChat) ? <Chat /> : null;

        return (
            <div className={classes.root}>

     <TopBar/>
      <Drawer variant="permanent" className={classes.drawer}  classes={{ paper: classes.paper }} >
        <div className={classes.toolbar} />
        <Divider/>
        <List button style={{width:"17em"}}>
        
        <p><br/><br/></p>
        <ListItem>
        <p onClick={()=>this.setState({"navigate":"chat"})} style={{cursor:"pointer",position:"relative",left:"3em",fontFamily:'Quicksand',fontWeight:"bolder",fontSize:"1.3em"}}>{String(sessionStorage.getItem("group"))}
        </p></ListItem>
        <Divider/>
        {/* <ListItem>
        <ListItemText primary="Chat" style={{cursor:'pointer',textAlign:'center'}}  onClick={()=>this.setState({"navigate":"chat"})}
       ></ListItemText></ListItem> */}
       {/* <Divider/> */}
       <ListItem>
       <ListItemText primary="Members" style={{cursor:'pointer',textAlign:'center'}}  onClick={()=>this.setState({"navigate":"members"})}
      ></ListItemText></ListItem>
      <Divider/><Divider/>
        <ListItem>
        
        <ListItemText primary="Trips" style={{cursor:'pointer',textAlign:'center'}}  
        onClick={()=>{this.setState({"navigate":"trips"})}}
       ></ListItemText>
      </ListItem> 
        <Divider/>
      <ListItem>
      <ListItemText primary="Track" style={{fontFamily:'Quicksand',cursor:'pointer',textAlign:'center'}}  
      onClick={this.handleNavigation}></ListItemText></ListItem>
      <Divider/>
        <ListItem>
        <ListItemText primary="Bill Splitter" style={{cursor:'pointer',textAlign:'center'}}  
        onClick={this.handleElse}
       ></ListItemText></ListItem>
       <Divider/>
       
        </List>
        <ListItem>
        <ListItemText primary="Files" style={{cursor:'pointer',textAlign:'center'}}  onClick={()=>{this.setState({navigate:'files'})}}
       ></ListItemText></ListItem><Divider/>
      </Drawer>
      <main className={classes.content}>
      <div>{middle}</div></main>
      {chatBox}
        <Fab color="primary" aria-label="add" className={classes.chatBox}
        onClick={()=>this.setState({toggleChat : !this.state.toggleChat})}>
          <ChatBubble />
        </Fab>
    </div>
 
        )
    }
}

export default withStyles(styles)(Dashboard);