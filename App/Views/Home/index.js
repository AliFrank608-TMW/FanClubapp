import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withNavigationFocus} from 'react-navigation'
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    StyleSheet
} from 'react-native'
import * as storage from '../../Utils/storage'
import I18n from '../../../config/i18n'
import firebase from 'react-native-firebase'
import colors from '../../../config/colors'
import ProjectCard from '../../Components/ProjectCard'
import PostCard from '../../Components/PostCard'
import {loadRanking} from '../../Modules/app'

const style = StyleSheet.create({
    cardarea: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    postarea: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
})

class Home extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: I18n.t('App.Views.Home.index.bot_list'),
        }
    }

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    async componentWillMount() {
        // ランキングのプロジェクト・記事を取得
        await this.props.dispatch(loadRanking())
    }

    // プロジェクト詳細ページを表示用にプロジェクトIDをpropsのnavigation内に格納
    async openProjectDetail(project_id) {
        this.props.navigation.push('project_detail', project_id)
    }
    // 記事詳細ページを表示用に記事IDをpropsのnavigation内に格納
    async openPostDetail(post_id) {
        this.props.navigation.push('post_detail', post_id)
    }

    projectCardMap = () => {
        const ranking = this.props.ranking
        return ranking.projects.map(rank => {
            // ファンルームヘッダー画像がない場合、デフォルト画像を代入する
            if (rank.header_image.full.url == null) {
                rank.header_image.full.url = 'https://entynext-dev.s3.amazonaws.com/uploads/project/header_image/4/s320_5a25b59d-aee5-4d5a-8d2a-647158427a76.jpg'
            }
            return <ProjectCard
                id={rank.id}
                title={rank.title}
                header_image={rank.header_image}
                short_introduction={rank.short_introduction}
                onPress={() => this.openProjectDetail(rank.id)}
            />
        })
    }

    postCardMap () {
        const ranking = this.props.ranking
        return ranking.posts.map(rank => {
            return <PostCard
                id={rank.id}
                title={rank.title}
                eyecatch_image={rank.eyecatch_image}
                onPress={() => this.openPostDetail(rank.id)}
            />
        })
    }

    render() {
        return <ScrollView style={{width: '100%', backgroundColor: '#f5f5f5'}}>
            <SafeAreaView>
                <Text style={{marginVertical: 10, fontSize: 25}}>人気のプロジェクト</Text>
                <View style={style.cardarea}>
                    {this.projectCardMap()}
                </View>

                <Text style={{marginVertical: 10, fontSize: 25}}>人気の記事</Text>
                <View style={style.postarea}>
                    {this.postCardMap()}
                </View>
            </SafeAreaView>
        </ScrollView>
    }

}

const mapStateToProps = (state) => {
    return {
        appState: state.app.state,
        ranking: state.app.ranking,
    }
}

export default connect(mapStateToProps)(withNavigationFocus(Home, 'home'))
