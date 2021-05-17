import React, {Component} from 'react'
import {Alert, Clipboard, Image, Platform, TextInput, SafeAreaView, StyleSheet, View, Text} from 'react-native'
import {withNavigationFocus} from "react-navigation"
import {connect} from "react-redux"
import {loadCategoryList, setselectedCategory} from "../../Modules/app"

const style = StyleSheet.create({
    inputText: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        padding: 5,
        backgroundColor: '#eee',
    },
})

class SelectCategory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categories: {
                categories: [
                {
                    id: 0,
                    value: '',
                }
            ]
            },
        }
    }

    async componentWillMount() {
        // カテゴリ一覧の取得
        const categoryList = await this.props.dispatch(loadCategoryList())
        this.setState({categories: categoryList})
    }

    selectCategory(category_id, category_name) {
        const {params} = this.props.navigation.state
        params.sendSelectedCategory(category_id, category_name)
        this.props.navigation.goBack()
    }

    categoryMap() {
        const categories = this.state.categories
        return categories.categories.map(cate =>{
            return <Text style={style.inputText}
                         onPress={() => this.selectCategory(cate.id, cate.name)}>{cate.name}</Text>
            })
    }

    render() {
        return <View>
            {this.categoryMap()}
        </View>
    }
}

const mapStateToProps = (state) => {
    return {
        appState: state.app.state,
        token: state.auth.token,
        user_id: state.auth.user_id,
    }
}

export default connect(mapStateToProps)(withNavigationFocus(SelectCategory, 'selectcategory'))
