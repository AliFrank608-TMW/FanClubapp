import {AsyncStorage} from 'react-native'

export function getItem(key) {
    function parseJson (item) {
        try { return JSON.parse(item) }
        catch (e) { return item }
    }
    return AsyncStorage.getItem(key).then(item => parseJson(item))
}

export function setItem(key, value) {
    if (value) return AsyncStorage.setItem(key, value)
    else console.log('not set, stringify failed:', key, value)
}

export function removeItem(key) {
    return AsyncStorage.removeItem(key)
}
