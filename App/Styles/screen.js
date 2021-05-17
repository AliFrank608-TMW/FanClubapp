import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    container: {
        paddingTop: 0,
        backgroundColor: 'white',
        flex: 1,
    },
    centerize: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    decorateUnderlineDot: {
        textDecorationLine: 'underline',
        textDecorationStyle: 'dotted',
        textDecorationColor: '#000',
    },
    decorateUnderlineSolid: {
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        textDecorationColor: '#000',
    },
    hrBottom: {
        borderBottomColor: '#F1F1F1',
        borderBottomWidth: 1,
    },
    hrTop: {
        borderTopColor: '#F1F1F1',
        borderTopWidth: 1,
    },
    map_back_button: {
        position: 'absolute',
        left: 20,
        top: 20,
    },
    map_back_button_text: {
        fontSize: 40,
        fontWeight: '500',
        color: '#67696B',
        backgroundColor: 'transparent',
        zIndex: 1,
    },
    back_button: {
        position: 'absolute',
        left: 10,
        top: 20,
    },
    back_button_text: {
        fontSize: 20,
        color: 'white',
        backgroundColor: 'transparent',
        textShadowColor: '#000000',
        textShadowRadius: 2,
        textShadowOffset: {width: 0, height: 2},
    },
    header_right: {
        position: 'absolute',
        right: 20,
        top: 20,
    },
})
