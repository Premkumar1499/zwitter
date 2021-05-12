import React from 'react'
import { Link } from 'react-router-dom'
import { ExploreIcon, PeopleIcon, JoinIcon, TwitterIcon } from '../../common/Icon'

function FrontPage() {

    return (
        <div className="frontPage">
            <div className="frontPage__left text-white font-xl font-700">
                <div className="frontPage_left--svg">
                    <TwitterIcon className="svg-100" />
                </div>

                <div className="frontPage__left--content z-1">
                    <div className="flex-row items-center">
                        <ExploreIcon className="svg-35 fill-white" />
                        <span className="ml-10">Follow your interest.</span>
                    </div>

                    <div className="flex-row items-center mt-40">
                        <PeopleIcon className="svg-35 fill-white" />
                        <span className="ml-10">Hear what people are talking about.</span>
                    </div>

                    <div className="flex-row items-center mt-40">
                        <JoinIcon className="svg-35 fill-white" />

                        <span className="ml-10">Join the conversation.</span>
                    </div>
                </div>
            </div>

            <div className="frontPage__right">
                <div className="frontPage__right--content">
                    <TwitterIcon className="svg-50" />

                    <span className="font-2xl font-700  mt-40 pb-10 block ">See what's hapenning in the world right now</span>
                    <span className="mb-20 mt-40 pt-20 font-700 font-md block">Join Zwitter today.</span>
                    <Link to="signup">
                        <button type="button" className="fill-button block w-100 text-white" style={{ padding: "15px 20px" }}>
                            Sign Up
                        </button>
                    </Link>
                    <Link to="login">
                        <button type="button" className="outline-button mt-15 mb-15 block w-100" style={{ padding: "15px 20px" }}>
                            Log in
                        </button>
                    </Link>
                </div>
            </div>

        </div>
    )
}

export default FrontPage
