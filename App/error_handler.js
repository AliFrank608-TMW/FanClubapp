import {Alert} from 'react-native'
import I18n from '../config/i18n'
import {sendSlack} from '../App/Utils/slack'
import * as storage from '../App/Utils/storage'
import DeviceInfo from 'react-native-device-info'
import stacktraceParser from 'stacktrace-parser'

const parseErrorStack = (error) => {
    if (!error || !error.stack) {
        return []
    }
    return Array.isArray(error.stack) ? error.stack : stacktraceParser.parse(error.stack)
}


// intercept react-native error handling
global.ErrorUtils.setGlobalHandler(async (error, isFatal) => wrapGlobalHandler(error, isFatal))

async function wrapGlobalHandler (error, isFatal) {

    const stack = parseErrorStack(error)

    if (error && error.className) {
        let className = error.className
        if (className === 'NetworkError') {
            Alert.alert(I18n.t('App.error_handler.error_occur'), I18n.t('App.error_handler.network_error'))
        } else {
            Alert.alert(I18n.t('App.error_handler.error_occur'), I18n.t('App.error_handler.unknown_error'))
        }
    } else {
        Alert.alert(I18n.t('App.error_handler.error_occur'), I18n.t('App.error_handler.unknown_error'))
    }

    if (process.env.NODE_ENV === 'production') {
        const prevScr = await storage.getItem('event_log/prevScreen')
        const newScr = await storage.getItem('event_log/newScreen')
        await sendSlack({
            channel: '#bugreport_coinapp',
            username: 'bot_error',
            msg: `>【${process.env.NODE_ENV.toUpperCase()} | ${new Date().toString()}】| PREVIOUS SCREEN:${prevScr} | NEW SCREEN: ${newScr} | ERROR:${error} | STACK:${stack} | LINE:${error.line} | MSG:${error.message} ----- UA: ${DeviceInfo.getUserAgent()} / IDFA: ${DeviceInfo.getUniqueID()} / BUILD NUMBER: ${DeviceInfo.getBuildNumber()}`
        })
    }
}
