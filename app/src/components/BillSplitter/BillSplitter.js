import React, { Component } from 'react';
import axios from 'axios';
import { List, ListItem,Paper,TextField, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Payment, CallSplit, Cancel } from '@material-ui/icons';
// import { TextField } from 'material-ui';

const styles = theme =>({
    root: {
      display: 'flex',
      margin:'auto',
      height:'100%',
      width:'100%',
      flexWrap: 'wrap',
      flexDirection:'column',
      justifyContent: 'center',
      alignItems : 'center',
      overflow: 'hidden',
position:"absolute",
left:"300px",
width:"500px",
height:"520px"
    },
    paper:{
        display:'flex',
        padding:'10px',
        marginTop:'20px',
        flexDirection:'column',       
    },record:{
        display:'flex',
        flexDirection:'column',
        // border:'1px solid red',
        maxHeight : '500px',
        overflow:'auto',
        padding:'10px',
        justifyContent:'center',
        alignItems:'center',
        // position:'fixed',
    },
    buttonContainer:{
        display:'flex',
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignItems:'center',
    }
  });

class BillSplitter extends Component{
    constructor(){
        super();
        this.state = {
            billSummary : [],
            record : '',
            dues : null,
            receiver : '',
            sender : '',
            amount : 0
        }
    }

    getSummary = () => {
        console.log('here we are')
        const url = 'http://localhost:5000/api/v1/summary/'+ sessionStorage.getItem('group')
        axios.get(url).then(response => {
                this.setState({
                    billSummary : response.data
                })
                console.log('[SUMMARY RESPONSE] : ', this.state.billSummary)
            }
        ).catch(error=>{
            // alert('sorry couldn\'t show summary');
        })
    }

    componentDidMount(){
        console.log('[GET SUMMARY]')
        this.getSummary()
        
    }

    recordSplit = () =>{

        const sender = this.state.sender
        const amount = this.state.amount

        axios.post('http://localhost:5000/api/v1/split',{
            'paid_by' : sender,
            'amount' : amount,
            'group' : String(sessionStorage.getItem('group'))
        }).then(response=>{
            this.setState({
                receiver : '',
                sender : '',
                amount : 0,
                record : ''
            })
            this.getSummary()
        }).catch(error => {

        })

    }

    recordPay = () =>{
        const sender = this.state.sender
        const receiver = this.state.receiver
        const amount = this.state.amount
        if(!receiver.length || !sender.length){
            return 0;
        }
        for(let i in amount){
            if(!(i>='0' && i<='9')){
                return 0;
            }
        }

        axios.post('http://localhost:5000/api/v1/payment',{
            'sender' : sender,
            'receiver' : receiver,
            'amount' : amount,
            'group' : String(sessionStorage.getItem('group'))
        }).then(response=>{
            this.setState({
                receiver : '',
                sender : '',
                amount : 0,
                record : ''
            })
            this.getSummary()
        }).catch(error => {

        })

    }

    render(){

        let summary = null;
        const {classes} = this.props;
        let recordPayment = null;
        
        if(this.state.record === 'pay'){
            recordPayment = (
                <Paper className={classes.paper} elevation={17}>
                    <Cancel onClick={this.recordSplit} />
                    <TextField label="Paid by" onChange = {(e)=>{this.setState({sender : e.target.value})}} placeholder="Sender" />
                    <TextField label="Receiver" onChange = {(e)=>{this.setState({receiver : e.target.value})}} placeholder="Receiver" />
                    <TextField label="Amount" type='number' onChange = {(e)=>{this.setState({amount : e.target.value})}} placeholder="Amount" />
                    <Button onClick={this.recordPay}>Pay</Button>
                </Paper>
            );
        }else if(this.state.record === 'split'){
            recordPayment = (
                <Paper className={classes.paper} elevation={17}>
                    <Cancel onClick={this.recordSplit} />
                    <TextField label="Sender" onChange = {(e)=>{this.setState({sender : e.target.value})}} placeholder="Sender" />
                    <TextField label="Amount" type='number' onChange = {(e)=>{this.setState({amount : e.target.value})}} placeholder="Amount" />
                    <Button onClick={this.recordSplit}>Split</Button>
                </Paper>
            );
        }else{

        }
        
        if(this.state.billSummary.length){
            summary = this.state.billSummary.map((val,index)=>{
                        return (       
                            <p>{val}</p>
                        );
                    })
        }else{
            summary = (
                <h4 style={{color : 'gray'}}>
                    No expenses
                </h4>
            )
        }
        
        
        return (
            <>
                <Paper className={classes.root} elevation={10}>
                    <h1 style={{position:'absolute',top:'10px'}}>Expense Tracker</h1>
                    {/* {summary} */}
                    <Paper className={classes.record} elevation={24}>
                        {summary}
                        
                        <div className={classes.buttonContainer}>
                            <Button color='primary' variant='outlined' onClick={()=>this.setState({record : 'split'})}><CallSplit color='secondary'/>Split</Button>
                            <Button color='primary' variant='outlined' onClick={()=>this.setState({record : 'pay'})}><Payment size='large'/>Pay</Button>
                        </div>
                        {recordPayment}
                    </Paper>
                </Paper>
            </>
        );
    }
    
    /* summary
        A pays amount{red} B
    */
}

export default withStyles(styles)(BillSplitter);
