import React, {Component} from 'react'
import {Alert, Clipboard, Image, Platform, TextInput, SafeAreaView, ScrollView, StyleSheet, View, Text, Switch} from 'react-native'
import moment from 'moment'
import TouchableOpacity from '../../Components/DefaultTouchableOpacity'
import {withNavigationFocus} from "react-navigation"
import {connect} from "react-redux"
import Toast from 'react-native-root-toast'
import {loadAuthVerify, loadBacknumberAuto, updateBacknumberAuto} from "../../Modules/app"

const style = StyleSheet.create({
    field_title: {
        fontSize: 13,
        fontWeight: 'bold',
        marginTop: 10,
        marginHorizontal: 10,
    },
    textinput: {
        margin: 10,
        padding: 5,
        borderWidth: 0.5,
        borderColor: '#555',
    },
    inputTextArea: {
        height: 100,
        margin: 10,
        padding: 5,
        borderWidth: 0.5,
        borderColor: '#555',
        textAlignVertical: 'top',
    },
    submit: {
        fontSize: 15,
        margin: 10,
        padding: 10,
        backgroundColor: '#ffdd59',
        textAlign: 'center',
    }
})

class BacknumberAutomation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rate_string: '',
            switchVal: true,
            setting: {
                id: 1,
                project_id: 1,
                enabled: true,
                price_rate: 1.5,
                created_at: '',
                updated_at: '',
            },
        }
    }

    async componentWillMount() {
        // project_idを取得
        const result = await this.props.dispatch(loadAuthVerify())
        const result_setting = await this.props.dispatch(loadBacknumberAuto(result.own_project.id))

        this.setState({setting: result_setting.setting, rate_string: String(result_setting.setting.price_rate)})
    }

    switchValue = (val) => {
        this.setState({setting: {enabled: val}})
    }

    async setprice_rate(val) {
        const val_num = parseFloat(val)
        // string用に変換
        const val_string = String(val_num)

        await this.setState({setting: {setprice_rate: val_num}, rate_string: val_string})
    }

    async update() {
        const result = await this.props.dispatch(updateBacknumberAuto(this.state.setting))

        if (result.setting) {
            Toast.show('更新しました')
        } else {
            Toast.show('更新に失敗しました')
        }

    }

    render() {
        return <ScrollView>
            <Text style={style.field_title}>有効</Text>
            <Switch onValueChange={this.switchValue} value={this.state.setting.enabled} />

            <Text style={style.field_title}>価格比率</Text>
            <TextInput style={style.textinput} onChangeText={this.setprice_rate} value={this.state.rate_string} />

            <View><Text style={style.submit} onPress={() => this.update()}>更新</Text></View>
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

export default connect(mapStateToProps)(withNavigationFocus(BacknumberAutomation, 'backnumberautomation'))
