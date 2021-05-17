import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Alert, Clipboard, Image, Platform, SafeAreaView, ScrollView, View, Text, StyleSheet, } from 'react-native'
import {Body, Container, Content, Icon, List, ListItem, Right} from 'native-base'
import {withNavigationFocus} from 'react-navigation'
import TouchableOpacity from '../../Components/DefaultTouchableOpacity'
import I18n from '../../../config/i18n'
import firebase from 'react-native-firebase'
import colors from '../../../config/colors'
import {deleteUser} from '../../Modules/auth'
import {loadAuthVerify} from '../../Modules/app'

const style = StyleSheet.create({
    list_title: {
        fontWeight: 'bold',
        fontSize: 13,
        margin: 10,
    },
})

class Mypage extends Component {

    constructor(props) {
        super(props)

        this.state = {
            debuger: false,
            own_project: true,
        }
    }

    async componentWillMount() {
        const me_data = await this.props.dispatch(loadAuthVerify())
        // ファンルームを開設していない場合の表示切り替え
        if (me_data.own_project == null) {
            this.setState({own_project: false})
        }

    }

    // ファンルーム
    openFanRoom() {
        this.props.navigation.push('myfanroom')
    }
    openNewFanRoom() {
        this.props.navigation.push('newfanroom', {
            newFunRoomStatus: (status) => this.setMenuList(status)
        })
    }
    openPost() {
        this.props.navigation.push('post')
    }
    openPlan() {
        this.props.navigation.push('plan')
    }
    openSales() {
        this.props.navigation.push('sales')
    }
    openBackers() {
        this.props.navigation.push('backers')
    }
    openMembers() {
        this.props.navigation.push('members')
    }
    openBacknumber() {
        this.props.navigation.push('backnumber')
    }

    // アカウント
    openSupportList () {
        this.props.navigation.push('supportlist')
    }
    openPayment() {
        this.props.navigation.push('payment')
    }

    openSiginUp () {
        this.props.navigation.push('siginup')
    }

    async setMenuList(status) {
        // ファンルームを開設していない場合の表示切り替え
        if (status.status == 'ok') {
            const me_data = await this.props.dispatch(loadAuthVerify())
            if (me_data.own_project == null) {
                this.setState({own_project: false})
            } else {
                this.setState({own_project: true})
            }
        }
    }
    openSiginIn () {
        this.props.navigation.push('siginin', {
            loginStatus: (status) => this.setMenuList(status)
        })
    }

    openChangeNickname () {
        this.props.navigation.push('changenickname')
    }

    openChangeEmailAddress () {
        this.props.navigation.push('changeemailaddress')
    }

    openChangePassword () {
        this.props.navigation.push('changepassword')
    }
    async logout () {
        const result = await this.props.dispatch(deleteUser())
    }
    logoutAlert() {
        Alert.alert(
            'ログアウトしますか？',
            '',
            [
                {text: 'ログアウトする', onPress: () => this.logout()},
                {text: 'キャンセル', style: 'cancel'},
            ],
            {cancelable: false},
        )
    }

    viewLogin() {
        return <View>
            <Text style={style.list_title}>{I18n.t('App.Views.Mypage.index.account.title')}</Text>
            <List style={{backgroundColor: 'white'}}>
                <ListItem
                    button
                    onPress={() => this.openSiginUp()}>
                    <Body>
                        <Text style={{fontSize: 14, fontWeight: '400', paddingVertical: 3}}>
                            {I18n.t('App.Views.Mypage.index.account.signup')}
                        </Text>
                    </Body>
                    <Right>
                        <Icon name="ios-arrow-forward-outline"/>
                    </Right>
                </ListItem>
            </List>

            <List style={{backgroundColor: 'white'}}>
                <ListItem
                    button
                    onPress={() => this.openSiginIn()}>
                    <Body>
                        <Text style={{fontSize: 14, fontWeight: '400', paddingVertical: 3}}>
                            {I18n.t('App.Views.Mypage.index.account.signin')}
                        </Text>
                    </Body>
                    <Right>
                        <Icon name="ios-arrow-forward-outline"/>
                    </Right>
                </ListItem>
            </List>
        </View>
    }

