import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import {GridList,Grid, Paper,GridListTile, Fab, IconButton, Divider, CircularProgress} from '@material-ui/core';
import {Add as AddIcon, AccessAlarmRounded, RefreshRounded, DeleteForeverRounded} from '@material-ui/icons';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import axios from 'axios';
import { sequenceExpression } from '@babel/types';


const useStyles = theme => ({
    root: {
      display: 'flex',
    //   minWidth:'700px',
      paddingTop:'60px',
      flexWrap: 'wrap',
      flexDirection:'column',
      justifyContent: 'center',
      alignItems : 'center',
      overflow: 'hidden',
    },
    gallery:{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    },
    gridList: {
      width: '70%',
      maxHeight: '700px',
      padding:0
    },
    fab : {
        margin : '5px 5px 5px 0px'
    }
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

        console.log('getting gallery')
        const url = 'http://localhost:5000/show_gallery/'+String(sessionStorage.getItem('group'))
        axios.get(url)
        .then(response => {
            this.setState({
                gallery : response.data
            })
            
        })
        .catch(err=>{

        })
    }

   
    handleSubmit = (e) =>{
        e.preventDefault()
        
        const formData = new FormData();
        formData.append('file',this.state.file)
        formData.append('group', String(sessionStorage.getItem('group')))
        
        // formData.append('filename', this.fileName.value);
        
        const url = 'http://localhost:5000/file_upload';

        axios.post(url,formData)
        .then(response => {
            // console.log('[RESPONSE] : ', response)
            this.getGallery()
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
        
        if(this.state.gallery){
            let ncols = 4
            if(this.state.gallery.length < 4)
                ncols = this.state.gallery.length
            let cHeight = 160
            if(ncols < 4){
                cHeight = 300
            }
            gallery = (
                <GridList cellHeight={cHeight} className={classes.gridList} cols={ncols}>
                    {
                        this.state.gallery.map((tile,ind) => {
                            const hit = atob(tile['$binary'])
                            return (
                                <GridListTile key={ind} cols={1}
                                    >
                                        {/* <DeleteForeverRounded onClick={} /> */}
                                    <img src = {"data:image/jpeg;base64," + hit} />
                                </GridListTile>
                            )
                        })
                    }
                </GridList>
            )
        }else{
            gallery = (
                <GridList cellHeight={160} className={classes.gridList} cols={1}>
                    <CircularProgress />
                </GridList>
            )
        }

        let fileName = 'Select Files';
        if(this.state.file){
            fileName = this.state.file.name
        }

        
        let formE = (
            <form style={{padding : '10px', position:'fixed',bottom:'50px',right:'33.5%'}} onSubmit={this.handleSubmit} method = "POST" enctype = "multipart/form-data">
            <label class="fileContainer">
                {fileName}
                <input type="file" onChange={this.onFileChange}/>
            </label>

            <Fab color="primary" aria-label="add" className={classes.fab} type="submit">
                <ArrowUpwardIcon />
            </Fab>
            
        </form>
        );

        let showTime = formE;
        if(this.state.gallery){
            showTime = (
                <>
                <Grid className={classes.gallery}>
                    {gallery}
                </Grid>
                <Divider/>
                <Divider/>
                <Grid>
                    {formE}
                   
                </Grid>
                </>
            )
        }

        return (
            <Grid className={classes.root}>
                {showTime}
            </Grid>
        );
    }

}

export default withStyles(useStyles)(FileUpload);