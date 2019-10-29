import React,{Component} from 'react';
import {withRouter, Route,Link,Switch} from 'react-router-dom';
import Register from '../components/HomePage/Register/Register';
import Login from '../components/HomePage/Login/Login';
import HomePage from '../components/HomePage/HomePage';
import UserPage from '../components/UserPage/UserPage'
import { classes } from 'istanbul-lib-coverage';


class App extends Component{
  
  state = {
    userLoggedIn : false
  }

  componentWillMount(){
    if(sessionStorage.getItem("userData")){
      this.setState({
        userLoggedIn : true
      });
    }else{
      this.setState({
        userLoggedIn : false
      });
    }
  }

  render(){
    
    let mainBody = (
        <Switch>
          <Route exact path="/" component = {HomePage} />
          <Route path="/user" component = {UserPage} />
          <Route exact path="/login" component = {Login} />
          <Route exact path="/register" component = {Register} />
        </Switch>
    );
      
    return (
      <div>
        {mainBody}
      </div>         
    );

  }
}

export default withRouter(App);