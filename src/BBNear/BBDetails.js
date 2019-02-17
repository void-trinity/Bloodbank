import React, { Component } from 'react';
import { SafeAreaView, Text, Linking, Button, Platform } from 'react-native';

export default class BBDetailsScreen extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { navigation } = this.props;
        const details = navigation.getParam('details');
        const { abn, abp, ap, an, bp, bn, op, on } = details.stock;
        return(
            <SafeAreaView style={{ flex: 1, marginTop: 20, justifyContent: 'space-around', alignItems: 'center'}}>
                <Text>
                    {`A+: ${ap}`}
                </Text>
                <Text>
                    {`A-: ${an}`}
                </Text>
                <Text>
                    {`B+: ${bp}`}
                </Text>
                <Text>
                    {`B-: ${bn}`}
                </Text>
                <Text>
                    {`AB+: ${abp}`}
                </Text>
                <Text>
                    {`AB-: ${abn}`}
                </Text>
                <Text>
                    {`O+: ${op}`}
                </Text>
                <Text>
                    {`O-: ${on}`}
                </Text>
                <Button title='Get Direction' onPress={() => {
                    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
                    const latLng = `${details.user.loc.lat},${details.user.loc.long}`;
                    const label = details.user.name;
                    const url = Platform.select({
                      ios: `${scheme}${label}@${latLng}`,
                      android: `${scheme}${latLng}(${label})`
                    });
                    Linking.openURL(url);
                }} />
        </SafeAreaView>
        )
    }
}