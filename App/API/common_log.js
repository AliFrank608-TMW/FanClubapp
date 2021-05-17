import qs from 'qs'
import apiConfig from '../../config/api'
import {NetworkError} from '../Utils/exceptions'
import {fetchJson} from '../Utils/network'
import JobWorker from '../Utils/job_worker'

class RestClient {
    /**
     * GETリクエストを送信する
     *
     * @param endpoint {string}
     * @param token {string}
     * @param params {Object}
     * @returns {Promise.<Object>}
     */
    async get (endpoint, token = null, params = null) {
        if (params) {
            let query = qs.stringify(params)
            endpoint = endpoint + '?' + query
        }
        return callApi(endpoint, token, {method: 'get'})
    }

    /**
     * POSTリクエストを送信する
     *
     * @param endpoint {string}
     * @param token {string}
     * @param params {Object}
     * @returns {Promise.<Object>}
     */
    async post(endpoint, token = null, params = null) {
        let opts = {method: 'post'}
        if (params) {
            opts.body = JSON.stringify(params)
        }
        return callApi(endpoint, token, opts)
    }

    /**
     * PUTリクエストを送信する
     *
     * @param endpoint {string}
     * @param token {string}
     * @param params {Object}
     * @returns {Promise.<Object>}
     */
    async put(endpoint, token = null, params = null) {
        let opts = {method: 'put'}
        if (params) {
            opts.body = JSON.stringify(params)
        }
        return callApi(endpoint, token, opts)
    }

    /**
     * PATCHリクエストを送信する
     *
     * @param endpoint {string}
     * @param token {string}
     * @param params {Object}
     * @returns {Promise.<Object>}
     */
    async patch(endpoint, token = null, params = null) {
        let opts = {method: 'patch'}
        if (params) {
            opts.body = JSON.stringify(params)
        }
        return callApi(endpoint, token, opts)
    }

    /**
     * DELETEリクエストを送信する
     *
     * @param endpoint {string}
     * @param token {string}
     * @param params {Object}
     * @returns {Promise.<Object>}
     */
    async delete(endpoint, token = null, params = null) {
        if (params) {
            let query = qs.stringify(params)
            endpoint = endpoint + '?' + query
        }
        return callApi(endpoint, token, {method: 'delete'})
    }
}

/**
 * The instance of RestClient
 * @type {RestClient}
 */
export const restClient = new RestClient()

// APIの通信処理をジョブキューに貯めて処理することでシリアル処理にする
const jobWorker = new JobWorker()
jobWorker.start()

/**
 * APIを呼び出す
 *
 * @param endpoint {string}
 * @param token {string}
 * @param options {Object}
 * @returns {*|Promise.<Object>}
 */
export async function callApi(endpoint, token, options = {method: 'get'}) {
    return new Promise((resolve, reject) => {
        jobWorker.addJob({
            process: async () => {
                return _callApi(endpoint, token, options).then((res) => {
                    resolve(res)
                }).catch((e) => {
                    reject(e)
                })
            },
        })
    })
}

export async function _callApi(endpoint, token, options = {method: 'get'}) {
    const url = `${apiConfig.log_base}${endpoint}`
    return fetchJson(url, {
        ...options,
        timeout: 10000,
        headers: {
            'X-ONETAP-TOKEN': `${token}`,
            'Content-Type': 'application/json',
        },
    }).catch(e => {
        throw new NetworkError(e.message, e)
    })
}

