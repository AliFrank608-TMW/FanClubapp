const TOKEN = 'xoxp-66164478454-66182559442-224827405685-1edd6567601ceea9a66879c747152c4a'

export async function sendSlack (object) {
    let formData = new FormData()
    const ops = {token: TOKEN, channel: object.channel, username: object.username, text: object.msg}
    for (let name in ops) {
        formData.append(name, ops[name])
    }
    // [注意]: crawlerではrequestで書いているが、ReactNativeのmoduleの関係でrequestをinstallするとcryptoがcannot resolveになる。
    // なのでhttpのリクエストはなるべくfetchで記述する。
    return await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        body: formData
    }).catch(e => console.error(e))
}
