import React, { Component } from 'react';
import { Platform, SafeAreaView, View, Text, StyleSheet, AsyncStorage, ActivityIndicator, TouchableWithoutFeedback, FlatList, Dimensions } from 'react-native';
import { Constants, Location } from 'expo';
import axiosInstance from '../axiosInstance';
import {BASE_URL} from '../../config';
import { Notifications, Permissions } from 'expo';

const { width, height } = Dimensions.get('window');

const TransactionCard = (props) => {
    return (
        <View style={{ borderColor: '#3C3C3C',borderBottomWidth: 0.5, width: width*0.8, height: height*0.15, justifyContent: 'center', paddingLeft: 30 }}>
            <Text>
                {`${props.string} ${props.name}`}
            </Text>
        </View>
    )
}

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            user: {},
            selected: 1
        }
    }
    async componentDidMount() {
        let token = await this.registerForPushNotificationsAsync();
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }

        let location = await Location.getCurrentPositionAsync({});
        axiosInstance.post(`${BASE_URL}/user/notification/set/`, { notification_tag: token, loc: { lat: location.coords.latitude, long: location.coords.longitude } })
        console.log(token);
        AsyncStorage.getItem('user')
            .then(user => {
                this.setState({user: JSON.parse(user), loaded: true })
            })
        axiosInstance.get(`${BASE_URL}/donations/find/`)
            .then(({ data }) => {
                this.setState({data});
            })
            .catch(error=>console.log(error))
        this._notificationSubscription = Notifications.addListener(this._handleNotification);
        if (Platform.OS === 'android') {
            Expo.Notifications.createChannelAndroidAsync('bloodbank', {
                name: 'Bloodbank',
                priority: 'max',
                vibrate: [0, 250, 250, 250],
                sound: true
            });
        }
    }

    registerForPushNotificationsAsync = async () => {
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        
        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
            return;
        }
        
        // Get the token that uniquely identifies this device
        //Remove the ternary operator during prod build
        let token = await Notifications.getExpoPushTokenAsync();
        return token;
    }

    _handleNotification = (notification) => {
        if (notification.origin === 'received' && this.state.appState === 'active') {
            console.log('received');
        } else if (notification.origin === 'selected') {
            console.log('selected', notification);
        }
    }

    renderList = () => {
        if(this.state.data&&this.state.data.received.length) {
            if(this.state.selected === 1) {
                return (
                    <FlatList
                        data={this.state.data.donated}
                        ListEmptyComponent={<Text style={{ margin: 30 }}>No Donations yet</Text>}
                        keyExtractor={(item, index) => item._id}
                        renderItem={({ item }) => {
                            return <TransactionCard name={item.recipient.name} string='Donated To' />
                        }}
                    />
                )
            } else {
                return (
                    <FlatList
                        data={this.state.data.received}
                        keyExtractor={(item, index) => item._id}
                        ListEmptyComponent={<Text style={{ margin: 30 }}>No Data Here ;)</Text>}
                        renderItem={({ item }) => {
                            return <TransactionCard name={item.donor.name} string='Donated By'/>
                        }}
                    />
                )
            }
        } else {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator />
                </View>
            )
        }
    }
    render() {
        if(this.state.loaded) {
            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.name}>
                            {this.state.user.name}
                        </Text>
                    </View>
                    <View style={styles.selection}>
                        <TouchableWithoutFeedback onPress={() => this.setState({ selected: 1 })}>
                            <View style={this.state.selected === 1? styles.selectionContainer: styles.notselectionContainer}>
                                <Text>Donations</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.setState({ selected: 2 })}>
                            <View style={this.state.selected === 2? styles.selectionContainer: styles.notselectionContainer}>
                                <Text>Receives</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.list}>
                        {this.renderList()}
                    </View>
                </SafeAreaView>
            )
        } else {
            return(
                <View style={{ flex:1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        marginTop: Constants.statusBarHeight,
    },
    name: {
        fontSize: 18
    },
    header: {
        height: height*0.1,
        width,
        backgroundColor: '#f3f3f3'
    },
    donationsContainer: {
        borderWidth: 0.5,
        borderRadius: 3,
        borderColor: '#3d3d3d'
    },
    selection: {
        flexDirection: 'row',
        height: height*0.05
    },
    selectionContainer: {
        flex: 0.5, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 0.5,
        borderColor: '#3C3C3C'
    },
    notselectionContainer: {
        flex: 0.5, justifyContent: 'center', alignItems: 'center'
    }
})