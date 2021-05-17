import {Platform} from 'react-native'
import { restClient } from './common.js'

export async function prepareStartSubscription (token, params) {
    const result = await restClient.get('/', token, params)
    return result
}

export async function loadPlansSubscription (token, params) {
    const result = await restClient.get('/', token, params)
    return result
}

// ポイントチャージ
export async function postPointCharge (token, params) {
    const result = await restClient.post('/point_orders/' + Platform.OS, token, params)
    return result
}

export async function loadLatestStatus (token, params) {
    const result = await restClient.post('/' + Platform.OS, token, params)
    return result
}

export async function restoreSubscription (token, params) {
    const result = await restClient.post('/' + Platform.OS, token, params)
    return result
}