    viewNewFanroom() {
        return <View>
            <Text style={style.list_title}>{I18n.t('App.Views.Mypage.index.fanroom.title')}</Text>
            <List style={{backgroundColor: 'white'}}>
                <ListItem
                    button
                    onPress={() => this.openNewFanRoom()}>
                    <Body>
                        <Text style={{fontSize: 14, fontWeight: '400', paddingVertical: 3}}>
                            {I18n.t('App.Views.Mypage.index.fanroom.create_fanroom')}
                        </Text>
                    </Body>
                    <Right>
                        <Icon name="ios-arrow-forward-outline"/>
                    </Right>
                </ListItem>
            </List>
        </View>
    }

    viewFanroom() {
        return <View>
            <Text style={style.list_title}>{I18n.t('App.Views.Mypage.index.fanroom.title')}</Text>
            <List style={{backgroundColor: 'white'}}>
                <ListItem
                    button
                    onPress={() => this.openFanRoom()}>
                    <Body>
                        <Text style={{fontSize: 14, fontWeight: '400', paddingVertical: 3}}>
                            {I18n.t('App.Views.Mypage.index.fanroom.myfanroom')}
                        </Text>
                    </Body>
                    <Right>
                        <Icon name="ios-arrow-forward-outline"/>
                    </Right>
                </ListItem>
            </List>

            <List style={{backgroundColor: 'white'}}>
                <ListItem
                    button
                    onPress={() => this.openPost()}>
                    <Body>
                        <Text style={{fontSize: 14, fontWeight: '400', paddingVertical: 3}}>
                            {I18n.t('App.Views.Mypage.index.fanroom.post')}
                        </Text>
                    </Body>
                    <Right>
                        <Icon name="ios-arrow-forward-outline"/>
                    </Right>
                </ListItem>
            </List>

            <List style={{backgroundColor: 'white'}}>
                <ListItem
                    button
                    onPress={() => this.openPlan()}>
                    <Body>
                        <Text style={{fontSize: 14, fontWeight: '400', paddingVertical: 3}}>
                            {I18n.t('App.Views.Mypage.index.fanroom.plan')}
                        </Text>
                    </Body>
                    <Right>
                        <Icon name="ios-arrow-forward-outline"/>
                    </Right>
                </ListItem>
            </List>

            <List style={{backgroundColor: 'white'}}>
                <ListItem
                    button
                    onPress={() => this.openSales()}>
                    <Body>
                        <Text style={{fontSize: 14, fontWeight: '400', paddingVertical: 3}}>
                            {I18n.t('App.Views.Mypage.index.fanroom.sales')}
                        </Text>
                    </Body>
                    <Right>
                        <Icon name="ios-arrow-forward-outline"/>
                    </Right>
                </ListItem>
            </List>

            <List style={{backgroundColor: 'white'}}>
                <ListItem
                    button
                    onPress={() => this.openBackers()}>
                    <Body>
                        <Text style={{fontSize: 14, fontWeight: '400', paddingVertical: 3}}>
                            {I18n.t('App.Views.Mypage.index.fanroom.backer')}
                        </Text>
                    </Body>
                    <Right>
                        <Icon name="ios-arrow-forward-outline"/>
                    </Right>
                </ListItem>
            </List>

            <List style={{backgroundColor: 'white'}}>
                <ListItem
                    button
                    onPress={() => this.openMembers()}>
                    <Body>
                        <Text style={{fontSize: 14, fontWeight: '400', paddingVertical: 3}}>
                            {I18n.t('App.Views.Mypage.index.fanroom.member')}
                        </Text>
                    </Body>
                    <Right>
                        <Icon name="ios-arrow-forward-outline"/>
                    </Right>
                </ListItem>
            </List>

            <List style={{backgroundColor: 'white'}}>
                <ListItem
                    button
                    onPress={() => this.openBacknumber()}>
                    <Body>
                        <Text style={{fontSize: 14, fontWeight: '400', paddingVertical: 3}}>
                            {I18n.t('App.Views.Mypage.index.fanroom.backnumber')}
                        </Text>
                    </Body>
                    <Right>
                        <Icon name="ios-arrow-forward-outline"/>
                    </Right>
                </ListItem>
            </List>
        </View>
    }

