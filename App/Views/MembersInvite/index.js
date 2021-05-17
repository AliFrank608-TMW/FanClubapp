import React, {Component} from 'react'
import {Alert, Clipboard, Image, Platform, TextInput, SafeAreaView, ScrollView, StyleSheet, View, Text} from 'react-native'
import TouchableOpacity from '../../Components/DefaultTouchableOpacity'
import {withNavigationFocus} from "react-navigation"
import {connect} from "react-redux"
import Toast from 'react-native-root-toast'
import {isValidEmail} from '../../Utils/validation'
import {loadAuthVerify, memberInvite} from "../../Modules/app"

const style = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        fontSize: 14,
        margin: 10,
    },
    inputText: {
        margin: 10,
        padding: 5,
        backgroundColor: '#eee',
    },
    submit: {
        fontSize: 15,
        margin: 10,
        padding: 10,
        backgroundColor: '#ffdd59',
        textAlign: 'center',
    }
})

class MembersInvite extends Component {
    constructor(props) {
        super(props)
        this.state = {
            project_id: 0,
            email: null,
            role_id: '4',
            role_name: '閲覧者',
        }
    }

    async componentWillMount() {
        // project_id取得
        const my_data = await this.props.dispatch(loadAuthVerify())
        const project_id = my_data.own_project.id
        this.setState({project_id: project_id})
    }

    setEmail = (email) => {
        this.setState({ email: email })
    }

    setRole = (role_id, role_name) => {
        this.setState({ role_id: role_id, role_name: role_name })
    }

    openRoleSelect() {
        this.props.navigation.push('memberinviterole', {
            selectedRole: (role_id, role_name) => this.setRole(role_id, role_name)
        })
    }

    async submit() {
        const email = this.state.email

        if (email === null) {
            Toast.show('メールアドレスを入力してください')
        } else {
            if (!isValidEmail(email)) {
                Toast.show('正しいメールアドレスを入力してください')
                return false
            }
        }

        const params = {
            email: email,
            project_id: this.state.project_id,
            role: this.state.role_id,
        }

        const result = await this.props.dispatch(memberInvite(params))
        if (result.message === 'success') {
            Toast.show('招待しました')
        } else {
            Toast.show('招待に失敗しました')
        }

    }

    render() {
        return <ScrollView>
            <Text style={style.title}>メールアドレス</Text>
            <TextInput style={style.inputText} onChangeText={this.setEmail} />
            <Text onPress={() => this.openRoleSelect()} style={style.inputText} >{this.state.role_name}</Text>

            <Text style={{margin: 10}}>招待するユーザーはFanRoomに登録済みである必要があります。</Text>

            <View style={{width: '100%',}}><Text style={style.submit} onPress={() => this.submit()}>招待する</Text></View>
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

export default connect(mapStateToProps)(withNavigationFocus(MembersInvite, 'membersinvite'))
