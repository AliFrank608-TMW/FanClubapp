import React, {Component} from 'react'
import {Text, StyleSheet, Platform} from 'react-native'

export default class DefaultText extends Component {

    constructor(props) {
        super(props)
        this.style = [style.default_font]

        if (props.style) {
            if (Array.isArray(props.style)) {
                this.style = this.style.concat(props.style)
            } else {
                this.style.push(props.style)
            }
        }
    }

    render() {
        return <Text {...this.props} style={this.style}>
            {this.props.children}
        </Text>
    }
}

const style = StyleSheet.create({
    default_font: {
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium'
    }
})
