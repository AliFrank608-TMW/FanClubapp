import * as api from '../API/event_log'
import DeviceInfo from 'react-native-device-info'
import puree from '../../config/puree'
import * as storage from '../../App/Utils/storage'

export const INCREMENT_PV = 'event_log/INCREMENT_PV'

const initialState = {
    pv_num: 0,
}

export function pureeSend(log) {
    return async (dispatch) => {
        const state = await dispatch(loadStateForMerge())
        puree.send({
            ...state,
            ...log
        })
    }
}

export function loadStateForMerge() {
    return async function (dispatch, getState) {
        let {pv_num} = await getState().event_log
        pv_num = pv_num + 1
        await dispatch({type: INCREMENT_PV, pv: pv_num})
        let {user_id, token} = await getState().auth
        user_id = process.env.NODE_ENV !== 'production' ? -1 : parseInt(user_id) // bigQuery用に型変換, devは-1でスキップ
        const ref_key = await storage.getItem('event_log/prevScreen')
        return {
            user_id,
            access_token: token,
            ref_key,
            device: DeviceInfo.getUserAgent(),
            value_int3: pv_num,
            value_str3: DeviceInfo.getUniqueId,
        }
    }
}

export function bulkSend(logs) {
    return async (_) => await api.bulkSend(logs)
}

export default function event_log(state = initialState, action) {
    switch (action.type) {
        case INCREMENT_PV: {
            return {
                ...state,
                pv_num: action.pv,
            }
        }
    }
    return state
}
