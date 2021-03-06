import React from "react";
import ReactDOM from "react-dom";
import { RouteComponentProps } from 'react-router';
import { geoCode,reverseGeoCode } from '../../mapHelpers';
import FindAddressPresenter from './FindAddressPresenter';

interface IState {
  lat: number;
  lng: number;
  address: string;
}

interface IProps extends RouteComponentProps<any>{
  google: any;
}

class FindAddressContainer extends React.Component<IProps,IState>{
  public mapRef: any;
  public map: google.maps.Map;
  public state = {
    address: "",
    lat: 0,
    lng: 0
  }

  constructor(props){
    super(props);
    this.mapRef = React.createRef();
    console.log("2",this.mapRef);
  }

  public componentDidMount(){
    console.log(this.mapRef);
    navigator.geolocation.getCurrentPosition(
      this.handleGeoSucces,
      this.handleGeoError
      );
  }

  public handleGeoSucces: PositionCallback = (position: Position) => {
    const {
      coords: {latitude, longitude} 
    } =  position;
    this.setState({
      lat: latitude,
      lng: longitude
    })
    this.loadMap(latitude,longitude);
    this.reverseGeocodeAddress(latitude, longitude);
  };

  public handleGeoError: PositionErrorCallback = () => {
    console.log("No loacation");
  };

  public loadMap = (lat, lng) => {
    console.log("1",this.mapRef);
    const { google } = this.props;
    const maps = google.maps;
    const mapNode = ReactDOM.findDOMNode(this.mapRef.current);
    const mapConfig: google.maps.MapOptions ={
      center:{
        lat,
        lng        
      },
      disableDefaultUI: false,
      minZoom: 8,
      zoom:11,

    };
    this.map = new maps.Map(mapNode,mapConfig);
    this.map.addListener("dragend",this.handleDragEnd)
  }
  
  public handleDragEnd = async () => {
    const newCenter = this.map.getCenter();
    const lat = newCenter.lat();
    const lng = newCenter.lng();
    this.setState({
      lat,
      lng
    });
    this.reverseGeocodeAddress(lat,lng);
  }

  public render(){
    const {address} = this.state;
    return (
      <FindAddressPresenter 
        mapRef={this.mapRef}
        address={address}
        onInputChange={this.onInputChange}
        onInputBlur={this.onInputBlur}
        onPickPlace={this.onPickPlace}
      />
    )
  }

  public onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: {name, value}
    } = event;
    this.setState({
      [name]: value
    } as any);
  };
  public onInputBlur = async () =>{
    const {address} = this.state;
    const result = await geoCode(address);
    if(result !== false){
      const {lat , lng, formatted_address} = result;
      this.setState({
        address:formatted_address,
        lat,
        lng
      });
      this.map.panTo({ lat, lng });
    };
  };
  public reverseGeocodeAddress =  async (lat: number, lng: number) => {
    const reversedAddress = await reverseGeoCode(lat, lng);
    if( reversedAddress !== false){
      this.setState({
        address : reversedAddress
      });
    }
  };

  public onPickPlace = () => {
    const { address, lat, lng } = this.state;
    const { history } = this.props;
    history.push({
      pathname: "/add-place",
      state: {
        address,
        lat,
        lng
      }
    });
    console.log(address,lat,lng);
  }
}

export default FindAddressContainer;