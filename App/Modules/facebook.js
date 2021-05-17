import {LoginManager, AccessToken, GraphRequest, GraphRequestManager} from 'react-native-fbsdk'
import {store} from '../../config/router'
import {createUser, saveUserSnsInfo, loginBySns} from '../Modules/auth'
import {Platform, Alert} from 'react-native'
import I18n from '../../config/i18n'

export const UPDATE_FACEBOOK_ACCESS_TOKEN = 'facebook/UPDATE_FACEBOOK_ACCESS_TOKEN'
export const UPDATE_FACEBOOK_USER_INFO = 'facebook/UPDATE_FACEBOOK_USER_INFO'

const initialState = {
    access_token: null,
    service_id: null,
    name: null,
    email: null,
}

export const registerViaFacebook = (callback) => {
    return async (dispatch, getState) => {
        const responseInfoCallback = async (error, result) => {
            if (error) {
                console.log(error)
            } else {
                console.log(result)
                await dispatch({type: UPDATE_FACEBOOK_USER_INFO, service_id: result.id, name: result.name, email: result.email})
                const facebookInfo = getState().facebook
                await dispatch(createUser(facebookInfo.name, facebookInfo.email))
                const userId = getState().auth.user_id
                await dispatch(saveUserSnsInfo(
                    userId,
                    'facebook',
                    facebookInfo.name,
                    facebookInfo.service_id,
                    facebookInfo.access_token))
                await callback(true)
            }
        }
        const infoRequest = new GraphRequest(
            '/me',
            {
                httpMethod: 'GET',
                parameters: {
                    'fields': {
                        'string': 'email,name'
                    }
                }
            },
            responseInfoCallback,
        )
        await LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
            (result) => {
                if (result.isCancelled) {
                    Alert.alert(I18n.t('App.Views.Mypage.list_view.check'), I18n.t('App.Modules.facebook.login_canceled'))
                } else {
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            dispatch({type: UPDATE_FACEBOOK_ACCESS_TOKEN, access_token: data.accessToken})
                            new GraphRequestManager().addRequest(infoRequest).start()
                        }
                    )
                }
            },
            (error) => {
                Alert.alert(I18n.t('App.Views.Mypage.list_view.check'),I18n.t('App.Modules.facebook.login_error') + error)
            }
        )
    }
}

export const loginViaFacebook = (callback) => {
    return async (dispatch, getState) => {
        const responseInfoCallback = async (error, result) => {
            if (error) {
                console.log(error)
            } else {
                console.log(result)
                await dispatch({type: UPDATE_FACEBOOK_USER_INFO, service_id: result.id, name: result.name, email: result.email})
                const facebookInfo = getState().facebook
                result = await dispatch(loginBySns('facebook', facebookInfo.service_id, facebookInfo.email, Platform.OS))
                if (result.status === 200) {
                    await callback(true)
                } else {
                    await callback(false)
                }
            }
        }
        const infoRequest = new GraphRequest(
            '/me',
            {
                httpMethod: 'GET',
                parameters: {
                    'fields': {
                        'string': 'email,name'
                    }
                }
            },
            responseInfoCallback,
        )
        await LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
            (result) => {
                if (result.isCancelled) {
                    Alert.alert(I18n.t('App.Views.Mypage.list_view.check'), I18n.t('App.Modules.facebook.login_canceled'))
                } else {
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            dispatch({type: UPDATE_FACEBOOK_ACCESS_TOKEN, access_token: data.accessToken})
                            new GraphRequestManager().addRequest(infoRequest).start()
                        }
                    )
                }
            },
            (error) => {
                Alert.alert(I18n.t('App.Views.Mypage.list_view.check'), I18n.t('App.Modules.facebook.login_error') + error)
            }
        )
    }
}


export default function facebook(state = initialState, action) {
    switch (action.type) {
        case UPDATE_FACEBOOK_ACCESS_TOKEN: {
            return {
                ...state,
                access_token: action.access_token,
            }
        }
        case UPDATE_FACEBOOK_USER_INFO: {
            return {
                ...state,
                service_id: action.service_id,
                name: action.name,
                email: action.email,
            }
        }
    }
    return state
}
