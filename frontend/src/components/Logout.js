import React, { useRef, useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { TwitterIcon } from '../common/Icon'

function Logout({ history }) {
    const modal = useRef()

    const dispatch = useDispatch()
    const auth = useSelector((state) => state.auth)
    const { config } = auth

    const handleClick = (e) => {
        if (e.target === modal.current) {
            history.goBack()
        }
    }

    useEffect(() => {
        window.addEventListener("click", handleClick)

        // cleanup this component
        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, [])

    const handleLogout = async () => {
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/logout`, {
                token: JSON.parse(localStorage.getItem('token'))
            }, config)
            localStorage.clear()
            dispatch({ type: "USER_AUTH", payload: false })
        } catch (err) {
            console.log(err)
        }
    }

    return (
        // <div ref={modal} className="modalContainer" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
        <div ref={modal} className="modalContainer">
            <div className="modal">
                <div className="ml-10 mr-10 mt-20 mb-20 text-center" style={{ maxWidth: "280px" }}>
                    <TwitterIcon />
                    <span className="font-700 font-md mt-10 block">Logout of Zwitter?</span>
                    <span className="block font-450 mb-15 text-secondary mt-15">You can always log back in at any time. If you just want to switch accounts, you can do that by adding an existing account. </span>
                    <div className="flex justify-between">
                        <button style={{ padding: "10px 35px" }} className="fill-button bg-light mr-15" onClick={() => { history.goBack() }}>Cancel</button>
                        <button style={{ padding: "10px 35px" }} className="fill-button" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default Logout
