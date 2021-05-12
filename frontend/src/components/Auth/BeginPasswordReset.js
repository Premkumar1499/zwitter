import axios from 'axios'
import React, { useState } from 'react'
import Alert from '../../common/Alert'
import { TwitterIcon } from '../../common/Icon'
import Spinner from '../../common/Spinner'


function BeginPasswordReset({ history }) {
    const [account, setAccount] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const sendOtp = async () => {
        setLoading(true)
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/password-token`, {
                account
            })
            setLoading(false)
            history.push({
                pathname: '/confirm_pin_reset',
                state: { id: data.id, email: data.email, phone: data.phone }
            })
        } catch (err) {
            setLoading(false)
            setError(err?.response?.data.message)
        }

    }

    return (
        <>
            {error && <Alert message={error} errorTimeout={() => setError('')} />}
            <nav className="flex-row justify-center items-center pt-10 pb-10">
                <TwitterIcon />
                <span className="text-secondary ml-10 font-md">Password Reset</span>
            </nav>
            <hr className="text-secondary mb-20" />
            {loading ? <Spinner /> :
                <div className="beginPasswordReset pl-15 pr-15">
                    <span className="font-700 font-xl">Find your Zwitter account</span>
                    <span className="text-secondary font-sm block mt-20">Enter your email, phone or username.</span>
                    <input type="text" className="w-90" value={account} onChange={(e) => setAccount(e.target.value)} />
                    <button className="fill-button mt-20 block text-white" onClick={sendOtp}>Search</button>
                </div>
            }
        </>
    )
}

export default BeginPasswordReset

