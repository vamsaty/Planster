import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import {GridList,Grid, Paper,GridListTile, Fab, IconButton, Divider} from '@material-ui/core';
import {Add as AddIcon, AccessAlarmRounded, RefreshRounded} from '@material-ui/icons';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import axios from 'axios';
import { sequenceExpression } from '@babel/types';


const useStyles = theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection:'column',
      justifyContent: 'space-around',
      overflow: 'hidden',
    //   backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      width: 500,
      height: 450,
    },
  });
  

class FileUpload extends Component{

    constructor(){
        super();
        this.state = {
            gallery : null,
            file : null,
            imageURL : null
        }
    }

    getGallery = () =>{
        const url = 'http://localhost:7000/show_gallery/'+String(sessionStorage.getItem('group'))
        axios.get(url)
        .then(response => {
            this.setState({
                gallery : response.data
            })
            console.log(this.state.gallery)
        })
        .catch(err=>{

        })
    }

   
    handleSubmit = (e) =>{
        e.preventDefault()
        
        const formData = new FormData();
        formData.append('file',this.state.file)
        formData.append('group', String(sessionStorage.getItem('group')))
        // console.log('[FORM_DATA]', formData.getAll())
        // formData.append('filename', this.fileName.value);
    
        const url = 'http://localhost:7000/file_upload';

        axios.post(url,formData)
        .then(response => {
            console.log('[RESPONSE] : ', response)
        })
        .catch(err=>{

        })

    }
    
      
    componentDidMount(){
        //fetch
        this.getGallery()
    }

    onFileChange = (e) =>{
        this.setState({
            file : e.target.files[0]
        })
    }

    render(){


        const {classes} = this.props;
        const tileData = [
            {
                img : 'ad',
                title : 'Image',
                author : 'er',
                cols : 2,
            }
        ]

        let gallery = null;
        console.log(this.state.gallery)

        if(this.state.gallery){
            gallery = (
                this.state.gallery.map((tile,ind) => {
                    const hit = atob(tile['$binary'])
                    console.log(hit)
                    return (
                        <GridListTile key={ind} cols={1}>
                            <img src = {"data:image/jpeg;base64," + hit} />
                        </GridListTile>
                    )
                })
            )
        }

        return (
            <div className={classes.root}>
                <GridList cellHeight={160} className={classes.gridList} cols={3}>
                    {gallery}
                </GridList>
            <Divider/>
            <Divider/>
            <Grid>
                <Paper>
                <form onSubmit={this.handleSubmit} method = "POST" enctype = "multipart/form-data">
                    <label class="fileContainer">
                        Click here to trigger the file uploader!
                        <input type="file"/>
                    </label>

                    <Fab color="primary" aria-label="add" className={classes.fab}>
                        <ArrowUpwardIcon />
                    </Fab>
                    <Fab color="primary" aria-label="add" className={classes.fab} onClick={this.getGallery}>
                        <RefreshRounded />
                    </Fab>
                </form>
                </Paper>

            </Grid>
            </div>
        );
    }

}

export default withStyles(useStyles)(FileUpload);