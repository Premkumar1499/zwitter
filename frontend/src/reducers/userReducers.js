// import axios from 'axios'
import {

    USER_REQUEST,
    USER_FAIL,
    USER_SUCCESS,
    USER_AUTH,
    USER_LOGOUT,
} from '../constants/userConstants'

export const userReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_REQUEST:
            return { loading: true }
        case USER_SUCCESS:
            return { ...state, loading: false, userInfo: action.payload }
        case USER_AUTH:
            return { ...state, loading: false, isAuth: action.payload }
        case USER_FAIL:
            return { loading: false, error: action.payload }
        case USER_LOGOUT:
            return {}
        default:
            return state
    }
}

