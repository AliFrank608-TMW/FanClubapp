import React, {Component} from 'react'
import {Alert, Clipboard, Image, Platform, TextInput, SafeAreaView, ScrollView, StyleSheet, View, Text} from 'react-native'
import TouchableOpacity from '../../Components/DefaultTouchableOpacity'
import {withNavigationFocus} from "react-navigation"
import {connect} from "react-redux"
import Toast from 'react-native-root-toast'
import {newFanRoom} from "../../Modules/app"

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

class NewFanRoom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            category_id: 0,
            category: 'カテゴリーを選択',
            roomname: '',
        }
    }

    setCategory(category_id, category_name) {
        this.setState({
            category_id: category_id,
            category: category_name
        })
    }

    openCategory() {
        this.props.navigation.push('selectcategory', {
            sendSelectedCategory: (category_id, category_name) => this.setCategory(category_id, category_name)
        })
    }

    setRoomName = (name) => {
        this.setState({ roomname: name })
    }

    async submit() {
        try {
            await this.props.dispatch(newFanRoom(this.state.category_id, this.state.roomname))
            Toast.show('開設しました')

            // マイページのメニュー表示の切り替え処理
            const {params} = this.props.navigation.state
            params.newFunRoomStatus({status: 'ok'})
            this.props.navigation.goBack()
        } catch (e) {
            console.log(e)
            Toast.show('開設に失敗しました')
        }
    }

    render() {
        return <View>
            <Text style={style.title}>カテゴリ</Text>
            <Text style={style.inputText} onPress={() => this.openCategory()}>{this.state.category}</Text>

            <Text style={style.title}>ファンルーム名</Text>
            <TextInput style={style.inputText} onChangeText={this.setRoomName} />

            <View style={{width: '100%',}}><Text style={style.submit} onPress={() => this.submit()}>開設する</Text></View>
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

export default connect(mapStateToProps)(withNavigationFocus(NewFanRoom, 'newfanroom'))
