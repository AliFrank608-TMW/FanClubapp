import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withNavigationFocus} from 'react-navigation'
import {StyleSheet, View, Text, Image, ScrollView, TextInput,} from "react-native"
import TouchableOpacity from '../../Components/DefaultTouchableOpacity'
import {loadPost, postComment, deleteComment, putGood, deleteGood, loadAuthVerify} from '../../Modules/app'
import moment from 'moment'
import Toast from "react-native-root-toast";
import colors from '../../../config/colors'

const style = StyleSheet.create({
    img: {
        position: 'relative',
        width: '100%',
        height: 200,
    },
    title: {
        fontSize: 23,
        fontWeight: 'bold',
        color: '#485460',
        margin: 10,
    },
    subtitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        marginBottom: 20,
    },
    good_btn: {
        fontSize: 23,
        color: colors.main_tint,
        textAlign: 'right',
    },
    comment_input: {
        padding: 5,
        margin: 10,
        borderColor: 'gray',
        borderWidth: 1,
    },
    comment_send: {
        width: 100,
        margin: 10,
        padding: 5,
        backgroundColor: '#ffdd59',
        color: '#485460',
        borderRadius: 10,
    }
})

class PostDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            current_user_id: 0,
            comment_input_text: 'コメントを書く',
            comment_body: '',
        }
    }

    async componentWillMount() {
        const me_data = await this.props.dispatch(loadAuthVerify())
        this.setState({current_user_id: me_data.user.id})

        // 記事IDから、記事詳細情報を取得する
        await this.props.dispatch(loadPost(this.props.navigation.state.params))
    }

    authorBox() {
        const comments = this.props.post_detail.post.project
        return(
            <View style={{padding:10, borderWidth:1, borderColor: '#000', borderRadius: 4,}}>
                <Text>{comments.title}</Text>
            </View>
        )
    }

    async postComment(post_id) {
        try {
            await this.props.dispatch(postComment(post_id, this.state.comment_body))
            await this.props.dispatch(loadPost(this.props.navigation.state.params))
            Toast.show('送信しました')
        } catch (e) {
            console.log(e)
            Toast.show('コメント送信に失敗しました')
        }
    }

    async deleteComment(comment_id) {
        try {
            await this.props.dispatch(deleteComment(this.props.post_detail.post.id, comment_id))
            await this.props.dispatch(loadPost(this.props.navigation.state.params))
            Toast.show('削除しました')
        } catch (e) {
            console.log(e)
            Toast.show('削除に失敗しました')
        }
    }

    async putGood() {
        await this.props.dispatch(putGood(this.props.navigation.state.params))
    }
    async deleteGood() {
        await this.props.dispatch(deleteGood(this.props.navigation.state.params))
    }
    viewGood() {
        if (this.props.is_good) {
            // いいねされている
            return <Text onPress={() => this.deleteGood()} style={style.good_btn}>♥</Text>
        } else {
            // されていない
            return <Text onPress={() => this.putGood()} style={style.good_btn}>♡</Text>
        }
    }

    setComment = (comment) => {
        this.setState({comment_body: comment})
    }

    commentMap() {
        const comments = this.props.post_detail.post.recent_post_comments
        const current_user_id = this.state.current_user_id
        const owner_user_id = this.props.post_detail.post.project.user_id

        return comments.map(comment => {
            return <View style={{backgroundColor: '#f5f5f5', margin: 10, padding: 5,}}>
                <Text style={{margin: 5}}>{comment.user.name}</Text>
                <Text>{comment.body}</Text>
                {(() => {
                    if (current_user_id === comment.user_id || current_user_id === owner_user_id) {
                        return <Text style={{textAlign: 'right'}} onPress={() => this.deleteComment(comment.id)}>削除</Text>
                    }
                })()}
            </View>
        })
    }

    render() {
        const post_detail = this.props.post_detail.post
        return(
            <ScrollView>
                <View>
                    <View style={{justifyContent: 'center', alignItems: 'center',}}>
                        {post_detail.eyecatch_image.url ? <Image source={{uri: post_detail.eyecatch_image.url}} style={style.img} /> : <View></View> }
                    </View>
                    <Text style={style.title}>{post_detail.title}</Text>
                    <Text style={{margin: 5, textAlign: 'right'}}>{moment(new Date(post_detail.created_at)).format("YYYY/MM/DD HH:mm")}</Text>
                    <Text style={{margin: 5, textAlign: 'right'}}>{this.props.post_detail.post.view_count} PV</Text>

                    {this.props.post_can_read ? <Text style={{marginHorizontal: 10}}>{post_detail.body}</Text> : <Text>この記事は閲覧できません。</Text>}

                    {this.viewGood()}

                    <Text style={style.subtitle}>コメント</Text>
                    <TextInput
                        style={style.comment_input}
                        onChangeText={this.setComment}
                        editable = {true}
                        placeholder={this.state.comment_input_text}
                    />
                    <View style={style.comment_send}>
                        <Text style={{fontSize: 12, textAlign: 'center'}}
                              onPress={() => this.postComment(post_detail.id)}>
                            コメント送信
                        </Text>
                    </View>
                    {this.commentMap()}
                </View>
            </ScrollView>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        post_detail: state.app.post_detail,
        is_good: state.app.is_good,
        post_can_read: state.app.post_can_read,
    }
}
export default connect(mapStateToProps)(withNavigationFocus(PostDetail, 'post_detail'))
