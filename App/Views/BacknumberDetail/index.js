import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withNavigationFocus} from 'react-navigation'
import {StyleSheet, View, Text, Image, ScrollView, Alert,} from "react-native"
import moment from 'moment'
import {loadBoughtBacknumber, backnumberFindById} from '../../Modules/app'
import TouchableOpacity from '../../Components/DefaultTouchableOpacity'

const style = StyleSheet.create({
    box: {
        width: 150,
        height: 150,
        margin: 10,
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    img: {
        width: '100%',
        height: '45%',
    },
    aboutarea: {
        padding: 10,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 12,
        marginBottom: 10,
    },
    shortintro: {
        fontSize: 10,
    }
})

class BacknumberDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            posts: [],
        }
    }

    async componentWillMount() {
        const backnumber_id = this.props.navigation.state.params.backnumber_id
        const result_bought_bn = await this.props.dispatch(loadBoughtBacknumber())

        // 購入済みバックナンバーの中から、選択されたバックナンバーを取得する
        const current_bn = result_bought_bn.post_packs.filter(bn => bn.id == backnumber_id)

        // バックナンバーにある記事を取得したい
        const posts = await this.props.dispatch(backnumberFindById(backnumber_id))

        this.setState({
            title: current_bn[0].title,
            posts: posts.post_pack.posts
        })
    }

    async openPostDetail(post_id) {
        this.props.navigation.push('post_detail', post_id)
    }

    postCardMap () {
        return this.state.posts.map(post => {
            return <TouchableOpacity onPress={() => this.openPostDetail(post.id)}>
                <View style={{backgroundColor: '#f5f5f5', margin: 5, padding: 10,}}>
                    <View>
                        <Text style={style.title}>{post.title}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        })
    }

    render() {
        return <ScrollView>
            <Text style={{fontSize: 25, margin: 10}}>{this.state.title}</Text>

            <Text>含まれている記事</Text>
            {this.postCardMap()}
        </ScrollView>
    }
}

const mapStateToProps = (state) => {
    return {
        project_detail: state.app.project_detail,
        joined_plan_ids: state.app.joined_plan_ids,
    }
}
export default connect(mapStateToProps)(withNavigationFocus(BacknumberDetail, 'backnumberdetail'))
