import React, { useState, useEffect } from 'react'
import axios from 'axios'
import BigModal from './BigModal'
import { CloseIcon, SearchIcon } from './Icon'

function Gif({ handleClose, handleGif }) {
    const [gifs, setGifs] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        const getData = async () => {
            const { data } = await axios.get('https://api.giphy.com/v1/gifs/trending', {
                params: {
                    api_key: process.env.REACT_APP_GIF_API
                }
            })
            setGifs(data.data)
        }
        getData()
    }, [])

    const handleClick = async () => {
        const { data } = await axios.get('https://api.giphy.com/v1/gifs/search', {
            params: {
                api_key: process.env.REACT_APP_GIF_API,
                q: search
            }
        })
        setGifs(data.data)
    }

    return (
        <BigModal onClose={handleClose}>
            <div className="modalCloseButton ">
                <div className="flex-row items-center">
                    <span className="pointer" onClick={handleClose}>
                        <CloseIcon />
                    </span>
                    <span className="font-800 font-md ml-20 flex-1">
                        <div className="searchBar">
                            <div><SearchIcon className="svg-20 fill-secondary" /></div>
                            <input type="text" onChange={(e) => setSearch(e.target.value)} />
                        </div>
                    </span>
                    <button className="fill-button text-white ml-10" onClick={handleClick}>Search</button>
                </div>
            </div>

            <div id="photos">
                {gifs.map(g => <div key={g.id}>
                    <img src={g.images.fixed_height.url} alt="" onClick={() => handleGif({ id: g.id, url: g.images.fixed_height.url })} />
                </div>
                )}
            </div>
        </BigModal>
    )
}

export default Gif
