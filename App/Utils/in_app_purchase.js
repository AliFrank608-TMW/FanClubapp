import {Alert, NativeModules, Platform} from 'react-native'
import * as iosApi from './ios_purchase'
import * as androidApi from './android_purchase'
import firebase from 'react-native-firebase'
import {store} from '../../config/router'
import Toast from 'react-native-root-toast'
import I18n from '../../config/i18n'
import bluebird from 'bluebird'

const {InAppUtils} = NativeModules
if (Platform.OS === 'ios') bluebird.promisifyAll(InAppUtils)
bluebird.promisifyAll(iosApi)
bluebird.promisifyAll(androidApi)

export const PRODUCT_KEYS = [
    'fanclub.1000.charge',
]

const toastParams = {
    duration: 1000,
    position: -100,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
}

export const startInAppPurchase = async (params, callback) => {
    const {product_id, point_id} = params
    let result = {status: 400, reason: 'initial in_app_purchase value'}
    if (!product_id) {
        result = {status: 400, reason: 'invalid product_id'}
        await callback(result)
    }
    if (Platform.OS === 'ios') {
        await iosApi.iosStartSubscribe(product_id, point_id, (ios_result) => callback(ios_result))
            .catch(async e => {
                result = {status: 400, reason: e.message}
                await callback(result)
            })
    } else if (Platform.OS === 'android') {
        await androidApi.androidStartSubscribe(product_id, (android_result) => callback(android_result))
            .catch(async e => {
                result = {status: 400, reason: e.message}
                await callback(result)
            })
    }
}


export const showInAppPurchaseInformation = async (result, selectedPlan) => {
    const platform = Platform.OS
    if (!result) {
        console.log('skipped because result could not get!')
        return {status: 400}
    }
    if (result.status === 200) {
        // 支払い完了
        Toast.show('支払いが完了しました')
        firebase.analytics().logEvent(`in_app_purchase_${platform.toUpperCase()}`, {'af_success': true})
        firebase.analytics().logEvent('start_subscribe', {
            'af_quantity': '1000pt',
            'af_revenue': selectedPlan.recurring_amount
        }) // 月払い支払い完了イベント
    } else {
        if (result.reason === 'NA_CURRENT_SUBSCRIPTION' || result.reason === 'NA_CURRENT_SUBSCRIPTION') {
            Toast.show(I18n.t(`App.Utils.${platform}_purchase.already_joined`), toastParams)
        } else if (result.reason === 'invalid_otid') {
            Toast.show(I18n.t(`App.Utils.${platform}_purchase.invalid_otid`), toastParams)
        } else if (result.reason === 'there are some errors about purchase processing') {
            if (platform === 'ios') {
                await InAppUtils.restorePurchases(async (error, response) => {
                    if (!error && Array.isArray(response)) {
                        // この場合は変更のリクエストを投げる
                        // すでに翌月末からプランが変更となります
                        Alert.alert(I18n.t('App.Utils.ios_purchase.already_joined_notify_title'), I18n.t('App.Utils.ios_purchase.already_joined_notify_desc'))
                    } else {
                        Alert.alert(I18n.t(`App.Utils.${platform}_purchase.error`), I18n.t(`App.Utils.${platform}_purchase.cant_connect`))
                    }
                })
            } else {
                Alert.alert(I18n.t(`App.Utils.${platform}_purchase.error`), I18n.t(`App.Utils.${platform}_purchase.cant_connect`))
            }
        } else if (result.reason === 'invalid developerPayload') {
            Alert.alert(I18n.t('App.Utils.android_purchase.error'), I18n.t('App.Utils.android_purchase.cant_connect'))
        } else if (result.reason === 'cannot make payments') {
            Alert.alert(I18n.t('App.Utils.ios_purchase.error'), I18n.t('App.Utils.ios_purchase.restricted_device'))
        } else {
            Toast.show(I18n.t(`App.Utils.${platform}_purchase.failed_to_join`), toastParams)
        }
    }
}

export const loadIosProducts = async (callback) => {
    if (Platform.OS !== 'ios') return
    await InAppUtils.loadProducts(PRODUCT_KEYS, async (error, products) => {
        console.log(error, products)
        await callback()
    })
}
