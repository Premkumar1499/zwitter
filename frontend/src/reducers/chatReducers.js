



export const chatReducer = (state = {}, action) => {
    switch (action.type) {
        case 'CHAT_LIST':
            return { ...state, chats: action.payload }
        case 'NEW_MESSAGE':
            return { newMessage: action.payload }
        case 'UNREAD_MESSAGES_COUNT':
            return { ...state, unreadMessagesCount: action.payload }
        case 'UNREAD_MESSAGES_COUNT_INCREMENT':
            return { ...state, unreadMessagesCount: state.unreadMessagesCount + 1 }
        case 'UNREAD_MESSAGES_COUNT_DECREMENT':
            return { ...state, unreadMessagesCount: state.unreadMessagesCount - 1 }
        default:
            return state
    }
}