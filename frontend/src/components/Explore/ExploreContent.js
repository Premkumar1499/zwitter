import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '../../common/Spinner'


const Html = ({ news }) => {
    return (
        <a href={news.url} target="_blank" >
            <div className="flex-row items-center p-10 postHover pointer border-bottom">
                <div className="flex-1 mr-20">
                    <span className=" block text-secondary font-sm">{news.source.name}</span>
                    <h4 className="mt-5">{news.title}</h4>
                </div>
                <img src={news.urlToImage} alt="" style={{ borderRadius: '5px' }} width="80" height="80" />
            </div>
        </a>
    )
}

function ExploreContent() {
    const [value, setValue] = useState(0)

    const dispatch = useDispatch()

    const auth = useSelector((state) => state.auth)
    const { config } = auth

    const exploreList = useSelector(state => state.exploreList)
    const { loading, sports, health, business, science } = exploreList

    const getSportsNews = async () => {
        if (sports.length === 0) {
            dispatch({ type: "EXPLORE_LIST_LOADING", payload: true })
            const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/explore/sports`, config)
            dispatch({ type: "SPORTS", payload: data.articles })
            dispatch({ type: "EXPLORE_LIST_LOADING", payload: false })
        }
    }

    const getHealthNews = async () => {
        if (health.length === 0) {
            dispatch({ type: "EXPLORE_LIST_LOADING", payload: true })
            const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/explore/health`, config)
            dispatch({ type: "HEALTH", payload: data.articles })
            dispatch({ type: "EXPLORE_LIST_LOADING", payload: false })
        }
    }

    const getBusinessNews = async () => {
        if (business.length === 0) {
            dispatch({ type: "EXPLORE_LIST_LOADING", payload: true })
            const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/explore/business`, config)
            dispatch({ type: "BUSINESS", payload: data.articles })
            dispatch({ type: "EXPLORE_LIST_LOADING", payload: false })
        }
    }

    const getScienceNews = async () => {
        if (science.length === 0) {
            dispatch({ type: "EXPLORE_LIST_LOADING", payload: true })
            const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/explore/science`, config)
            dispatch({ type: "SCIENCE", payload: data.articles })
            dispatch({ type: "EXPLORE_LIST_LOADING", payload: false })
        }
    }

    useEffect(() => {
        getSportsNews()
    }, [])

    return (
        <>
            <div className="profile__tabs">
                <button className={`tab ${value === 0 && 'activeTab'}`} onClick={() => { setValue(0); getSportsNews() }} > Sports </button>
                <button className={`tab ${value === 1 && 'activeTab'}`} onClick={() => { setValue(1); getHealthNews() }} > Health </button>
                <button className={`tab ${value === 2 && 'activeTab'}`} onClick={() => { setValue(2); getBusinessNews() }} > Business</button>
                <button className={`tab ${value === 3 && 'activeTab'}`} onClick={() => { setValue(3); getScienceNews() }} > Science</button>
            </div>

            {loading ? <Spinner /> : <>
                {value === 0 && <> {sports?.map(news =>
                    news.url && news.urlToImage && <Html news={news} key={news.title} />
                )}
                </>}

                {value === 1 && <> {health?.map(news =>
                    news.url && news.urlToImage && <Html news={news} key={news.title} />
                )}
                </>}

                {value === 2 && <> {business?.map(news =>
                    news.url && news.urlToImage && <Html news={news} key={news.title} />
                )}
                </>}

                {value === 3 && <> {science?.map(news =>
                    news.url && news.urlToImage && <Html news={news} key={news.title} />
                )}
                </>}
            </>}

        </>
    )
}

export default ExploreContent
