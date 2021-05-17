// ログインが必要な機能を未ログイン状態で呼び出した場合に発生する
export class NoLoginError extends Error {
    constructor (message, cause = null) {
        super(message)
        this.className = 'NoLoginError'
        if (cause) {
            this.stack += '\nCaused by:' + cause.stack
        }
    }
}

// ネットワーク関連のエラーが起きた場合に発生する
export class NetworkError extends Error {

    /**
     * Constructor.
     * @param message {string}
     * @param cause {Error}
     */
    constructor (message, cause = null) {
        super(message)
        this.className = 'NetworkError'

        if (cause) {
            this.stack += '\nCaused by:' + cause.stack
        }
    }
}

export class NetworkTimeoutError extends NetworkError {
    constructor (message, cause = null) {
        super(message, cause)
        this.className = 'NetworkTimeoutError'
        if (cause) {
            this.stack += '\nCaused by:' + cause.stack
        }
    }
}
