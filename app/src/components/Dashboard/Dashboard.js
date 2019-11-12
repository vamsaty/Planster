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
const drawerWidth = 300;


const styles = theme => ({
    root: {
        display: 'flex',
      },
     
      drawer: {
          zIndex : "-1",
          flexShrink: 0,
      
      },
      
      content: {
        flexGrow: 1,
        padding: 40,
        margin:20,
        position:"absolute",
        left:"15em",
        top:"1em"
      },
      
     
    
    
  });

class Dashboard extends Component{
    constructor(props) {
      super(props)
    
      this.state = {
          members:[],
          navigate:"",
          
         
      }
      this.listMembersHandler=this.listMembersHandler.bind(this);
      this.handleNavigation=this.handleNavigation.bind(this)
    }

    listMembersHandler = () =>{
        axios.get('http://127.0.0.1:5000/api/v1/groups/list/members/Gokarna').
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
    
    render(){
        let middle
        if(this.state.navigate=="track")
        {
            middle=(<div><Track/></div>)
        }
        const { classes } = this.props;
        return (
            <div className={classes.root}>
  
     <TopBar/>
      <Drawer variant="permanent" className={classes.drawer} >
        <div className={classes.toolbar} />
        <Divider/>
        <List button style={{width:"17em"}}>
        
        <p><br/><br/></p>
        <ListItem>
        <ListItemText primary="Goa"></ListItemText></ListItem>
        <Divider/>
        <ListItem>
        <ExpansionPanel style={{width:"100%"}}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          
        >
          <Typography className={classes.heading}>Members</Typography>
        </ExpansionPanelSummary>
        
        {this.state.members.map( (val, ind) => (
            <div><ListItem alignItems="flex-start"> 
            <Typography style={{fontFamily:'Quicksand',position:"relative",top:"1.1em"}} >{val}</Typography>
            </ListItem>
            </div>
        ))}
        <p><br></br></p>
        
      </ExpansionPanel>
     
      </ListItem> <Divider/>
        <ListItem>
        <ListItemText primary="Track" onClick={this.handleNavigation}></ListItemText></ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
      <div>{middle}</div></main>
      
    </div>
 
        )
    }
}

export default withStyles(styles)(Dashboard);