import React, {Component} from 'react'
import {connect} from 'react-redux'
import {StyleSheet, View, Text, Image} from "react-native"
import TouchableOpacity from '../DefaultTouchableOpacity'
import {setProjectDetailId} from '../../Modules/app'

const style = StyleSheet.create({
    box: {
        width: 300,
        height: 150,
        marginTop: 10,
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    img: {
        width: '100%',
        height: '45%',
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

export default class ProjectCard extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <TouchableOpacity onPress={this.props.onPress}>
                <View style={style.box}>
                    <Image source={{uri: this.props.header_image.full.url}} style={style.img} />
                    <View style={style.aboutarea}>
                        <Text style={style.title}>{this.props.title}</Text>
                        <Text style={style.shortintro}>{this.props.short_introduction}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}
