import React,{ useState,Component } from 'react'
import ReactMapGL, {LinearInterpolator, FlyToInterpolator} from 'react-map-gl';
import MapGL, {NavigationControl, Marker,Popup} from 'react-map-gl';
import { Icon } from 'semantic-ui-react';
import pointer from '../../assets/images/clocation.png'
import friend from '../../assets/images/flocation.png'
import axios from "axios";
const TOKEN="pk.eyJ1Ijoic2phZG9uIiwiYSI6ImNrMnZ2dDhjajA4cGkzZHBnNGJwdGx3eGoifQ.cochyrkRr-f87PZXJCo4Ww"

const geolocateStyle = {
  float: 'left',
  margin: '50px',
  padding: '10px'
};

const navStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
};

const markerList=[
    {lat: 17.441013, 
    long: 78.391796,
    info: 10},
    { lat:17.442889, 
    long: 78.396073,
    info: 20},
    {lat: 17.441681, 
    long: 78.394357,
    info: 10}
    ];
class Track extends Component{

  constructor(props) {
    super(props)
  
    this.state = {
      viewport: {
          width: 950,
          height: 550,
          latitude: 17.442120,  
          longitude: 78.391384,
          zoom: 14
      },
      popupInfo: null,
  }
    
    this.getLocation=this.getLocation.bind(this)
  }

  

findCoordinates = () => {
  navigator.geolocation.getCurrentPosition(
    position => {
      const location = JSON.stringify(position);
      console.log(position)
      let lat=position.coords.latitude
      let long =position.coords.longitude
        this.setState({viewport:{...this.state.viewport,latitude:position.coords.latitude,longitude:position.coords.longitude}});
      

    },
    error => alert(error.message),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  );
};
_onViewportChange = viewport => {
    this.setState({viewport});
};

setpopup = () => {
  this.setState({popupInfo: true})
}

delpopup = () => {
  this.setState({popupInfo: null})
}

renderPopup(index){
  return this.state.popupInfo && (
    <Popup tipSize={5}
      anchor="bottom-right"
      longitude={markerList[index].long}
      latitude={markerList[index].lat}
      onMouseLeave={() => this.setState({popupInfo: null})}
      closeOnClick={true}>
      <p>Available beds:{markerList[index].info}</p>
    </Popup>
  )
}

 getLocation()
  {
    axios.post('http://localhost:5000/api/v1/setlocation/'+String(sessionStorage.getItem("userData")),
      {'latitude':this.state.viewport.latitude,'longitude':this.state.viewport.longitude})
      .then( response => {
        })
        .catch(error => {
         
        });
    axios.get('http://localhost:5000/api/v1/getlocation/'+String(sessionStorage.getItem("userData")))
      .then( response => {
        
        const min = 0.001;
    const max = 0.005;
    const rand = min + Math.random() * (max - min);
        this.setState({viewport:{...this.state.viewport,latitude:response.data.latitude+rand,longitude:response.data.longitude - rand}});
        
        })
        
        .catch(error => {
         
        });
        console.log(this.state.viewport.latitude)
        console.log(this.state.viewport.longitude)
  }
componentDidMount()
{
  this.getLocation();
  setInterval(this.getLocation,10000)
}

render() {
    return (
        <div>
            <ReactMapGL
            {...this.state.viewport} onViewportChange={this._onViewportChange}
            mapStyle="mapbox://styles/mapbox/streets-v10"
            mapboxApiAccessToken={TOKEN} >
            <div className="nav" style={navStyle}>
          <NavigationControl onViewportChange={this._onViewportChange}/>
          <Marker latitude={this.state.viewport.latitude} longitude={this.state.viewport.longitude} offsetLeft={-20} offsetTop={-10}>
          <img style={{width:"1.8em"}} src={pointer}/>
        </Marker>
        <Marker latitude={this.state.viewport.latitude+0.01} longitude={this.state.viewport.longitude-0.011} offsetLeft={-20} offsetTop={-10}>
          <img style={{width:"1.8em"}} src={friend}/>
        </Marker>
        <Marker latitude={this.state.viewport.latitude+0.02} longitude={this.state.viewport.longitude+0.003} offsetLeft={-20} offsetTop={-10}>
          <img style={{width:"1.8em"}} src={friend}/>
        </Marker>
              
       </div>
          </ReactMapGL>
          
        </div>
    );
}
}

export default Track