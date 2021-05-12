import React from 'react'

const TextInput = ({ type = "text", className = '', placeholder, maxLength = "", handleInput, value, error = "", handleClick }) => {


    return (
        <div className={`textInput ${className} `}>
            <input className={`${error && 'input-error'}`} type={type} value={value} maxLength={maxLength} onChange={(e) => handleInput(e.target.value)} onClick={handleClick} />
            {maxLength && <span className="textInput__length  ">{value.length}/{maxLength}</span>}
            <span className={`textInput__placeholder ${error && 'text-error'} ${value.length && 'textInput__placeholder--focus'}`}>{placeholder}</span>
        </div>
    )
}

export default TextInput
