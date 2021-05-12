import React, { useState, useEffect, Suspense } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ImageIcon, EmojiIcon, GifIcon } from './Icon'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import CircularProgress from '@material-ui/core/CircularProgress';
import ToolTip from './ToolTip'
import axios from 'axios'
import { RECENT_POST } from '../constants/postConstants';
import LinearProgress from '@material-ui/core/LinearProgress';
import Gif from './Gif';
import useMediaQuery from '@material-ui/core/useMediaQuery';



const EmojiPicker = React.lazy(() => import('./EmojiPicker/EmojiPicker'))

function TweetContainer({ label, textareaMinHeight, placeholder, postId = '', onSubmit }) {
    const [postText, setPostText] = useState('')
    const [imageFile, setImageFile] = useState(null)
    const [progress, setProgress] = useState(0)
    const [imageUrl, setImageUrl] = useState('')
    const [disable, setDisable] = useState(true)
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false)
    const [gifModal, setGifModal] = useState(false)
    const [gif, setGif] = useState(null)
    const [disableImage, setDisableImage] = useState(false)
    const [disableGif, setDisableGif] = useState(false)

    const sm = useMediaQuery('(max-width:500px)');


    const dispatch = useDispatch()

    const user = useSelector((state) => state.user)
    const { userInfo } = user

    const auth = useSelector((state) => state.auth)
    const { config } = auth

    const socketDetails = useSelector((state) => state.socketDetails)
    const { socket } = socketDetails

    useEffect(() => {
        setProgress(postText.length / 3)
    }, [postText])

    useEffect(() => {
        if (!postText && !imageUrl)
            setDisable(true)
        else
            setDisable(false)
    }, [postText, imageUrl])

    const handleImg = async (e) => {
        if (e.target.files[0] && !disableGif) {
            setImageFile(e.target.files[0])
            const blob = new Blob([e.target.files[0]], { type: e.target.files[0].type })
            const url = URL.createObjectURL(blob)
            setImageUrl(url)
            setDisableGif(true)
        }
    }

    const handleGif = () => {
        if (!disableGif) {
            setGifModal(true)
            setDisableImage(true)
        }
    }

    const submitTweet = async () => {
        setLoading(true)
        console.log(gif)
        const formData = new FormData();
        formData.append('image', imageFile)
        formData.append('text', postText)
        formData.append('gif', JSON.stringify(gif))

        postId && formData.append('replyTo', postId)


        const token = JSON.parse(localStorage.getItem('token'))

        try {
            const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/post`, formData, {
                headers: {
                    'content-type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                }
            })
            dispatch({ type: RECENT_POST, payload: data })
            setPostText('')
            setImageUrl('')
            setImageFile(null)
            setGif(null)
            setDisableGif(false)
            setDisableImage(false)
            setLoading(false)
            onSubmit()
            if (postId && data.replyTo.postedBy._id !== userInfo.id) {
                console.log("reply", data)
                socket.emit("notification received", data.replyTo.postedBy._id)
            }
        } catch (err) {
            setLoading(false)
            if (err?.response?.status === 401) {
                dispatch({ type: "USER_AUTH", payload: false })
            }
        }

    }


    return (
        <>

            <div className="flex-row ml-spacing mt-10 mb-10">

                <img src={userInfo.profilePhoto.url} alt="userPic" width="40" height="40" className="border-round" />

                <div className="flex-column flex-1">
                    <TextareaAutosize rowsMax={6} rowsMin={textareaMinHeight} maxLength="300" autoFocus={true} spellCheck="false" className="tweetTextarea p-10"
                        aria-label="maximum height" placeholder={placeholder} value={postText} onChange={(e) => setPostText(e.target.value)} />


                    {imageUrl && <div className="pos-relative">
                        <img src={imageUrl} alt="img" className="postImage" />
                        <span className="previewClose" onClick={() => { setImageUrl(''); setImageFile(null); setDisableGif(false) }}>x</span>
                    </div>
                    }

                    {gif?.url && <div className="pos-relative">
                        <img src={gif.url} alt="img" className="postImage" />
                        <span className="previewClose" onClick={() => { setGif(null); setDisableImage(false) }}>x</span>
                    </div>
                    }

                    <div className="flex-row items-center justify-between">
                        <div>
                            <ToolTip title="image">
                                <div className={`bgHover inline-block p-7 border-round ${sm && 'pr-0'}`}>
                                    <label htmlFor={label} >
                                        <ImageIcon className={`${disableImage && 'opac-5'}`} />
                                    </label>
                                    {!disableImage && <input className="none" id={label} accept="image/*" type="file" onChange={handleImg} />}
                                </div>
                            </ToolTip>

                            <ToolTip title="GIF">
                                <div className={`bgHover inline-block p-7 border-round ${sm && 'pr-0'}`} onClick={handleGif}>
                                    <GifIcon className={`${disableGif && 'opac-5'}`} />
                                </div>
                            </ToolTip>

                            <ToolTip title="emoji">
                                <div className={`bgHover inline-block p-7 border-round ${sm && 'pr-0'}`} onClick={(e) => { console.log(e.currentTarget); setAnchorEl(e.currentTarget) }}>
                                    <EmojiIcon />
                                </div>
                            </ToolTip>


                        </div>

                        <div className="flex-row align-center mr-10">

                            <div className="inline-block">
                                <CircularProgress variant="determinate" size={20} value={progress} className="progress" />
                            </div>

                            <button className={`fill-button text-white ${disable && 'opac-5'}`} disabled={disable} onClick={submitTweet}>Tweet</button>
                        </div>
                    </div>
                </div>
            </div>
            {loading && <LinearProgress />}

            <Suspense fallback={<div></div>}>
                <EmojiPicker handleEmoji={(emoji) => { setPostText(postText + emoji); }} targetElement={anchorEl} handleClose={() => setAnchorEl(null)} />
            </Suspense>

            {gifModal && <Gif handleClose={() => { setGifModal(false); setDisableImage(false) }} handleGif={(gif) => { setGif(gif); setGifModal(false); setDisable(false) }} />}
        </>
    )
}

export default TweetContainer
