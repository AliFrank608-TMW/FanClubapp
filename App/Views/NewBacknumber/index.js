import React, {Component} from 'react'
import {Alert, Clipboard, Image, Platform, TextInput, SafeAreaView, ScrollView, StyleSheet, View, Text} from 'react-native'
import TouchableOpacity from '../../Components/DefaultTouchableOpacity'
import {isValidEmail, isValidPassword} from '../../Utils/validation'
import {withNavigationFocus} from "react-navigation"
import {connect} from "react-redux"
import Toast from 'react-native-root-toast'
import {loadAuthVerify, createBacknumber} from "../../Modules/app"

const style = StyleSheet.create({
    field_title: {
        fontSize: 13,
        fontWeight: 'bold',
        marginTop: 10,
        marginHorizontal: 10,
    },
    textinput: {
        margin: 10,
        padding: 5,
        borderWidth: 0.5,
        borderColor: '#555',
    },
    inputTextArea: {
        height: 100,
        margin: 10,
        padding: 5,
        borderWidth: 0.5,
        borderColor: '#555',
        textAlignVertical: 'top',
    },
    submit: {
        fontSize: 15,
        margin: 10,
        padding: 10,
        backgroundColor: '#ffdd59',
        textAlign: 'center',
    }
})

class NewBacknumber extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            price: 0,
            publish_val: false,
            publish_name: '非公開',
            selected_ids: [],
            published_posts: null,
        }
    }

    setTitle = (title) => {
        this.setState({title: title})
    }

    setPrice = (price) => {
        this.setState({price: price})
    }

    setPublish(publish_val, publish_name) {
        this.setState({ publish_val: publish_val, publish_name: publish_name})
    }

    setSelectPostIds(selected_ids, published_posts) {
        this.setState({selected_ids: selected_ids, published_posts: published_posts})
    }

    openSelectBNPublish(publish_val, publish_name) {
        this.props.navigation.push('selectbnpublish', {
            selectedPublish: (publish_val, publish_name) => this.setPublish(publish_val, publish_name)
        })
    }

    openSelectBNPost() {
        this.props.navigation.push('selectbnposts', {
            selected_post_ids: (params) => {
                const {selected_ids, published_posts} = params
                this.setSelectPostIds(selected_ids, published_posts)
            },
            selected_ids: this.state.selected_ids,
            published_posts: this.state.published_posts,
        })
    }

    async submit() {
        // 項目が空でないかチェック
        if (this.state.title === '') {
            Toast.show('タイトルを入力してください')
            return false
        }
        if (this.state.price === null) {
            Toast.show('価格を入力してください')
            return false
        }

        const result = await this.props.dispatch(loadAuthVerify()) // project_idを取得
        const post_result = await this.props.dispatch(createBacknumber({
            post_pack: {
                project_id: result.own_project.id,
                title: this.state.title,
                price: this.state.price,
                published: this.state.publish_val,
            },
            post_ids: this.state.selected_ids
            }))

        if (post_result === post_result.post_pack.created_at) {
            Toast.show('作成されました')
        } else {
            Toast.show('作成失敗')
        }
    }

    render() {
        return <ScrollView>
            <Text style={style.field_title}>タイトル</Text>
            <TextInput style={style.textinput} onChangeText={this.setTitle} />

            <Text style={style.field_title}>価格</Text>
            <TextInput style={style.textinput}
                       keyboardType='phone-pad'
                       maxLength={9}
                       onChangeText={this.setPrice}
            />

            <Text style={style.field_title}>公開状態</Text>
            <Text style={style.textinput} onPress={() => this.openSelectBNPublish()}>{this.state.publish_name}</Text>

            <Text style={style.field_title}>バックナンバーにする記事</Text>
            <Text style={style.textinput} onPress={() => this.openSelectBNPost()}>{this.state.selected_ids.length}つの記事が選択中</Text>

            <View><Text style={style.submit} onPress={() => this.submit()}>作る</Text></View>
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

export default connect(mapStateToProps)(withNavigationFocus(NewBacknumber, 'newbacknumber'))
