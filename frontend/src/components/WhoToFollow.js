import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Followers from './FollowerAndFollowing/Followers'
import Spinner from '../common/Spinner'

function WhoToFollow() {

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)

    const auth = useSelector((state) => state.auth)
    const { config } = auth


    useEffect(() => {
        const getUsers = async () => {
            setLoading(true)
            const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/connect?limit=4`, config)
            // console.log(data)
            setLoading(false)
            setUsers(data)
        }
        getUsers()
    }, [])

    return (
        <div className="whoToFollow">
            <span className="font-xl font-700 block text-center mb-20">Who To Follow</span>

            {loading ? <Spinner />
                :
                <>
                    {users.length === 0 ?
                        <div className="text-center mt-15">
                            <span className="block font-700 font-md text-align">You don't have any one to connect</span>
                            <span className="block text-secondary">When you have, it will show up here</span>
                        </div>
                        :
                        <>
                            {users.map(user =>
                                <Followers key={user._id} follower={user} />
                            )}
                        </>
                    }
                </>}

            <Link to="/connect">
                <span className="text-primary ml-20 ">
                    more
                </span>
            </Link>

        </div>
    )
}

export default WhoToFollow
