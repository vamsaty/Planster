import React,{Component} from 'react';
import {withRouter, Route,Link,Switch} from 'react-router-dom';
import Register from '../components/HomePage/Register/Register';
import Login from '../components/HomePage/Login/Login';
import HomePage from '../components/HomePage/HomePage';
<<<<<<< HEAD:app/src/Containers/App.js
import UserPage from '../components/UserPage/UserPage';
import { classes } from 'istanbul-lib-coverage';
import Dashboard from '../components/Dashboard/Dashboard';
import Temp from '../components/FileUpload/Temp';

=======
import UserPage from '../components/UserPage/UserPage'
import { classes } from 'istanbul-lib-coverage';
import Dashboard from '../components/Dashboard/Dashboard'
import Trips from '../components/Trip/Trip'
>>>>>>> Shivangi:app/src/containers/App.js
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
          <Route exact path="/dashboard" component = {Dashboard} />
<<<<<<< HEAD:app/src/Containers/App.js
          <Route exact path="/file_upload" component = {Temp} />

=======
          <Route exact parth="/dashboard/trip" component={Trips} />
          
>>>>>>> Shivangi:app/src/containers/App.js
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
