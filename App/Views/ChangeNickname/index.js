import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Alert, Clipboard, Image, Platform, SafeAreaView, View, Text, StyleSheet, TextInput} from 'react-native'
import Toast from 'react-native-root-toast'
import {changeNickname} from "../../Modules/auth"
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

class ChangeNickname extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nickname: null,
        }
    }

    setNickname = (nickname) => {
        this.setState({ nickname: nickname })
    }

    async submit() {
        const nickname = this.state.nickname

        if (nickname === null) {
            Toast.show('ニックネームを入力してください。')
            return false
        } else {
            const result = await this.props.dispatch(changeNickname({nickname: nickname}))

            console.log('view result中身')
            console.log(result)

            if (result.message === 'success') {
                this.props.navigation.goBack()
                Toast.show('パスワードを変更しました。')
            }
        }
    }

    render() {
        return(
            <View>
                <Text style={style.title}>新しいニックネーム</Text>
                <TextInput style={style.inputText} onChangeText={this.setNickname} value={this.state.nickname} />

                <View style={{width: '100%',}}><Text style={style.submit} onPress={() => this.submit()}>変更する</Text></View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
    }
}
export default connect(mapStateToProps)(withNavigationFocus(ChangeNickname, 'changenickname'))
