import React, { Component } from 'react';

class SendMessageForm extends Component{
    
    constructor(){
        super();
        this.state = {
            message : ''
        }
        // this.handleChange
    }

    handleChange = (e) =>{
        console.log(e.target.value);
        this.setState({
            message : e.target.value
        })
    }

    handleSubmit = (e) =>{
        e.preventDefault();
        // send off message somehow
        console.log(this.state.message)
        this.props.sendMessage(this.state.message);
        this.setState({
            message : ''
        })
    }
    
    render(){


        return (
            <form
                onSubmit = {this.handleSubmit}
            >
                 {/* className={sendMessageForm}> */}
                
                <input 
                    onChange={this.handleChange}
                    placeholder={"Type your message here"}
                    value = {this.state.message }
                    type="text" 
                />

            </form>
        );
    }
}

export default SendMessageForm;