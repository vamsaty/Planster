import React, { Component } from 'react';
import axios from 'axios';
import { List, ListItem,Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

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
    },
  });

class BillSplitter extends Component{
    constructor(){
        super();
        this.state = {
            billSummary : null,
            dues : null
        }
    }

    getSummary = () => {
        console.log('here we are')
        const url = 'http://localhost:5000/api/v1/summary'
        axios.get(url).then(
            response => {
                this.setState({
                    billSummary : response.data
                })
            }
        ).catch(error=>{
            alert('sorry couldn\'t show summary');
        })
    }

    componentDidMount(){
        this.getSummary()
    }


    render(){

        let summary = null;

        if(this.state.getSummary){
            summary = (
                <List>
                    {this.state.billSummary.map((val,index)=>{
                        return (             
                            <ListItem>
                                {val}
                            </ListItem>
                        )
                    })}        
                </List>
            )
        }

        const {classes} = this.props
        return (
            <>
                <Paper className={classes.root}>
                    <h1>here we are</h1>
                    {summary}
                </Paper>
            </>
        );
    }
    
    /* summary
        A pays amount{red} B
    */
}

export default withStyles(styles)(BillSplitter);