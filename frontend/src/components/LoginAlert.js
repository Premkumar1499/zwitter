import React from 'react'
import BigModal from '../common/BigModal'
import { Link } from 'react-router-dom'
import { getTime, getDate } from '../common/timeAndDate'
import { TwitterIcon } from '../common/Icon'

function LoginAlert({ handleClose, loginInfo, loginTime }) {
    return (
        <div>
            <BigModal onClose={handleClose}>
                <div className="w-90 m-auto">
                    <div className="text-center pt-20">
                        <TwitterIcon className="svg-35" />
                    </div>
                    <span className="font-700 font-2xl block text-center mt-40">
                        New login alert
                    </span>
                    <div className="text-secondary  font-600 p-20">
                        <span className="block">
                            There was a login to your account from a new device
                        </span>

                        <p className="mt-15">
                            New login
                        </p>

                        <p>
                            Device: {loginInfo.browser}
                        </p>

                        <p>
                            Location*: {loginInfo.location}
                        </p>

                        <p>
                            When: {getDate(new Date(loginTime))} at {getTime(new Date(loginTime))}
                        </p>

                        <p className="mt-20">
                            *Location is approximately based on the login's IP address
                        </p>

                        <ul className="mt-20">
                            <p>If this was you</p>
                            <li>You can ignore this message. There's no nedd to take any action</li>
                        </ul>

                        <ul className="mt-20">
                            <p>If this wasn't you</p>
                            <li>
                                <Link to="/change-password">
                                    <span className="text-primary">Change your password </span>
                                </Link>
                                 now to protect your account.</li>
                        </ul>

                        <p>You'll be logged out of all your active Twitter sessions except the one you're using at the time.</p>
                        <button className="fill-button w-90 text-white mt-20" onClick={handleClose}>Got it</button>
                    </div>
                </div>
            </BigModal>
        </div>
    )
}

export default LoginAlert
