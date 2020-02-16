import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import toastr from '../notification/Toastr';
import geocode from '../controls/Geocode';

const mapStyles = {
    width: '100%',
    height: '100%'
};


class orderMap extends Component {

    state = {
        data: {
            init_conditions: {
                lat: 8.500000,
                lng: 4.550000,
                zoom: 14,
            },
            accessories: {
                showingInfoWindow: false,
                activeMarker: {},
                selectedPlace: {}
            },
            order: {
                pickup_address: {
                    lat: "",
                    lng: ""
                },
                C_location: {
                    lat: "",
                    lng: ""
                }
            }
        }
    };

    //SEND REQUEST TO THE API WITH TOKEN AND ORDER ID AS QSRING.
    //FOR THE SINGLE ORDER 
    //---- GET THE CURRENT LOCATION AND DESTINATION ADDRESS 
    //-----GEOCODE THE ADDRESS. I.E CONVERT TO LAT AND LNG
    //STORE IN THE STATE TO BE REF BY MARKER ON THE MAP


    componentDidMount() {
        const token = sessionStorage.getItem('token');
        if (!token) {
            toastr.warning('YOU ARE NOT SIGNED IN');
            this.props.history.push('/login');
        } else if (token) {

            const queryId = this.props.match.params.id;

            fetch('https://s-i-api.herokuapp.com/api/v1/map?ordCk=' + queryId, {
                method: "GET",
                headers: {
                    Authorization: token
                }

            }).then(res => {
                return res.json();
            }).then(data => {
                const pickup_address = data[0].pickup_address;
                const c_location = data[0].c_location;
                const pickupData = {
                    field: 'pickup_address',
                    val: pickup_address
                };
                const cLocationData = {
                    field: 'C_location',
                    val: c_location
                };
                geocode(pickupData, this);
                geocode(cLocationData, this);


            })

        }


    }

    //OPEN INFORMATION WINDOW FOR LOCATION MARKERS

    handleMarkerClick = (props, marker, e) => {
        const dataCopy = { ...this.state.data };
        dataCopy.accessories.selectedPlace = props;
        dataCopy.accessories.activeMarker = marker;
        dataCopy.accessories.showingInfoWindow = true;
        this.setState({
            data: dataCopy
        })
    }


    // REACT TO CLOSE BUTTON ON THE INFORMATION WINDOW TO BE CLOSED

    handleInfoClose = () => {
        const copyData = { ...this.state.data };
        if (this.state.data.accessories.showingInfoWindow) {
            copyData.accessories.showingInfoWindow = false;
            copyData.accessories.activeMarker = null;
            this.setState({
                data: copyData
            })

        }
    }


    render() {
        return (
            <div>
                <h4>WAREHOUSE,  PICKUP ADDRESS, DESTINATION ADDRESS</h4>
                <Map style={mapStyles}
                    google={this.props.google}
                    initialCenter={{
                        lat: this.state.data.init_conditions.lat,
                        lng: this.state.data.init_conditions.lng
                    }}
                    zoom={this.state.data.init_conditions.zoom}>
                    <Marker onClick={this.handleMarkerClick} name={'PAKAGE WAREHOUSE'}
                        position={{ lat: this.state.data.init_conditions.lat, lng: this.state.data.init_conditions.lng }} />

                    <Marker onClick={this.handleMarkerClick} name={'PAKAGE PICKUP ADDRESS'}
                        position={{ lat: this.state.data.order.pickup_address.lat, lng: this.state.data.order.pickup_address.lng }} />


                    <Marker onClick={this.handleMarkerClick} name={'PAKAGE CURRENT LOCATION'}
                        position={{ lat: this.state.data.order.C_location.lat, lng: this.state.data.order.C_location.lng }} />

                    <InfoWindow marker={this.state.data.accessories.activeMarker}
                        visible={this.state.data.accessories.showingInfoWindow} onClose={this.handleInfoClose} >
                        <div>{this.state.data.accessories.selectedPlace.name}</div>
                    </InfoWindow>
                </Map>
            </div>

        )
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyDoduk96MV36i6RJFgvo80FqZTFBZj2k1M'
})(orderMap)
