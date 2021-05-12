import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import Spinner from '../common/Spinner'
import CreatePost from '../common/CreatePost'


function Hashtag({ match, history }) {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)

    const auth = useSelector((state) => state.auth)
    const { config } = auth


    useEffect(() => {
        const getPosts = async () => {
            setLoading(true)
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/post/hashtag/${match.params.name}`, config)
                setLoading(false)
                setPosts(data)
            } catch (err) {
                setLoading(false)
                console.log(err)
            }

        }
        getPosts()
    }, [])


    return (
        <>
            <div className="main__header">
                <span>Hashtags</span>
            </div>

            {loading ? <Spinner />
                :
                <>
                    {
                        posts?.map(post => (
                            <CreatePost key={post._id} post={post} history={history} />
                        ))
                    }
                </>
            }
        </>
    )
}

export default Hashtag
