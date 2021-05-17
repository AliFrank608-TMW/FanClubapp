import React, {Component} from 'react'
import {StyleSheet, View, Text, Image, Dimensions} from "react-native"
import TouchableOpacity from '../DefaultTouchableOpacity'

const style = StyleSheet.create({
    box: {
        width: 150,
        height: 150,
        margin: 10,
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    img: {
        width: '100%',
        height: '55%',
    },
    aboutarea: {
        padding: 10,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 12,
        marginBottom: 10,
    },
    shortintro: {
        fontSize: 10,
    }
})

export default class PostCard extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <TouchableOpacity onPress={this.props.onPress}>
                <View style={style.box}>
                    <Image source={{uri: this.props.eyecatch_image.standard.url}} style={style.img} />
                    <View style={style.aboutarea}>
                        <Text style={style.title}>{this.props.title}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}
