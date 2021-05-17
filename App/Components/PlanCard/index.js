import React, {Component} from 'react'
import {connect} from 'react-redux'
import {StyleSheet, View, Text, Image} from "react-native"
import TouchableOpacity from '../DefaultTouchableOpacity'

const style = StyleSheet.create({
    card: {
        width: '95%',
        padding: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginVertical:5,
        borderRadius: 4,
        backgroundColor: '#fff',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 14,
        marginTop: 5,
        marginBottom: 5,
    },
    price: {
        fontSize: 13,
        color: '#ff0000',
        marginBottom: 5,
    },
    join_btn: {
        width: '40%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 5,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#ffdd59',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#fff',
        overflow: 'hidden',
    }
})

export default class PlanCard extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={style.card}>
                <Text style={style.title}>{this.props.title}</Text>
                <Text style={style.price}>{this.props.price} <Text style={{fontSize: 10, color: '#485460',}}>ポイント/月</Text></Text>
                <Text style={{fontSize: 12,}}>{this.props.description}</Text>
                {this.props.joined ?
                    <View></View> :
                    <View style={style.join_btn}>
                        <Text style={{fontSize: 13, textAlign: 'center'}} onPress={() => this.props.onPress()}>加入する</Text>
                    </View>
                }
            </View>
        )

    }
}
