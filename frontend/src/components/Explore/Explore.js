import React, { useState, Suspense } from 'react'
import { BackIcon } from '../../common/Icon'
import SearchComponent from '../../common/SearchComponent'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Link } from 'react-router-dom'
import Spinner from '../../common/Spinner'

const ExploreContent = React.lazy(() => import('./ExploreContent'));


function Explore() {
    const smallScreen = useMediaQuery('(max-width:500px)');
    const [searchPop, setSearchPop] = useState(false)
    // const [searchData, setSearchData] = useState([])
    const [searchData, setSearchData] = useState({ users: [], hashtags: [] })


    return (
        <>
            {(smallScreen && searchPop) && <div className="searchBack" onClick={() => setSearchPop(false)}><BackIcon /></div>}

            <div className="main__header" style={{ borderBottom: 'none', padding: '0' }}>
                <span>
                    {smallScreen ? <SearchComponent
                        handleFocus={() => setSearchPop(true)}
                        // handleSearchData={(users) => setSearchData(users)} />
                        handleSearchData={(data) => setSearchData({ hashtags: data.hashtags, users: data.users })} />
                        :
                        <SearchComponent />
                    }
                </span>
            </div>

            {(smallScreen && searchPop) ?
                <div>
                    {(searchData?.users?.length === 0 && searchData?.hashtags?.length === 0) ?
                        <div className="text-center mt-15">
                            <span className="block text-secondary">Search twitter for users</span>
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
                            {searchData?.users.map(user =>
                                <div key={user._id}>
                                    <Link to={`/profile/${user.username}`}  >
                                        <div className="flex-row items-center pointer pl-10 pr-20 ">
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
                </div>
                :
                <Suspense fallback={<div><Spinner /></div>}>
                    <ExploreContent />
                </Suspense>
            }
        </>
    )
}

export default Explore
