import React from 'react'
import {Clipboard, Linking, Platform} from 'react-native'
import shittyQs from 'shitty-qs'
import SafariView from 'react-native-safari-view'
import {ANIMATIONS_SLIDE, CustomTabs} from 'react-native-custom-tabs'
import apiConfig from '../../config/api'
import I18n from '../../config/i18n'
import Toast from 'react-native-root-toast'

const toastParams = {
    duration: 1000,
    position: -100,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
}

function ApiConnectWebView(hash_string, exchangeValue, callback) {
    let url = `${apiConfig.web_host}/mypage/${exchangeValue}?hash_string=${hash_string}&modal=off`
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

module.exports = ApiConnectWebView
