import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withNavigationFocus} from 'react-navigation'
import {StyleSheet, View, Text, Image, ScrollView, Alert, Platform,} from "react-native"
import moment from 'moment'
import {loadProject, loadJoinedPlan, joinPlan, loadBacknumber, loadAuthVerify, buyBacknumber, loadBoughtBacknumber} from '../../Modules/app'
import PlanCard from '../../Components/PlanCard'
import PostCard from '../../Components/PostCard'
import Toast from "react-native-root-toast"
import {setMyFollows, follow, unfollow} from "../../Modules/auth"
import {getProjectPostList} from "../../Modules/app"

const style = StyleSheet.create({
    img: {
        position: 'relative',
        width: '100%',
        height: 450,
    },
    follow_area: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    follower: {
        fontSize: 12,
        padding: 5,
        marginHorizontal: 10,
        color: '#485460',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#485460',
    },
    follow: {
        fontSize: 12,
        paddingTop: 7,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        marginHorizontal: 10,
        color: '#485460',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#485460',
        overflow: 'hidden',
    },
    two_column: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 23,
        fontWeight: 'bold',
        color: '#485460',
        margin: 10,
    },
    supporter_num: {
        fontSize: 20,
        color: '#ffdd59',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        marginBottom: 20,
    },
    project_about: {
        marginLeft: 10,
        marginRight: 10,
        color: '#485460',
    },
    bn_buy_btn: {
        width: '45%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 5,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#ffdd59',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#fff',
        overflow: 'hidden',
    }
})

 class ProjectDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            project_plan_ids: [],
            joined_plan_ids: [],
            project_plans: [],
            backnumbers: [],
            bought_bn_ids: [],
            follow: false,
            current_point: 0,
            posts: {
                posts: [
                    {
                        id: 0,
                        project_id: 0,
                        eyecatch_image: {
                            url: '',
                            standard: {
                                url: ''
                            },
                        },
                        title: '記事タイトル',
                    }
                ]
            },
        }
    }

     async componentWillMount() {
        // プロジェクトIDから、プロジェクト詳細情報を取得する
         await this.props.dispatch(loadProject(this.props.navigation.state.params))

         // 加入中のプランidを取得、配列化
         const result_joined_plans = await this.props.dispatch(loadJoinedPlan())

         let joined_plan_ids = []
         result_joined_plans.subscription.map(plan => {
             return joined_plan_ids.push(plan.plan_id)
         })
         this.setState({joined_plan_ids: joined_plan_ids})

         // プロジェクトのプランidを取得、配列化
         let plan_ids = []
         this.props.project_detail.project.plans.map(plan => {
             return plan_ids.push(plan.id)
         })
         this.setState({project_plan_ids: plan_ids})


         // 加入中のプランは加入ボタンを表示しないようにするため、判定用のカラムを追加
         let add_column = this.props.project_detail.project.plans.map(plan => {
             // 判定用カラムを追加し、加入中のプランidと一致したら、trueを代入する
             plan.joined = false
             const joined_plan_ids = this.state.joined_plan_ids
             for (let i in joined_plan_ids) {
                 if (plan.id === joined_plan_ids[i]) {
                     plan.joined = true
                 }
             }
             return plan
         })

         // 加入中のプランがある場合は、すべて加入ボタンを非表示にさせるため、
         // joinedカラムにtrueがあったら、すべてtrueにする
         this.props.project_detail.project.plans.map(plan => {
             if (plan.joined) {
                 this.props.project_detail.project.plans.map(p => {
                     p.joined = true
                 })
             }
         })

         this.setState({project_plans: add_column})

         // バックナンバーの取得
         const result = await this.props.dispatch(loadAuthVerify())
         const project_id = result.own_project.id
         const backnumber_list = await this.props.dispatch(loadBacknumber(project_id))

         // 購入されたバックナンバーを取得、配列化
         const result_bought_bn = await this.props.dispatch(loadBoughtBacknumber())
         let bought_bn_arr = []

         result_bought_bn.post_packs.map(bn => {
             return bought_bn_arr.push(bn.id)
         })

         // 購入済みのバックナンバーは、購入ボタンを非表示にするため、判定カラムを追加する
         let bn_add_column = backnumber_list.post_packs.map(bn => {
             bn.bought = false
             for (let i in bought_bn_arr) {
                 if (bn.id == bought_bn_arr[i]) {
                     bn.bought = true
                 }
             }
             return bn
         })

         this.setState({
             backnumbers: bn_add_column,
             bought_bn_ids: bought_bn_arr,
         })

         // 記事を取得
         const result_posts = await this.props.dispatch(getProjectPostList(this.props.navigation.state.params))
         this.setState({posts: result_posts})

         // フォロー状態の取得
         const result_follows = await this.props.dispatch(loadAuthVerify())
         const follows = result_follows.follows

         await this.props.dispatch(setMyFollows(follows))
         this.props.follows.map(follow => {
             if (follow.project.id == this.props.navigation.state.params) {
                 this.setState({follow: true})
             }
         })

         // 残高ポイントを取得
         const current_point =  result.user.points
         this.setState({current_point: current_point})
     }

     async follow() {
         await this.props.dispatch(follow(this.props.navigation.state.params))
         this.setState({follow: true})
         await this.props.dispatch(loadProject(this.props.navigation.state.params))
     }

     async unfollow() {
         await this.props.dispatch(unfollow(this.props.navigation.state.params))
         this.setState({follow: false})
         await this.props.dispatch(loadProject(this.props.navigation.state.params))
     }

     async joinPlan(plan_id) {
        try {
            // 残高と比較して支払い可能か確認
            const join_plan_price = this.state.project_plans.filter(plan => plan.id == plan_id)
            if (join_plan_price[0].price > this.state.current_point) {
                Toast.show('残高ポイントが足りません')
                return false
            }

            // 加入処理
            const result = await this.props.dispatch(joinPlan(plan_id))
            const join_planid = result.subscription.plan_id

            let join_plan = this.state.project_plans.filter(post => post.id == join_planid)
            join_plan[0].joined = true
            await this.setState({
                ...this.state.project_plans,
                ...join_plan,
            })

            Toast.show('加入しました')
        } catch (e) {
            console.log(e)
            Toast.show('加入に失敗しました')
        }
     }

     joinPlanAlert(plan_id) {
         Alert.alert(
             'プランに加入しますか？',
             '',
             [
                 {text: '加入する', onPress: () => this.joinPlan(plan_id)},
                 {text: 'キャンセル', style: 'cancel'},
             ],
             {cancelable: false},
         )
     }

     async buyBacknumber(backnumber_id) {
         // 残高と比較して支払い可能か確認
         const buy_bn_price = this.state.backnumbers.filter(bn => bn.id == backnumber_id)
         if (buy_bn_price[0].price > this.state.current_point) {
             Toast.show('残高ポイントが足りません')
             return false
         }

        try {
            await this.props.dispatch(buyBacknumber(backnumber_id))
            Toast.show('購入しました')
        } catch (e) {
            console.log(e)
            Toast.show('購入に失敗しました')
        }

     }

     buyBacknumberAlert(backnumber_id) {
         Alert.alert(
             'バックナンバーを購入しますか？',
             '',
             [
                 {text: '購入する', onPress: () => this.buyBacknumber(backnumber_id)},
                 {text: 'キャンセル', style: 'cancel'},
             ],
             {cancelable: false},
         )
     }

     openBacknumberDetail(backnumber_id) {
         this.props.navigation.push('backnumberdetail', {
             backnumber_id: backnumber_id,
         })
     }

     planCardMap () {
         const plans = this.state.project_plans
         return plans.map(plan => {
             return <PlanCard
                 id={plan.id}
                 title={plan.title}
                 price={plan.price}
                 description={plan.description}
                 joined={plan.joined}
                 onPress={() => this.joinPlanAlert(plan.id)}
             />
         })
     }

     backnumberMap () {
        return this.state.backnumbers.map(bn => {
            return <View style={{backgroundColor: '#fff', margin: 10, padding: 10}}>
                <Text style={{fontWeight: 'bold',}}>{bn.title}</Text>
                <Text>{moment(new Date(bn.created_at)).format("YYYY/MM/DD")}</Text>
                <Text><Text style={{color: '#ff0000',}}>{bn.price}</Text> <Text style={{fontSize: 10, color: '#485460',}}>pt</Text></Text>
                {bn.bought ? <View style={style.bn_buy_btn}>
                    <Text style={{fontSize: 13, textAlign: 'center'}} onPress={() => this.openBacknumberDetail(bn.id)}>バックナンバーをみる</Text>
                </View> : <View style={style.bn_buy_btn}>
                    <Text style={{fontSize: 13, textAlign: 'center'}} onPress={() => this.buyBacknumberAlert(bn.id)}>購入する</Text>
                </View>
                }
            </View>
        })
     }

     async openPostDetail(post_id) {
         this.props.navigation.push('post_detail', post_id)
     }

     postCardMap () {
         const posts = this.state.posts.posts

         return posts.map(post => {
             // ファンルームヘッダー画像がない場合、デフォルト画像を代入する
             if (post.eyecatch_image.standard.url == null) {
                 post.eyecatch_image.standard.url = 'https://entynext-dev.s3.amazonaws.com/uploads/project/header_image/4/s320_5a25b59d-aee5-4d5a-8d2a-647158427a76.jpg'
             }
             if (post && post.title) {
                 return <PostCard
                     id={post.id}
                     title={post.title}
                     eyecatch_image={post.eyecatch_image}
                     onPress={() => this.openPostDetail(post.id)}
                 />
             }
         })
     }

    render() {
        const project_detail = this.props.project_detail.project
        // ヘッダー画像がない場合、デフォルト画像を代入する
        if (project_detail.header_image.full.url == null) {
            project_detail.header_image.full.url = 'https://entynext-dev.s3.amazonaws.com/uploads/project/header_image/4/s320_5a25b59d-aee5-4d5a-8d2a-647158427a76.jpg'
        }
        return (
            <ScrollView>
                <View>
                    <Image source={{uri: project_detail.header_image.full.url}} style={style.img} />

                    <View style={style.two_column}>
                        <View style={{width: '70%'}}>
                            <Text style={style.title}>{project_detail.title}</Text>
                        </View>
                        <View style={{width: '30%'}}>
                            <Text style={style.supporter_num}>{project_detail.backer_count} 人</Text>
                            <Text style={{textAlign: 'right'}}>のサポーター</Text>
                        </View>
                    </View>

                    <View style={style.follow_area}>
                        <Text style={style.follower}>{project_detail.follower_count} フォロワー</Text>
                        {this.state.follow ? <Text style={style.follow} onPress={() => this.unfollow()}>フォロー解除</Text> : <Text style={style.follow} onPress={() => this.follow()}>フォローする</Text>}
                    </View>

                    <Text style={style.subtitle}>プロジェクト概要</Text>
                    <Text style={style.project_about}>{project_detail.safe_introduction}</Text>

                    <Text style={style.subtitle}>プラン</Text>
                    <View style={{backgroundColor: '#f5f5f5'}}>
                        {this.planCardMap()}
                    </View>

                    <Text style={style.subtitle}>バックナンバー</Text>
                    <View style={{backgroundColor: '#f5f5f5'}}>
                        {this.backnumberMap()}
                    </View>

                    <Text style={style.subtitle}>記事</Text>
                    <View style={{backgroundColor: '#f5f5f5', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',}}>
                        {this.postCardMap()}
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        project_detail: state.app.project_detail,
        joined_plan_ids: state.app.joined_plan_ids,
        follows: state.auth.follows,
    }
}
export default connect(mapStateToProps)(withNavigationFocus(ProjectDetail, 'project_detail'))
