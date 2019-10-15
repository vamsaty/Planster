import React, { Component } from 'react';
import Message from '../Message/Message';

// const DUMMY_DATA = [
//     {
//         senderId : 'satyam',
//         text : 'here'
//     },
//     {
//         senderId : 'satyam2',
//         text : '123here'
//     },
//     {
//         senderId : 'satyam1',
//         text : 'therehere'
//     }
// ]

class MessageList extends Component {
    render(){
        console.log("Inside MessageList",this.props.messages)
        return (
            <div className={"message-list"}>
                {this.props.messages.map((msg,index)=>{
                    return(
                        <Message 
                            key = {msg.senderId+index}
                            username = {msg.senderId}
                            message = {msg.text} />
                    );
                })}
            </div>
        );
    };
}


export default MessageList;