import React from 'react';
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";
import { Ionicons } from '@expo/vector-icons';
import Login from './Login';
import { Signup, ChooseUserType } from './Signup';
import HomeScreen from './Home';
import MapScreen from "./Maps";
import { ScannerScreen, QRScreen, TransactionScreen } from './Scanner';
import BloodBankScreen from './BBNear';
import BBDetailsScreen from './BBNear/BBDetails';
import RequestScreen from './Requests';
import MakeRequestScreen from './Requests/Makerequest';
import UpdateRecords from './UpdateRecords';

const BottomBar = createBottomTabNavigator (
  {
    Home: HomeScreen,
    Maps: MapScreen,
    Transaction: TransactionScreen,
    Bloodbanks: BloodBankScreen,
    Request: RequestScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === 'Home') {
          iconName = `ios-information-circle${focused ? '' : '-outline'}`;
        } else if (routeName === 'Maps') {
          iconName = `ios-cloud${focused ? '' : '-outline'}`;
        } else if (routeName === 'Transaction')
          iconName = `ios-add-circle${focused ? '' : '-outline'}`;
        else if (routeName === 'Bloodbanks')
        iconName = `ios-star${focused ? '' : '-outline'}`;
        else if (routeName === 'Request')
        iconName = `ios-notifications${focused ? '' : '-outline'}`;

        // You can return any component that you like here!
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  }
);


const BottomBar2 = createBottomTabNavigator (
  {
    Home: HomeScreen,
    Transaction: TransactionScreen,
    Request: RequestScreen,
    UpdateRecords: UpdateRecords
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === 'Home') {
          iconName = `ios-information-circle${focused ? '' : '-outline'}`;
        } else if (routeName === 'Transaction')
          iconName = `ios-add-circle${focused ? '' : '-outline'}`;
        else if (routeName === 'Request')
          iconName = `ios-notifications${focused ? '' : '-outline'}`;
        else if (routeName === 'UpdateRecords')
          iconName = `ios-checkbox${focused ? '' : '-outline'}`;

        // You can return any component that you like here!
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  }
);
const AppNavigator = createStackNavigator(
    {
        Login: {
            screen: Login
        },
        Signup: {
            screen: Signup
        },
        BottomBar: {
          screen: BottomBar
        },
        BottomBar2: BottomBar2,
        Scanner: ScannerScreen,
        QR: QRScreen,
        BBDetails: BBDetailsScreen,
        MakeRequest: MakeRequestScreen,
        ChooseUserType: ChooseUserType
    },
    {
        headerMode: 'none',
        initialRouteName: 'Login'
    }
);
  
export default createAppContainer(AppNavigator);