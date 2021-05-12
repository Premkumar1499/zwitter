import React from 'react'
import { Link } from 'react-router-dom'
import FollowAndFollowingButton from '../../common/FollowAndFollowingButton'


function Following({ followingUser }) {

    return (
        <div>
            <div className=" flex-row items-center pointer p-10 postHover followers" data-username={followingUser.username}>
                <img src={followingUser.profilePhoto.url} alt="" width="35" height="35" className="border-round" />
                <div className=" flex-1 ml-10">
                    <Link to={`/profile/${followingUser.username}`}>
                        <span className="block font-700 mt-10 ">{followingUser.name}</span>
                        <span className="block font-450 text-secondary font-xs ">@{followingUser.username}</span>
                        <span className="mt-5">{followingUser.bio}</span>
                    </Link>
                </div>
                <FollowAndFollowingButton username={followingUser.username} id={followingUser._id} />

            </div>
            <div className="border-bottom"></div>
        </div>
    )
}

export default Following
