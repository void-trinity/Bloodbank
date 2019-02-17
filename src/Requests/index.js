import React, { Component } from 'react';
import { Button, SafeAreaView } from 'react-native';
import { Constants } from 'expo'; 

export default class RequestScreen extends Component {
    render() {
        return (
            <SafeAreaView style={{ flex: 1, marginTop: Constants.statusBarHeight, justifyContent: 'space-around', alignItems: 'center' }}>
                <Button onPress={() => this.props.navigation.navigate('ViewRequests')} title='View Requests'/>
                <Button onPress={() => this.props.navigation.navigate('MakeRequest')} title='Make Requests'/>
            </SafeAreaView>
        )
    }
}