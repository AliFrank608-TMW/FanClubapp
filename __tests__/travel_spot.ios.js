import 'react-native'
import React from 'react'
import TravelSpot from '../App/Views/TravelSpot'
import renderer from 'react-test-renderer'

import testStore from '../App/testStore'

jest.mock('../App/API/common')
jest.mock('react-native-snap-carousel', () => 'Carousel')

const common = require('../App/API/common')
const spot = {
    id: 1,
    name: '清水寺',
    description: '平安京遷都以前からの歴史をもつ、京都では数少ない寺院の1つ。京都市内でも有数の観光地として有名であり、季節を問わず多くの参詣者や修学旅行生で賑わう。',
    image: {url: 'https://scontent-nrt1-1.cdninstagram.com/t51.2885-15/e35/18646536_1966303503653564_6000233350197936128_n.jpg'},
    travel_spot_images: []
}
common.callApi(() => {
    Promise.resolve({
        status: 200
    })
})
common.restClient = {
    get () {
        return {
            status: 200,
            spot,
            isTracked: true,
            isFavorite: true,
            articles: [],
            recommendedSpots: [],
            topImages: [],
            subImages: []
        }
    }
}

it('renders correctly', () => {
    const navigation = {
        state: {params: {id: 1}}
    }
    const tree = renderer.create(
        <TravelSpot id="1" store={testStore} navigation={navigation}/>
    )
})
