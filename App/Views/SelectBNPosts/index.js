import React, {Component} from 'react'
import {Alert, Clipboard, Image, Platform, TextInput, SafeAreaView, ScrollView, StyleSheet, View, Text} from 'react-native'
import TouchableOpacity from '../../Components/DefaultTouchableOpacity'
import {isValidEmail, isValidPassword} from '../../Utils/validation'
import {withNavigationFocus} from "react-navigation"
import {connect} from "react-redux"
import Toast from 'react-native-root-toast'
import {loadBacknumber, loadpostList} from "../../Modules/app"

const style = StyleSheet.create({
    post_title: {
        fontSize: 15,
        fontWeight: 'bold',
        margin: 10
    }
})

class SelectBNPosts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            project_id: 0,
            selected_ids: [],
            published_posts: [],
            message: '読み込み中',
        }
    }

    async componentWillMount() {
        const {edit_select, selected_ids, published_posts} = this.props.navigation.state.params
        if (published_posts === null) {
            // 公開済みの記事を取得し、選択されたかどうかのステータスを管理するキーを追加
            const result = await this.props.dispatch(loadpostList())
            if (result.posts.length === 0) {
                this.setState({message: '記事がありません'})
            }
            const published_posts = result.posts.filter(post => {
                if (post.published) {
                    post.selected = false
                    return post
                }
            })

            this.setState({published_posts: published_posts})
        } else if (edit_select === true) {
            // 公開済みの記事を取得し、選択されたかどうかのステータスを管理するキーを追加
            const result = await this.props.dispatch(loadpostList())
            const published_posts = result.posts.filter(post => {
                if (post.published) {
                    post.selected = false
                    return post
                }
            })

            // 選択されている記事のid配列を照合し、selectedカラムをtrueに上書きする処理
            // post.idを一つ一つ回し、そのつどfor文でselected_ids配列をすべて回して照合する
            published_posts.map(post => {
                for (let i in selected_ids) {
                    if (post.id === selected_ids[i]) {
                        return post.selected = true
                    }
                }
            })

            this.setState({
                selected_ids: selected_ids,
                published_posts: published_posts
            })
        }
        else {
            // 親から受け取ったpostをsetする
            const {params} = this.props.navigation.state
            await this.setState({
                selected_ids: params.selected_ids || [],
                published_posts: params.published_posts || [],
            })
        }
    }

    async setSelectPost(post_id) {
        let {selected_ids, published_posts} = this.state
        // 空でないかチェック
        if (post_id) {
            // 選択・選択解除する処理
            if (selected_ids.indexOf(post_id) === -1) { // 選択する処理
                selected_ids.push(post_id) // 選択されたpostのidを配列で管理
                // 選択ステータス（記事配列のselectedカラム）をtrueに切り替えるため、
                // 対象となるpostを抽出し、trueに切り替え、公開済み記事配列に代入する
                let true_post = published_posts.filter(post => post.id == post_id)
                true_post[0].selected = true
                await this.setState({
                    ...published_posts,
                    ...true_post,
                })


                // 親に送る
                const {params} = this.props.navigation.state
                params.selected_post_ids({
                    selected_ids: this.state.selected_ids,
                    published_posts: this.state.published_posts
                })

            } else { // 選択解除する処理
                if (selected_ids.indexOf(post_id) !== -1) {
                    // 一致したid以外を抽出する
                    let falsed_ids = selected_ids.filter(post => post != post_id)

                    // 記事配列の記事ステータスをfalseに切り替える
                    let false_post = published_posts.filter(post => post.id == post_id)
                    false_post[0].selected = false
                    await this.setState({
                        selected_ids: falsed_ids,
                        ...published_posts,
                        ...false_post,
                    })

                    // 親に送る
                    const {params} = this.props.navigation.state
                    params.selected_post_ids({
                        selected_ids: this.state.selected_ids,
                        published_posts: this.state.published_posts
                    })

                }
            }
        }
    }

    postMap() {
        const posts = this.state.published_posts
        return posts.length > 0 ? posts.map(post => {
            return <View>
                {post.published && <View>
                    <Text style={style.post_title}>{post.title}</Text>
                    <Text onPress={() => this.setSelectPost(post.id)}>
                        {post.selected ? '選択中' : '選択する'}
                    </Text>
                </View>}
            </View>
        }) : <View>
            <Text style={style.post_title}>まだ投稿がありません</Text>
        </View>
    }

    loading() {
        if (this.state.published_posts.length === 0) {
            return <Text>{this.state.message}</Text>
        }
    }

    render() {
        return <ScrollView>
            <View>
                {this.loading()}
                {this.postMap()}
            </View>
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

export default connect(mapStateToProps)(withNavigationFocus(SelectBNPosts, 'selectbnposts'))
