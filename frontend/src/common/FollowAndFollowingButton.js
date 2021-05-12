import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_SUCCESS } from '../constants/userConstants'

function FollowAndFollowingButton({ username, id }) {
    const [isFollowing, setIsFollowing] = useState(null)
    const [followingHover, setFollowingHover] = useState('Following')

    const dispatch = useDispatch()

    const user = useSelector((state) => state.user)
    const { userInfo } = user

    const auth = useSelector((state) => state.auth)
    const { config } = auth

    useEffect(() => {
        if (userInfo.following?.includes(id))
            setIsFollowing(true)
        else
            setIsFollowing(false)
    }, [id])

    const handleFollow = async (e) => {
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_SERVER_URL}/user/${username}/follow`, {}, config)
            dispatch({ type: USER_SUCCESS, payload: data.user })
            setIsFollowing(data.isFollowing)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div>
            {id !== userInfo.id && <>
                {isFollowing ?
                    <button className="fill-button text-white" onMouseOver={() => setFollowingHover('Unfollow')} onMouseLeave={() => setFollowingHover('Following')} onClick={handleFollow}>{followingHover}</button>
                    :
                    <button className="outline-button" onClick={handleFollow}>Follow</button>
                }
            </>
            }
        </div>
    )
}

export default FollowAndFollowingButton
