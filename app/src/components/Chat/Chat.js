import React,{Component} from 'react';
import { withStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import SendIcon from '@material-ui/icons/Send'
import {Divider, Typography,ListItem ,List,Fab, TextField, ListItemText} from '@material-ui/core'
import axios from "axios";
import './chat_scroll.css'
import CircleRipple from 'material-ui/internal/CircleRipple';
import { LinearProgress, CircularProgress } from 'material-ui';
// import { forEach } from 'gl-matrix/src/gl-matrix/vec2';
import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded';

const styles = theme => ({

    root: {
        display: 'flex',
        flexDirection : 'column',
        position:'absolute',
        bottom:'10%',
        right:'0',
        maxHeight:'85%',
        padding:'10px',
        '&::webkit-scrollbar':{
            width:'0'
        }
      },
      inline: {
        display: 'inline',
      },
      chatControl:{
          marginTop:'10px'
      },
      chatBox:{
        overflow:'auto',
        marginBottom:'10px'
      },
      textField:{
        width:'300px'
      },
      
      paper: {
        backgroundColor: "#a2adff",
        color: 'white'
    },
        
  });

let messagesEndRef = React.createRef()

class Chat extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            chatData : [],
            msg : ''
        }
        
    }

    chatCaller = 0


    getChats = () =>{
        
        const url = 'http://localhost:5000/chat/' + 
        String(sessionStorage.getItem('group'))
        axios.get(url)
        .then(response=> {
            if(this.state.chatData != response.data){
                this.setState({
                    chatData : response.data
                })
            }
            console.log('[CHAT DATA] : ',response)
        }).catch(err => {

        })

    }

    componentDidMount(){
        this.chatCaller = setInterval(
            this.getChats,
            1000
        );
    }

    componentWillUnmount(){
        clearInterval(this.chatCaller)
    }

    scrollToBottom() {
        const scrollHeight = this.el.scrollHeight;
        const height = this.el.clientHeight;
        const maxScrollTop = scrollHeight - height;
        this.el.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
    
    postChat = () =>{
        
        const msg = this.state.msg;
        if(msg.length == 0){
            return 0;
        }
        console.log('[POSTING]')

        const url = 'http://localhost:5000/chat'
        axios.post(url,{
            'username' : String(sessionStorage.getItem('userData')),
            'group' : String(sessionStorage.getItem('group')),
            'msg' : msg
        }).then(response=>{
            this.setState({
                msg : ''
            })
            this.getChats()
        }).catch(err=>{

        })

    }
    
    updateMessage =(e)=>{
        this.setState({
            msg : e.target.value
        })
    }

    render(){
        
        const { classes } = this.props;
        let chatBox = null;
        if(this.state.chatData){
            const username = String(sessionStorage.getItem('userData'))
            chatBox = (
                <List className={classes.chatBox}
                    ref={el => { this.el = el; }}
                >
                {/* <Fab color="primary" aria-label="add" className={classes.fab}
                    onClick={this.scrollToBottom}>
                        <KeyboardArrowDownRoundedIcon />
                    </Fab> */}
                {this.state.chatData.map((val,index)=>{
                    let lr = 'left';
                    let sender = val.sender;
                    let content = 'flex-start'
                    if(val.sender == username){
                        lr = 'right'
                        sender = ''
                        content = 'flex-end'
                    }
                    
                    return (
                        <ListItem 
                        style={{textAlign:lr, justifyContent:content}}

                        >
                            <ListItemText
                            className={classes.chatItem}
                            style={{textAlign:lr}}
                            button
                            primary={sender}
                                secondary={
                                    <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        {val.msg}
                                    </Typography>
                                    </React.Fragment>
                                }
                                />
                        </ListItem>
                    )
                })}
                
                </List>
            )
        }else{
            chatBox = <CircularProgress />
        }
        return (
            <Paper className = {classes.root}>
                {chatBox}

                
                <div className={classes.chatControl}>
                    
                    <TextField
                        required
                        placeholder='enter message'
                        name="name"
                        value={this.state.msg}
                        onChange={this.updateMessage}
                        className={classes.textField}
                        margin="normal"
                    />

                    <Fab size='small' color="primary" aria-label="add" className={classes.fab}
                    onClick={this.postChat}>
                        <SendIcon />
                    </Fab>
                </div>
            </Paper>
        );

    }
}

export default withStyles(styles)(Chat);