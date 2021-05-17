import * as api from '../API/magic_link_log'

export function createMagicLinks() {
    return async function (dispatch, getState) {
        const {token} = getState().auth
        const result = await api.createMagicLinks(token)
        if (result.status === 200) {

        }
        return result
    }
}
