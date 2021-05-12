import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { CameraIcon } from '../../common/Icon'
import BigModal from '../../common/BigModal'
import { CloseIcon } from '../../common/Icon'
import TextInput from '../../common/TextInput'
import CoverPhoto from './CoverPhoto'
import ProfilePhoto from './ProfilePhoto'
import { USER_SUCCESS } from '../../constants/userConstants'
import { LinearProgress } from '@material-ui/core'
import { getDate } from '../../common/timeAndDate'


function EditProfile({ handleClose }) {
    const [coverPhoto, setCoverPhoto] = useState('')
    const [coverPhotoModal, setCoverPhotoModal] = useState(false)
    const [profilePhoto, setProfilePhoto] = useState('')
    const [profilePhotoModal, setProfilePhotoModal] = useState(false)
    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const [location, setLocation] = useState('')
    const [website, setWebsite] = useState('')
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()

    const user = useSelector((state) => state.user)
    const { userInfo } = user

    const auth = useSelector((state) => state.auth)
    const { config } = auth

    useEffect(() => {
        setName(userInfo.name)
        setBio(userInfo.bio)
        setLocation(userInfo.location)
        setWebsite(userInfo.website)
    }, [userInfo])

    const handleCoverPhoto = (e) => {
        if (e.target.files[0]) {
            setCoverPhoto(URL.createObjectURL(e.target.files[0]))
            setCoverPhotoModal(true)
        } else {
            setCoverPhoto('')
            setCoverPhotoModal(false)
        }
    }

    const handleProfilePhoto = (e) => {
        if (e.target.files[0]) {
            setProfilePhoto(URL.createObjectURL(e.target.files[0]))
            setProfilePhotoModal(true)
        } else {
            setProfilePhoto('')
            setProfilePhotoModal(false)
        }
    }

    const handleEdit = async () => {
        if (name.trim() === '')
            console.log('error')
        else {
            setLoading(true)
            try {
                const { data } = await axios.put(`${process.env.REACT_APP_SERVER_URL}/user/${userInfo.username}/edit`, {
                    name, bio, location, website
                }, config)
                dispatch({ type: USER_SUCCESS, payload: data.user })
                setLoading(false)
                handleClose()
            } catch (err) {
                setLoading(false)
                console.log(err)
            }
        }
    }


    return (
        <>
            <BigModal onClose={handleClose}>
                {loading && <LinearProgress />}
                <div className="modalCloseButton ">
                    <div className="flex-row items-center">
                        <span className="pointer" onClick={handleClose}>
                            <CloseIcon />
                        </span>
                        <span className="font-800 font-md ml-20 flex-1">Edit Profile</span>
                        <button className="fill-button text-white" onClick={handleEdit}>Save</button>
                    </div>
                </div>

                <div className="coverPhoto">
                    <span className="center bgHover border-round p-7 pointer" >
                        <label htmlFor="coverPhoto">
                            <CameraIcon className="fill-white" />
                        </label>
                        <input type="file" id="coverPhoto" accept="image/*" className="none" onChange={handleCoverPhoto} />
                    </span>
                    {userInfo.coverPhoto?.url &&
                        <img src={userInfo.coverPhoto.url} alt="" className="w-100 h-100" />
                    }

                    <div className="profilePhoto">
                        <span className="center bgHover border-round p-7 pointer" >
                            <label htmlFor="profilePhoto">
                                <CameraIcon className="fill-white" />
                            </label>
                            <input type="file" id="profilePhoto" accept="image/*" className="none" onChange={handleProfilePhoto} />
                        </span>
                        {userInfo.profilePhoto?.url &&
                            <img src={userInfo.profilePhoto?.url} alt="" className="w-100 h-100 border-round" />
                        }
                    </div>
                </div>

                <div className="mt-40 pt-20"></div>

                <TextInput className="m-auto" placeholder="Name" maxLength="50" handleInput={(value) => setName(value)} value={name} />

                <div className="mt-20 pt-10">
                    <TextInput className="m-auto" placeholder="Bio" maxLength="100" handleInput={(value) => setBio(value)} value={bio} />
                </div>

                <div className="mt-20 pt-10">
                    <TextInput className="m-auto" placeholder="Location" maxLength="30" handleInput={(value) => setLocation(value)} value={location} />
                </div>

                <div className="mt-20 pt-10 mb-20">
                    <TextInput className="m-auto" placeholder="Website" maxLength="100" handleInput={(value) => setWebsite(value)} value={website} />
                </div>

                <div className="mt-20 pt-10 mb-20 ml-20">
                    <p className="text-secondary">Birth date</p>
                    <p className="font-md">{getDate(new Date(userInfo.dob))}</p>
                </div>

            </BigModal>
            {coverPhotoModal && <CoverPhoto coverPhoto={coverPhoto} username={userInfo.username} handleClose={() => setCoverPhotoModal(false)} />}
            {profilePhotoModal && <ProfilePhoto profilePhoto={profilePhoto} username={userInfo.username} handleClose={() => setProfilePhotoModal(false)} />}

        </>
    )
}

export default EditProfile
