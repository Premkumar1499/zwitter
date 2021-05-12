import {
    POST_LIST_SUCCESS,
    POST_LIST_FAIL,
    RECENT_POST,
    DELETE_POST
} from '../constants/postConstants'

export const postsReducer = (state = {}, action) => {
    switch (action.type) {
        case POST_LIST_SUCCESS:
            return { ...state, postedList: action.payload, postLoaded: true }
        case POST_LIST_FAIL:
            return { error: action.payload }
        case RECENT_POST:
            return { ...state, recentPost: action.payload }
        case DELETE_POST:
            return { ...state, deletedPost: action.payload }
        default:
            return state
    }
}
