import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Link } from 'react-router-dom'


function UserDetails({ username }) {
    const [userDetails, setUserDetails] = useState(null)

    const user = useSelector((state) => state.user)
    const { userInfo } = user

    const token = JSON.parse(localStorage.getItem('token'))
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    useEffect(() => {
        if (userInfo.username === username) {
            setUserDetails(userInfo)
        } else {
            const getUserDetails = async () => {
                try {
                    const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/profile/${username}`, config)
                    console.log(data)
                    setUserDetails(data.user)
                } catch (err) {
                    console.log(err.response)
                }
            }
            getUserDetails()
        }
    }, [])


    return (
        <div>
            {userDetails && <>
                <img src={userDetails.profilePhoto.url} alt="pp" width="50" height="50" className="border-round" />
                <span className="block font-700 font-sm text-root mt-15 ">{userDetails.name}</span>
                <span className="block font-450 text-secondary font-sm mt-5 mb-15">@{userDetails.username}</span>
                <span className="mb-15">{userDetails.bio}</span>
                <div className="flex-row">
                    <Link to={`/profile/${userDetails.username}/following`}>
                        <span className="font-450 text-secondary font-2sm">{userDetails.following.length} following</span>
                    </Link>
                    <Link to={`/profile/${userDetails.username}/followers`}>
                        <span className="font-450 text-secondary font-2sm ml-20">{userDetails.followers.length} followers</span>
                    </Link>
                </div>
                {userDetails.following.includes(userInfo.id)}
            </>}
        </div>
    )
}

export default UserDetails
