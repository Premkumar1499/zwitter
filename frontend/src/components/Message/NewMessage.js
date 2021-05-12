import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import BigModal from '../../common/BigModal'
import { CloseIcon, SearchIcon } from '../../common/Icon'


let timer;

function NewMessage({ handleClose, history }) {
    const [searchData, setSearchData] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])
    const [disable, setDsable] = useState(true)

    const user = useSelector((state) => state.user)
    const { userInfo } = user

    const auth = useSelector((state) => state.auth)
    const { config } = auth


    const handleChange = (e) => {
        const search = e.target.value
        clearTimeout(timer)

        timer = setTimeout(async () => {
            if (search.trim() !== "") {
                const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/user/search`, { search }, config)
                const filteredData = []
                data?.users.forEach(user => {
                    if ((user._id === userInfo.id) || (selectedUsers.some(u => u._id === user._id))) {
                        return
                    } else {
                        filteredData.push(user)
                    }
                })

                setSearchData(filteredData)


            }
        }, 1000)
    }

    const handleSelectedUsers = (e) => {
        const userId = e.target.closest('.user').getAttribute('data-id')
        const userSelected = searchData.filter(user => user._id === userId)
        setSelectedUsers([...selectedUsers, ...userSelected])
        setSearchData(searchData.filter(user => user._id !== userId))
    }

    const removeSelectedUser = (e) => {
        const removeUserId = e.target.closest('.selectedUser').getAttribute('data-id')
        const removedUser = selectedUsers.find(user => user._id === removeUserId)
        setSelectedUsers(selectedUsers.filter(user => user._id !== removeUserId))
        setSearchData([removedUser, ...searchData])
    }

    useEffect(() => {
        selectedUsers.length >= 1 ? setDsable(false) : setDsable(true)
    }, [selectedUsers])

    const handleChat = async () => {
        const users = selectedUsers.map(user => user._id)

        try {
            const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/chat`, { users }, config)
            history.push(`/messages/${data._id}`)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <BigModal onClose={handleClose}>
                <div className="modalCloseButton ">
                    <div className="flex-row items-center">
                        <span className="pointer" onClick={handleClose}>
                            <CloseIcon />
                        </span>
                        <span className="font-800 font-md ml-20 flex-1">New Message</span>
                        <button className={`fill-button text-white ${disable && 'opac-5'}`} disabled={disable} onClick={handleChat}>Next</button>
                    </div>
                </div>

                <div className="p-10 flex-row items-center border-bottom">
                    <SearchIcon />
                    <input type="text" placeholder="Search people" onChange={handleChange} className="flex-1 p-10 font-sm border-none text-root caret-rootText bg-root" />
                </div>

                <div className="p-10 flex-row flex-wrap">
                    {selectedUsers?.map(user =>
                        <div className="flex-row items-center fit-content border-secondary border-semi-round mr-10 mt-5 p-4 bgHover selectedUser" key={user._id} data-id={user._id}>
                            <img src={user.profilePhoto.url} alt="pp" className="border-round" width="20" height="20" />
                            <span className="pl-5 font-sm font-600">{user.name}</span>
                            <div className="ml-5 mt-5 pointer" onClick={removeSelectedUser}>
                                <CloseIcon className="svg-20 pointer-none" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-10">
                    {searchData.length === 0 ?
                        <div className="text-center mt-15">
                            <span className="block text-secondary">Search twitter for users</span>
                        </div> :
                        <div>
                            {searchData.map(user =>
                                <div className="flex-row items-center pointer pl-10 pr-20 user" key={user._id} data-id={user._id} onClick={handleSelectedUsers} >
                                    <img src={user.profilePhoto.url} alt="" width="35" height="35" className="border-round" />
                                    <div className=" flex-1 ml-10">
                                        <span className="block mt-10" style={{ fontSize: '15px', fontWeight: '700' }}>{user.name}</span>
                                        <span className="block text-secondary font-xs mb-10" style={{ fontSize: '14px', fontWeight: '500' }}>@{user.username}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    }
                </div>

            </BigModal>
        </>
    )
}

export default NewMessage
