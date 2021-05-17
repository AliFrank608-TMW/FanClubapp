import React, {Component} from 'react'
import {Alert, Clipboard, Image, Platform, TextInput, SafeAreaView, StyleSheet, View, Text} from 'react-native'
import {isValidEmail, isValidPassword} from '../../Utils/validation'
import {withNavigationFocus} from "react-navigation"
import {connect} from "react-redux"
import Toast from 'react-native-root-toast'
import {loginWithPassword} from "../../Modules/auth"

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

class SiginIn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: null,
            password: null,
            error_msg: '',
        }
    }

    setEmail = (email) => {
        this.setState({ email: email })
    }

    setPassword = (password) => {
        this.setState({ password: password })
    }

    async submit() {
        const email = this.state.email
        const password = this.state.password

        if (email === null || password === null) {
            Toast.show('メールアドレスもしくはパスワードを入力してください。')
        } else {
            if (!isValidEmail(email)) {
                Toast.show('正しいメールアドレスを入力してください')
                return false
            }

            let result = ''
            try {
                result = await this.props.dispatch(loginWithPassword({email: email, password: password}))
            } catch (e) {
                this.setState({error_msg: 'メールアドレスもしくはパスワードが異なります'})
            }

            if (this.props.token !== null) {
                const {params} = this.props.navigation.state
                params.loginStatus({status: 'ok'})

                this.props.navigation.goBack()
                Toast.show('ログインしました')
            }

            if (result.message === 'success') {
            } else if (result.message === 'This email is already registered') {
                Toast.show('すでに登録されています')
            }
        }
    }

    render() {
        return(
            <View>
                <Text style={style.title}>メールアドレス</Text>
                <TextInput style={style.inputText} onChangeText={this.setEmail} />

                <Text style={style.title}>パスワード</Text>
                <TextInput style={style.inputText} onChangeText={this.setPassword} secureTextEntry={true} />

                <Text style={{textAlign: 'center', color: 'red'}}>{this.state.error_msg}</Text>

                <View style={{width: '100%',}}><Text style={style.submit} onPress={() => this.submit()}>ログイン</Text></View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token
    }
}
export default connect(mapStateToProps)(withNavigationFocus(SiginIn, 'siginin'))
