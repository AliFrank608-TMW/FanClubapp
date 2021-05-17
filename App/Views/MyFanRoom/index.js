import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Alert, Clipboard, Image, Platform, SafeAreaView, View, Text, TextInput, StyleSheet, InputAccessoryView, Button, ScrollView} from 'react-native'
import {Body, Container, Content, Icon, List, ListItem, Right} from 'native-base'
import {withNavigationFocus} from 'react-navigation'
import TouchableOpacity from '../../Components/DefaultTouchableOpacity'
import I18n from '../../../config/i18n'
import firebase from 'react-native-firebase'
import colors from '../../../config/colors'
import {loadCategoryList, loadMyFanRoom, loadProject, updateMyFunRoom, loadAuthVerify, requestPublish, requestUnpublish} from "../../Modules/app"
import Toast from "react-native-root-toast"
import PropTypes from 'prop-types'
import SelectCategory from '../SelectCategory/index'

const style = StyleSheet.create({
    inputText: {
        margin: 10,
        padding: 5,
        backgroundColor: '#eee',
    },
    inputTextArea: {
        height: 100,
        margin: 10,
        padding: 5,
        backgroundColor: '#eee',
        textAlignVertical: 'top',
    },
    button: {
        margin: 10,
        padding: 10,
        backgroundColor: '#ffdd59',
        textAlign: 'center',
    },
})

class MyFanRoom extends Component {
    constructor(props) {
        super(props)

        this.state = {
            myFunRoom: {
                id: 0,
                title: '',
                introduction: '',
                short_introduction: '',
                category_id: 0,
                header_image: {
                    url: ''
                },
            },
            categories: [],
            select_now_category: '',
            room_published: false,
            filename: '',
        }
    }

    async componentWillMount() {
        // マイファンルームのデータを取得する
        const result = await this.props.dispatch(loadAuthVerify())
        const room_publish_result = await this.props.dispatch(loadAuthVerify())

        if (room_publish_result.own_project.published_at) {
            this.setState({room_published: true})
        }
        this.setState({myFunRoom: result.own_project})

        // カテゴリ一覧の取得
        const categoryList = await this.props.dispatch(loadCategoryList())
        this.setState({categories: categoryList.categories})

        // 現在のカテゴリidからカテゴリ名を取得し、格納する
        const now_category_hash = this.state.categories.filter((obj) => {
            if(obj.id === this.state.myFunRoom.category_id) {
                return obj
            }
        })
        this.setState({select_now_category: now_category_hash['0'].name})
    }

    setTitle = (title) => {
        this.setState({
            myFunRoom: {
                ...this.state.myFunRoom,
                title: title
            }})
    }

    setShortIntro = (short_intro) => {
        this.setState({
            myFunRoom: {
                ...this.state.myFunRoom,
                short_introduction: short_intro
            }})
    }

    setIntro = (intro) => {
        this.setState({
            myFunRoom: {
                ...this.state.myFunRoom,
                introduction: intro
            }})
    }

    setSelectedCategory(category_id, category_name) {
        this.setState({
            myFunRoom: {
                ...this.state.myFunRoom,
                category_id: category_id
            },
            select_now_category: category_name
        })
    }

    openCategorySelect() {
        this.props.navigation.push('selectcategory', {
            sendSelectedCategory: (category_id, category_name) => this.setSelectedCategory(category_id, category_name)
        })
    }

