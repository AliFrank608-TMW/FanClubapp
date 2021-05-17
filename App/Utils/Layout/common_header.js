import React, { Component } from 'react'
import {
    TouchableOpacity,
    Image,
    View,
} from 'react-native'

export function basicBackHeader (deviceHeight, title, navigation) {
    return {
        title: title,
        headerLeft: <TouchableOpacity onPress={() => navigation.goBack(null)}>
            <Image source={require('../../Images/back.png')} style={{
                backgroundColor: 'transparent',
                marginLeft: deviceHeight * 1 / 1.8 * 0.04,
                marginTop: deviceHeight * 0.012,
            }}/>
        </TouchableOpacity>,
    }
}

export function webviewBackHeader (deviceHeight, title, navigation) {
    return {
        title: title,
        headerLeft: <TouchableOpacity onPress={() => navigation.goBack(null)}>
            <Image source={require('../../Images/back.png')} style={{
                backgroundColor: 'transparent',
                marginLeft: deviceHeight * 1 / 1.8 * 0.04,
                marginTop: deviceHeight * 0.012,
            }}/>
        </TouchableOpacity>,
    }
}

export function cantEscapeHeader () {
    return {
        headerLeft: <View />,
    }
}

export function disableTabBar () {
    return {
        tabBarVisible: false,
    }
}

export function modalCloseHeader (deviceHeight, navigation) {
    return {
        headerLeft: <TouchableOpacity onPress={() => navigation.goBack(null)}>
            <Image
                source={require('../../Images/04_home_btn_closed_off/home_btn_closed_off.png')}
                style={{
                    backgroundColor: 'transparent',
                    marginLeft: deviceHeight * 1 / 1.8 * 0.04,
                    marginTop: deviceHeight * 0.012,
                }}/>
        </TouchableOpacity>,
    }
}
