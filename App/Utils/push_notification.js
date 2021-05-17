import OneSignal from 'react-native-onesignal'

export async function checkAndRequestNotificationPermission() {
    let result = 'skip'
    await OneSignal.checkPermissions(async permissions => {
        if (!permissions || !permissions.alert) {
            let permissions = {
                alert: true,
                badge: true,
                sound: true,
            }
            await OneSignal.requestPermissions(permissions)
            // リクエスト後の対応を考えている
            OneSignal.checkPermissions(permissions => {
                if (!permissions || !permissions.alert) {
                  result = 'denied'
                } else {
                  result = 'allowed'
                }
            })
        }
        return result
    })
}
