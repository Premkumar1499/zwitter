import React, { useRef, useEffect } from 'react'

function OptionModal(props) {
    const optionModal = useRef()

    const handleClick = (e) => {
        if (e.target === optionModal.current) {
            props.onClose()
        }
    }

    useEffect(() => {
        window.addEventListener("click", handleClick)

        // cleanup this component
        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, [])

    return (
        <div ref={optionModal} className="optionModal">
            {props.children}
        </div>
    )
}

export default OptionModal
