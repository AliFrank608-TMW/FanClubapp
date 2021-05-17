import React, {Component} from 'react'
import {Alert, Clipboard, Image, Platform, TextInput, SafeAreaView, ScrollView, StyleSheet, View, Text} from 'react-native'
import moment from 'moment'
import TouchableOpacity from '../../Components/DefaultTouchableOpacity'
import {withNavigationFocus} from "react-navigation"
import {connect} from "react-redux"
import Toast from 'react-native-root-toast'
import {loadBacker, loadAuthVerify, loadFollowr} from "../../Modules/app"

const style = StyleSheet.create({
    btn: {
        minWidth: 100,
        fontSize: 12,
        paddingTop: 7,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        marginHorizontal: 5,
        marginVertical: 10,
        color: '#485460',
        borderRadius: 14,
        backgroundColor: '#ffdd59',
        overflow: 'hidden',
        textAlign: 'center',
    }
})

class Backers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            segment_tab_id: 1,
            supporters: [],
            followrs: [],
        }
    }

    async componentWillMount() {
        const result = await this.props.dispatch(loadAuthVerify())
        const project_id = result.own_project.id

        let supporters = await this.props.dispatch(loadBacker(project_id))
        supporters = supporters.backers
        let followers = await this.props.dispatch(loadFollowr(project_id))
        followers = followers.followers

        this.setState({ supporters: supporters, followrs: followers })
    }

    setSegmentTabId = (id) => {
        this.setState({segment_tab_id: id})
    }

    supportersMap() {
        return this.state.supporters.map(supporter => {
            return <View style={{margin: 10, padding: 10, backgroundColor: '#f5f5f5'}}>
                <Text>{supporter.user.email}</Text>
                <Text>サポート開始日：{moment(new Date(supporter.created_at)).format("YYYY/MM/DD")}</Text>
            </View>
        })
    }

    followerMap() {
        return this.state.followrs.map(follower => {
            return <View style={{margin: 10, padding: 10, backgroundColor: '#f5f5f5'}}>
                <Text>{follower.user.email}</Text>
                <Text>フォロー開始日：{moment(new Date(follower.created_at)).format("YYYY/MM/DD")}</Text>
            </View>
        })
    }

    render() {
        return <ScrollView>
            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
            }}>
                <Text style={style.btn} onPress={() => this.setSegmentTabId(1)}>サポーター</Text>
                <Text style={style.btn} onPress={() => this.setSegmentTabId(2)}>フォロワー</Text>
            </View>
            <View>
                {(() => {
                    if (this.state.segment_tab_id === 1) {
                        // サポーター
                        return <View>
                            {this.supportersMap()}
                        </View>
                    } else if (this.state.segment_tab_id === 2) {
                        // フォロワー
                        return <View>
                            {this.followerMap()}
                        </View>
                    }
                }) ()}
            </View>
        </ScrollView>
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user_id: state.auth.user_id,
    }
}
export default connect(mapStateToProps)(withNavigationFocus(Backers, 'backers'))
