import React, { Component } from 'react';
import { SafeAreaView, View, Text, Dimensions, ActivityIndicator, FlatList, Picker, TouchableOpacity, Alert, Button } from 'react-native';
import axiosInstance from '../axiosInstance';
import { Constants, Location } from 'expo';
import { BASE_URL } from '../../config';

const { width, height } = Dimensions.get('window');

export default class MakeRequestScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bg: 'A+',
            data: [],
            checked: []
        }
    }
    componentDidMount() {
        axiosInstance.post(`${BASE_URL}/user/findnearby/`,{ bloodgroup: 'A+' })
                            .then(({ data }) => {
                                this.setState({ bg: itemValue })
                                console.log(data);
                                this.setState({ data: data.nearbydonors })
                                let intialCheck = data.map(x => false);
                                this.setState({ checked: intialCheck })
                            })
                            .catch(error=> console.log('error'))
    }
    handleChange = (index) => {
        let checked = [...this.state.checked];
        checked[index] = !checked[index];
        this.setState({ checked });
    }
    schedulenotification = async () => {
        let array = [];
        this.state.checked.map((el, index) => {
            if(el)
                array.push(this.state.data[index].user.phone)
        })
        let location = await Location.getCurrentPositionAsync({});
        axiosInstance.post(`${BASE_URL}/pushnotification/`, { phonenumbers: array, bloodgroup: this.state.bg, loc: { lat: location.coords.latitude, long: location.coords.longitude } })
            .then(({ data }) => {
                if(data.success) {
                    Alert.alert('Success', 'User(s) notified');
                    this.props.navigation.goBack();
                } else {
                    Alert.alert('Failure, User(s) not notified');
                }
            })
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', marginTop: Constants.statusBarHeight }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: 0.1*height, width, backgroundColor: '#F8F8F8' }}>
                    <Text>
                        Make Request
                    </Text>
                </View>
                <Picker
                    selectedValue={this.state.bg}
                    style={{height: 50, width: 100, margin: 2}}
                    onValueChange={(itemValue, itemIndex) =>
                        axiosInstance.post(`${BASE_URL}/user/findnearby/`,{ bloodgroup: itemValue })
                            .then(({ data }) => {
                                this.setState({ bg: itemValue })
                                console.log(data);
                                this.setState({ data: data.nearbydonors })
                            })
                            .catch(error=> console.log('error'))
                    }>
                    <Picker.Item label="A+" value="A+" />
                    <Picker.Item label="B+" value="B+" />
                    <Picker.Item label="A-" value="A-" />
                    <Picker.Item label="B-" value="B-" />
                    <Picker.Item label="AB+" value="AB+" />
                    <Picker.Item label="AB-" value="AB-" />
                    <Picker.Item label="O+" value="O+" />
                    <Picker.Item label="O-" value="O-" />
                </Picker>
                <View style={{height: 0.6*height}}>
                    <FlatList
                        data={this.state.data}
                        ListEmptyComponent={<ActivityIndicator/>}
                        keyExtractor={(item, index) => item._id}
                        renderItem={({ item, index }) => {
                            console.log(item);
                            return (
                                <TouchableOpacity onPress={() => this.handleChange(index)}>
                                    <View style={[{ marginTop: 2, borderWidth: 2, borderRadius: 2, flexDirection: 'row', width, padding: 20 },this.state.checked[index]?{backgroundColor: '#3C3C3C'}:{backgroundColor:'white'}]}>
                                        <Text>{`${item.user.name}`}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                    }}
                    />
                </View>
                <View>
                    <Button title='Make Request to selected' onPress={this.schedulenotification} />
                </View>
            </SafeAreaView>
        )
    }
}