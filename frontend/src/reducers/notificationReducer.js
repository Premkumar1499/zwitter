



export const notificationReducer = (state = {}, action) => {
    switch (action.type) {
        case 'UNREAD_NOTIFICATIONS':
            return { ...state, unreadNotifications: action.payload }
        case 'UNREAD_NOTIFICATIONS_COUNT':
            return { ...state, unreadNotificationsCount: action.payload }
        case 'LATEST_NOTIFICATION':
            return { ...state, latest_notification: action.payload }
        default:
            return state
    }
}