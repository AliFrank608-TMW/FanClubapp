// 通信処理関連のユーティリティ
import log from './log'
import { sendSlack } from './slack'
import DeviceInfo from 'react-native-device-info'

export function fetchJson (url, options = {}) {
    if (!options.method) {
        options.method = 'get'
    }
    options = Object.assign({timeout: 540 * 1000}, options)
    return fetch(url, options).then((response) => {
        if (response.status === 200) {
            log.info(`[INFO] STATUS ${response.status} ${options.method.toUpperCase()} ${url}`)
        } else {
            log.warn(`[WARN] STATUS ${response.status} ${options.method.toUpperCase()} ${url}`)
        }
        let contentType = response.headers.get('content-type')
        if (contentType.indexOf('application/json') === -1) {
            throw new Error('response type is not json.')
        }
        // この意味不明のsetTimeout()はReactNativeの意味不明のバグを回避するために必要
        // この意味不明のsetTimeout()はReactNativeの意味不明のバグを回避するために必要
        // https://github.com/facebook/react-native/issues/6679
        setTimeout(() => null, 0)
        setTimeout(() => null, 10)
        setTimeout(() => null, 100)
        setTimeout(() => null, 1000)
        return response.text()
    }).then(text => {
        if (!text) {
            throw new Error('response body is empty')
        }
        return JSON.parse(text)
    }).catch(async error => {
        await sendSlack({
            channel: '#bugreport_coinapp',
            username: 'bot_error',
            msg: `>【${process.env.NODE_ENV} | ${new Date().toString()}】: ${error} --- UA: ${DeviceInfo.getUserAgent()} / IDFA: ${DeviceInfo.getUniqueID()} / BUILD NUMBER: ${DeviceInfo.getBuildNumber()}`,
        })
    })
}
