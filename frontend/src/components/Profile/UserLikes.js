import axios from 'axios'
import React, { useState, useEffect } from 'react'
import CreatePost from '../../common/CreatePost'
import Spinner from '../../common/Spinner'

function UserLikes({ username, config, history }) {
    const [likes, setLikes] = useState([])
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        const getLikes = async () => {
            setLoading(true)
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/${username}/likes`, config)
                // console.log(data)
                setLikes(data)
                setLoading(false)
            } catch (err) {
                console.log(err.response)
                setLoading(false)
            }
        }
        getLikes()

    }, [])

    return (
        <div className="pos-relative">
            {loading ? <Spinner /> : <>
                {likes.length === 0 ?
                    <div className="text-center mt-15">
                        <span className="block font-700 font-md text-align">You havn't liked any tweet yet</span>
                        <span className="block text-secondary">When you have liked, it will show up here</span>
                    </div>
                    :
                    <>
                        {
                            likes?.map(like => (
                                <CreatePost key={like._id} post={like} history={history} />

                            ))
                        }
                    </>
                }
            </>
            }
        </div>
    )
}

export default UserLikes
