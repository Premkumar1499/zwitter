

export const authReducer = (state = {}, action) => {
    switch (action.type) {
        case "SET_TOKEN":
            return {
                config: {
                    headers: {
                        Authorization: `Bearer ${action.payload}`,
                    }
                }
            }
        default:
            return state
    }
}