/**
 * Created by shinji on 2017/07/03.
 */

const emailRegexp = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
exports.isValidEmail = (email) => {
    return emailRegexp.test(email)
}

const passwordRegexp = /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/
exports.isValidPassword = (password) => {
    return passwordRegexp.test(password)
}
