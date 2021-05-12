import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route } from 'react-router-dom'
import { TweetIcon } from '../common/Icon'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Tweet from './Tweet'
import { listPosts } from '../actions/postAction';
import CreatePost from '../common/CreatePost';
import Spinner from '../common/Spinner'
import TweetContainer from '../common/TweetContainer'

function Home() {

    const [tweetModal, setTweetModal] = useState(false)
    const [posts, setPosts] = useState([])

    const sm = useMediaQuery('(max-width:500px)');

    const dispatch = useDispatch()

    const postList = useSelector((state) => state.postList)
    const { postLoaded = false, recentPost = '', postedList, deletedPost = '' } = postList


    useEffect(() => {
        dispatch(listPosts())
    }, [])

    useEffect(() => {
        setPosts(postedList)
    }, [postedList])

    useEffect(() => {
        if (recentPost)
            setPosts([recentPost, ...posts])
    }, [recentPost])

    useEffect(() => {
        if (deletedPost) {
            setPosts(posts.filter(post => post._id !== deletedPost))
        }
    }, [deletedPost])

    return (
        <>
            <div className="main__header">
                <span>HOME</span>
            </div>

            {sm ? <button className={`fill-button border-round tweetButton `} onClick={() => setTweetModal(true)}>
                <TweetIcon className="fill-white" />
            </button> :
                <>
                    <TweetContainer label="img" textareaMinHeight={2} placeholder="What's happening?" />

                    <div style={{ borderTop: '10px solid var(--lightColor)' }}></div>
                </>
            }

            <div className="pos-relative">
                {

                    !postLoaded
                        ?
                        <Spinner />
                        :
                        posts?.map(post => <Route key={post._id} render={({ history }) => <CreatePost history={history} post={post} />} />)
                }
            </div>

            <div style={{ marginBottom: '60px' }}></div>

            {tweetModal && <Tweet handleClose={() => setTweetModal(false)} />}


        </>
    )
}

export default Home
