import React, { useState } from 'react'
import { SearchIcon } from './Icon'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Spinner from './Spinner'
let timer;

function SearchComponent({ handleFocus, handleSearchData }) {
    const smallScreen = useMediaQuery('(max-width:500px)');
    const [searchPop, setSearchPop] = useState(false)
    const [searchData, setSearchData] = useState({ users: [], hashtags: [] })
    const [loading, setLoading] = useState(false)

    const auth = useSelector((state) => state.auth)
    const { config } = auth

    const handleChange = (e) => {
        const search = e.target.value
        clearTimeout(timer)
        timer = setTimeout(async () => {
            if (search.trim() !== "") {
                setLoading(true)
                const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/user/search?hashtag=true`, { search }, config)
                setLoading(false)
                console.log(data)
                smallScreen ? handleSearchData(data) : setSearchData(data)
            }
        }, 700)
    }

    const handleBlur = () => {
        setTimeout(() => {
            setSearchPop(false)
            setLoading(false)
        }, 200)
    }

    return (
        <div className="w-90">
            <div className="searchBar">
                <div><SearchIcon className="svg-20 fill-secondary" /></div>
                {smallScreen ?
                    <input type="text" placeholder="Search Twitter" onFocus={handleFocus} onChange={handleChange} />
                    :
                    <input type="text" placeholder="Search Twitter" onFocus={() => setSearchPop(true)} onBlur={handleBlur} onChange={handleChange} />
                }
            </div>

            {(!smallScreen && searchPop) &&
                <div className="w-100 pos-relative">
                    <div className="searchPop">
                        {loading ? <Spinner />
                            :
                            <>
                                {(searchData?.users?.length === 0 && searchData?.hashtags?.length === 0) ?
                                    <div className="text-center mt-15">
                                        <span className="block text-secondary" style={{ fontSize: '16px', fontWeight: '700' }}>Search twitter for users</span>
                                    </div> :
                                    <div>
                                        {searchData?.hashtags?.map(hashtag =>
                                            <div key={hashtag._id}>
                                                <Link to={`/hashtag/${hashtag.name.slice(1)}`} >
                                                    <div className="flex-row items-center pointer pl-10 pr-20 pb-10 postHover" >
                                                        <div className=" flex-1 ml-10">
                                                            <span className="block mt-10" style={{ fontSize: '15px', fontWeight: '700' }}>{hashtag.name}</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        )}
                                        {searchData?.users?.map(user =>
                                            <div key={user._id}>
                                                <Link to={`/profile/${user.username}`} >
                                                    <div className="flex-row items-center pointer pl-10 pr-20 pb-10 postHover" >
                                                        <img src={user.profilePhoto.url} alt="" width="35" height="35" className="border-round" />
                                                        <div className=" flex-1 ml-10">
                                                            <span className="block mt-10" style={{ fontSize: '15px', fontWeight: '700' }}>{user.name}</span>
                                                            <span className="block text-secondary font-xs mb-10" style={{ fontSize: '14px', fontWeight: '500' }}>@{user.username}</span>
                                                        </div>
                                                    </div>
                                                </Link>

                                            </div>
                                        )}
                                    </div>
                                }
                            </>}

                    </div>
                </div>}

        </div>
    )
}

export default SearchComponent
