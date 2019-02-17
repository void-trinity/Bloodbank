import React, { Component } from 'react';
import { StyleSheet, View, Button, Picker, DatePickerAndroid, Alert, Text, Keyboard, TouchableWithoutFeedback, ScrollView, AsyncStorage } from 'react-native';
import Input from '../Components/input';
import axios from 'axios';
import { BASE_URL } from '../../config';

export class ChooseUserType extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center' }}>
                <Button
                    title='Signup as Donor'
                    onPress = {() => this.props.navigation.navigate('Signup', { 'usertype': 'donor'})}
                />
                <Button
                    title='Signup as Bloodbank'
                    onPress = {() => this.props.navigation.navigate('Signup', { 'usertype': 'bloodbank'})}
                />
            </View>
        )
    }
}

export class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            password: '',
            name: '',
            password2: '',
            email: '',
            usertype: '',
            year: '',
            month: '',
            day: '',
            bg: ''
        }
    }
    componentDidMount() {
        const usertype = this.props.navigation.getParam('usertype');
        this.setState({ usertype });
    }
    trylogging() {
        if(this.state.usertype === 'donor') {
            let { phone, password, name, password2, day, month, year, usertype, bg, email } = this.state;
            if(phone.length < 10 || name.length == 0 || password.length < 5 || password2.length < 5 || email.length < 2 || date === '')
                Alert.alert('Invalid Data', 'Please check all the fields have valid date');
            else if(password !== password2)
                Alert.alert('Password Mismatch', 'The two passwords do not match');
            else
                axios.post(`${BASE_URL}/user/signup/`, { user: {
                    name, email, phone, password, usertype
                }, bloodgroup:  bg, dob: new Date(`${month}-${day}-${year}`)})
                .then(({data}) => {
                    console.log(JSON.stringify(data));
                    if(data.success) {
                        AsyncStorage.multiSet([['token', data.token], ['user', JSON.stringify(data.payload.user)]])
                            .then(() => {
                                this.setState({ loading: false });
                                this.props.navigation.navigate('BottomBar');
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
        } else {
            let { phone, password, name, password2, address, email, usertype } = this.state;
            if(phone.length < 10 || name.length == 0 || password.length < 5 || password2.length < 5 || email.length < 2 || address === '')
                Alert.alert('Invalid Data', 'Please check all the fields have valid date');
            else if(password !== password2)
                Alert.alert('Password Mismatch', 'The two passwords do not match');
            else
                axios.post(`${BASE_URL}/user/signup/`, { user: {
                    name, email, phone, password, usertype
                }, address})
                .then(({data}) => {
                    console.log(JSON.stringify(data));
                    if(data.success) {
                        AsyncStorage.multiSet([['token', data.token], ['user', JSON.stringify(data.payload.user)]])
                            .then(() => {
                                this.setState({ loading: false });
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
            
    }
    async pickDate() {
        try {
            const {action, year, month, day} = await DatePickerAndroid.open({
              date: new Date(),
              maxDate: new Date()
            });
            if (action !== DatePickerAndroid.dismissedAction) {
              this.setState({ year, month, day });
            }
          } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
          }
    }
    renderExtras = () => {
        if(this.state.usertype === 'donor') {
            return (
                <View>
                    <Picker
                        selectedValue={this.state.bg}
                        style={{height: 50, width: 100, margin: 2}}
                        onValueChange={(bg) => this.setState({bg})}>
                        <Picker.Item label="A+" value="A+" />
                        <Picker.Item label="B+" value="B+" />
                        <Picker.Item label="A-" value="A-" />
                        <Picker.Item label="B-" value="B-" />
                        <Picker.Item label="AB+" value="AB+" />
                        <Picker.Item label="AB-" value="AB-" />
                        <Picker.Item label="O+" value="O+" />
                        <Picker.Item label="O-" value="O-" />
                    </Picker>
                    <TouchableWithoutFeedback onPress={() => this.pickDate()}>
                        <View style={{ width: 100, height: 60 }}>
                            <Text>
                                {this.state.year === '' ? 'Select DOB': `${this.state.day}-${this.state.month+1}-${this.state.year}`}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            )
        } else return (
            <View>
                <Input
                    header='Address'
                    onChangeText={(address) => this.setState({ address })}
                    value={this.state.address}
                />
            </View>
        )
    }
    render() {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: 20 }}>
                        <View style={{ flex: 0.8, justifyContent: 'space-around', alignItems: 'center' }}>
                            <Text
                                style={{ fontSize: 30, margin: 30 }}
                            >
                                Signup
                            </Text>
                            <Input
                                header='Name'
                                onChangeText={(name) => this.setState({ name })}
                                value={this.state.name}
                            />
                            <Input
                                header='Phone Numer'
                                keyboardType='phone-pad'
                                maxLength={10}
                                onChangeText={(phone) => this.setState({ phone })}
                                value={this.state.phone}
                            />
                            <Input
                                header='Email'
                                keyboardType='email-address'
                                onChangeText={(email) => this.setState({ email })}
                                value={this.state.email}
                            />
                            <Input
                                header='Password'
                                secureTextEntry
                                onChangeText={(password) => this.setState({ password })}
                                value={this.state.password}
                            />
                            <Input
                                header='Confirm Password'
                                secureTextEntry
                                onChangeText={(password2) => this.setState({ password2 })}
                                value={this.state.password2}
                            />
                            {this.renderExtras()}
                        </View>
                        <View style={{ flex: 0.2, margin: 40 }}>
                            <Button
                                title='Sign Up'
                                onPress={this.trylogging.bind(this)}
                            />
                            <TouchableWithoutFeedback
                                onPress={() => this.props.navigation.navigate('Login')} 
                            >
                                <View style={{ marginTop: 20, alignItems: 'center' }}>
                                    <Text>
                                        Already a member?
                                        <Text style={{ color: 'blue' }}>
                                            {' Login'}
                                        </Text>
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </ScrollView>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-around',
        backgroundColor: 'white',
        alignItems: 'center'
    },
})