import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import FollowAndFollowingButton from '../../common/FollowAndFollowingButton'
import { VipIcon } from '../../common/Icon'

function Followers({ follower }) {

    return (
        <div>

            <div className=" flex-row items-center pointer p-10 postHover followers">
                <img src={follower.profilePhoto.url} alt="" width="35" height="35" className="border-round" />

                <div className=" flex-1 ml-10">
                    <Link to={`/profile/${follower.username}`}>
                        <span className="flex-row items-center">
                            <span className="block font-700 mt-10 ">{follower.name}</span>
                            <span style={{ margin: "4px 0 0 2px" }}>{follower.role === "admin" && <VipIcon className="svg-15" />}</span>
                        </span>
                        <span className="block font-450 text-secondary font-xs ">@{follower.username}</span>
                        <span className="mt-5">{follower.bio}</span>
                    </Link>
                </div>

                <FollowAndFollowingButton username={follower.username} id={follower._id} />
            </div>

            <div className="border-bottom"></div>

        </div>
    )
}

export default Followers
