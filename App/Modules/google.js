import {createUser, saveUserSnsInfo, loginBySns} from '../Modules/auth'
import {Platform, Alert} from 'react-native'
import I18n from '../../config/i18n'
import { GoogleSignin, statusCodes } from 'react-native-google-signin'


export const UPDATE_GOOGLE_USER_INFO = 'google/UPDATE_GOOGLE_USER_INFO'

const initialState = {
    user_info: null,
}


export const registerViaGoogle = (callback) => {
    return async (dispatch, getState) => {
        try {
            await GoogleSignin.hasPlayServices()
            const userInfo = await GoogleSignin.signIn()
            await dispatch({type: UPDATE_GOOGLE_USER_INFO, user_info: userInfo})

            const googleInfo = getState().google.user_info
            await dispatch(createUser(googleInfo.user.name, googleInfo.user.email))

            const userId = getState().auth.user_id
            await dispatch(saveUserSnsInfo(
                userId,
                'google',
                googleInfo.user.name,
                googleInfo.user.id,
                googleInfo.accessToken))

            await callback(true)
        } catch (error) {
            console.log('GoogleSignin.signIn', error)

            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                Alert.alert(I18n.t('App.Views.Mypage.list_view.check'), I18n.t('App.Modules.google.login_canceled'))
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
                Alert.alert(I18n.t('App.Views.Mypage.list_view.check'), I18n.t('App.Modules.google.login_error'))
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                Alert.alert(I18n.t('App.Views.Mypage.list_view.check'), I18n.t('App.Modules.google.login_error'))
            } else {
                // some other error happened
                Alert.alert(I18n.t('App.Views.Mypage.list_view.check'), I18n.t('App.Modules.google.login_error'))
            }

            await callback(false)
        }
    }
}


export const loginViaGoogle = (callback) => {
    return async (dispatch, getState) => {
        try {
            await GoogleSignin.hasPlayServices()
            const userInfo = await GoogleSignin.signIn()
            await dispatch({type: UPDATE_GOOGLE_USER_INFO, user_info: userInfo})

            const googleInfo = getState().google.user_info
            const result = await dispatch(loginBySns('google', googleInfo.user.id, googleInfo.user.email, Platform.OS))

            if (result.status === 200) {
                await callback(true)
            } else {
                await callback(false)
            }
        } catch (error) {
            console.log('GoogleSignin.signIn', error)

            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                Alert.alert(I18n.t('App.Views.Mypage.list_view.check'), I18n.t('App.Modules.google.login_canceled'))
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
                Alert.alert(I18n.t('App.Views.Mypage.list_view.check'), I18n.t('App.Modules.google.login_error'))
                await callback(false)
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                Alert.alert(I18n.t('App.Views.Mypage.list_view.check'), I18n.t('App.Modules.google.login_error'))
                await callback(false)
            } else {
                // some other error happened
                Alert.alert(I18n.t('App.Views.Mypage.list_view.check'), I18n.t('App.Modules.google.login_error'))
                await callback(false)
            }
        }
    }
}



export default function google(state = initialState, action) {
    switch (action.type) {
        case UPDATE_GOOGLE_USER_INFO: {
            return {
                ...state,
                user_info: action.user_info,
            }
        }
    }
    return state
}
