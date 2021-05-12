import axios from 'axios'

export const getUnreadNotification = () => async (dispatch) => {
    const token = JSON.parse(localStorage.getItem('token'))

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    try {
        const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/notification?unreadOnly=true`, config)
        console.log(data)
        dispatch({ type: 'UNREAD_NOTIFICATIONS', payload: data })
        dispatch({ type: 'UNREAD_NOTIFICATIONS_COUNT', payload: data.length })

    } catch (err) {
        console.log(err)
    }

}