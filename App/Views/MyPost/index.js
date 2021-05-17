import React, {Component} from 'react'
import {Alert, Clipboard, Image, Platform, TextInput, SafeAreaView, StyleSheet, ScrollView, View, Text} from 'react-native'
import {isValidEmail, isValidPassword} from '../../Utils/validation'
import {withNavigationFocus} from "react-navigation"
import {connect} from "react-redux"
import Toast from 'react-native-root-toast'
import {loadpostList, requestDeletePost} from "../../Modules/app"

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

class MyPost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: [
                {
                    id: 0,
                    project_id: 0,
                    title: '',
                    comment_count: 0,
                    favorite_count: 0,
                    view_count: 0,
                    created_at: '',
                    published: true,
                    eyecatch_image: {
                        standard: {
                            url: ''
                        }
                    },
                    plan: {
                        title: '',
                    },
                }
            ]
        }
    }

    async componentWillMount() {
        const result = await this.props.dispatch(loadpostList())
        this.setState({ posts: result.posts })
    }

    async setPost(status) {
        if (status.status == 'ok') {
            const result = await this.props.dispatch(loadpostList())
            this.setState({ posts: result.posts })
        }
    }

    async openNewPost() {
        this.props.navigation.push('new_post', {
            createdPost: (status) => this.setPost(status)
        })
    }

    async openPostDetail(post_id) {
        this.props.navigation.push('post_detail', post_id)
        Toast.show('削除しました')
    }

    async deletePost(post_id) {
        await this.props.dispatch(requestDeletePost(post_id))
        const result = await this.props.dispatch(loadpostList())
        this.setState({ posts: result.posts })
    }

    async deletePostAlert(post_id) {
        Alert.alert(
            '削除しますか？',
            '',
            [
                {text: '削除する', onPress: () => this.deletePost(post_id)},
                {text: 'キャンセル', style: 'cancel'},
            ],
            {cancelable: false},
        )
    }

    postMap() {
        const posts = this.state.posts
        return posts.map(post => {
                return <View style={{margin: 10, padding: 10, backgroundColor: '#f5f5f5'}}>
                    <Text style={{fontSize: 15, fontWeight: 'bold'}}>{post.title}</Text>
                    {post.plan ? <Text>プラン {post.plan.title}</Text> : <Text>プランなし</Text>}
                    <Text>コメント {post.comment_count} / いいね {post.favorite_count} / 閲覧数 {post.view_count}</Text>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                        <Text style={style.edit_del_btn} onPress={() => this.openPostDetail(post.id)}>表示</Text>
                        <Text style={style.edit_del_btn} onPress={() => this.deletePostAlert(post.id)}>削除</Text>
                    </View>
                </View>
            })
    }

    render() {
        return <ScrollView>
            <Text style={style.new_btn} onPress={() => this.openNewPost()}>記事を投稿する</Text>
            {this.postMap()}
        </ScrollView>
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token
    }
}
export default connect(mapStateToProps)(withNavigationFocus(MyPost, 'mypost'))
