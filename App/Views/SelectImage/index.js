import React, {Component} from 'react'
import {Alert, Clipboard, Image, Platform, TextInput, SafeAreaView, ScrollView, StyleSheet, View, Text, CameraRoll} from 'react-native'
import TouchableOpacity from '../../Components/DefaultTouchableOpacity'
import {withNavigationFocus} from "react-navigation"
import {connect} from "react-redux"

class SelectImage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: '',
            photos: [
                {
                    node: {
                        image: {
                            filename: "",
                            uri: "",
                        }
                    }
                }
            ],
        }
    }

    componentWillMount() {
        CameraRoll.getPhotos({
            first: 50,
            assetType: 'Photos',
        })
            .then(r => {
                this.setState({ photos: r.edges })
            })
            .catch((err) => {
                //Error Loading Images
                this.setState({message: '設定から写真へのアクセスを許可してください'})
            })
    }

    selectedPhoto(uri, filename) {
        const {params} = this.props.navigation.state
        params.selectedPhoto({uri: uri, filename: filename})
        this.props.navigation.goBack()
    }

    photosMap() {
        return this.state.photos.map(photo => {
            if (photo.node.image.uri == '') {
                return <Text>{this.state.message}</Text>
            } else {
                return <TouchableOpacity onPress={() => this.selectedPhoto(photo.node.image.uri, photo.node.image.filename)}>
                    <Image style={{width: 88, height: 88, margin: 2,}}
                           source={{uri: photo.node.image.uri}}
                    />
                </TouchableOpacity>
            }
        })
    }

    render() {
        return <ScrollView>
            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginVertical: 3,
                marginLeft: 3,
            }}>
                {this.photosMap()}
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
export default connect(mapStateToProps)(withNavigationFocus(SelectImage, 'select_image'))
