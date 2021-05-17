import {Alert, NativeModules, Platform} from 'react-native'
import I18n from '../../config/i18n'
import Toast from 'react-native-root-toast'
import InAppBilling from 'react-native-billing'
import * as api from '../API/subscription'
import {pureeSend} from '../Modules/event_log'
import {updateUserBasicInfo} from '../Modules/auth'
import {UPDATE_CURRENT_PLAN, UPDATE_PAYMENT_PROFILE,} from './me'

const {InAppUtils} = NativeModules

export const LOAD_PLANS = 'subscription/LOAD_PLANS'
export const LOAD_SUBSCRIBE = 'subscription/LOAD_SUBSCRIBE'
export const LOAD_CHARGES = 'subscription/LOAD_CHARGES'

const toastParams = {
    duration: 1000,
    position: -100,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
}

const initialState = {
    currentSubscription: {},
    plans: [],
}

const STORE_NAME = Platform.OS === 'ios' ? 'iTunes Store' : 'Google Play'

// プランの一覧取得
export function loadPlansSubscription(params) {
    return async (dispatch, getState) => {
        const {token} = getState().auth
        const result = await api.loadPlansSubscription(token, params)
        if (result.status === 200) {
            await dispatch({type: LOAD_PLANS, plans: result.plans})
        }
        return result
    }
}

// 加入画面で取得する情報
export function prepareStartSubscription(params) {
    return async (dispatch, getState) => {
        const {token} = getState().auth
        const {paymentProfile} = getState().me
        const result = await api.prepareStartSubscription(token, params)
        dispatch(pureeSend({
            action_name: 'prepare_subscription',
            action_value: result.status,
            value_int1: paymentProfile.payment_method_num,
            // 事前に支払手段を登録してるのとそうでないのは両方を
        }))
        if (result.status === 200) {
            dispatch({type: UPDATE_PAYMENT_PROFILE, payment: result.payment_profile})
        }
        return result
    }
}

export function receiptValidate(params) {
    return async (dispatch, getState) => {
        const {token} = getState().auth
        const result = await api.postPointCharge(token, params)
        await dispatch(pureeSend({
            action_name: 'receipt_validate',
            action_value: result.status,
        }))
        if (result.status === 200) {
            await Promise.all([
                dispatch({type: UPDATE_PAYMENT_PROFILE, payment: result.payment_profile}),
                dispatch({type: UPDATE_CURRENT_PLAN, plan: result.current_plan}),
                dispatch({type: LOAD_SUBSCRIBE, subscription: result.new_subscription}),
            ])
        }
        return result
    }
}

export function loadLatestStatus() {
    return async (dispatch, getState) => {
        const {token} = getState().auth
        const result = await api.loadLatestStatus(token, {})
        await dispatch(pureeSend({
            action_name: 'load_latest_status',
            action_value: result.status,
        }))
        if (result.status === 200) {
            await Promise.all([
                dispatch({type: UPDATE_PAYMENT_PROFILE, payment: result.payment_profile}),
                dispatch({type: UPDATE_CURRENT_PLAN, plan: result.current_plan}),
                dispatch({type: LOAD_SUBSCRIBE, subscription: result.new_subscription}),
            ])
        }
        // MEMO: トーストここで出した方がいいかも？
        // リスクはバッチとずれたタイミングでトーストでるかも
        return result
    }
}

export function restoreSubscription() {
    return async (dispatch, getState) => {
        let params = {}
        const {token} = getState().auth
        if (Platform.OS === 'ios') {
            let toast = Toast.show(STORE_NAME + I18n.t('App.Modules.subscription.try_restore'), toastParams)
            await InAppUtils.restorePurchases(async (error, response) => {
                if (!error) {
                    const sorted = await response.sort((a, b) => a.transactionDate - b.transactionDate)
                    const lastPurchase = await sorted[sorted.length - 1]
                    params['original_transaction_id'] = await lastPurchase.originalTransactionIdentifier
                    params['receipt_data'] = await lastPurchase.transactionReceipt
                    params['plan_id'] = await lastPurchase.productIdentifier
                    const result = await api.restoreSubscription(token, params)
                    Toast.hide(toast)
                    if (result.status === 200) {
                        await dispatch(updateUserBasicInfo(result.user_id, result.access_token))
                        await Promise.all([
                            dispatch({type: UPDATE_PAYMENT_PROFILE, payment: result.payment_profile}),
                            dispatch({type: UPDATE_CURRENT_PLAN, plan: result.current_plan}),
                            dispatch({type: LOAD_SUBSCRIBE, subscription: result.new_subscription}),
                        ])
                        Toast.show(I18n.t('App.Modules.subscription.restore_complete'), toastParams)
                    } else {
                        if (result.reason === 'NA_CURRENT_SUBSCRIPTION') {
                            Toast.show(STORE_NAME + I18n.t('App.Modules.subscription.cant_find_subscription'), toastParams)
                        } else {
                            Toast.show(I18n.t('App.Modules.subscription.restore_failed'), toastParams)
                        }
                    }
                } else {
                    Toast.show(I18n.t('App.Modules.subscription.restore_failed'), toastParams)
                }
            })
        } else {
            let toast = Toast.show(STORE_NAME + I18n.t('App.Modules.subscription.try_restore'), toastParams)
            await InAppBilling.close()
            await InAppBilling.open()
            const ids = await InAppBilling.listOwnedSubscriptions()
            await InAppBilling.loadOwnedPurchasesFromGoogle()
            const promises = ids.map(async (id) => {
                return await InAppBilling.getSubscriptionTransactionDetails(id).then(detail => {
                    return [detail.purchaseToken, detail.productId]
                })
            })
            params['sets'] = await Promise.all(promises)
            await InAppBilling.close()
            const result = await api.restoreSubscription(token, params)
            Toast.hide(toast)
            if (result.status === 200) {
                await dispatch(updateUserBasicInfo(result.user_id, result.access_token))
                await Promise.all([
                    dispatch({type: UPDATE_PAYMENT_PROFILE, payment: result.payment_profile}),
                    dispatch({type: UPDATE_CURRENT_PLAN, plan: result.current_plan}),
                    dispatch({type: LOAD_SUBSCRIBE, subscription: result.new_subscription}),
                ])
                Toast.show(I18n.t('App.Modules.subscription.restore_complete'), toastParams)
            } else {
                if (result.reason === 'NA_CURRENT_SUBSCRIPTION') {
                    Toast.show(STORE_NAME + I18n.t('App.Modules.subscription.cant_find_subscription'), toastParams)
                } else {
                    Toast.show(I18n.t('App.Modules.subscription.restore_failed'), toastParams)
                }
            }
        }
    }
}


export default function subscription(state = initialState, action) {
    switch (action.type) {
        case LOAD_PLANS: {
            return {
                ...state,
                plans: action.plans,
            }
        }
        case LOAD_SUBSCRIBE: {
            return {
                ...state,
                currentSubscription: action.subscription,
            }
        }
    }
    return state
}
