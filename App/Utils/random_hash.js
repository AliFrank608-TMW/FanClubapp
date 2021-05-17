export const generateRandomHash = (l) => {
    const charset = 'abcdefghijklmnopqrstuvwxyz0123456789'
    const cl = charset.length
    let res = ''
    for (let i = 0; i < l; i++) {
        res += charset[Math.floor(Math.random() * cl)]
    }
    return res
}
