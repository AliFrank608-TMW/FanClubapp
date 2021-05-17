import React, {Component} from 'react'
import {connect} from 'react-redux'
import {ActivityIndicator, Alert, Button, Linking, Platform, View} from 'react-native'
import * as appActions from '../Modules/app'
import {loadFromStorage} from '../Modules/auth'
import * as storage from '../Utils/storage'
import Text from '../Components/DefaultText'
import apiConfig from '../../config/api'
import I18n from '../../config/i18n'
import {disableTabBar} from '../Utils/Layout/common_header'
import screen from '../Styles/screen'


/**
 * 最初に表示するページを判定するために使うダミーの画面
 */
export class Initial extends Component {

    static navigationOptions = () => disableTabBar()

    constructor(props) {
        super(props)

        this.state = {
            hasError: false,
            isLoading: true,
        }
    }

    // 要確認
    async componentDidMount() {
        await this._startup()
    }
    async _startup() {
        let requireInstallLogging = false
        await this.props.dispatch(loadFromStorage())
        return this.props.dispatch(appActions.loadLastBootTime()).then(async _ => {
            if (this.props.token !== null) {

            }
            return true
        }).then(_ => {
            if (this.props.app.last_boot_time === null) {
                // 初回起動時にSafariを起動すればユーザーのトラッキンができる
                // しかし、Appleのガイドライン違反となるためリジェクトされる可能性が高い
                // SafariViewControllerを使うことでアプリ内部でクッキーを共有することも可能だが
                // こちらも明確に規約で禁止されている。
                // https://developer.apple.com/app-store/review/guidelines/jp/
                // requireInstallLogging = true
            }
        }).then(async _ => {
            await Promise.all([
                this.props.dispatch(appActions.loadAppSettings()),
                this.props.dispatch(appActions.incrementBootCount()),
                this.props.dispatch(appActions.updateLastBootTime()),
            ])
            return true
        }).then(_ => {
            if (requireInstallLogging) {
                return Linking.openURL(apiConfig.install_logging_url).then(_ => {
                    throw new Error('INSTALL_LOGGING')
                })
            }
            return true
        }).finally(async _ => {
            return this.props.navigation.dispatch({
                type: 'Navigation/NAVIGATE',
                key: null,
                routeName: 'cardRoot',
            })
        }).catch(e => {
            Alert.alert(I18n.t('App.Views.initial.error_network'))
            return this.setState({
                hasError: true,
            })
        })
    }

    _renderContent() {
        return <View style={{paddingHorizontal: '6%'}}>
            {
                this.state.hasError ? [
                    <Text style={{padding: 10}}>
                        {I18n.t('App.Views.initial.error')}
                    </Text>,
                    <Button title={I18n.t('App.Views.initial.start_up')} onPress={this._startup.bind(this)}/>,
                ] : (
                    this.need_install ? [
                        <Text style={{padding: 10, lineHeight: 13.8}}>
                            {I18n.t('App.Views.initial.not_newest')}{'\n'}
                            {I18n.t('App.Views.initial.encourage_update')}
                        </Text>,
                        <Button title={I18n.t('App.Views.initial.goto_store')} onPress={this._toAppStore.bind(this)}/>,
                    ] : <ActivityIndicator style={{padding: 10}}/>
                )
            }
        </View>
    }

    render() {

        return <View style={[{flex: 1, backgroundColor: 'white'}, screen.centerize]}>
            {this._renderContent()}
        </View>
    }
}

const mapStateToProps = (state) => {
    return {
        app: state.app,
        token: state.auth.token,
    }
}

export default connect(mapStateToProps)(Initial)
