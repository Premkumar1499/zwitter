import axios from 'axios'
import React, { useState, useEffect, Fragment } from 'react'
import CreatePost from '../../common/CreatePost'
import Spinner from '../../common/Spinner'

function UserTweets({ username, config, history }) {
    const [tweets, setTweets] = useState([])
    const [pinnedTweet, setPinnedTweet] = useState(null)
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        if (username) {
            const getTweets = async () => {
                setLoading(true)
                try {
                    const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/${username}/tweets`, config)
                    setTweets(data.tweets)
                    setPinnedTweet(data.pinnedTweet)
                    setLoading(false)
                } catch (err) {
                    console.log(err.response)
                    setLoading(false)
                }
            }
            getTweets()
        }

    }, [username])

    return (
        <div className="pos-relative">
            {loading ? <Spinner /> : <>
                {tweets.length === 0 ?
                    <div className="text-center mt-15">
                        <span className="block font-700 font-md text-align">You havn't tweeted yet</span>
                        <span className="block text-secondary">When you have tweeted, it will show up here</span>
                    </div>
                    :
                    <>

                        {pinnedTweet && <CreatePost key={pinnedTweet._id} post={pinnedTweet} history={history} />}

                        {
                            tweets?.map(tweet => <Fragment key={tweet._id}>
                                {!tweet.pinned && <CreatePost post={tweet} history={history} />}
                            </Fragment>)
                        }
                    </>
                }
            </>
            }
        </div>
    )
}

export default UserTweets
