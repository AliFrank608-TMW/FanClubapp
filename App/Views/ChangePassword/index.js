import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Alert, Clipboard, Image, Platform, SafeAreaView, View, Text, StyleSheet, TextInput} from 'react-native'
import Toast from 'react-native-root-toast'
import {loginWithPassword} from "../../Modules/auth"
import {isValidPassword} from "../../Utils/validation"
import {changePassword} from "../../Modules/auth"
import {withNavigationFocus} from "react-navigation"

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
    description: {
        fontSize: 13,
        margin: 5,
        color: '#555',
    },
    submit: {
        fontSize: 15,
        margin: 10,
        padding: 10,
        backgroundColor: '#ffdd59',
        textAlign: 'center',
    }
})

class ChangePassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            password: null,
        }
    }

    setPassword = (password) => {
        this.setState({ password: password })
    }

    async submit() {
        const password = this.state.password

        if (password === null) {
            Toast.show('パスワードを入力してください。')
            return false
        } else {
            if (!isValidPassword(password)) {
                Toast.show('パスワードは半角英数で、1文字以上の大文字・小文字・数字・記号を含み、8文字以上にしてください。')
                return false
            }

            const result = await this.props.dispatch(changePassword({password: password}))

            if (result.message === 'success') {
                this.props.navigation.goBack()
                Toast.show('パスワードを変更しました。')
            }
        }
    }

    render() {
        return(
            <View>
                <Text style={style.title}>新しいパスワード</Text>
                <TextInput style={style.inputText} onChangeText={this.setPassword} secureTextEntry={true} />
                <Text style={style.description}>パスワードは半角英数で、1文字以上の大文字・小文字・数字・記号を含み、8文字以上にしてください。</Text>

                <View style={{width: '100%',}}><Text style={style.submit} onPress={() => this.submit()}>変更する</Text></View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
    }
}
export default connect(mapStateToProps)(withNavigationFocus(ChangePassword, 'changepassword'))
