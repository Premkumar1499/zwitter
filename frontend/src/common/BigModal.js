import React, { useRef, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom'



function BigModal(props) {
    const modal = useRef()

    const handleClick = useCallback((e) => {
        if (e.target === modal.current) {
            props.onClose()
        }
    }, [props])

    useEffect(() => {
        window.addEventListener("click", handleClick)

        // cleanup this component
        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, [handleClick])

    return ReactDOM.createPortal(
        <div ref={modal} className="modalContainer">
            <div className="child">
                <div className="inner">
                    {props.children}
                </div>
            </div>

        </div>,
        document.getElementById('portal')
    )
}

export default BigModal
