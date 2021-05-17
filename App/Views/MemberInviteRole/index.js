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

class MemberInviteRole extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    selectRole(role_id, role_name) {
        const {params} = this.props.navigation.state
        params.selectedRole(role_id, role_name)
        this.props.navigation.goBack()
    }

    render() {
        return <View>
            <Text style={style.inputText} onPress={() => this.selectRole(2, '管理者')}>管理者</Text>
            <Text style={style.inputText} onPress={() => this.selectRole(3, '編集者')}>編集者</Text>
            <Text style={style.inputText} onPress={() => this.selectRole(4, '閲覧者')}>閲覧者</Text>
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

export default connect(mapStateToProps)(withNavigationFocus(MemberInviteRole, 'memberinviterole'))
