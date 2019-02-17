import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, AsyncStorage, Alert, ActivityIndicator } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import Input from '../Components/input';
import QRCode from 'react-native-qrcode';
import axiosInstance from '../axiosInstance';
import { BASE_URL } from '../../config';
 
export class ScannerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flashMode: false,
      zoom: 0.5
    };
  }
  state = {
    hasCameraPermission: null,
  }

async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  renderScreen = () => {
    if(!this.state.trying) {
        return (
          <BarCodeScanner
            onBarCodeScanned={this.handleBarCodeScanned}
            style={StyleSheet.absoluteFill}
            barCodeTypes={['qr']}
          />
        )
    } else {
      return (
        <ActivityIndicator />
      )
    }
  }
  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View style={{ flex: 1 }}> 
          {this.renderScreen()}
      </View>
    );
  }

  handleBarCodeScanned = ({ type, data }) => {
    console.log('here: ', data)
    this.setState({ trying: true })
    axiosInstance.post(`${BASE_URL}/donations/write/`,JSON.parse(data))
      .then(({data}) => {
        console.log('Data from: ' ,data)
        Alert.alert(data.success?'Success': 'Failure', data.message);
        this.props.navigation.navigate('BottomBar');
      })
      .catch(error=>console.log(error))
  }
}

export class QRScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      donorCode: '',
      loaded: false,
      quantity: '0'
    }
  }
  componentDidMount() {
    AsyncStorage.getItem('user')
      .then(user => this.setState({ donorCode: JSON.parse(user).phone }))
      .catch(error => {
        Alert.alert('Error', 'cannot connect to services');
      })
  }
  generateQR = () => {
    const quantity = parseInt(this.state.quantity);
    if (quantity > 0 && quantity < 3)
      this.setState({ loaded: true })
    else {
      Alert.alert('Error', 'Please fill a valid data');
    }
  }
  renderQR = () => {
    if(this.state.loaded) {
      return (
        <QRCode
          style={{ flex: 0.8}}
          value={JSON.stringify({phone: this.state.donorCode, quantity: this.state.quantity})}
          size={200}
          bgColor='black'
          fgColor='white'
        />
      )
    } else return (
      <View>
        <Input keyboardType='phone-pad' header='Enter quantity' onChangeText={(quantity) => this.setState({ quantity })} value={this.state.quantity}/>
        <Button title='Generate QR' onPress={this.generateQR} />
      </View>
    )
  }
  render() {
    return(
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {this.renderQR()}
      </SafeAreaView>
    )
  }
}

export class TransactionScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center'}}>
        <Button onPress={() => this.props.navigation.navigate('Scanner')} title='You are a donor' />
        <Button onPress={() => this.props.navigation.navigate('QR')} title='You are a Recipient' />
      </View>
    )
  }
}