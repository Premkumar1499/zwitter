import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { NewMessageIcon } from '..//../common/Icon'
import NewMessage from './NewMessage'

function Message({ match, history }) {
    const [newMessageModal, setNewMessageModal] = useState(false)
    const [chatList, setChatList] = useState([])

    const user = useSelector((state) => state.user)
    const { userInfo } = user

    const auth = useSelector((state) => state.auth)
    const { config } = auth

    useEffect(() => {

        const getChat = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/chat`, config)
                setChatList(data)
            } catch (err) {
                console.log(err)
            }
        }
        getChat()
    }, [])



    return (
        <>
            <div className="main__header">
                <span>Message</span>
                <div className="inline-block pointer p-7 border-round bgHover" onClick={() => setNewMessageModal(true)}>
                    <NewMessageIcon />
                </div>
            </div>

            <div>
                {chatList.map(chat =>
                    <Link to={`/messages/${chat._id}`} key={chat._id}>
                        <div className={`flex-row items-center border-bottom postHover p-10 ${chat.latestMessage && !chat.latestMessage?.readBy.includes(userInfo.id) && 'bg-primaryBg'}`} >
                            <div className="mr-15" style={{ width: "40px", height: "40px" }}>
                                <img src={chat.chatProfilePic} alt="pp" className="border-round" width="40" height="40" />
                            </div>

                            <div className="flex-col">
                                <div className="font-600 font-sm break-word">{chat.chatName}</div>
                                <div className="text-secondary break-word">
                                    {chat.latestMessage ? `${chat.latestMessage?.sender?.name}: ${chat.latestMessage?.content}`.substr(0, 40) + '...' : 'New chat'}
                                </div>
                            </div>
                        </div>
                    </Link>
                )}
            </div>

            {newMessageModal && <NewMessage handleClose={() => setNewMessageModal(false)} history={history} />}
        </>
    )
}

export default Message
