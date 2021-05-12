import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { AtIcon, BookmarkIcon, CloseIcon, DisplayIcon, ProfileIcon } from '../common/Icon'
import Display from './Display'

function SideNav() {
    const [display, setDisplay] = useState(false)
    const sidenavModal = useRef()
    const sidenav = useRef()

    const user = useSelector(state => state.user)
    const { userInfo } = user

    const handleClickOpen = () => {
        sidenav.current.style.width = "280px";
        sidenavModal.current.style.display = "block";
    }

    const handleClickClose = () => {
        sidenav.current.style.width = "0px";
        sidenavModal.current.style.display = "none";
    }

    const handleClick = (e) => {
        if (e.target === sidenavModal.current) {
            sidenav.current.style.width = "0";
            sidenavModal.current.style.display = "none";
        }
    }

    useEffect(() => {
        window.addEventListener("click", handleClick)

        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, [])

    return (
        <div className="sidenavContainer">
            <img src={userInfo.profilePhoto.url} alt="" className="border-round " width="30" height="30" onClick={handleClickOpen} />

            <div ref={sidenavModal} className="sidenavModal"></div>

            <div ref={sidenav} className="sidenav">
                <div className="flex-row p-10">
                    <span className="font-md font-700 flex-1">Account Info</span>
                    <span className="pointer" onClick={handleClickClose}><CloseIcon /></span>
                </div>
                <hr />
                <div className="ml-10 mt-10">
                    <img src={userInfo.profilePhoto.url} alt="" className="border-round" width="30" height="30" onClick={handleClickOpen} />
                    <span className="block font-700 ">{userInfo.name}</span>
                    <span className="block font-450 text-secondary font-xs mb-10">@{userInfo.username}</span>
                    <div className="ml-10 mt-20 mb-20 text-secondary">
                        <span><span className="font-600 text-dark">{userInfo?.following.length}</span> Following</span>
                        <span className="ml-10"><span className="font-600 text-dark">{userInfo?.followers.length}</span> Followers</span>
                    </div>

                </div>
                <Link to={`/profile/${userInfo.username}`} onClick={handleClickClose}>
                    <div className="flex items-center bgLightHover pt-10 pb-10 pl-10 mt-10">
                        <ProfileIcon className="fill-rootText svg-15" /> <span className="ml-10">Profile</span>
                    </div>
                </Link>

                <Link to={`/bookmark`} onClick={handleClickClose}>
                    <div className="flex items-center bgLightHover pt-10 pb-10 pl-10 mt-10">
                        <BookmarkIcon className="fill-rootText svg-15" /> <span className="ml-10">Bookmark</span>
                    </div>
                </Link>

                <Link to={`/connect`} onClick={handleClickClose}>
                    <div className="flex items-center bgLightHover pt-10 pb-10 pl-10 mt-10">
                        <AtIcon className="fill-rootText svg-15" /> <span className="ml-10">Connect</span>
                    </div>
                </Link>

                <div className="flex items-center bgLightHover pt-10 pb-10 pl-10 mt-10" onClick={() => { handleClickClose(); setDisplay(true) }}>
                    <DisplayIcon className="fill-rootText svg-15" /> <span className="ml-10">Display</span>
                </div>

                <Link to='/change-password' onClick={handleClickClose}>
                    <div className="bgLightHover pt-10 pb-10 pl-10 mt-10">
                        <span className="ml-10">Change password</span>
                    </div>
                </Link>

                <Link to='/logout'>
                    <div className="bgLightHover pt-10 pb-10 pl-10 mt-10">
                        <span className="ml-10">Logout</span>
                    </div>
                </Link>
            </div>

            {display && <Display handleClose={() => setDisplay(false)} />}


        </div>
    )
}

export default SideNav
