import React, {Component} from 'react'
import {Alert, Clipboard, Image, Platform, TextInput, SafeAreaView, ScrollView, StyleSheet, View, Text, InputAccessoryView, Button} from 'react-native'
import TouchableOpacity from '../../Components/DefaultTouchableOpacity'
import {isValidEmail, isValidPassword} from '../../Utils/validation'
import {withNavigationFocus} from "react-navigation"
import {connect} from "react-redux"
import Toast from 'react-native-root-toast'
import {sendPost, loadAuthVerify, publishPost} from "../../Modules/app"

const style = StyleSheet.create({
    textinput: {
        margin: 10,
        padding: 5,
        borderWidth: 0.5,
        borderColor: '#555',
    },
    field_title: {
        fontSize: 13,
        fontWeight: 'bold',
        marginTop: 10,
        marginHorizontal: 10,
    },
    inputTextArea: {
        height: 100,
        margin: 10,
        padding: 5,
        borderWidth: 0.5,
        borderColor: '#555',
        textAlignVertical: 'top',
    },
    button: {
        margin: 10,
        padding: 10,
        backgroundColor: '#ffdd59',
        textAlign: 'center',
    },
})

class NewPost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            post_id: null,
            image: null,
            title: '',
            body: '',
            plan_id: 0,
            plan_title: '未選択（無料）',
            tag: '',
            tags: [],
            published: false,
            saved: false,
            selected_photo: '',
            filename: '',
        }
    }

    setTitle = (title) => {
        this.setState({title: title})
    }

    setBody = (body) => {
        this.setState({body: body})
    }

    setSelectedPlan(plan_id, plan_title) {
        this.setState({plan_id: plan_id, plan_title: plan_title})
    }

    openSelectPlan() {
        this.props.navigation.push('selectplan', {
            sendSelectedPlan: (plan_id, plan_title) => this.setSelectedPlan(plan_id, plan_title)
        })
    }

    setTag = (tag) => {
        this.setState({tag: tag})
    }

    deleteTag(tag) {
        const deleted_tags = this.state.tags.filter(t => {
            return t !== tag
        })
        this.setState({tags: deleted_tags})
    }

    tagMap() {
        return this.state.tags.map(tag => {
            return <Text>{tag}
            <Text onPress={() => {this.deleteTag(tag)}}>×</Text>
            </Text>
        })
    }

    async setTags() {
        if (this.state.tag === '') {
            return false
        }
        await this.setState({
            tags: [...this.state.tags, this.state.tag]
        })
    }

    async save() {
        if (this.state.title === '') {
            Toast.show('タイトルを入力してください')
            return false
        }

        if (this.state.body === '') {
            Toast.show('内容を入力してください')
            return false
        }

        const project_id = await this.props.dispatch(loadAuthVerify())
        const post = {
            project_id: project_id.own_project.id,
            title: this.state.title,
            body: this.state.body,
            plan_id: this.state.plan_id,
            published_at: null,
            published: false,
        }

        const result = await this.props.dispatch(sendPost({post: post, tags: this.state.tags}))

        // 記事画像のアップロード
        if (this.state.selected_photo != '') {
            let form_data = new FormData()
            form_data.append('image', {
                uri: this.state.selected_photo,
                name: this.state.filename + '.jpg',
                type: 'image/jpg'
            }, this.state.filename + '.jpg')

            await fetch(`http://192.168.100.51:3000/api/v1/posts/${result.post.id}/eyecatch_image`, {
                method: 'POST',
                body: form_data,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-ONETAP-TOKEN': this.props.token,
                },
            })
        }

        Toast.show('保存しました')

        const {params} = this.props.navigation.state
        params.createdPost({status: 'ok'})
        this.props.navigation.goBack()
    }

    async publish() {
        if (!this.state.saved) {
            await this.save()
        }

        const result = await this.props.dispatch(publishPost(this.state.post_id))
        this.setState({published: true})

        Toast.show('公開しました')

        const {params} = this.props.navigation.state
        params.createdPost({status: 'ok'})
        this.props.navigation.goBack()
    }

    selectedPhoto(image_data) {
        const {uri, filename} = image_data
        this.setState({
            selected_photo: uri.replace('http', 'https'),
            filename: filename,
        })
    }

    openCameraRoll() {
        this.props.navigation.push('select_image', {
            selectedPhoto: ({uri: uri, filename: filename}) => this.selectedPhoto({uri: uri, filename: filename})
        })
    }

    render() {
        const inputAccessoryViewID = 'inputTextArea'
        return <ScrollView>
            {(() => {
               if (this.state.selected_photo == '') {
                   return <TouchableOpacity
                       style={{width: '100%', height: 100, backgroundColor: '#f5f5f5', justifyContent:'center', flexDirection:'row', }}
                       onPress={() => this.openCameraRoll()}>
                       <Text>タップして画像を選択</Text>
                   </TouchableOpacity>
               } else {
                   return <TouchableOpacity onPress={() => this.openCameraRoll()}>
                       <Image style={{width: '100%', height: 100}} source={{uri: this.state.selected_photo}} />
                   </TouchableOpacity>
               }
            })()}

            <Text style={style.field_title}>タイトル</Text>
            <TextInput style={style.textinput} onChangeText={this.setTitle} />

            <Text style={style.field_title}>内容</Text>
            <TextInput
                style={style.inputTextArea}
                editable={true}
                multiline={true}
                numberOfLines={4}
                onChangeText={this.setBody}
                inputAccessoryViewID={inputAccessoryViewID}/>
            <InputAccessoryView nativeID={inputAccessoryViewID}>
                <View style={{backgroundColor: '#f5f5f5'}}>
                    <View style={{alignSelf: 'flex-end'}}><Button title='閉じる' /></View>
                </View>
            </InputAccessoryView>

            <Text style={style.field_title}>プラン</Text>
            <View style={{borderWidth: 0.5, borderColor: '#555', padding: 5, marginHorizontal: 10,}}>
                <Text onPress={() => this.openSelectPlan()}>{this.state.plan_title}</Text>
            </View>

            <Text style={style.field_title}>タグ</Text>
            <TextInput style={style.textinput} onChangeText={this.setTag} />
            <Text style={{padding: 10, backgroundColor: '#ffdd59', width: 50, textAlign: 'center'}}
                  onPress={() => this.setTags()}>追加</Text>
            {this.tagMap()}

            <Text style={style.button} onPress={() => this.save()}>
                保存
            </Text>
            <Text style={style.button} onPress={() => this.publish()}>
                公開する
            </Text>
        </ScrollView>
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user_id: state.auth.user_id,

    }
}
export default connect(mapStateToProps)(withNavigationFocus(NewPost, 'new_post'))
