import React, { Component } from 'react';
import { SafeAreaView, View, Button, StyleSheet, Image, Alert, Text, TouchableWithoutFeedback, AsyncStorage, ActivityIndicator } from 'react-native';
import Input from '../Components/input';
import axios from 'axios';
import {BASE_URL} from '../../config';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '9424113605',
            password: 'password',
            loading: false
        }
    }
    trylogging() {
        this.setState({ loading: true });   
        let { phone, password } = this.state;
        if(phone.length < 10)
            Alert.alert('Invalid Phone Number', 'Please enter a valid phone number');
        else if(password.length < 5)
            Alert.alert('Password too short', 'Passowrd should be atleast 5 characters long');
        else {
            const url = `${BASE_URL}/user/login/`;
            console.log(url);
            axios.post(url, {
                phone: this.state.phone,
                password: this.state.password
            })
                .then(({data}) => {
                    console.log(JSON.stringify(data));
                    if(data.success) {
                        AsyncStorage.multiSet([['token', data.token], ['user', JSON.stringify(data.payload.user)]])
                            .then(() => {
                                this.setState({ loading: false });
                                if(data.payload.user.usertype === 'donor')
                                    this.props.navigation.navigate('BottomBar');
                                else 
                                    this.props.navigation.navigate('BottomBar2');
                            })
                    }
                    else {
                        this.setState({ loading: false });
                        Alert.alert('Error', 'Invalid Credentials, please try again');
                    }
                })
                .catch(error => {
                    console.log('error: ', error);
                    this.setState({ loading: false });
                    Alert.alert('Error', 'Check Internet');
                })
        }
        this.setState({ loading: false });
    }
    render() {
        if(this.state.loading) {
            return(
                <SafeAreaView>
                    <ActivityIndicator/>
                </SafeAreaView>
            )
        }
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 0.2, justifyContent: 'center' }}>
                    <Image
                        style={{ flex: 0.8, resizeMode: 'contain' }}
                        source={require('../Assets/png/icon.png')}
                    />
                </View>
                <View style={{ flex: 0.6, justifyContent: 'space-evenly' }}>
                    <Input
                        header='Phone Numer'
                        keyboardType='phone-pad'
                        maxLength={10}
                        onChangeText={(phone) => this.setState({ phone })}
                        value={this.state.phone}
                    />
                    <Input
                        header='Password'
                        secureTextEntry
                        onChangeText={(password) => this.setState({ password })}
                        value={this.state.password}
                    />
                    <Button
                        title='Sign In'
                        onPress={this.trylogging.bind(this)}
                    />
                </View>
                <View>
                    <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.navigate('ChooseUserType')} 
                    >
                        <Text>
                            Not a user?
                            <Text style={{ color: 'blue' }}>
                                {' Signup'}
                            </Text>
                        </Text>
                    </TouchableWithoutFeedback>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        backgroundColor: 'white',
        alignItems: 'center'
    },
})