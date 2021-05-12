import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import Alert from '../../common/Alert'
import { TwitterIcon } from '../../common/Icon'
import TextInput from '../../common/TextInput'
import getBrowserInfo from '../../common/getBrowserInfo'
import Spinner from '../../common/Spinner'

function Login({ history }) {
    const [account, setAccount] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [location, setLocation] = useState("Unknown location")
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        const getLocation = async () => {
            const { data } = await axios.get(`https://api.ipdata.co/?api-key=${process.env.REACT_APP_LOCATION_API}`)
            setLocation(`${data.city} ${data.region} ${data.country_name}`)
        }
        getLocation()
    }, [])



    const login = async () => {
        setLoading(true)
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/login`, {
                account,
                password,
                info: {
                    browser: getBrowserInfo(),
                    location
                }
            })
            localStorage.setItem("token", JSON.stringify(data.token))
            localStorage.setItem("theme", "0")
            localStorage.setItem("color", "0")
            dispatch({ type: "SET_TOKEN", payload: data.token })
            dispatch({ type: "USER_SUCCESS", payload: data.user })
            dispatch({ type: "USER_AUTH", payload: true })
            setLoading(false)
            history.push('/home')
        } catch (err) {
            setError(err.response?.data?.message)
            setLoading(false)
            console.log(err)
        }

    }

    return (
        <div className="login pl-15 pr-5">
            {error && <Alert message={error} errorTimeout={() => setError('')} />}
            <TwitterIcon className="svg-35 mt-15" />
            <span className="block font-700 font-2xl mt-20">Log in to Zwitter</span>
            <div className="mt-20">
                <TextInput placeholder="Phone, email or username" handleInput={(value) => setAccount(value)} value={account} />
            </div>
            <div className="mt-15">
                <TextInput type="password" placeholder="password" handleInput={(value) => setPassword(value)} value={password} />
            </div>
            <button className="fill-button w-90 mt-20 text-white" style={{ padding: "1.5rem 1.7rem" }} onClick={login}>Log in</button>
            <div className="mt-20">
                <Link to="/begin_password_reset">
                    <span className="hoverState">Forgot password?</span>
                </Link>
                <span className="text-primary" style={{ padding: " 0 .5rem" }}>·</span>
                <Link to="/signup">
                    <span className="hoverState">Sign up for Zwitter</span>
                </Link>
            </div>
            {loading && <Spinner />}
        </div>
    )
}

export default Login
