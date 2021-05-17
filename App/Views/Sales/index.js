import React, {Component} from 'react'
import {Alert, Clipboard, Image, Platform, TextInput, SafeAreaView, ScrollView, StyleSheet, View, Text} from 'react-native'
import moment from 'moment'
import TouchableOpacity from '../../Components/DefaultTouchableOpacity'
import {withNavigationFocus} from "react-navigation"
import {connect} from "react-redux"
import Toast from 'react-native-root-toast'
import {loadAuthVerify, loadSalesRecent, loadSalesDaily, loadSalesMonthly} from "../../Modules/app"

const style = StyleSheet.create({
    list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    column: {
        width: '50%',
        height: 35,
        padding: 5,
        borderColor: '#555',
        borderBottomWidth: 0.5,
    },
    btn: {
        minWidth: 100,
        fontSize: 12,
        paddingTop: 7,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        marginHorizontal: 5,
        marginVertical: 10,
        color: '#485460',
        borderRadius: 14,
        backgroundColor: '#ffdd59',
        overflow: 'hidden',
        textAlign: 'center',
    }
})

class Sales extends Component {
    constructor(props) {
        super(props)
        this.state = {
            project_id: 0,
            segment_tab_id: 1,
            recent: {
                plan_payments: [],
            },
            daily: {
                plan_payments: [],
            },
            monthly: {
                plan_payments: [],
            },
            post_pack_payments: [],
        }
    }

    async componentWillMount() {
        // project_id取得
        const my_data = await this.props.dispatch(loadAuthVerify())
        const project_id = my_data.own_project.id
        this.setState({project_id: project_id})

        // 売上データを取得
        // 直近100件
        const recent = await this.props.dispatch(loadSalesRecent(project_id))
        this.setState({recent:{plan_payments: recent.plan_payments}})
        // 日別
        const daily = await this.props.dispatch(loadSalesDaily(project_id))
        this.setState({daily:{plan_payments: daily.plan_payments}})
        // 月別
        const monthly = await this.props.dispatch(loadSalesMonthly(project_id))
        this.setState({monthly:{plan_payments: monthly.plan_payments}})
    }

    recentMap() {
        return this.state.recent.plan_payments.map(plan => {
            return <View style={style.list}>
                <View style={style.column}><Text>{moment(new Date(plan.created_at)).format("YYYY/MM/DD")}</Text></View>
                <View style={style.column}><Text>{plan.charge} 円</Text></View>
            </View>
        })
    }

    dailyMap() {
        return this.state.daily.plan_payments.map(plan => {
            return <View style={style.list}>
                <View style={style.column}><Text>{plan.day}</Text></View>
                <View style={style.column}><Text>{plan.amount} 円</Text></View>
            </View>
        })
    }

    monthlyMap() {
        return this.state.monthly.plan_payments.map(plan => {
            return <View style={style.list}>
                <View style={style.column}><Text>{plan.month}</Text></View>
                <View style={style.column}><Text>{plan.amount} 円</Text></View>
            </View>
        })
    }

    setSegmentTabId = (id) => {
        this.setState({segment_tab_id: id})
    }

    render() {
        return <ScrollView>
            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
            }}>
                <Text style={style.btn} onPress={() => this.setSegmentTabId(1)}>直近100件</Text>
                <Text style={style.btn} onPress={() => this.setSegmentTabId(2)}>日別</Text>
                <Text style={style.btn} onPress={() => this.setSegmentTabId(3)}>月別</Text>
            </View>

            <View style={style.list}>
                <View style={style.column}><Text>日付</Text></View>
                <View style={style.column}><Text>金額</Text></View>
            </View>
            {(() => {
                if (this.state.segment_tab_id === 1) {
                    // 直近100件
                    return <View>
                        {this.recentMap()}
                    </View>
                } else if (this.state.segment_tab_id === 2) {
                    // 日別
                    return <View>
                        {this.dailyMap()}
                    </View>
                } else if (this.state.segment_tab_id === 3) {
                    // 月別
                    return <View>
                        {this.monthlyMap()}
                    </View>
                }
            }) ()}

        </ScrollView>
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user_id: state.auth.user_id,
    }
}
export default connect(mapStateToProps)(withNavigationFocus(Sales, 'sales'))
