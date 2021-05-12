import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import TopModal from '../../common/TopModal'
import { CloseIcon } from '../../common/Icon'
import TextInput from '../../common/TextInput'

function ChatInfo({ match }) {
    const [chat, setChat] = useState({})
    const [chatNameModal, setChatNameModal] = useState(false)
    const [chatName, setChatName] = useState('')
    const [disable, setDisable] = useState(false)

    const auth = useSelector((state) => state.auth)
    const { config } = auth

    useEffect(() => {
        const getChat = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/chat/${match.params.chatId}`, config)
                setChat(data)
                setChatName(data.chatName)
            } catch (err) {
                console.log(err)
            }
        }
        getChat()
    }, [])

    useEffect(() => {
        chatName.trim() === chat.chatName ? setDisable(true) : setDisable(false)
    }, [chatName])

    const updateChatName = async () => {
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_SERVER_URL}/chat/${match.params.chatId}`, { chatName }, config)
            setChatName(data.chatName)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <div>
                <div className="main__header">
                    <span>Chat Info</span>
                </div>

                <div className="flex-row items-center postHover p-20">
                    <div className="flex-1 font-600 font-sm">
                        {chatName}
                    </div>
                    <span className="text-primary mr-20 pointer" onClick={() => setChatNameModal(true)}>Edit</span>
                </div>

                <div style={{ borderTop: '10px solid var(--lightColor)' }}></div>

                <div className="font-800 font-md p-10 border-bottom mb-10">
                    People
            </div>

                {chat.users?.map(user =>
                    <div key={user._id}>
                        <Link to={`/profile/${user.username}`} >
                            <div className="flex-row items-center pointer pl-10 pr-20 postHover" >
                                <img src={user.profilePhoto?.url} alt="" width="35" height="35" className="border-round" />
                                <div className=" flex-1 ml-10">
                                    <span className="block mt-10" style={{ fontSize: '15px', fontWeight: '700' }}>{user.name}</span>
                                    <span className="block text-secondary font-xs mb-10" style={{ fontSize: '14px', fontWeight: '500' }}>@{user.username}</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}
            </div>
            {chatNameModal && <TopModal onClose={() => setChatNameModal(false)}>
                <>
                    <div className="p-10 flex-row items-center border-bottom">
                        <div className="pointer mt-5" onClick={() => setChatNameModal(false)}>
                            <CloseIcon />
                        </div>
                        <span className="font-800 font-md flex-1 ml-20">Edit</span>
                        <button className={`fill-button text-white ${disable && 'opac-5'}`} disabled={disable} onClick={updateChatName}>Save</button>
                    </div>

                    <div className="mt-20">
                        <img src={chat.chatProfilePic} alt="pp" className="border-round block  m-auto" width="80" height="80" />
                    </div>

                    <div className="mt-20 mb-20">
                        <TextInput type='text' className="m-auto" placeholder="Chat name" maxLength="50" handleInput={(value) => setChatName(value)} value={chatName} />
                    </div>
                </>
            </TopModal>}
        </>
    )
}

export default ChatInfo
