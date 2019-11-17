import React, { Component } from 'react';
import Chatkit from '@pusher/chatkit-client';
import chatcss from './chatbox.module.css';
import MessageList from '../../Components/ChatComponents/MessageList/MessageList';
import SendMessageForm from '../../Components/ChatComponents/MessageForm/SendMessageForm';


import { tokenUrl, instanceLocator } from './config';
import RoomList from './RoomList/RoomList';


class ChatApp extends Component{

    constructor(){
        super();
        this.state = {
            messages : []
            // currentUser : null
        }
    }

    componentDidMount(){
        const chatManager = new Chatkit.ChatManager({
            instanceLocator,
            userId : 'user1',
            
            tokenProvider : new Chatkit.TokenProvider({
                url : tokenUrl
            })
        })

        chatManager.connect()
        .then(currentUser => {
            this.currentUser = currentUser;
            console.log("current User : ", currentUser);
            this.currentUser.subscribeToRoom({
                roomId : '51802dd0-5e61-40f3-a806-30f7b6174aa3',
                // messageLimit : 10,
                hooks : {
                    
                    onMessage : message => {
                        this.setState({
                            messages : [...this.state.messages,message]
                        });
                    }

                }
            })
            console.log(this.state.messages)
        })

    }
    
    sendMessage = (text) =>{
        this.currentUser.sendMessage({
            text,
            roomId : '51802dd0-5e61-40f3-a806-30f7b6174aa3',
        })
    }

    render(){
        
        // console.log("this.state.messages : ",this.state.messages)

        return(
            <div className={chatcss.chatBoxBody} >
                <RoomList />
                <MessageList messages = {this.state.messages} />
                <SendMessageForm sendMessage = {this.sendMessage} />
            </div>
        );
    };
}

export default ChatApp;