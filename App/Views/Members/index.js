import React, {Component} from 'react'
import {Alert, Clipboard, Image, Platform, TextInput, SafeAreaView, ScrollView, StyleSheet, View, Text} from 'react-native'
import moment from 'moment'
import TouchableOpacity from '../../Components/DefaultTouchableOpacity'
import {withNavigationFocus} from "react-navigation"
import {connect} from "react-redux"
import Toast from 'react-native-root-toast'
import {loadAuthVerify, loadMenberList, updateMenber, deleteMember} from "../../Modules/app"

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

class Members extends Component {
    constructor(props) {
        super(props)
        this.state = {
            project_id: 0,
            owner_email: '',
            role_id: 0,
            members: [],
        }
    }

    async componentWillMount() {
        const result = await this.props.dispatch(loadAuthVerify())
        const project_id = result.own_project.id
        const owner_email = result.user.email

        const members = await this.props.dispatch(loadMenberList(project_id))
        this.setState({
            project_id: project_id,
            members: members.members,
            owner_email: owner_email
        })
    }

    openInvite () {
        this.props.navigation.push('membersinvite')
    }

    async setRole(role_id, user_id) {
        // 権限を変更するユーザーのデータを取得
        const update_user_data = this.state.members.filter(val => {
            return val.user_id === user_id
        })

        const params = {
            member: {
                id: update_user_data['0'].id,
                project_id: this.state.project_id,
                role: role_id,
            }
        }

        const result = await this.props.dispatch(updateMenber(params))
        if (result.member.updated_at) {
            const members = await this.props.dispatch(loadMenberList(this.state.project_id))
            this.setState({members: members.members})
            Toast.show('権限が更新されました')
        }
    }

    openUpdateMember(none, user_id) {
        this.props.navigation.push('updatemember', {
            selectedRole: (role_id, user_id) => this.setRole(role_id, user_id),
            user_id: user_id,
        })
    }

    async deleteMember(member_id) {
        const params = {project_id: this.state.project_id, member_id: member_id}
        const result = await this.props.dispatch(deleteMember(params))

        if (result.message === 'success') {
            Toast.show('削除しました')
            const members = await this.props.dispatch(loadMenberList(this.state.project_id))
            this.setState({members: members.members})
        }
    }

    deleteAlert(member_id) {
        Alert.alert(
            '削除しますか？',
            '',
            [
                {text: '削除する', onPress: () => this.deleteMember(member_id)},
                {text: 'キャンセル', style: 'cancel'},
            ],
            {cancelable: false},
        )
    }

    memberMap() {
        return this.state.members.map(member => {
            return <View style={{margin: 10, padding: 10, backgroundColor: '#f5f5f5'}}>
                <Text>{member.user.name}</Text>
                <Text>{member.user.email}</Text>
                {(() => {
                    if (member.role === 1) {
                        return <Text>オーナー</Text>
                    } else if (member.role === 2) {
                        return <Text>管理者</Text>
                    } else if (member.role === 3) {
                        return <Text>編集者</Text>
                    } else if (member.role === 4) {
                        return <Text>閲覧者</Text>
                    }
                }) ()}

                {(() => {
                    if (member.user.email !== this.state.owner_email) {
                        return <View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                        }}>
                            <Text style={style.edit_del_btn} onPress={() => this.openUpdateMember(member.id, member.user.id)}>権限の変更</Text>
                            <Text style={style.edit_del_btn} onPress={() => this.deleteAlert(member.id)}>削除</Text>
                            </View>
                    }
                }) ()}
            </View>
        })
    }

    render() {
        return <ScrollView>
            <Text style={style.new_btn} onPress={() => this.openInvite()}>招待</Text>
            {this.memberMap()}
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

export default connect(mapStateToProps)(withNavigationFocus(Members, 'members'))
