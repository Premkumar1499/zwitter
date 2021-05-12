import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { CloseIcon } from '../common/Icon'
import TopModal from '../common/TopModal'
import TweetContainer from '../common/TweetContainer'
import ToolTip from '../common/ToolTip'


function Reply({ handleClose, postId }) {
    const [replyToPost, setReplyToPost] = useState({})
    const [replyToUser, setReplyToUser] = useState({})

    const auth = useSelector((state) => state.auth)
    const { config } = auth

    useEffect(() => {
        const getPost = async () => {
            const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/post/${postId}`, config)
            data.retweetData ? setReplyToPost(data.retweetData) : setReplyToPost(data)
            setReplyToUser(data)
        }
        getPost()
    }, [])


    return (
        <>
            <TopModal onClose={handleClose}>
                <div className="modalCloseButton">
                    <span className="pointer" onClick={handleClose}>
                        <CloseIcon />
                    </span>
                </div>

                <div className="flex-row ml-spacing mt-10 mr-10 mb-10" data-id={postId}>

                    <div className="flex-col">
                        <img src={replyToUser.postedBy?.profilePhoto.url} alt="userPic" width="40" height="40" className="border-round" />
                        <div className="reply__line"></div>
                    </div>

                    <div className="flex-column flex-1 ml-spacing">

                        <div className="flex-row">
                            <span className="font-700">{replyToUser.postedBy?.name}</span>
                            <span className="text-secondary ml-10">@{replyToUser.postedBy?.username}</span>
                        </div>

                        <div>
                            {replyToPost.post?.text && <p className="mt-10 mb-10 break-word">{replyToPost.post.text}</p>}
                            {replyToPost.post?.postImg?.id &&
                                <ToolTip title={replyToPost.post?.postImg?.url}>
                                    <span className="break-word">{replyToPost.post.postImg.id}</span>
                                </ToolTip>
                            }

                        </div>

                        <p className="text-secondary mt-10">Replying To <span className="text-primary">@{replyToUser.postedBy?.username}</span></p>
                    </div>
                </div>


                <TweetContainer label="replyImg" textareaMinHeight={4} placeholder="Tweet Your Reply" postId={postId} onSubmit={handleClose} />


            </TopModal>
        </>
    )
}

export default Reply
