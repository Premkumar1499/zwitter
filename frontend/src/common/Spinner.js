import React from 'react'

function Spinner({ w = 25, h = 25 }) {
    const style = {
        width: `${w}px`,
        height: `${h}px`
    }
    return (
        <div className="spinner" style={style}>

        </div>
    )
}

export default Spinner
