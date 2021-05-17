import {Alert, NativeModules, Platform} from 'react-native'
import bluebird from 'bluebird'
import {store} from '../../config/router'
import {chargePoint} from '../Modules/app'

const {InAppUtils} = NativeModules
if (Platform.OS === 'ios') bluebird.promisifyAll(InAppUtils)

exports.iosStartSubscribe = async (plan_id, point_id, callback) => { // 支払いが可能かチェック
    const productId = plan_id
    let result = {status: 400, reason: 'initial ios_purchase value'}
    await InAppUtils.canMakePayments(async (enabled) => {
        if (!enabled) {
            result.reason = 'cannot make payments'
            await callback(result)
        }
    })
    await InAppUtils.purchaseProduct(productId, async (error, response) => {
        // NOTE: 課金済みもESKERRORDOMAIN1になる！
        // 別プランに課金とか発生してもESKERRORDOMAIN1がでるっぽい。
        // ただし、プラン変更はすぐにチャージおきずに次回引き落としを境に切り替わるのでloadでハンドリングすればよし
        try {
            if (error !== null && error.length !== 0) {
                let errMsg = ''
                if (typeof error === 'string') {
                    errMsg = error
                } else if (typeof error === 'object' && (error.code !== 'ESKERRORDOMAIN2')) {
                    errMsg = error.message
                }
                if (errMsg.length > 0) {
                    result.reason = 'there are some errors about purchase processing'
                    result = {
                        ...result,
                        errMsg
                    }
                    await callback(result)
                }
            } else if (response && response.transactionReceipt) {
                result = await store.dispatch(chargePoint({
                    receipt: response.transactionReceipt,
                    point_id: point_id,
                }))

                await callback(result)

            } else {
                result.reason = 'invalid pattern of in app purchase'
                await callback(result)
            }
        } catch (e) {
            result = {status: 400, reason: e.message}
            await callback(result)
        }
    })
}
