import React, {Component} from 'react'
import {Provider} from 'react-redux'
import I18n from '../config/i18n'
import {Alert, AppState, Linking, Platform, View} from 'react-native'
import firebase from 'react-native-firebase'
import {AppWithNavigationState, store} from '../config/router'

export default class Root extends Component {
    constructor(props) {
        super(props)
        this.state = {
            appState: AppState.currentState,
            openTime: null,
        }
    }

    render() {
        return <Provider store={store}>
            <AppWithNavigationState/>
        </Provider>
    }
}
