import React, {Component} from 'react'
import {Alert, Clipboard, Image, Platform, TextInput, SafeAreaView, StyleSheet, View, Text} from 'react-native'
import TouchableOpacity from '../../Components/DefaultTouchableOpacity'
import {withNavigationFocus} from "react-navigation"
import {connect} from "react-redux"
import {loadAuthVerify} from "../../Modules/app"

const style = StyleSheet.create({
    inputText: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        padding: 5,
        backgroundColor: '#eee',
    },
})

class SelectPlan extends Component {
    constructor(props) {
        super(props)
        this.state = {
            plans: {
                plans: [
                    {
                        backer_count: 0,
                        backers_limit: null,
                        created_at: '',
                        description: '',
                        id: 0,
                        price: 0,
                        project_id: 0,
                        title: '',
                        updated_at: '',
                    }
                ],
            },
        }
    }

    async componentWillMount() {
        // プラン一覧の取得
        let planList = await this.props.dispatch(loadAuthVerify())
        const freePlan = {
            id: 0,
            price: 0,
            title: '未指定（無料）',
        }

        this.setState({plans: planList['own_project']})
    }

    selectPlan(plan_id, plan_title) {
        const {params} = this.props.navigation.state
        params.sendSelectedPlan(plan_id, plan_title)
        this.props.navigation.goBack()
    }

    planMap() {
        const plans = this.state.plans
        return plans.plans.map(plan =>{
            return <View>
                <TouchableOpacity style={style.inputText} onPress={() => this.selectPlan(plan.id, plan.title)}>
                    <Text>{plan.title}</Text>
                    <Text>{plan.price}円/月</Text>
                    <Text>特典：{plan.description}</Text>
                </TouchableOpacity>
                </View>
        })
    }

    render() {
        return <View>
            <View>
                <TouchableOpacity style={style.inputText} onPress={() => this.selectPlan(0, '未指定（無料）')}>
                    <Text>未指定（無料）</Text>
                </TouchableOpacity>
            </View>

            {this.planMap()}
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

export default connect(mapStateToProps)(withNavigationFocus(SelectPlan, 'selectplan'))
