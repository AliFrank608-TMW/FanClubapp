import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Alert, Clipboard, Image, Platform, SafeAreaView, View, Text, StyleSheet, TextInput} from 'react-native'
import Toast from 'react-native-root-toast'
import {isValidEmail} from "../../Utils/validation"
import {changeEmailAddress} from "../../Modules/auth"
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
    submit: {
        fontSize: 15,
        margin: 10,
        padding: 10,
        backgroundColor: '#ffdd59',
        textAlign: 'center',
    }
})

class ChangeEmailAddress extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: null,
        }
    }

    setEmail = (email) => {
        this.setState({ email: email })
    }

    async submit() {
        const email = this.state.email

        if (email === null) {
            Toast.show('メールアドレスを入力してください。')
            return false
        } else {
            if (!isValidEmail(email)) {
                Toast.show('正しいメールアドレスを入力してください')
                return false
            }

            const result = await this.props.dispatch(changeEmailAddress({email: email}))

            if (result.code === 0) {
                this.props.navigation.goBack()
                Toast.show('メールを送信しました。受信したメールのリンクを開いてください。')
            } else if (result.code === 'E01001') {
                Toast.show('登録されているメールアドレスと同様です')
            }
        }
    }

    render() {
        return(
            <View>
                <Text style={style.title}>新しいメールアドレス</Text>
                <TextInput style={style.inputText} onChangeText={this.setEmail} value={this.state.email} />

                <View style={{width: '100%',}}><Text style={style.submit} onPress={() => this.submit()}>変更する</Text></View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
    }
}
export default connect(mapStateToProps)(withNavigationFocus(ChangeEmailAddress, 'changeemailaddress'))
