import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Alert, Clipboard, Image, Platform, ScrollView, View, Text, StyleSheet, TextInput} from 'react-native'
import Toast from 'react-native-root-toast'
import {loadSupportList, loadStopSupport} from "../../Modules/app"
import {withNavigationFocus} from "react-navigation"
import moment from 'moment'

const style = StyleSheet.create({
    project_card: {
        margin: 5,
        padding: 10,
        backgroundColor: '#fff',
    },

    project_name: {
        fontWeight: 'bold',
        margin: 5,
    },

    edit_del_btn: {
        width: '40%',
        padding: 5,
        margin: 5,
        backgroundColor: '#ffdd59',
        textAlign: 'center'
    },
})

class SupportList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nickname: null,
            subscription_plans: {
                subscription_plans: [
                    {
                        id: 0,
                        subscription_id: 0,
                        title: '',
                        price: 0,
                        created_at: '',
                        projects: {
                            title: '',
                        },
                    }
                ]
            },
        }
    }

    async componentWillMount() {
        const result = await this.props.dispatch(loadSupportList())
        this.setState({ subscription_plans: result })
    }

    async stopSupport(plan_id) {
        const result = await this.props.dispatch(loadStopSupport(plan_id))

        if (result.message === 'success') {
            const result = await this.props.dispatch(loadSupportList())
            this.setState({ subscription_plans: result })
            Toast.show('サポートを停止しました')
        }
    }

    stopSupportAlert(plan_id) {
        Alert.alert(
            'サポートを停止しますか？',
            '',
            [
                {text: '停止する', onPress: () => this.stopSupport(plan_id)},
                {text: 'キャンセル', style: 'cancel'},
            ],
            {cancelable: false},
        )
    }

    planCardMap() {
        const joinedPlans = this.state.subscription_plans
        return joinedPlans.subscription_plans.length > 0 ? joinedPlans.subscription_plans.map(plan => {
            return <View style={style.project_card}>
                <Text style={style.project_name}>{plan.projects.title}</Text>
                <Text>プラン名：{plan.title}</Text>
                <Text>金額：{plan.price}円/月</Text>
                <Text>閲覧可能期間：{moment(new Date(plan.created_at)).format("YYYY/MM/DD")}から1ヶ月間</Text>
                <Text>サポート開始日：{moment(new Date(plan.created_at)).format("YYYY/MM/DD")}</Text>

                <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                    <Text style={style.edit_del_btn} onPress={() => this.stopSupportAlert(plan.subscription_id)}>サポートを停止する</Text>
                </View>
            </View>
        }) : <View style={style.project_card}>
            <Text style={style.project_name}>まだサポート先はありません。</Text>
        </View>
    }

    render() {
        return(
            <ScrollView style={{height: '100%', backgroundColor: '#f5f5f5'}}>
                {this.planCardMap()}
            </ScrollView>
        )
    }
}

const mapStateToProps = (state) => {
    return {
    }
}
export default connect(mapStateToProps)(withNavigationFocus(SupportList, 'supportlist'))
