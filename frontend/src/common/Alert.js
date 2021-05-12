import React, { useEffect } from 'react'

let t;
function Alert({ message = '', errorTimeout }) {

    useEffect(() => {
        clearTimeout(t)
        t = setTimeout(() => {
            errorTimeout()
        }, 4000)
    }, [errorTimeout])

    return (
        <div className="alert">
            <span className="block">
                {message}
            </span>
        </div>
    )
}

export default Alert
