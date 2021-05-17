// consoleに渡すときにレベルを維持する
const KEEP_LOG_LEVEL = false

class Log {

    /**
     * @param args {Array}
     */
    trace (...args) {
        console.trace.apply(this, args)
    }

    /**
     * @param args {Array}
     */
    log (...args) {
        console.log.apply(this, args)
    }

    /**
     * @param args {Array}
     */
    info (...args) {
        console.log.apply(this, this._makeParams(args, 'blue', false))
    }

    /**
     * @param args {Array}
     */
    warn (...args) {
        if (KEEP_LOG_LEVEL) {
            console.warn.apply(this, args)
        } else {
            console.log.apply(this, this._makeParams(args, 'orange', true))
        }
    }

    /**
     * @param args {Array}
     */
    error (...args) {
        if (KEEP_LOG_LEVEL) {
            console.error.apply(this, args)
        } else {
            console.log.apply(this, this._makeParams(args, 'red', true))
        }
    }

    /**
     * @param args {Array}
     * @param color {string}
     * @param withStack {bool}
     * @returns {Array.<*>}
     * @private
     */
    _makeParams (args, color, withStack) {
        let msg = args[0]
        let smsg = '%c' + msg
        if (withStack) {
            smsg = smsg + (new Error()).stack.split('\n').slice(3, 6).join('\n')
        }
        return [smsg, 'color: ' + color].concat(args.slice(1))
    }
}

export default new Log()

