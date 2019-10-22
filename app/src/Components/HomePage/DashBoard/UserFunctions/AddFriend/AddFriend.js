import React,{Component} from 'react';
import axios from 'axios';


class AddFriend extends Component{

    constructor(){
        super();
        this.state = {
            friendName : '',
            show : false,
            status : null,
        }
    }


    addFriendHandler=()=>{
        axios.post('http://localhost:5000/api/v1/add_friend/'+String(this.state.friendName) + '/' + String(sessionStorage.getItem("userData")) ).
        then((res)=>{
            this.setState({
                friendName : '',
                show : true,
                status : null
            });
            console.log("friend adding",res)
        }).catch((error)=>{
            this.setState({
                status : "error"
            })
        })
    }
    
    render(){
        
        let err = null;
        if(this.state.show){
            err = <h3>
                ADDed {this.state.friendName}
            </h3>;
        }
        
        if(this.state.status){
            err = (
                <h3 onClick={()=>{
                    this.setState({
                        status : null,
                        show : false,
                        friendName : ''
                    })
                }}>
                    ERROR CAN'T FIND THE USER
                </h3>
            );
        }

        return(
            <div>
                {err}
                <input type="text" value = {this.state.friendName} onChange = {(e)=>{
                        this.setState({
                            friendName : e.target.value
                        })
                    }} />
                <button onClick = {this.addFriendHandler}>
                    ADD FRIEND
                </button>
            </div>
        );
    }

}

export default AddFriend;