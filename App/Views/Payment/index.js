import React, {Component} from 'react'
import {Alert, Clipboard, Image, Platform, TextInput, SafeAreaView, ScrollView, StyleSheet, View, Text} from 'react-native'
import moment from 'moment'
import TouchableOpacity from '../../Components/DefaultTouchableOpacity'
import {withNavigationFocus} from "react-navigation"
import {connect} from "react-redux"
import Toast from 'react-native-root-toast'
import {loadAuthVerify, getChargePoint} from "../../Modules/app"
import * as inAppPurchaseApi from '../../Utils/in_app_purchase'
import bluebird from 'bluebird'
bluebird.promisifyAll(inAppPurchaseApi)

const style = StyleSheet.create({
    field_title: {
        fontSize: 13,
        fontWeight: 'bold',
        marginTop: 10,
        marginHorizontal: 10,
    },
    btn: {
        margin: 10,
        padding: 10,
        backgroundColor: '#ffdd59',
        textAlign: 'center',
    },

    point_charge_area: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    point_charge_item: {
        width: '40%',
        margin: 10,
        padding:5,
        backgroundColor: '#f5f5f5',
        textAlign: 'center',
    },
})

class Payment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            current_point: 0,
            point_list: {
                point: [
                {
                    id: 0,
                    price: 0,
                    charge: 0,
                    amount: 0,
                },
            ]
            }
        }
    }

    async sleep(msec) {
        return new Promise((resolve, _) => {
            setTimeout(() => resolve(), msec)
        })
    }

    async componentWillMount() {
        if (Platform.OS === 'ios') {
            await inAppPurchaseApi.loadIosProducts(async () => await this.sleep(200))
        }

        const result = await this.props.dispatch(loadAuthVerify())
        const current_point = result.user.points
        this.setState({current_point: current_point})

        // チャージポイント一覧の取得
        const point_list = await this.props.dispatch(getChargePoint())
        this.setState({point_list: point_list})
    }

    async chargePoint(product_id, point_id) {
        const params = {product_id: product_id, point_id: point_id}
        try {
            await inAppPurchaseApi.startInAppPurchase(params, async () => {
                // 残高ポイントを更新
                const result = await this.props.dispatch(loadAuthVerify())
                const current_point = result.user.points
                this.setState({current_point: current_point})

                Toast.show('ポイントを購入しました')
            })
        } catch (e) {
            Toast.show('ポイント購入に失敗しました')
            console.log('チャージエラー')
            console.log(e)
        }
    }

    selectPointAlert(product_id, price, point_id) {
        Alert.alert(
            price + 'チャージしますか？',
            '',
            [
                {text: 'チャージする', onPress: () => this.chargePoint(product_id, point_id)},
                {text: 'キャンセル', style: 'cancel'},
            ],
            {cancelable: false},
        )
    }

    pointMap() {
        return this.state.point_list.point.map(point => {
            return <View style={style.point_charge_area}>
                <Text style={style.point_charge_item}
                      onPress={() => this.selectPointAlert('fanclub.1000.charge', `${point.price} pt（${point.amount}円）`, point.id)}>
                    {point.price} pt（{point.amount}円）
                </Text>
            </View>
        })
    }

    render() {
        return <ScrollView>
            <Text style={style.field_title}>ポイント残高</Text>
            <Text style={{color: '#79c800', fontSize: 25, marginHorizontal: 10,}}>{this.state.current_point}</Text>

            <Text style={style.field_title}>ポイントチャージ</Text>

            {this.pointMap()}
        </ScrollView>
    }

}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user_id: state.auth.user_id,
    }
}
export default connect(mapStateToProps)(withNavigationFocus(Payment, 'payment'))