    viewAccount() {
        return <View>
            <Text style={style.list_title}>{I18n.t('App.Views.Mypage.index.account.title')}</Text>
            <List style={{backgroundColor: 'white'}}>
                <ListItem
                    button
                    onPress={() => this.openSupportList()}>
                    <Body>
                        <Text style={{fontSize: 14, fontWeight: '400', paddingVertical: 3}}>
                            {I18n.t('App.Views.Mypage.index.account.support')}
                        </Text>
                    </Body>
                    <Right>
                        <Icon name="ios-arrow-forward-outline"/>
                    </Right>
                </ListItem>
            </List>

            <List style={{backgroundColor: 'white'}}>
                <ListItem
                    button
                    onPress={() => this.openPayment()}>
                    <Body>
                        <Text style={{fontSize: 14, fontWeight: '400', paddingVertical: 3}}>
                            {I18n.t('App.Views.Mypage.index.account.payment')}
                        </Text>
                    </Body>
                    <Right>
                        <Icon name="ios-arrow-forward-outline"/>
                    </Right>
                </ListItem>
            </List>

            <List style={{backgroundColor: 'white'}}>
                <ListItem
                    button
                    onPress={() => this.openChangeNickname()}>
                    <Body>
                        <Text style={{fontSize: 14, fontWeight: '400', paddingVertical: 3}}>
                            {I18n.t('App.Views.Mypage.index.account.nickname')}
                        </Text>
                    </Body>
                    <Right>
                        <Icon name="ios-arrow-forward-outline"/>
                    </Right>
                </ListItem>
            </List>

            <List style={{backgroundColor: 'white'}}>
                <ListItem
                    button
                    onPress={() => this.openChangeEmailAddress()}>
                    <Body>
                        <Text style={{fontSize: 14, fontWeight: '400', paddingVertical: 3}}>
                            {I18n.t('App.Views.Mypage.index.account.email')}
                        </Text>
                    </Body>
                    <Right>
                        <Icon name="ios-arrow-forward-outline"/>
                    </Right>
                </ListItem>
            </List>

            <List style={{backgroundColor: 'white'}}>
                <ListItem
                    button
                    onPress={() => this.openChangePassword()}>
                    <Body>
                        <Text style={{fontSize: 14, fontWeight: '400', paddingVertical: 3}}>
                            {I18n.t('App.Views.Mypage.index.account.password')}
                        </Text>
                    </Body>
                    <Right>
                        <Icon name="ios-arrow-forward-outline"/>
                    </Right>
                </ListItem>
            </List>

            <List style={{backgroundColor: 'white'}}>
                <ListItem
                    button
                    onPress={() => this.logoutAlert()}>
                    <Body>
                        <Text style={{fontSize: 14, fontWeight: '400', paddingVertical: 3}}>
                            {I18n.t('App.Views.Mypage.index.account.logout')}
                        </Text>
                    </Body>
                    <Right>
                        <Icon name="ios-arrow-forward-outline"/>
                    </Right>
                </ListItem>
            </List>
        </View>
    }

    render() {
        return (
            <ScrollView>
                {(() => {
                    if (!this.props.token) {
                        return this.viewLogin()
                    } else {
                        // ルームを開設している・していない場合の表示切り替え
                        if (this.state.own_project) {
                            return <View>
                                {this.viewFanroom()}
                                {this.viewAccount()}
                            </View>
                        }
                        return <View>
                            {this.viewNewFanroom()}
                            {this.viewAccount()}
                        </View>
                    }
                })()}
            </ScrollView>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        appState: state.app.state,
        token: state.auth.token,
        user_id: state.auth.user_id,
    }
}

export default connect(mapStateToProps)(withNavigationFocus(Mypage, 'profile'))
