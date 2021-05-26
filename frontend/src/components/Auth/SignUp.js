import React, { useState, useEffect } from 'react'
import { TwitterIcon, BackIcon } from '../../common/Icon'
import TextInput from '../../common/TextInput'
import { checkEmail, checkPhone, validateUsername } from '../../common/validation'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import FrontPage from './FrontPage'
import Modal from '../../common/Modal'
import { intlCode } from '../../utils/intlCallingCode'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import Spinner from '../../common/Spinner'
import Alert from '../../common/Alert'

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novermber', 'December']

function SignUp({ history }) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [swap, setSwap] = useState(true)
    const [dobMonth, setDobMonth] = useState('')
    const [dobYear, setDobYear] = useState('')
    const [dobDay, setDobDay] = useState('')
    const [date, setDate] = useState('')
    const [disable, setDisable] = useState(true)
    const [verificationCode, setVerificationCode] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [username, setUsername] = useState('')
    const [step, setStep] = useState(1)
    const [modal, setModal] = useState(false)
    const [option, setOption] = useState(false)
    const [intl, setIntl] = useState("")

    const [userId, setUserId] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)


    const year = new Date().getFullYear();
    const smallScreen = useMediaQuery("(max-width:565px)")

    const dispatch = useDispatch()

    useEffect(() => {
        const getInfo = async () => {
            try {
                // const { data } = await axios.get('https://www.cloudflare.com/cdn-cgi/trace')
                // setIntl(intlCode[data.split('\n')[8].split('=')[1] || 'IN'])
                const { data } = await axios.get(`https://api.ipdata.co/?api-key=${process.env.REACT_APP_LOCATION_API}`)
                setIntl(intlCode[data.country_code || 'IN'])

            } catch (e) {
                setIntl("91")
            }
        }
        getInfo()
        // fetch('https://www.cloudflare.com/cdn-cgi/trace')
        //     .then(res => res.json())
        //     .then(data => setIntl(intlCode[data.countryCode || 'IN']))
        //     .catch(e => setIntl("91"))
    }, [])


    useEffect(() => {
        if (name.trim() && ((email.trim() && checkEmail(email)) || (phone.trim() && checkPhone(phone))) && date)
            setDisable(false)
        else
            setDisable(true)
    }, [email, phone, name, date])

    const checkVerificationCode = (verificationCode) => { verificationCode.length === 6 ? setDisable(false) : setDisable(true) }
    const checkPassword = (password) => { password.length >= 8 ? setDisable(false) : setDisable(true) }
    const checkUsername = (username) => { (username.trim().length > 4 && validateUsername(username)) ? setDisable(false) : setDisable(true) }

    useEffect(() => {
        checkVerificationCode(verificationCode)
    }, [verificationCode])

    useEffect(() => {
        checkPassword(password)
    }, [password])

    useEffect(() => {
        checkUsername(username)
    }, [username])

    useEffect(() => {
        if (dobYear && dobDay && dobMonth)
            setDate(`${dobYear}-${dobMonth}-${dobDay}`) // d = yyyy-mm-dd
    }, [dobMonth, dobDay, dobYear])

    const dob = (d) => {
        // d = yyyy-mm-dd
        const dobDate = d.split('-')

        return `${month[+dobDate[1]].slice(0, 3)} ${dobDate[2]}, ${dobDate[0]}`
    }

    const register = async () => {
        const account = swap ? "email" : "phone"
        // const accountValue = email || `+${intl}${phone.match(/\d+/g).join('')}`
        const accountValue = email || { intl, phoneNo: phone.match(/\d+/g).join('') }


        setLoading(true)
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/register`, {
                name,
                [account]: accountValue,
                dob: date,
                username
            })
            console.log(data);
            setLoading(false)
            setStep(4)
        } catch (err) {
            setLoading(false)
            setError(err.response.data.message)
            console.log(err.response)
        }
    }

    const resendToken = async () => {
        const account = swap ? "email" : "phone"
        const accountValue = email || phone.match(/\d+/g).join('')
        try {
            await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/resend-register-token`, {
                [account]: accountValue
            })
        } catch (err) {
            console.log(err.response)
        }
    }

    const otpVerification = async () => {
        const account = swap ? "email" : "phone"
        const accountValue = email || phone.match(/\d+/g).join('')
        setLoading(true)
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/register-verify`, {
                [account]: accountValue,
                otp: verificationCode
            })
            setUserId(data.id)
            setLoading(false)
            setDisable(true)
            setStep(5)
        } catch (err) {
            setLoading(false)
            setError(err.response.data.message)
            console.log(err.response)
        }
    }

    const postPassword = async () => {

        setLoading(true)
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/setpassword`, {
                id: userId,
                password
            })
            setLoading(false)
            localStorage.setItem("token", JSON.stringify(data.token))
            localStorage.setItem("theme", "0")
            localStorage.setItem("color", "0")
            dispatch({ type: "SET_TOKEN", payload: data.token })
            dispatch({ type: "USER_SUCCESS", payload: data.user })
            dispatch({ type: "USER_AUTH", payload: true })
            history.push('/home')
        } catch (err) {
            setLoading(false)
            setError(err.response.data.message)
        }
    }



    return (
        <>
            <FrontPage />
            <div className="modalContainer">
                <div className="child">
                    {error && <Alert message={error} errorTimeout={() => setError('')} />}

                    {loading ? <Spinner /> :

                        <div className="w-90 m-auto">

                            {step === 1 && <>
                                <div className="flex-row justify-between items-center mt-10">
                                    <div></div>
                                    <TwitterIcon className="svg-35" />
                                    <button className={`fill-button text-white ${disable && 'opac-5'}`} disabled={disable} onClick={() => { setStep(2); checkUsername(username) }}>Next</button>
                                </div>
                                <div className=" mt-20 ">
                                    <span className="font-700 font-xl block mb-20">Create your account</span>
                                    <div className="mb-20">
                                        <TextInput placeholder="Name" handleInput={(value) => setName(value)} value={name} />
                                    </div>

                                    {swap ?
                                        <div className="mb-20">
                                            <TextInput placeholder="Email" handleInput={(value) => setEmail(value)} value={email} error={!checkEmail(email)} />
                                            {!checkEmail(email) && <small className="text-error">Please enter a valid email</small>}
                                        </div>
                                        :
                                        <div className="mb-20">
                                            <TextInput type="tel" placeholder="Phone" handleInput={(value) => setPhone(value)} value={phone} error={!checkPhone(phone)} />
                                            {!checkPhone(phone) && <small className="text-error">Please enter a valid phone number</small>}
                                        </div>
                                    }


                                    <span className="hoverState pt-15 pb-10 inline-block" onClick={() => { setSwap(swap => !swap); setEmail(''); setPhone('') }}>{swap ? "Use phone instead" : "Use email instead"}</span>
                                    <span className="font-700 font-md mt-20 block">Date of birth</span>
                                    <span className="text-secondary font-450 block pr-20 mr-20">This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or something else.</span>
                                    {smallScreen ?
                                        <div className="mb-20 mt-20">
                                            <TextInput type="date" placeholder="Birth date" handleInput={(value) => setDate(value)} value={date} />
                                        </div> :

                                        <div className="dob mt-20">

                                            <div className="pos-relative inline-block mr-20">
                                                <span>Month</span>
                                                <select value={dobMonth} className="dob-select font-xs" onChange={(e) => setDobMonth(e.target.value)}>
                                                    <option> </option>
                                                    {
                                                        Array.from({ length: 12 }, (_, i) => (
                                                            <option value={i} key={i}>{month[i]}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>

                                            <div className="pos-relative inline-block mr-20" >
                                                <span>Day</span>

                                                <select value={dobDay} className="dob-select" onChange={(e) => setDobDay(e.target.value)}>
                                                    <option>  </option>
                                                    {
                                                        Array.from({ length: 31 }, (_, i) => (
                                                            <option value={i + 1} key={i}>{i + 1}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>



                                            <div className="pos-relative inline-block">
                                                <span>Year</span>
                                                <select value={dobYear} className="dob-select" onChange={(e) => setDobYear(e.target.value)}>
                                                    <option> </option>
                                                    {
                                                        Array.from({ length: 150 }, (_, i) => (
                                                            <option value={year - i} key={i}>{year - i}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>

                                        </div>
                                    }
                                </div>
                            </>
                            }
                            {step === 2 && <>
                                <div className="flex-row justify-between items-center mt-10">
                                    <BackIcon className="pointer" handleClick={() => { setStep(1); setDisable(false) }} />
                                    <TwitterIcon className="svg-35" />
                                    <button className={`fill-button text-white ${disable && 'opac-5'}`} disabled={disable} onClick={() => { setStep(3); setDisable(true) }}>Next</button>
                                </div>
                                <span className="block font-700 font-lg mt-20">You'll need a username</span>
                                <span className="block font-450 text-secondary mt-15 mb-20">Your username can contain only letters, numbers, and underscores—no spaces are allowed.</span>
                                <TextInput type='text' placeholder="username" handleInput={(value) => setUsername(value)} value={username} error={!validateUsername(username)} />
                                {!validateUsername(username) && <small className="text-error">Please enter a valid user number</small>}

                            </>}
                            {step === 3 &&
                                <>
                                    <div className=" mt-10  flex items-center">
                                        <BackIcon className="pointer" handleClick={() => { setStep(2); setDisable(false) }} />
                                        <span className="font-800 font-xl ml-20">Step 3 of 5</span>
                                    </div>

                                    <div className=" mt-20">
                                        <span className="font-700 font-xl block mb-20 ">Create your account</span>

                                        <div className="mb-20  pt-20">
                                            <TextInput placeholder="Name" value={name} handleClick={() => setStep(1)} />
                                        </div>
                                        <div className="mb-20 ">
                                            <TextInput placeholder="Username" value={username} handleClick={() => setStep(2)} />
                                        </div>
                                        {swap ?
                                            <div className="mb-20 ">
                                                <TextInput placeholder="Email" value={email} handleClick={() => setStep(1)} />
                                            </div> :
                                            <div className="mb-20 ">
                                                <TextInput placeholder="Phone" value={phone} handleClick={() => setStep(1)} />
                                            </div>
                                        }
                                        <div className="mb-20 ">
                                            <TextInput placeholder="Birth date" value={dob(date)} handleClick={() => setStep(1)} />
                                        </div>
                                        {/* {!smallScreen && <span className="text-secondary font-450 font-2sm  block mr-20 pr-20"> By signing up, you agree to the Terms of Service and Privacy Policy. Others will be able to find you by email or phone number when provided. </span>} */}
                                    </div>
                                    <button className="fill-button w-90 mt-20 text-white" onClick={() => { !swap ? setModal(true) : register() }}>Sign up</button>
                                </>

                            }
                            {step === 4 &&
                                <>
                                    <div className="flex-row justify-between items-center mt-10">
                                        <BackIcon className="pointer" handleClick={() => setStep(3)} />
                                        <TwitterIcon className="svg-35" />
                                        <button className={`fill-button text-white ${disable && 'opac-5'} mr-10`} disabled={disable} onClick={() => { otpVerification() }}>Next</button>
                                    </div>
                                    <div className=" mt-20 ">
                                        <span className="font-700 font-xl block mb-20">We sent you a code</span>
                                        <span className="text-secondary font-450 block mb-20">Enter it below to verify {email || phone}</span>
                                        <div>
                                            <TextInput placeholder="Verification code" handleInput={(value) => setVerificationCode(value)} value={verificationCode} />
                                        </div>
                                        <small className="text-primary hoverState" onClick={() => setOption(true)}>Didn't recieve {swap ? "EMAIL" : "SMS"}?</small>
                                    </div>
                                    {option &&
                                        <div className="transparentModal" onClick={() => setOption(false)}>
                                            <div className="options">
                                                <span className="block">Didn't recieve {swap ? "EMAIL" : "SMS"}?</span>
                                                <span className="block bgLightHover pointer pr-10 pl-10 pt-15 pb-15" onClick={() => resendToken()}>Resend {swap ? "EMAIL" : "SMS"}</span>
                                                <span className="block bgLightHover pointer pr-10 pl-10 pt-15 pb-15" onClick={() => { setSwap(!swap); setStep(1); setEmail(''); setPhone('') }}>Use {swap ? "phone" : "email"} instead</span>
                                            </div>
                                        </div>
                                    }
                                </>}
                            {step === 5 && <>
                                <div className="flex-row justify-between items-center mt-10">
                                    <div></div>
                                    <TwitterIcon className="svg-35" />
                                    <button className={`fill-button text-white ${disable && 'opac-5'}`} disabled={disable} onClick={() => { postPassword() }}>Next</button>
                                </div>
                                <span className="block font-700 font-lg mt-20">You'll need a password</span>
                                <span className="block font-450 text-secondary mt-15 mb-20">Make sure its 8 characters or more.</span>
                                <TextInput type={showPassword ? 'text' : 'password'} placeholder="password" handleInput={(value) => setPassword(value)} value={password} />
                                <small className="text-primary hoverState" onClick={() => setShowPassword(s => !s)}>{showPassword ? 'Hide password' : 'Reveal password'}</small>

                            </>}

                        </div>}
                </div >
            </div>
            {modal && <Modal onClose={() => setModal(false)}>
                <div className="ml-10 mr-10 mt-20 mb-20 text-center" style={{ width: "280px" }}>
                    <span className="font-700 font-xl block">Verify Phone</span>
                    <span className="block font-450 mb-15 text-secondary mt-15">We'll text your verification code to {phone}.</span>
                    <button style={{ padding: "10px 45px" }} className="fill-button bg-light text-dark mr-15" onClick={() => { setStep(1); setModal(false) }}>Edit</button>
                    <button style={{ padding: "10px 45px" }} className="fill-button" onClick={() => { setModal(false); register() }}>Ok</button>
                </div>
            </Modal>
            }

        </>
    )
}

export default SignUp
