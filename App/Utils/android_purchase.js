import {NativeModules, Platform} from 'react-native'
import {store} from '../../config/router'
import InAppBilling from 'react-native-billing'
import bluebird from 'bluebird'

exports.androidStartSubscribe = async (plan_id, callback) => {

    const hex = (n) => {
        n = n || 16
        let result = ''
        while (n--) {
            result += Math.floor(Math.random() * 16).toString(16).toUpperCase()
        }
        return result
    }

    const productId = plan_id
    const developerPayload = hex(10)
    let details
    let result = {status: 400, reason: 'initial android_purchase value'}
    try {
        await InAppBilling.close()
        await InAppBilling.open()
        details = await InAppBilling.subscribe(productId, developerPayload)
        if (('subs:' + productId + ':' + developerPayload) !== details.developerPayload) {
            result.reason = 'invalid developerPayload'
            return await callback(result)
        }
        await InAppBilling.close()
    } catch (e) {
        if (e.code !== 'UNSPECIFIED') {
            result.reason = 'there are some errors about purchase processing'
            return await callback(result)
        }
    }

    await callback(result)
}
