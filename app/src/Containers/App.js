import React,{Component} from 'react';
// import logo from '../logo.svg';
import './App.css';
import appcss from './App.module.css';
// import Dashboard from '../Components/Dashboard/Dashboard';
// import ToolBar from '../Components/ToolBar/ToolBar';
import HomePage from '../Components/HomePage/HomePage';
import Normal from '../Components/HomePage/normal';
import ChatApp from './ChatApp/ChatApp';


class App extends Component{
  
  
  render(){

    return (
      <div className={appcss.mainWrapper}>
        <main className={appcss.appMain}>
          
          <HomePage />
          {/* <ChatApp /> */}

        </main>
      </div>
    );
  }
}

export default App;
