import React,{Component} from 'react';
import logo from '../logo.svg';
import './App.css';
import Dashboard from '../Components/Dashboard/Dashboard';
import ToolBar from '../Components/ToolBar/ToolBar';


class App extends Component{
  
  
  render(){

  
    return (
      <div>
        <h1> SE Project Begins </h1>
        <img src={logo} className="App-logo" alt="logo" />
        <Dashboard />
        <ToolBar />
      </div>
    );
  }
}

export default App;
