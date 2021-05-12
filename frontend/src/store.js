import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'

import {
    userReducer
} from './reducers/userReducers'

import {
    postsReducer
} from './reducers/postReducers'

import {
    exploreReducer
} from './reducers/exploreReducers'

import {
    socketReducer
} from './reducers/socketReducer'

import {
    chatReducer
} from './reducers/chatReducers'

import {
    notificationReducer
} from './reducers/notificationReducer'

import {
    authReducer
} from './reducers/authReducer'


const token = JSON.parse(localStorage.getItem('token'))

const reducer = combineReducers({
    user: userReducer,
    postList: postsReducer,
    exploreList: exploreReducer,
    socketDetails: socketReducer,
    chatDetails: chatReducer,
    notificationDetails: notificationReducer,
    auth: authReducer
});

const initialState = {
    chatDetails: { unreadMessagesCount: 0 },
    exploreList: { sports: [], health: [], business: [], science: [] },
    auth: {
        config: {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    }
}

const middleware = [thunk]

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store