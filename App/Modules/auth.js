import * as api from '../API/auth'
import * as meApi from '../API/me'
import * as storage from '../Utils/storage'
import log from '../Utils/log'
import {Alert, Platform} from 'react-native'

export const UPDATE_USER_BASIC_INFO = 'auth/UPDATE_USER_BASIC_INFO'
export const UPDATE_ACCESS_TOKEN = 'auth/UPDATE_ACCESS_TOKEN'
export const UPDATE_MY_FOLLOWS = 'auth/UPDATE_MY_FOLLOWS'

const USER_ID_KEY = 'auth/user_id'
const TOKEN_KEY = 'auth/token'

const initialState = {
    user_id: null,
    token: null,
    follows: null,
}

// 新規登録
export function siginUp(params) {
    return async (dispatch, getState) => {
        const result = await api.siginUp(params)
        return result
    }
}

// 端末に保存したtokenの取得 (cookieのload)
export function loadFromStorage() {
    return async (dispatch, getState) => {
        const user_id = await storage.getItem(USER_ID_KEY)
        const token = await storage.getItem(TOKEN_KEY)
        if (user_id && token) {
            await dispatch({
                type: UPDATE_USER_BASIC_INFO,
                user_id: user_id.toString(),
                token: token,
            })
        }
    }
}

// uidとtokenの更新
export function updateUserBasicInfo(userId, token) {
    return async function (dispatch, getState) {
        if (!userId) throw new Error('userId is null')
        if (!token) throw new Error('token is null')

        let uid = userId
        if (typeof uid === 'number') {
            uid = uid.toString()
        }
        await Promise.all([
            storage.setItem(USER_ID_KEY, uid),
            storage.setItem(TOKEN_KEY, token),
            dispatch({type: UPDATE_USER_BASIC_INFO, user_id: uid, token: token})
        ])
    }
}


// ニックネーム変更
export function changeNickname(nickname) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.requestChangeNickname(token, nickname)
        return result
    }
}

// メアド変更
export function changeEmailAddress(email) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.requestChangeEmail(token, email)
        return result
    }
}

// パスワード変更
export function changePassword(password) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.requestChangePassword(token, password)
        return result
    }
}

// ユーザー作成 (メール認証はskipする)
// => Promise.allで呼び出すのでresult返してそれでUI変更などはできない
export function createUser(name = '', email = '') {
    return async (dispatch, getState) => {
        const {token} = getState().auth
        if (token) return // 既にアカウント作成済みなのでskip
        let params = {}
        if (name) {
            params['name'] = name
        }
        if (email) {
            params['email'] = email
        }
        try {
            // アカウント作成とreduxの更新
            const result = await (Platform.OS === 'ios' ? api.createUserIos(params) : api.createUserAndroid(params))
            await dispatch(updateUserBasicInfo(result.user_id, result.access_token))
            if (Platform.OS === 'android') {
                const pushToken = await storage.getItem('push_notification/pushToken')
                const oneSignalUserId = await storage.getItem('push_notification/oneSignalUserId')
                await meApi.updatePushToken(result.access_token, pushToken, oneSignalUserId)
            }
        } catch (e) {
            log.error(e)
            // 失敗の通達
            Alert.alert('エラー', '登録に失敗しました')
        }
    }
}

// 自分のフォロー情報をストアに格納
export function setMyFollows(follows) {
    return async function (dispatch, getState) {
        dispatch({type: UPDATE_MY_FOLLOWS, follows})
    }
}

// フォロー
export function follow(project_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.follow(token, project_id)
        return result
    }
}

// フォロー解除
export function unfollow(project_id) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.unfollow(token, project_id)
        return result
    }
}

export function loginWithPassword(params) {
    return async function (dispatch, getState) {
        const result = await api.loginWithPassword(params)
        if (result.user_id !== null || result.access_token !== null) {
            await dispatch(updateUserBasicInfo(result.user_id, (result.access_token || 'empty')))
        }
        return result
    }
}

export function deleteUser() {
    return async (dispatch, getState) => {
        await storage.removeItem(USER_ID_KEY)
        await storage.removeItem(TOKEN_KEY)
        await storage.removeItem('tutorialShowed')
        await storage.removeItem('phoneNumber')
        await dispatch({type: UPDATE_USER_BASIC_INFO, user_id: null, token: null})
    }
}

export function requestAuth(params) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.requestAuth(token, params)
        return result
    }
}

export function verifyAuth(params) {
    return async function (dispatch, getState) {
        const auth = getState().auth
        const {token, user_id} = auth
        const result = await api.verifyAuth(token, {...params, uid: user_id})
        if (result.status === 200) {
            await dispatch(updateUserBasicInfo(result.user.id, result.token))
        }
        return result
    }
}

export function appLoginRequest(params) {
    return async function (dispatch) {
        const result = await api.appLoginRequest({
            ...params,
            platform: Platform.OS
        })
        if (result.status === 200) {
            await dispatch(updateUserBasicInfo(result.user_id, result.access_token))
        }
        return result
    }
}

export function appLoginVerify(params) {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.appLoginVerify(token, params)
        return result
    }
}

export function deactivateUser() {
    return async (dispatch, getState) => {
        const {token} = getState().auth
        await api.deactivateUser(token, {})
        await storage.removeItem(USER_ID_KEY)
        await storage.removeItem(TOKEN_KEY)
        await storage.removeItem('tutorialShowed')
        await storage.removeItem('phoneNumber')
        return dispatch({type: UPDATE_USER_BASIC_INFO, user_id: null, token: null})
    }
}

export function saveUserSnsInfo(user_id, service, name, service_user_id, access_token) {
    return async (dispatch, getState) => {
        const result = await api.saveUserSnsInfo({user_id, service, name, service_user_id, access_token})
        return result
    }
}

export function loginBySns(service, service_user_id, email, platform) {
    return async (dispatch, getState) => {
        const result = await api.loginBySns({service, service_user_id, email, platform})
        if (result.status === 200) {
            await dispatch(updateUserBasicInfo(result.user.id, result.token))
        }
        return result
    }
}

export default function auth(state = initialState, action) {
    switch (action.type) {
        case UPDATE_USER_BASIC_INFO: {
            return {
                ...state,
                user_id: action.user_id,
                token: action.token,
            }
        }
        case UPDATE_ACCESS_TOKEN: {
            return {
                ...state,
                token: action.access_token,
            }
        }
        case UPDATE_MY_FOLLOWS: {
            return {
                ...state,
                follows: action.follows,
            }
        }
    }
    return state
}
