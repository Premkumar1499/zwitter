import axios from 'axios'
import React, { useState, useEffect } from 'react'
import CreatePost from '../../common/CreatePost'
import Spinner from '../../common/Spinner'

function UserReplies({ username, config, history }) {
    const [replies, setReplies] = useState([])
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        const getReplies = async () => {
            setLoading(true)
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/${username}/replies`, config)
                setReplies(data)
                setLoading(false)
            } catch (err) {
                console.log(err.response)
                setLoading(false)
            }
        }
        getReplies()

    }, [])

    return (
        <div className="pos-relative">
            {loading ? <Spinner /> : <>
                {replies.length === 0 ?
                    <div className="text-center mt-15">
                        <span className="block font-700 font-md text-align">You havn't replied yet</span>
                        <span className="block text-secondary">When you have replied, it will show up here</span>
                    </div>
                    :
                    <>
                        {
                            replies?.map(reply => (
                                <CreatePost key={reply._id} post={reply} history={history} />

                            ))
                        }
                    </>
                }
            </>
            }
        </div>
    )
}

export default UserReplies
