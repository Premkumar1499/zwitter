import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { AddBookmarkIcon, PinFillIcon, DeleteIcon, LikeIcon, OptionsIcon, PinIcon, ReplyIcon, RetweetIcon, VipIcon } from './Icon'
import ToolTip from './ToolTip'
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import Reply from '../components/Reply'
import Modal from './Modal'
import Alert from './Alert'
import { DELETE_POST } from '../constants/postConstants'
import { getPostTime, getTimeAndDate } from './timeAndDate'
import { textUrl } from './textToUrl'

const useStyles = makeStyles({
    popover: {
        backgroundColor: "transparent"
    }
})


function CreatePost({ post, history }) {
    const classes = useStyles()
    const [tweet, setTweet] = useState([])
    const [replyModal, setReplyModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [pinModal, setPinModal] = useState(false)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [retweetTooltip, setRetweetToolTip] = useState('')
    const [likeTooltip, setLikeToolTip] = useState('')
    const [bookmark, setBookmark] = useState(null)



    const [anchorEl, setAnchorEl] = React.useState(null);


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;


    const dispatch = useDispatch()


    const user = useSelector((state) => state.user)
    const { userInfo } = user

    const socketDetails = useSelector((state) => state.socketDetails)
    const { socket } = socketDetails

    const auth = useSelector((state) => state.auth)
    const { config } = auth

    const likeActive = post.likes.includes(userInfo.id) ? "active" : "";
    const retweetActive = post.retweetUsers.includes(userInfo.id) ? "active" : "";

    const likeCount = post.likes.length || ""
    const retweetCount = post.retweetUsers.length || ''
    const replyCount = post.repliedUsers.length || ''


    const isRetweet = post.retweetData !== undefined;
    const userRetweeted = isRetweet && post.postedBy._id === userInfo.id
    const retweetedBy = isRetweet ? post.postedBy.username : null;

    const isReply = post.replyTo !== undefined
    const replyToUsername = isReply ? post.replyTo?.postedBy?.username : null

    const postedUser = post.postedBy
    const postId = post._id

    const postData = isRetweet ? post.retweetData : post;
    const postText = postData.post.text
    const postImage = postData.post.postImg.url

    const userBookmarks = userInfo?.bookmarks

    useEffect(() => {
        retweetActive ? setRetweetToolTip('Undo Retweet') : setRetweetToolTip('Retweet')
    }, [retweetActive])

    useEffect(() => {
        likeActive ? setLikeToolTip('Unlike') : setLikeToolTip('Like')
    }, [likeActive])

    useEffect(() => {
        userBookmarks?.includes(postId) ? setBookmark(true) : setBookmark(false)
    }, [userBookmarks, postId])

    useEffect(() => {
        postText && setTweet(textUrl(postText))
    }, [postText])

    const handleLike = async (e) => {
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_SERVER_URL}/post/${postId}/like`, {}, config)
            e.target.closest('.likeContainer').querySelector('span').innerText = data.likes.length || ""

            if (data.likes.includes(userInfo.id)) {
                e.target.closest('.likeContainer').classList.add('active')
                setLikeToolTip('Unlike')
                if (data.postedBy !== userInfo.id)
                    socket.emit("notification received", data.postedBy)
            } else {
                e.target.closest('.likeContainer').classList.remove('active')
                setLikeToolTip('Like')
            }
        } catch (err) {
            if (err?.response.status === 401) {
                dispatch({ type: "USER_AUTH", payload: false })
            }
        }
    }

    const handleRetweet = async (e) => {
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/post/${postId}/retweet`, {}, config)

            e.target.closest('.retweetContainer').querySelector('span').innerText = data.retweetUsers.length || ""

            if (data.retweetUsers.includes(userInfo.id)) {
                e.target.closest('.retweetContainer').classList.add('active')
                setRetweetToolTip('Undo Retweet')
                if (data.postedBy !== userInfo.id)
                    socket.emit("notification received", data.postedBy)
            } else {
                e.target.closest('.retweetContainer').classList.remove('active')
                setRetweetToolTip('Retweet')
            }
        } catch (err) {
            if (err?.response.status === 401) {
                dispatch({ type: "USER_AUTH", payload: false })
            }
        }
    }

    const handleDelete = async (e) => {
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/post/${postId}`, config)
            dispatch({ type: DELETE_POST, payload: data })
            setAlertMessage('Your tweet was deleted')
            setAlert(true)
        } catch (err) {
            if (err?.response.status === 401) {
                dispatch({ type: "USER_AUTH", payload: false })
            }
        }
    }

    const handlePinAndUnpin = async (e) => {
        const pinned = e.target.closest('.pinned').getAttribute('data-pinned') === 'true' ? true : false
        const body = pinned ? { pinned: false } : { pinned: true }
        try {
            await axios.put(`${process.env.REACT_APP_SERVER_URL}/post/${postId}`, body, config)
            postData.pinned = !pinned
            setPinModal(false)
            setAlertMessage(!pinned ? 'Tweet was pinned to your profile' : 'Tweet was unpinned from your profile')
            setAlert(true)
        } catch (err) {
            if (err?.response.status === 401) {
                dispatch({ type: "USER_AUTH", payload: false })
            }
            setPinModal(false)
        }
    }

    const handleBookmarks = async (e) => {
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_SERVER_URL}/post/${postId}/bookmark`, {}, config)
            setBookmark(data)
        } catch (err) {
            if (err?.response.status === 401) {
                dispatch({ type: "USER_AUTH", payload: false })
            }
        }
    }

    const handlePost = (e) => {
        if (!e.target.closest('.click'))
            history.push(`/post/${postId}`)
    }


    return (
        <>
            <div className="postHover pointer" onClick={handlePost}>
                {
                    isRetweet && (userRetweeted ?
                        <span className="flex items-center ml-35 pt-10">
                            <RetweetIcon className="svg-15 fill-secondary" />
                            <span className="text-secondary ml-5 font-700 font-2sm ">You Retweeted</span> </span>
                        :
                        <span className="flex items-center ml-35 mt-5">
                            <RetweetIcon className="svg-15 fill-secondary" />
                            <span className="text-secondary ml-5 font-700 font-2sm"> Retweeted by <Link to={`/profile/${retweetedBy}`} className="text-secondary" >{`@${retweetedBy}`}</Link> </span>
                        </span>
                    )
                }

                {postData.pinned && <div className="flex-row items-center ml-35 pt-10">
                    <PinFillIcon className="fill-secondary svg-15" /> <span className="text-secondary ml-5 font-700 font-2sm">Pinned Tweet</span>
                </div>
                }
                <div className="flex-row ml-spacing pt-10 mr-10 mb-10 " data-id={postId}>

                    <img src={postedUser.profilePhoto.url} alt="userPic" width="40" height="40" className="border-round click" />

                    <div className="flex-column flex-1 ml-spacing">
                        <div className="flex-row justify-between items-center">
                            <div className="click">
                                <Link to={`/profile/${postedUser.username}`}>
                                    <span className=" flex-row flex-wrap ">
                                        <span className="font-700">{postedUser.name}</span>
                                        <span style={{ margin: "4px 0 0 2px" }}>{postedUser.role === "admin" && <VipIcon className="svg-15" />}</span>
                                        <span className="text-secondary ml-5 hoverUnderline">
                                            @{postedUser.username}
                                        </span>
                                        <pre className="text-secondary">·</pre>
                                        <ToolTip title={getTimeAndDate(new Date(postData.createdAt))}>
                                            <span className="text-secondary">{getPostTime(new Date(), new Date(postData.createdAt))}</span>
                                        </ToolTip>
                                    </span>


                                </Link>
                            </div>
                            {postedUser._id === userInfo.id &&
                                <div className="pointer click" onClick={handleClick}>
                                    <OptionsIcon className="fill-secondary svg-20" />
                                </div>
                            }
                        </div>

                        {
                            isReply && (
                                <span className="text-secondary font-2sm click">
                                    Replying to <Link to={`/profile/${replyToUsername}`}><span className="text-primary">{`@${replyToUsername}`}</span></Link>
                                </span>
                            )
                        }

                        <div >
                            {tweet?.map((s, i) => {
                                if (s.type === "text") return <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{s.text}</span>;
                                else if (s.type === "link")
                                    return (
                                        <span key={i} className="click"
                                            dangerouslySetInnerHTML={{
                                                __html: `<a href=http://${s.text} target=”_blank” id="link">${s.text}</a>`
                                            }}
                                        ></span>
                                    );
                                else if (s.type === "hashtag")
                                    return (
                                        <Link to={`/hashtag/${s.text.slice(1)}`} key={i}>
                                            <span className="text-primary click">
                                                {s.text}
                                            </span>
                                        </Link>
                                    )
                            })}
                            {/* {postText && <p className="mt-5 mb-10" style={{ wordBreak: "break-word" }}>{postText}</p>} */}
                            {postImage && <img src={postImage} alt="postImg" className="postImage block" />}
                        </div>

                        <div className="flex-row justify-around">
                            <div className="flex-row items-center click" style={{ width: "70px" }}>
                                <ToolTip title="Reply">
                                    <div className="inline-block pointer p-7 border-round reply" onClick={() => setReplyModal(true)}>
                                        <ReplyIcon className="fill-secondary svg-20" />
                                    </div>
                                </ToolTip>
                                <span className="text-secondary">{replyCount}</span>
                            </div>

                            <div className={`flex-row items-center retweetContainer click ${retweetActive}`} style={{ width: "70px" }} onClick={handleRetweet}>
                                <ToolTip title={retweetTooltip}>
                                    <div className="inline-block pointer p-7 border-round retweet " >
                                        <RetweetIcon className="fill-secondary svg-20" />
                                    </div>
                                </ToolTip>
                                <span className="text-secondary">{retweetCount}</span>
                            </div>

                            <div className={`flex-row items-center likeContainer click ${likeActive} `} style={{ width: "70px" }}>
                                <ToolTip title={likeTooltip}>
                                    <div className="inline-block pointer p-7 border-round like " onClick={handleLike} >
                                        <LikeIcon className="fill-secondary svg-20 pointer-none" />
                                    </div>
                                </ToolTip>
                                <span className="text-secondary ">{likeCount}</span>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="border-bottom"></div>

            </div>
            {replyModal && <Reply postId={postId} handleClose={() => setReplyModal(false)} />}

            {deleteModal && <Modal onClose={() => setDeleteModal(false)}>
                <div className="ml-10 mr-10 mt-20 mb-20 text-center" style={{ maxWidth: "280px" }}>
                    <span className="font-700 font-md mt-10 block">Delete Tweet?</span>
                    <span className="block font-450 mb-15 text-secondary mt-15">This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from Twitter search results.  </span>
                    <div className="flex justify-between">
                        <button style={{ padding: "10px 35px" }} className="fill-button bg-light mr-15" onClick={() => setDeleteModal(false)}>Cancel</button>
                        <button style={{ padding: "10px 35px" }} className="fill-button text-white" onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            </Modal>}

            {pinModal && <Modal onClose={() => setPinModal(false)}>
                <div className="ml-10 mr-10 mt-20 mb-20 text-center pinned" style={{ maxWidth: "280px" }} data-pinned={postData.pinned}>
                    <span className="font-700 font-md mt-10 block">{postData.pinned ? 'Unpin Tweet from profile?' : 'Pin Tweet to profile?'}</span>
                    <span className="block font-450 mb-15 text-secondary mt-15">{postData.pinned ? 'This will no longer appear automatically at the top of your profile.' : 'This will appear at the top of your profile and replace any previously pinned Tweet.'}</span>
                    <div className="flex justify-around">
                        <button style={{ padding: "10px 35px" }} className="fill-button bg-light mr-15" onClick={() => setPinModal(false)}>Cancel</button>
                        <button style={{ padding: "10px 35px" }} className="fill-button text-white" onClick={handlePinAndUnpin}>{postData.pinned ? 'Unpin' : 'Pin'}</button>
                    </div>
                </div>
            </Modal>}

            {alert && <Alert message={alertMessage} errorTimeout={() => { setAlert(false); setAlertMessage('') }} />}

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                classes={{ paper: classes.popover }}
            >
                <div className="bg-root text-secondary">
                    <div className="flex-row items-center p-10 postHover pointer" onClick={() => { setDeleteModal(true); handleClose(); }}>
                        <div className="mt-5 mr-10"><DeleteIcon className="svg-20 fill-error" /></div>
                        <span className="text-error">Delete</span>
                    </div>
                    <div className="flex-row items-center p-10 postHover pointer" onClick={() => { setPinModal(true); handleClose(); }}>
                        <div className="mt-5 mr-10"><PinIcon className="fill-secondary svg-20" /></div>
                        <span>{postData.pinned ? 'Unpin from Profile' : 'Pin to your Profile'}</span>
                    </div>
                    <div className="flex-row items-center p-10 postHover pointer" onClick={() => { handleBookmarks(); handleClose(); }}>
                        <div className="mt-5 mr-10"><AddBookmarkIcon className="fill-secondary svg-20" /></div>
                        <span>{bookmark ? 'Remove Tweet from bookmarks' : 'Add Tweet to Bookmarks'}</span>
                    </div>
                </div>


            </Popover>

        </>
    )
}

export default CreatePost
