import {restClient} from './common.js'

export async function createMagicLinks (token) {
    return await restClient.post('/magic_links', token, {})
}
