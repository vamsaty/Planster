import React from 'react';
import msgcss from './Message.module.css';

const Message = (props) =>{
    return (
        <div className = { msgcss.message }>
            <p className = { msgcss.messageUsername }> 
                { props.username } 
            </p>
            <div className = { msgcss.messageText }> 
                { props.message } 
            </div>
        </div>
    );
}

export default Message;