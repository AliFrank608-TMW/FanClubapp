import React, {Component} from 'react'
import {Alert, Clipboard, Image, Platform, TextInput, SafeAreaView, ScrollView, StyleSheet, View, Text} from 'react-native'
import TouchableOpacity from '../../Components/DefaultTouchableOpacity'
import {isValidEmail, isValidPassword} from '../../Utils/validation'
import {withNavigationFocus} from "react-navigation"
import {connect} from "react-redux"
import Toast from 'react-native-root-toast'
import {loadAuthVerify, requestDeletePlan} from "../../Modules/app"

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
    edit_del_btn: {
        width: '40%',
        padding: 5,
        margin: 5,
        backgroundColor: '#ffdd59',
        textAlign: 'center'
    }
})

class Plan extends Component {
    constructor(props) {
        super(props)
        this.state = {
            plans: [
                {
                    id: 0,
                    project_id: 0,
                    title: '',
                    price: 0,
                    description: '',
                }
            ],
        }
    }

    async componentWillMount() {
        const result = await this.props.dispatch(loadAuthVerify())
        this.setState({ plans: result.own_project.plans })
    }

    async setPlan(status) {
        if (status.status == 'ok') {
            const result = await this.props.dispatch(loadAuthVerify())
            this.setState({ plans: result.own_project.plans })
        }
    }

    openEditPlan(plan_id, project_id) {
        this.props.navigation.push('edit_plan', {
            plan_id: plan_id,
            project_id: project_id,
            editedPlan: (status) => this.setPlan(status)
        })
    }

    async openNewPlan() {
        this.props.navigation.push('new_plan', {
            createdPlan: (status) => this.setPlan(status)
        })
    }

    async deletePlan(plan_id) {
        const result = await this.props.dispatch(requestDeletePlan(plan_id))
        if (result.status === 'ok') {
            const result = await this.props.dispatch(loadAuthVerify())
            this.setState({ plans: result.own_project.plans })
            Toast.show('削除しました')
        }
    }

    deletePlanAlert(plan_id) {
        Alert.alert(
            '削除しますか？',
            '',
            [
                {text: '削除する', onPress: () => this.deletePlan(plan_id)},
                {text: 'キャンセル', style: 'cancel'},
            ],
            {cancelable: false},
        )
    }

    planMap() {
        return this.state.plans.map(plan => {
            return <ScrollView>
                <View style={{margin: 10, padding: 10, backgroundColor: '#f5f5f5'}}>
                    <Text><Text style={style.field_title}>プラン名</Text> {plan.title}</Text>
                    <Text><Text style={style.field_title}>金額</Text> {plan.price}</Text>
                    <Text><Text style={style.field_title}>特典</Text> {plan.description}</Text>

                    <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                        <Text style={style.edit_del_btn} onPress={() => this.deletePlanAlert(plan.id)}>削除</Text>
                        <Text style={style.edit_del_btn} onPress={() => this.openEditPlan(plan.id, plan.project_id)}>編集</Text>
                    </View>
                </View>
            </ScrollView>
        })
    }

    render() {
        return <ScrollView>
            <Text style={style.new_btn} onPress={() => this.openNewPlan()}>プランの作成</Text>
            {this.planMap()}
        </ScrollView>
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user_id: state.auth.user_id,

    }
}
export default connect(mapStateToProps)(withNavigationFocus(Plan, 'plan'))
