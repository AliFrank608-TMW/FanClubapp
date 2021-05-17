import React, {Component} from 'react'
import {
    TouchableOpacity,
    TouchableNativeFeedback,
    Platform,
    View
} from 'react-native'
import colors from '../../../config/colors'

export default class DefaultTouchableOpacity extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return Platform.OS === 'ios' ? <TouchableOpacity
            {...this.props}
            delayPressIn={10}
            activeOpacity={0.8}>
            {this.props.children}
        </TouchableOpacity> : <TouchableNativeFeedback
            onPress={this.props.onPress}
            useForeground={true}
            background={TouchableNativeFeedback.Ripple(colors.main, true)}>
            <View style={this.props.style}>
                {this.props.children}
            </View>
        </TouchableNativeFeedback>
    }
}
