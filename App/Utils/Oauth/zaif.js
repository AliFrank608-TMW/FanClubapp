import React, {Component} from 'react'
import {Linking, Clipboard, Alert, Platform} from 'react-native'
import shittyQs from 'shitty-qs'
import SafariView from 'react-native-safari-view'
import {CustomTabs, ANIMATIONS_SLIDE} from 'react-native-custom-tabs'
import {store} from '../../../config/router'
import {fetchJson} from '../../Utils/network'
import {sendZaifTokenToServer} from '../../Modules/auth'
import apiConfig from '../../../config/api'
import I18n from '../../../config/i18n'
import Toast from 'react-native-root-toast'

const toastParams = {
    duration: 1000,
    position: -100,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
}

const CLIANT_ID = 'b3a21d0bcc8248a68df0d5a695bc2dd1'
const CLIANT_SECRET = '712b29ffd9674b8ba7c175c6b254bcb7'
const SCOPE = ['info', 'trade'].join('%20')
const REDIRECT_URL = apiConfig.base + '/auth/zaif_callback'

function ZaifOAuth(state, callback) {

    Linking.addEventListener('url', handleUrl)

    async function handleUrl(event) {
        let [, query_string] = event.url.match(/\?([^?]*)$/)
        let query = shittyQs(query_string)
        if (state !== query.state) {
            callback(new Error('State code is invalid. 1'))
        } else if (query.code === undefined) {
            callback(new Error('Oauth2 security error'))
        } else {
            const url = `https://oauth.zaif.jp/v1/token?code=${query.code}&grant_type=authorization_code&client_id=${CLIANT_ID}&client_secret=${CLIANT_SECRET}&redirect_uri=${REDIRECT_URL}`
            try {
                const res = await fetchJson(url, {method: 'post'})
                const {token_type, access_token, refresh_token, expires_in} = res
                if (res.state !== state) {
                    Toast.show(I18n.t('App.Utils.Oauth.zaif.error_occured_auth_zaif'), toastParams)
                    callback(new Error('State code is invalid. 2'))
                }
                if (token_type !== 'bearer') {
                    Toast.show(I18n.t('App.Utils.Oauth.zaif.error_occured_auth_zaif'), toastParams)
                    callback(new Error('invalid token_type'))
                }
                let apiRes = await store.dispatch(sendZaifTokenToServer(query.code, access_token, refresh_token, expires_in))
                if (apiRes.status === 200) {
                    Toast.show(I18n.t('App.Utils.Oauth.zaif.succeed_auth_zaif'), toastParams)
                    callback(null, true)
                } else if (apiRes.reason === 'ZAIF_TOKEN_ALREADY_SAVED') {
                    Toast.show(I18n.t('App.Utils.Oauth.zaif.already_auth_zaif'), toastParams)
                    callback(new Error('ZAIF_TOKEN_ALREADY_SAVED'))
                } else {
                    Toast.show(I18n.t('App.Utils.Oauth.zaif.failed_auth_zaif'), toastParams)
                    callback(new Error('API connection error'))
                }
            } catch (e) {
                console.info(e)
                Alert.alert(I18n.t('App.Utils.Oauth.zaif.network_error'), I18n.t('App.Utils.Oauth.zaif.error_network_msg'))
                callback(new Error('Zaif connection error'))
            }

        }
        Linking.removeEventListener('url', handleUrl)
    }


    let url = `https://zaif.jp/oauth?client_id=${CLIANT_ID}&response_type=code&scope=${SCOPE}&state=${state}&redirect_uri=${REDIRECT_URL}`
    if (Platform.OS === 'ios') {
        SafariView.show({
            url,
            fromBottom: true,
            readerMode: false,
            tintColor: '#5898FF',
        }).catch(_ => {
            Clipboard.setString(url)
            Toast.show(I18n.t('App.Utils.Oauth.zaif.cant_open_safari'), toastParams)
        })
    } else {
        CustomTabs.openURL(url, {
            toolbarColor: '#5898FF',
            enableUrlBarHiding: true,
            showPageTitle: true,
            enableDefaultShare: true,
            animations: ANIMATIONS_SLIDE,
        })
    }
}

module.exports = ZaifOAuth
