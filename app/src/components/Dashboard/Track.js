import React,{ Component } from 'react'
import axios from "axios";
import { Map, GoogleApiWrapper,Marker,InfoWindow } from 'google-maps-react';
import pointer from '../../assets/images/clocation.png'
const TOKEN="pk.eyJ1Ijoic2phZG9uIiwiYSI6ImNrMnZ2dDhjajA4cGkzZHBnNGJwdGx3eGoifQ.cochyrkRr-f87PZXJCo4Ww"


const mapStyles = {
  width: '60em',
  height: '30em',
};

class Track extends Component{

  constructor(props) {
    super(props)
    this.state = {
      latitude:0,
      longitude:0,
      popupInfo: null,
      friends_coordinates:[],
      l:0,
      lo:0,
  }
    this.trackLocation=this.trackLocation.bind(this)
    this.display=this.display.bind(this)
  }




trackLocation()
  {
    navigator.geolocation.getCurrentPosition(
      position => {
        const location = JSON.stringify(position);
        console.log(position)
        let lat=position.coords.latitude
        let long =position.coords.longitude
        this.setState({latitude:position.coords.latitude,
        longitude:position.coords.longitude})
      },
      error => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    axios.post('http://localhost:5000/api/v1/setlocation/'+String(sessionStorage.getItem("Name")),
      {'latitude':this.state.latitude ,'longitude':this.state.longitude })
      .then( response => {})
      .catch(error => {});
        var i;
        var coordinates=[]
        for(i=0;i<this.props.members.length;i++)
        {
          let x=[]
          if(this.props.members[i]==String(sessionStorage.getItem("Name")))
          continue;
          axios.get('http://localhost:5000/api/v1/getlocation/'+this.props.members[i])
          .then( response => {
            x.push(response.data.latitude)
            x.push(response.data.longitude)
            x.push(response.data.name)
            coordinates.push(x)
            //  console.log(coordinates)
            this.setState({l:response.data.latitude,lo:response.data.longitude})    })
          .catch(error => {});
        }
      this.setState({friends_coordinates:coordinates}) 
  }

componentDidMount()
{
  this.trackLocation()
  setInterval(this.trackLocation,3000)
}

display = () =>
{
  console.log(this.state.index)
  var d=document.getElementById(this.state.index)
  d.style.display="block"
}


distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist.toFixed(3);
	}
}

render() {  
    return (
        <div>
        <Map
        google={this.props.google}
        zoom={15}
        style={mapStyles}
        initialCenter={{ lat:12.935599, lng:  77.534564}}
      >
        <Marker options={{icon: {url: require('../../assets/images/clocation.png'), scaledSize: {width: 32, height: 32}}}} position={{ lat: this.state.latitude, lng: this.state.longitude}} />
        <InfoWindow position={{ lat: this.state.latitude+0.0016, lng: this.state.longitude}} visible={true}>
            <div>
              Me
            </div>
        </InfoWindow>
        {this.state.friends_coordinates.map( (val, ind) => (
         
          <Marker options={{icon: {url: require('../../assets/images/flocation.png'), scaledSize: {width: 32, height: 32}}}} position={{lat:val[0] ,lng:val[1] }}>
          </Marker>
          
        
        ))}    
        {this.state.friends_coordinates.map( (val, ind) => (
         
          <InfoWindow position={{lat:val[0]+0.0017,lng:val[1] }} visible={true}>
          <div>
           {val[2]}
          </div>
      </InfoWindow>
          
        
        ))}    
      </Map>

        </div>
    );
}
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCOy5dPWYI2XWvR4c99GcnL76PxdoCZm-U'
})(Track);