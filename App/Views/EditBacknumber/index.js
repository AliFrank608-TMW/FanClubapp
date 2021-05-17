import React, {Component} from 'react'
import {Alert, Clipboard, Image, Platform, TextInput, SafeAreaView, ScrollView, StyleSheet, View, Text} from 'react-native'
import {withNavigationFocus} from "react-navigation"
import {connect} from "react-redux"
import Toast from 'react-native-root-toast'
import {loadAuthVerify, backnumberFindById, updateBacknumber} from "../../Modules/app"

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

class EditBacknumber extends Component {
    constructor(props) {
        super(props)
        this.state = {
            price_string: '',
            publish_name: '',
            posts_arr: [],
            selected_ids: [],
            published_posts: null,
            post_pack: {
                id: 0,
                title: '',
                price: 0,
                published: false,
                posts: [],
                selected_ids: [],
                published_posts: null,
            }
        }
    }

    async componentWillMount() {
        const backnumber_id = this.props.navigation.state.params.backnumber_id
        const result = await this.props.dispatch(backnumberFindById(backnumber_id))

        let publish_name = '非公開'
        if (result.post_pack.published) {
            publish_name = '公開'
        }

        // 選択されているpostのidを配列化
        let posts_arr = []
        result.post_pack.posts.map(post => {
            posts_arr.push(post.id)
        })

        this.setState({
            post_pack: result.post_pack,
            price_string: String(result.post_pack.price),
            publish_name: publish_name,
            posts_arr: posts_arr,
        })
    }

    setTitle = (title) => {
        this.setState({title: title})
    }

    setPrice = (price) => {
        const price_num = parseFloat(price)
        // 表示用にstringへ変換
        const price_string = String(price_num)

        this.setState({
            post_pack: {
                ...this.state.post_pack,
                price: price_num
            },
            price_string: price_string
        })
    }

    setPublish(publish_val, publish_name) {
        this.setState({ published: publish_val, publish_name: publish_name})
    }

    setSelectPostIds(selected_ids, published_posts) {
        this.setState({
            posts_arr: selected_ids,
            post_pack: {
                ...this.state.post_pack,
                posts: published_posts
            }
        })
    }

    openSelectBNPost() {
        this.props.navigation.push('selectbnposts', {
            selected_post_ids: (params) => {
                const {selected_ids, published_posts} = params
                this.setSelectPostIds(selected_ids, published_posts)
            },
            selected_ids: this.state.posts_arr,
            published_posts: this.state.post_pack.posts,
            edit_select: true,
        })
    }

    openSelectBNPublish(publish_val, publish_name) {
        this.props.navigation.push('selectbnpublish', {
            selectedPublish: (publish_val, publish_name) => this.setPublish(publish_val, publish_name)
        })
    }

    async update() {
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
        const post_result = await this.props.dispatch(updateBacknumber({
            post_pack: {
                id: this.state.post_pack.id,
                project_id: result.own_project.id,
                title: this.state.post_pack.title,
                price: this.state.post_pack.price,
                published: this.state.post_pack.published,
            },
            post_ids: this.state.posts_arr
        }))

        if (post_result === post_result.post_pack.created_at) {
            Toast.show('更新されました')
        } else {
            Toast.show('更新に失敗しました')
        }
    }

    render() {
        return <ScrollView>
            <Text style={style.field_title}>タイトル</Text>
            <TextInput style={style.textinput} onChangeText={this.setTitle} value={this.state.post_pack.title} />

            <Text style={style.field_title}>価格</Text>
            <TextInput style={style.textinput}
                       keyboardType='phone-pad'
                       maxLength={9}
                       onChangeText={this.setPrice}
                       value={this.state.price_string}
            />

            <Text style={style.field_title}>公開状態</Text>
            <Text style={style.textinput} onPress={() => this.openSelectBNPublish()}>{this.state.publish_name}</Text>

            <Text style={style.field_title}>バックナンバーにする記事</Text>
            <Text style={style.textinput} onPress={() => this.openSelectBNPost()}>{this.state.posts_arr.length}つの記事が選択中</Text>

            <View><Text style={style.submit} onPress={() => this.update()}>更新</Text></View>
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

export default connect(mapStateToProps)(withNavigationFocus(EditBacknumber, 'editbacknumber'))
