import React, {Component} from 'react'
import {Alert, Clipboard, Image, Platform, TextInput, SafeAreaView, StyleSheet, View, Text} from 'react-native'
import {withNavigationFocus} from "react-navigation"
import {connect} from "react-redux"

const style = StyleSheet.create({
    inputText: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        padding: 5,
        backgroundColor: '#eee',
    },
})

class SelectBNPublish extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    selectedPublish(publish_val, publist_name) {
        const {params} = this.props.navigation.state
        params.selectedPublish(publish_val, publist_name)
        this.props.navigation.goBack()
    }

    render() {
        return <View>
            <Text onPress={() => this.selectedPublish(true, '公開')} style={style.inputText}>公開</Text>
            <Text onPress={() => this.selectedPublish(false, '非公開')} style={style.inputText}>非公開</Text>
        </View>
    }
}

const mapStateToProps = (state) => {
    return {
        appState: state.app.state,
        token: state.auth.token,
        user_id: state.auth.user_id,
    }
}

export default connect(mapStateToProps)(withNavigationFocus(SelectBNPublish, 'selectbnpublish'))
