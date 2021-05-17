import * as storage from '../../App/Utils/storage'
import {store} from '../../config/router'
import {pureeSend} from '../../App/Modules/event_log'
import firebase from 'react-native-firebase'

exports.setScreen = async (screenName) => {
    firebase.analytics().setCurrentScreen(screenName)
    let prevScreen = await storage.getItem('event_log/newScreen')
    await storage.setItem('event_log/prevScreen', prevScreen)
    await storage.setItem('event_log/newScreen', screenName)
}

exports.appEvent = async (eventKey, eventParams, pureeParams) => {
    eventParams = eventParams || {}
    pureeParams = pureeParams || {}
    await Promise.all([
        firebase.analytics().logEvent(eventKey, {...eventParams}),
        store.dispatch(pureeSend({...pureeParams})),
    ])
}
