// import * as storage from '../Utils/storage'
// import * as api from '../API/app'
import React, {Component} from 'react'
import {Alert, Clipboard, Image, Platform, TextInput, SafeAreaView, StyleSheet, View, Text} from 'react-native'
import {siginUp} from "../../Modules/auth"
import {connect} from "react-redux"
import {withNavigationFocus} from "react-navigation"
import {isValidEmail, isValidPassword} from '../../Utils/validation'
import Toast from 'react-native-root-toast'

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

class SiginUp extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: null,
            password: null,
            requested: true,
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
            if (!isValidPassword(password)) {
                Toast.show('パスワードは半角英数で、1文字以上の大文字・小文字・数字・記号を含み、8文字以上にしてください。')
                return false
            }

            const result = await this.props.dispatch(siginUp({email: email, password: password}))

            if (result.message === 'success') {
                this.setState({requested: false})
            } else if (result.message === 'This email is already registered') {
                Toast.show('すでに登録されています')
            }
        }
    }

    render() {
        return(
            <View>
                { this.state.requested ? <View>
                    <Text style={style.title}>メールアドレス</Text>
                    <TextInput style={style.inputText} onChangeText={this.setEmail} />

                    <Text style={style.title}>パスワード</Text>
                    <TextInput style={style.inputText} onChangeText={this.setPassword} secureTextEntry={true} />
                    <Text style={{fontSize: 12, color: '#555', margin: 5,}}>パスワードは半角英数で、1文字以上の大文字・小文字・数字・記号を含み、8文字以上にしてください。</Text>

                    <View><Text style={style.submit} onPress={() => this.submit()}>登録</Text></View>
                </View> : <View><Text>メールを送信しました。メールのリンクをクリックして登録を完了してください。</Text></View>}
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {}
}
export default connect(mapStateToProps)(withNavigationFocus(SiginUp, 'siginup'))
