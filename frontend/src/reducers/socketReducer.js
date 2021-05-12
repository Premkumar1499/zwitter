

export const socketReducer = (state = {}, action) => {
    switch (action.type) {
        case 'SOCKET_CONNECTED':
            return { socket: action.payload }
        default:
            return state
    }
}