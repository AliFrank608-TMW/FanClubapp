import React, {Component} from 'react'
import {Alert, Clipboard, Image, Platform, TextInput, SafeAreaView, ScrollView, StyleSheet, View, Text} from 'react-native'
import TouchableOpacity from '../../Components/DefaultTouchableOpacity'
import {withNavigationFocus} from "react-navigation"
import {connect} from "react-redux"
import Toast from 'react-native-root-toast'
import {loadAuthVerify, loadMenberList, updateMenber, deleteMember} from "../../Modules/app"

const style = StyleSheet.create({
    inputText: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        padding: 5,
        backgroundColor: '#eee',
    },
})

class UpdateMember extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    setRole(role_id) {
        const user_id = this.props.navigation.state.params.user_id
        const {params} = this.props.navigation.state

        params.selectedRole(role_id, user_id)
        this.props.navigation.goBack()
    }

    render() {
        return <ScrollView>
            <Text style={style.inputText} onPress={() => this.setRole(2)}>管理者</Text>
            <Text style={style.inputText} onPress={() => this.setRole(3)}>編集者</Text>
            <Text style={style.inputText} onPress={() => this.setRole(4)}>閲覧者</Text>
        </ScrollView>
    }
}

const mapStateToProps = (state) => {
    return {
        appState: state.app.state,
        token: state.auth.token,
        user_id: state.auth.user_id,
    }
}

export default connect(mapStateToProps)(withNavigationFocus(UpdateMember, 'updatemember'))
