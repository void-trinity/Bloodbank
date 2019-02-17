import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator , Alert, Button } from 'react-native';
import { MapView, Constants, Location, Permissions, Marker } from 'expo';
import axios from 'axios';

export default class MapScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null,
            errorMessage: null,
            bloodbanks: [],
            markerPressed: false
        }
    }
    async componentDidMount() {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({ region: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }});
        axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=21.2497,81.6050&radius=5000&keyword=bloodbank&key=AIzaSyAx3abH7wPpGqWkx9edReEZJfhQ96fclyk')
                .then(({data}) => {
                    console.log(JSON.stringify(data.results));
                    this.setState({ bloodbanks: data.results });
                })
                .catch((error) => {
                    this.setState({ loading: false });
                    Alert.alert('Error', 'Check your connection');
                })
    }
    renderMap() {
        if(this.state.bloodbanks && this.state.bloodbanks.length) {
            return (
                <MapView
                    style={styles.map}
                    region={this.state.region}
                    toolbarEnabled={true}
                    loadingEnabled
                    loadingIndicatorColor={'blue'}
                    loadingBackgroundColor={'white'}
                >
                    <MapView.Marker
                        coordinate={{latitude: this.state.region.latitude, longitude: this.state.region.longitude}}
                        title='Your Location'
                    />
                    {
                        this.state.bloodbanks.map((el, index) =>
                            <MapView.Marker
                                key={index}
                                coordinate={{latitude: el.geometry.location.lat, longitude: el.geometry.location.lng}}
                                title={el.name}
                            />
                        )
                    }
                </MapView>
            )
        } else {
            return(
                <ActivityIndicator />
            )
        }
    }
    render() {
        return (
            <View style={styles.container}>
                {this.renderMap()}
            </View>
    )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        flex: 1
    },
        
    map: {
            flex: 1
    },
    calloutText: {
        backgroundColor: 'white',
        borderWidth: 0.5
    }
})