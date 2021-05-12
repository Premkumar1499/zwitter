import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios';
import CreatePost from '../common/CreatePost';
import Spinner from '../common/Spinner';

function PostPage({ match, history }) {
    const [post, setPost] = useState('')
    const [replies, setReplies] = useState([])
    const [loading, setLoading] = useState(false)

    const auth = useSelector((state) => state.auth)
    const { config } = auth


    useEffect(() => {
        const getPost = async () => {
            setLoading(true)
            const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/post/${match.params.id}/detail`, config)
            // console.log(data);
            setLoading(false)
            setPost(data.postData)
            setReplies(data.replies)
        }
        getPost()
    }, [match])

    return (
        <div>
            <div className="main__header">
                <span>THREAD</span>
            </div>

            {loading ? <Spinner />
                :
                <>

                    {post && <CreatePost post={post} history={history} />}

                    <div style={{ borderTop: '10px solid var(--lightColor)' }}></div>


                    {replies.length === 0 ?
                        <div className="text-center mt-15">
                            <span className="block font-700 font-md text-align">You don't have any replies yet</span>
                            <span className="block text-secondary">When you have, it will show up here</span>
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
                </>}

        </div>
    )
}

export default PostPage
