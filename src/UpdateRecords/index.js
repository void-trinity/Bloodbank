import React, { Component } from 'react';
import { View, ActivityIndicator, Button, Alert, ScrollView, Dimensions, Text } from 'react-native';
import Input from '../Components/input';
import { Constants } from 'expo'
import axiosInstance from '../axiosInstance';
import { BASE_URL } from '../../config';

const {width, height} = Dimensions.get('window');

export default class UpdateRecords extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ap: '',
            an: '',
            bp: '',
            bn: '',
            abp: '',
            abn: '',
            op: '',
            on: '',
            loading: true
        }
    }
    componentDidMount() {
        axiosInstance.get(`${BASE_URL}/bloodbank/stock/`)
            .then(({ data }) => {
                const { ap, an, bp, bn, abp, abn, op, on } = data;
                this.setState({ap:`${ap}`, an: `${an}`, bp: `${bp}`, bn: `${bn}`, abp: `${abp}`, abn: `${abn}`, op: `${op}`, on: `${on}`, loading: false});
            })
    }
    updateStock = () => {
        const { ap, an, bp, bn, abp, abn, op, on } = this.state;
        if (ap < 0 || an < 0 || bp < 0 || bn < 0 || abp < 0 || abn < 0 || op < 0 || on < 0)
            Alert.alert('Error', 'Invalid values in field');
        else {
            axiosInstance.post(`${BASE_URL}/bloodbank/updatestock/`, {
                stock: {
                    ap, an, bp, bn, abp, abn, op, on
                }
            })
                .then(({ data }) => {
                    if(data.success)
                        Alert.alert('Success', 'Updated Successfully')
                    else
                        Alert.alert('Error', 'Error in updation, try again')
                })
                .catch(error=> {
                    Alert.alert('Error', 'Error in updation, try again')
                })
        }
    }
    renderCheck = () => {
        if(this.state.loading)
            return <ActivityIndicator />
        else
            return (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Input
                        header='A+'
                        onChangeText={(ap) => this.setState({ ap })}
                        value={this.state.ap}
                        keyboardType='phone-pad'
                    />
                    <Input
                        header='A-'
                        onChangeText={(an) => this.setState({ an })}
                        value={this.state.an}
                        keyboardType='phone-pad'
                    />
                    <Input
                        header='B+'
                        onChangeText={(bp) => this.setState({ bp })}
                        value={this.state.bp}
                        keyboardType='phone-pad'
                    />
                    <Input
                        header='B-'
                        onChangeText={(bn) => this.setState({ bn })}
                        value={this.state.bn}
                        keyboardType='phone-pad'
                    />
                    <Input
                        header='AB+'
                        onChangeText={(abp) => this.setState({ abp })}
                        value={this.state.abp}
                        keyboardType='phone-pad'
                    />
                    <Input
                        header='AB-'
                        onChangeText={(abn) => this.setState({ aabnp })}
                        value={this.state.abn}
                        keyboardType='phone-pad'
                    />
                    <Input
                        header='O+'
                        onChangeText={(op) => this.setState({ op })}
                        value={this.state.op}
                        keyboardType='phone-pad'
                    />
                    <Input
                        header='O-'
                        onChangeText={(on) => this.setState({ on })}
                        value={this.state.on}
                        keyboardType='phone-pad'
                    />
                    <Button title='Update Stocks' onPress={this.updateStock}/>
                </ScrollView>
            )
    }
    render() {
        return (
            <View style={{ marginTop: Constants.statusBarHeight, alignItems: 'center', flex: 1}}>
                <View style={{ height: height*0.1, width, backgroundColor: '#f3f3f3', justifyContent: 'center'}}>
                    <Text style={{ fontSize: 18, marginLeft: 10 }}>
                        Update Record
                    </Text>
                </View>
                {this.renderCheck()}
            </View>
        )
    }
}