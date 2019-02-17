import React from 'react';
import { View ,Text, TextInput, StyleSheet } from 'react-native';

export default Input = (props) => {
    return (
        <View style={styles.inputContainer}>
            <Text>
                {props.header}
            </Text>
            <TextInput
                style={styles.inputStyle}
                underlineColorAndroid='blue'
                placeholder={props.placeholder}
                secureTextEntry={props.secureTextEntry}
                keyboardType={props.keyboardType}
                maxLength={props.maxLength}
                onChangeText={props.onChangeText}
                value={props.value}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        justifyContent: 'center',
        marginVertical: 10
    },
    inputStyle: {
        width: 250,
        fontSize: 14,
        paddingVertical: 10
    },
})