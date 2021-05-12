import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Following from './Following'
import Followers from './Followers'
import Spinner from '../../common/Spinner'

function FollowerAndFollowing({ history, match }) {
    const [value, setValue] = useState(0)
    const [loading, setLoading] = useState(false)
    const [following, setFollowing] = useState([])
    const [followers, setFollowers] = useState([])



    const user = useSelector((state) => state.user)
    const { userInfo } = user

    const auth = useSelector((state) => state.auth)
    const { config } = auth

    useEffect(() => {
        if (window.location.pathname === `/profile/${match.params.username}/following`)
            setValue(0)
        else if (window.location.pathname === `/profile/${match.params.username}/followers`)
            setValue(1)
    }, [match.params.username])

    useEffect(() => {

        const getUserDetails = async () => {
            setLoading(true)
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/${match.params.username}/following_followers`, config)
                setFollowing(data.following)
                setFollowers(data.followers)
                setLoading(false)
            } catch (err) {
                console.log(err.response)
                setLoading(false)
            }
        }
        getUserDetails()
    }, [match.params.username])


    return (
        <>
            {loading ? <Spinner /> :
                <div >
                    <div className="main__header">
                        <span>{match.params.username}</span>
                    </div>

                    <div className="profile__tabs">
                        <button className={`tab ${value === 0 && 'activeTab'}`} onClick={() => setValue(0)}> Following </button>
                        <button className={`tab ${value === 1 && 'activeTab'}`} onClick={() => setValue(1)}> Followers </button>
                    </div>

                    {value === 0 && <>
                        {following.length === 0 ?
                            <div className="text-center mt-15">
                                <span className="block font-700 font-md text-align">You are not following anyone yet</span>
                                <span className="block text-secondary">When you follow, it will show up here</span>
                            </div> : <>
                                {following?.map(user =>
                                    <Following key={user._id} followingUser={user} history={history} />
                                )}
                            </>}
                    </>}

                    {value === 1 && <>
                        {followers.length === 0 ?
                            <div className="text-center mt-15">
                                <span className="block font-700 font-md text-align">You don't have any followers yet</span>
                                <span className="block text-secondary">When you have, it will show up here</span>
                            </div> : <>
                                {followers?.map(user =>
                                    <Followers key={user._id} follower={user} history={history} />
                                )}
                            </>}
                    </>}


                </div>
            }
        </>
    )
}

export default FollowerAndFollowing
