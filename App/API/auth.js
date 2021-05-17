import {restClient} from './common.js'

// 新規登録
export async function siginUp(params) {
    const result = await restClient.post('/auth/sign-up', null, params)
    return result
}

// ログイン
export async function loginWithPassword(params) {
    const result = await restClient.post('/auth/login', null, params)
    return result
}

// ユーザー情報取得
export async function getUserData(params) {
    const result = await restClient.get('/users/1')
    return result
}

// ニックネーム変更
export async function requestChangeNickname(token, params) {
    const result = await restClient.put('/me/name', token, params)
    return result
}

// メアド変更
export async function requestChangeEmail(token, params) {
    const result = await restClient.post('/me/request-mail-change', token, params)
    return result
}

// パスワード変更
export async function requestChangePassword(token, params) {
    const result = await restClient.put('/me/password', token, params)
    return result
}

// create_for_iosに相当
export async function createUserIos(params) {
    const result = await restClient.post('/auth/create_for_ios', null, {...params})
    return result
}

// create_for_androidに相当
export async function createUserAndroid(params) {
    const result = await restClient.post('/auth/create_for_android', null, {...params})
    return result
}

// 二段階認証リクエスト
export async function requestAuth(token, params) {
    const result = await restClient.post('/auth/request', token, params)
    return result
}

// 二段階認証チェック
export async function verifyAuth(token, params) {
    const result = await restClient.post('/auth/verify2', token, params)
    return result
}

// プロジェクトのフォロー
export async function follow (token, params) {
    const result = await restClient.put(`/projects/${params}/follow`, token, null)
    return result
}

// プロジェクトのフォロー解除
export async function unfollow (token, params) {
    const result = await restClient.delete(`/projects/${params}/follow`, token, null)
    return result
}

export async function appLoginRequest(params) {
    const result = await restClient.post('/auth/app_login_request', null, params)
    return result
}

export async function appLoginVerify(token, params) {
    const result = await restClient.post('/auth/app_login_verify', token, params)
    return result
}

export async function sendZaifTokenToServer(token, params) {
    const result = await restClient.post('/auth/zaif', token, {zaif: {...params}})
    return result
}

export async function deactivateUser(token, params) {
    const result = await restClient.delete('/auth/deactivate', token, params)
    return result
}

export async function saveUserSnsInfo(params) {
    const result = await restClient.post('/auth/associate_sns', null, params)
    return result
}

export async function loginBySns(params) {
    const result = await restClient.post('/auth/app_login_via_sns', null, params)
    return result
}
