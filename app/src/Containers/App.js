import React,{Component} from 'react';
// import logo from '../logo.svg';
import './App.css';
import appcss from './App.module.css';
import HomeIcon from '@material-ui/icons/Home';
// import Dashboard from '../Components/Dashboard/Dashboard';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box';
import Login from '../Components/Login/Login';
import Register from '../Components/Register/Register';
// import ToolBar from '../Components/ToolBar/ToolBar';
import HomePage from '../Components/HomePage/HomePage';
import Normal from '../Components/HomePage/normal';
import ChatApp from './ChatApp/ChatApp';
import { register } from '../serviceWorker';


class App extends Component{
  
  constructor(){
    super();
    this.state = {
      toggleLogin : false,
      toggleSignup : false
    };

  }
  
  toggleLoginHandler=()=>{
    const loginVal = this.state.toggleLogin;
    this.setState({
      toggleLogin : !loginVal
    })
  }

  toggleSignupHandler=()=>{
    const signupVal = this.state.toggleSignup;
    this.setState({
      toggleSignup : !signupVal
    })
  }

  goToHomePage = () =>{
    this.setState({
      toggleLogin : false,
      toggleSignup : false
    })
  }

  

  render(){
    const st = {
      position:'absolute',
      right : 0
    }
    const homeButton = (
      <Box component="span" m={1} style={st}>
        <Button onClick={this.goToHomePage}>
            <HomeIcon />
        </Button>
      </Box>
    );


    let contentToShow = (
      <>
        <Button variant="contained" 
          color="primary" 
          className={appcss.homeButton} 
          onClick={this.toggleLoginHandler}
        >
            LOG IN
        </Button>

        <Button variant="contained" 
          color="secondary" 
          className={appcss.homeButton} 
          onClick={this.toggleSignupHandler}
        >
            SIGN UP
        </Button>
      </>
    );

    if(this.state.toggleLogin){
      contentToShow = (
        <Login />
      );
    }else if(this.state.toggleSignup){
      contentToShow = (
        <Register 
          showSignup={this.toggleSignupHandler}
        />
      );
    }

    return (
      <>  
        {homeButton}
    
        <Box color={"text.primary"} className={appcss.mainWrapper}>
          
          {contentToShow}
      
        </Box>
      </>
    );
  }
}

export default App;
