import { restClient } from './common_log.js'

export async function bulkSend (logs) {
    if (Array.isArray(logs) !== true) {
        console.warn('log is not array')
    }
    return await restClient.post('/record-event-multiple', 'cointrader', {events: logs})
}
