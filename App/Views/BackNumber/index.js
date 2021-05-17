import React, {Component} from 'react'
import {Alert, Clipboard, Image, Platform, TextInput, SafeAreaView, ScrollView, StyleSheet, View, Text} from 'react-native'
import moment from 'moment'
import TouchableOpacity from '../../Components/DefaultTouchableOpacity'
import {withNavigationFocus} from "react-navigation"
import {connect} from "react-redux"
import Toast from 'react-native-root-toast'
import {loadAuthVerify, loadBacknumber} from "../../Modules/app"

const style = StyleSheet.create({
    new_btn: {
        padding: 5,
        margin: 10,
        backgroundColor: '#ffdd59',
        textAlign: 'center'
    },
    edit_del_btn: {
        width: '40%',
        padding: 5,
        margin: 5,
        backgroundColor: '#ffdd59',
        textAlign: 'center'
    }
})

class BackNumber extends Component {
    constructor(props) {
        super(props)
        this.state = {
            project_id: 0,
            post_packs: [],
        }
    }

    async componentWillMount() {
        const result = await this.props.dispatch(loadAuthVerify())
        const project_id = result.own_project.id

        const backnumber_list = await this.props.dispatch(loadBacknumber(project_id))

        this.setState({
            project_id: project_id,
            post_packs: backnumber_list.post_packs
        })
    }

    openNewBacknumber() {
        this.props.navigation.push('newbacknumber')
    }

    openBacknumberAutomation() {
        this.props.navigation.push('backnumberautomation')
    }

    openEditBacknumber(id) {
        this.props.navigation.push('editbacknumber', {
            backnumber_id: id,
        })
    }

    backnumberMap() {
        return this.state.post_packs.map(post => {
            return <View style={{margin: 10, padding: 10, backgroundColor: '#f5f5f5'}}>
                <Text>
                    {post.title}
                    {post.published ? <Text></Text> : <Text>（非公開）</Text>}
                </Text>

                <Text>価格：{post.price}</Text>
                <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                    <Text style={style.edit_del_btn} onPress={() => this.openEditBacknumber(post.id)}>編集</Text>
                </View>
            </View>
        })
    }

    render() {
        return <ScrollView>
            <Text style={style.new_btn} onPress={() => this.openNewBacknumber()}>バックナンバーを作る</Text>
            <Text style={style.new_btn} onPress={() => this.openBacknumberAutomation()}>自動バックナンバー設定</Text>
            {this.backnumberMap()}
        </ScrollView>
    }
}

const mapStateToProps = (state) => {
    return {
        appState: state.app.state,
        token: state.auth.token,
        user_id: state.auth.user_id,
    }
}

export default connect(mapStateToProps)(withNavigationFocus(BackNumber, 'backnumber'))
