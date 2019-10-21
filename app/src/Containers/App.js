import React,{Component} from 'react';
import './App.css';
import {withRouter, Route,Link,Switch} from 'react-router-dom';
import Layout from '../hoc/Layout/Layout';
import Register from '../components/Registration/Register';
import Login from '../components/Login/Login';
import Logout from '../components/Logout/Logout';
import HomePage from '../components/HomePage/HomePage';
import DashBoard from '../components/HomePage/DashBoard/DashBoard';

// import DashLayout from '../hoc/Layout/DashLayout';

// import DashBoard from '../components/'

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
    
  console.log("LOGIN___DATA ?? ", this.state)

    let mainBody = (
      <>
        <Switch>
          <Route exact path="/" component = {HomePage} />
          <Route exact path="/user" component = {DashBoard} />
          <Route exact path="/login" component = {Login} />
          <Route exact path="/logout" component = {Logout} />
          <Route exact path="/register" component = {Register} />
        </Switch>
      </>
    );
      
    return (
        <Layout>
          {mainBody}
        </Layout>
    );

  }
}

export default withRouter(App);