    async save(project_id) {
        const updatedData = {
            title: this.state.myFunRoom.title,
            category_id: this.state.myFunRoom.category_id,
            short_introduction: this.state.myFunRoom.short_introduction,
            introduction: this.state.myFunRoom.introduction,
        }

        try {
            await this.props.dispatch(updateMyFunRoom({updated_data: updatedData, project_id: project_id}))

            // 画像のアップロード
            let form_data = new FormData()
            form_data.append('image', {
                uri: this.state.myFunRoom.header_image.url,
                name: this.state.filename + '.jpg',
                type: 'image/jpg'
            }, this.state.filename + '.jpg')

            await fetch(`http://192.168.100.51:3000/api/v1/projects/${this.state.myFunRoom.id}/header_image`, {
                method: 'POST',
                body: form_data,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-ONETAP-TOKEN': this.props.token,
                },
            })

            Toast.show('保存しました')
        } catch(e) {
            console.log(e)
            Toast.show('保存に失敗しました')
        }
    }

    async publish(project_id) {
        try {
            await this.props.dispatch(requestPublish(project_id))
            this.setState({room_published: true})
            Toast.show('公開されました')
        } catch(e) {
            console.log(e)
            Toast.show('公開に失敗しました')
        }
    }

    async unpublish(project_id) {
        try {
            await this.props.dispatch(requestUnpublish(project_id))
            this.setState({room_published: false})
            Toast.show('非公開になりました')
        } catch(e) {
            console.log(e)
            Toast.show('非公開に失敗しました')
        }
    }

    selectedPhoto(image_data) {
        const {uri, filename} = image_data
        this.setState({
            myFunRoom: {
                ...this.state.myFunRoom,
                header_image: {
                    url: uri.replace('http', 'https'),
                },
            },
            filename: filename
        })
    }

    openCameraRoll() {
        this.props.navigation.push('select_image', {
            selectedPhoto: ({uri: uri, filename: filename}) => this.selectedPhoto({uri: uri, filename: filename})
        })
    }

    render() {
        const inputAccessoryViewID = 'oiwi'
        return　<ScrollView>
            <TouchableOpacity onPress={() => this.openCameraRoll()}>
                {(() => {
                    if (this.state.myFunRoom.header_image.url == '') {
                        return <TouchableOpacity
                            style={{width: '100%', height: 100, backgroundColor: '#f5f5f5', justifyContent:'center', flexDirection:'row', }}
                            onPress={() => this.openCameraRoll()}>
                            <Text>タップして画像を選択</Text>
                        </TouchableOpacity>
                    } else {
                        return <Image source={{uri: this.state.myFunRoom.header_image.url}} style={{width: '100%', height: 100,}} />
                    }
                })()}
            </TouchableOpacity>

            <Text>タイトル</Text>
            <TextInput style={style.inputText} value={this.state.myFunRoom.title} onChangeText={this.setTitle} />

            <Text>カテゴリー</Text>
            <Text style={style.inputText}
                  dataSelected={this.setSelectedCategory}
                  onPress={() => this.openCategorySelect()}>{this.state.select_now_category}</Text>

            <Text>紹介（一文）</Text>
            <TextInput style={style.inputText} value={this.state.myFunRoom.short_introduction} onChangeText={this.setShortIntro} />

            <Text>説明</Text>
            <TextInput style={style.inputTextArea}
                       editable={true}
                       multiline={true}
                       numberOfLines={4}
                       value={this.state.myFunRoom.introduction}
                       onChangeText={this.setIntro}
                       inputAccessoryViewID={inputAccessoryViewID}/>
            <InputAccessoryView nativeID={inputAccessoryViewID}>
                <View style={{backgroundColor: '#f5f5f5'}}>
                    <View style={{alignSelf: 'flex-end'}}><Button title='閉じる' /></View>
                </View>
            </InputAccessoryView>

            <Text style={style.button} onPress={() => this.save(this.state.myFunRoom.id)}>保存</Text>
            {this.state.room_published ?
                <Text style={style.button}
                      onPress={() => this.unpublish(this.state.myFunRoom.id)}
                >
                    非公開にする
                </Text> :
                <Text style={style.button}
                      onPress={() => this.publish(this.state.myFunRoom.id)}
                >
                    公開にする
                </Text>
            }
        </ScrollView>
    }
}

const mapStateToProps = (state) => {
    return {
        appState: state.app.state,
        token: state.auth.token,
        user_id: state.auth.user_id,
        selected_category: state.auth.selected_category,
        post_detail: state.app.post_detail,
    }
}

export default connect(mapStateToProps)(withNavigationFocus(MyFanRoom, 'myfanroom'))
