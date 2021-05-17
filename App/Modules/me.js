import * as api from '../API/me'
import log from '../Utils/log'
import * as storage from '../Utils/storage'
import { LOAD_SUBSCRIBE } from '../Modules/subscription'
import {Platform} from 'react-native'

export const GET_BASIC_PROFILE = 'me/GET_BASIC_PROFILE'
export const CONFIRM_EMAIL = 'me/CONFIRM_EMAIL'
export const CONFIRM_PHONE = 'me/CONFIRM_PHONE'
export const UPDATE_LOGIN_SETTING = 'me/UPDATE_LOGIN_SETTING'
export const UPDATE_PASSWORD_STATUS = 'me/UPDATE_PASSWORD_STATUS'
export const UPDATE_INVITECODE = 'me/UPDATE_INVITECODE'
export const UPDATE_EXCHANGES = 'me/UPDATE_EXCHANGES'
export const UPDATE_PAYMENT_PROFILE = 'me/UPDATE_PAYMENT_PROFILE'
export const UPDATE_CURRENT_PLAN = 'me/UPDATE_CURRENT_PLAN'

const initialState = {
    basicProfile: {
        email: {
            status: null, // authed, sent, failed
            email_string: null,
        },
        phone_number: {
            status: null, // authed, sent, failed
            phone_string: null,
        },
    },
    login_settings: {
        password: false,
        two_factor: false,
    },
    password_status: false,
    invite_code: {
        used: null,
        my_code: null,
    },
    currentPlan: null,
    exchange: {
        zaif: null,
        bitFlyer: null,
        binance: null,
        bitfinex: null,
    },
    paymentProfile: {
        active_bot_num: null,
        rest_available_bot_num: null,
        payment_method_num: null,
        discount_coupon_num: null,
        monthly_coupon_num: null,
        invoice_num: null,
    },
}

export function getBasicProfile () {
    return async function (dispatch, getState) {
        const {token} = await getState().auth
        if (!token) return
        const result = await api.getBasicProfile(token).catch(e => {
            log.error(e)
            return {status: 500}
        })
        if (result.status === 200) {
            await storage.setItem('phoneNumber', result.user.phone_number.phone_string)
            dispatch({
                type: GET_BASIC_PROFILE,
                profile: result.user,
                plan: result.current_plan,
                exchange: result.exchange,
                payment: result.payment_profile,
            })
            dispatch({
                type: UPDATE_INVITECODE,
                invite_code: result.invite_code,
            })
            dispatch({
                type: LOAD_SUBSCRIBE,
                subscription: result.subscription,
            })
            dispatch({
                type: UPDATE_LOGIN_SETTING,
                login_settings: result.login_settings,
            })
            dispatch({
                type: UPDATE_PASSWORD_STATUS,
                password_status: result.password_status,
            })
        } else {
            log.warn(result)
        }
        return result
    }
}

export function passwordChange (params) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.passwordChange(token, params)
        return result
    }
}

export function changeLoginSetting (params) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.changeLoginSetting(token, params)
        if (result.status === 200) {
            await dispatch({
                type: UPDATE_LOGIN_SETTING,
                login_settings: result.login_settings,
            })
        }
        return result
    }
}

export function loadActivateProcess (params) {
    return async (dispatch, getState) => {
        const {token} = getState().auth
        const result = await api.loadActivateProcess(token, params)
        return result
    }
}

export function loginCountIncr () {
    return async (dispatch, getState) => {
        const {token} = getState().auth
        const result = await api.loginCountIncr(token)
        return result
    }
}

export function updatePushToken (pushToken, oneSignalUserId) {
    return async function (dispatch, getState) {
        const {token} = await getState().auth
        if (Platform.OS === 'android') {
            await storage.setItem('push_notification/pushToken', pushToken)
            await storage.setItem('push_notification/oneSignalUserId', oneSignalUserId)
        }
        let result = await api.updatePushToken(token, pushToken, oneSignalUserId)
        return result
    }
}

export function openedPushNotification (params) {
    return async function (dispatch, getState) {
        const {token} = await getState().auth
        let result = await api.openedPushNotification(token, params)
        return result
    }
}

export function useInviteCode (params) {
    return async function (dispatch, getState) {
        const {token} = await getState().auth
        const result = await api.useInviteCode(token, params)
        if (result.status === 200) {
            await dispatch({type: UPDATE_INVITECODE, invite_code: result.invite_code})
        }
        return result
    }
}

export function requestEmailChange (email) {
    return async (dispatch, getState) => {
        const {token} = getState().auth
        const result = await api.requestEmailChange(token, {email})
        return result
    }
}

export function requestPhoneNumberChange (phone, firebase_verification_id) {
    return async (dispatch, getState) => {
        const {token} = getState().auth
        const result = await api.requestPhoneNumberChange(token, {phone, firebase_verification_id})
        return result
    }
}

export function confirmPhoneNumberChange (phone_number_change_request_id, firebase_token, firebase_uid, firebase_refreshToken) {
    return async (dispatch, getState) => {
        const {token} = getState().auth
        const result = await api.confirmPhoneNumberChange(token, {
            token: firebase_token,
            phone_number_change_request_id,
            firebase_uid,
            firebase_refreshToken,
        })
        if (result.status === 200) {
            const profile = result.user
            await storage.setItem('phoneNumber', profile.phone_number.phone_string)
            await dispatch({type: CONFIRM_PHONE, profile})
        }
        return result
    }
}

export default function me (state = initialState, action) {
    switch (action.type) {
        case GET_BASIC_PROFILE: {
            return {
                ...state,
                basicProfile: action.profile,
                currentPlan: action.plan,
                exchange: action.exchange,
                paymentProfile: action.payment,
            }
        }
        case CONFIRM_EMAIL: {
            return {
                ...state,
                basicProfile: action.profile,
            }
        }
        case CONFIRM_PHONE: {
            return {
                ...state,
                basicProfile: action.profile,
            }
        }
        case UPDATE_LOGIN_SETTING: {
            return {
                ...state,
                login_settings: action.login_settings,
            }
        }
        case UPDATE_PASSWORD_STATUS: {
            return {
                ...state,
                password_status: action.password_status,
            }
        }
        case UPDATE_INVITECODE: {
            return {
                ...state,
                invite_code: action.invite_code,
            }
        }
        case UPDATE_EXCHANGES: {
            return {
                ...state,
                exchange: action.exchange,
            }
        }
        case UPDATE_PAYMENT_PROFILE: {
            return {
                ...state,
                paymentProfile: action.payment,
            }
        }
        case UPDATE_CURRENT_PLAN: {
            return {
                ...state,
                currentPlan: action.plan,
            }
        }
    }
    return state
}
