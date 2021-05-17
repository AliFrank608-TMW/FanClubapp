import React, {Component} from 'react'
import {Alert, Clipboard, Image, Platform, TextInput, SafeAreaView, ScrollView, StyleSheet, View, Text} from 'react-native'
import TouchableOpacity from '../../Components/DefaultTouchableOpacity'
import {isValidEmail, isValidPassword} from '../../Utils/validation'
import {withNavigationFocus} from "react-navigation"
import {connect} from "react-redux"
import Toast from 'react-native-root-toast'
import {newPlan, loadAuthVerify} from "../../Modules/app"

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
    new_btn: {
        padding: 5,
        margin: 10,
        backgroundColor: '#ffdd59',
        textAlign: 'center'
    },
})

class NewPlan extends Component {
    constructor(props) {
        super(props)
        this.state = {
            plans: [
                {
                    id: 0,
                    title: '',
                    project_id: 0,
                    price: 0,
                    description: '',
                }
            ],
        }
    }

    async componentWillMount() {
        // project_idを取得
        const result = await this.props.dispatch(loadAuthVerify())
        this.setState({
            plans: {
                ...this.state.plans,
                project_id: result.own_project.id
            }})
    }

    setTitle = (title) => {
        this.setState({
            plans: {
                ...this.state.plans,
                title: title
            }})
    }
    setPrice = (price) => {
        this.setState({
            plans: {
                ...this.state.plans,
                price: price
            }})
    }
    setDescription = (description) => {
        this.setState({
            plans: {
                ...this.state.plans,
                description: description
            }})
    }

    async save() {
        if (this.state.plans.title === '') {
            Toast.show('プラン名を入力してください')
            return false
        }

        // 料金バリデーション
        if (!typeof this.state.plans.price === 'number') {
            Toast.show('数字で入力してください')
            return false
        }
        if (this.state.plans.price <= 99) {
            Toast.show('100円以上である必要があります')
            return false
        }
        if (this.state.plans.price > 100000) {
            Toast.show('100,000円以下である必要があります')
            return false
        }

        const result = await this.props.dispatch(newPlan({plan: this.state.plans}))

        if (result.plan.created_at) {
            Toast.show('プランが作成されました')

            const {params} = this.props.navigation.state
            params.createdPlan({status: 'ok'})

            this.props.navigation.goBack()
        }
    }

    render() {
        return <View>
            <Text style={style.field_title}>プラン名</Text>
            <TextInput style={style.textinput} onChangeText={this.setTitle} />

            <Text style={style.field_title}>金額</Text>
            <TextInput style={style.textinput} onChangeText={this.setPrice} keyboardType='phone-pad' />

            <Text style={style.field_title}>特典</Text>
            <TextInput style={style.inputTextArea}
                       multiline={true}
                       numberOfLines={4}
                       onChangeText={this.setDescription}
            />

            <Text style={style.new_btn} onPress={() => this.save()}>作成</Text>
        </View>
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user_id: state.auth.user_id,

    }
}
export default connect(mapStateToProps)(withNavigationFocus(NewPlan, 'new_plan'))
