import React,{ Component } from 'react'
import ReactMapGL from 'react-map-gl';
import  {NavigationControl, Marker,Popup} from 'react-map-gl';
import pointer from '../../assets/images/clocation.png'
import friend from '../../assets/images/flocation.png'
import axios from "axios";
const TOKEN="pk.eyJ1Ijoic2phZG9uIiwiYSI6ImNrMnZ2dDhjajA4cGkzZHBnNGJwdGx3eGoifQ.cochyrkRr-f87PZXJCo4Ww"


const navStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
};


class Track extends Component{

  constructor(props) {
    super(props)
    this.state = {
      viewport: {
          width: 950,
          height: 550,
          latitude: 0,  
          longitude: 0,
          zoom: 14
      },
      popupInfo: null,
      friends_coordinates:[],
      l:0,
      lo:0,
  }
    this.trackLocation=this.trackLocation.bind(this)
    this.display=this.display.bind(this)
  }


_onViewportChange = viewport => {
    this.setState({viewport});
};

trackLocation()
  {
    navigator.geolocation.getCurrentPosition(
      position => {
        const location = JSON.stringify(position);
        console.log(position)
        let lat=position.coords.latitude
        let long =position.coords.longitude
        this.setState({viewport:{...this.state.viewport,latitude:position.coords.latitude,
        longitude:position.coords.longitude}})
      },
      error => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    axios.post('http://localhost:5000/api/v1/setlocation/'+String(sessionStorage.getItem("Name")),
      {'latitude':this.state.viewport.latitude ,'longitude':this.state.viewport.longitude })
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
          <ReactMapGL
            {...this.state.viewport} onViewportChange={this._onViewportChange}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxApiAccessToken={TOKEN} >
            <div className="nav" style={navStyle}>
          <NavigationControl onViewportChange={this._onViewportChange}/>
          <div>
            <Marker latitude={this.state.viewport.latitude} longitude={this.state.viewport.longitude} offsetLeft={-20} offsetTop={-10}>
            <img style={{width:"1.8em"}} src={pointer} />
            </Marker>
          </div>
          {this.state.friends_coordinates.map( (val, ind) => (
          <div key={ind}>
          <Marker latitude={val[0]} longitude={val[1]} offsetLeft={-20} offsetTop={-10}>
          <img style={{width:"1.8em"}} src={friend} onMouseEnter={()=>{this.setState({index:ind})}} onClick={this.display}/>
          </Marker>
          <div id={ind} style={{display:"none"}}>
          <Popup tipSize={5}
          anchor="bottom-right"
          longitude={val[1]}
          latitude={val[0]}
          closeButton={false} closeOnClick={false}
          height="10px">
          <p>{val[2]} {this.distance(this.state.viewport.latitude,this.state.viewport.longitude,val[0],val[1],'K')}km</p>
          </Popup></div></div>
        ))}    
       </div>
          </ReactMapGL>
        </div>
    );
}
}

export default Track