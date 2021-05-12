import axios from 'axios'

export const getChatList = () => async (dispatch) => {
    const token = JSON.parse(localStorage.getItem('token'))

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    try {
        const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/chat`, config)
        //  console.log(data.length)
        dispatch({ type: 'CHAT_LIST', payload: data })
    } catch (err) {
        console.log(err)
    }

}

export const getUnreadChatsCount = () => async (dispatch) => {
    const token = JSON.parse(localStorage.getItem('token'))

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    try {
        const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/chat?unreadOnly=true`, config)
        //  console.log(data.length)
        dispatch({ type: 'UNREAD_MESSAGES_COUNT', payload: data.length })
    } catch (err) {
        console.log(err)
    }

}
