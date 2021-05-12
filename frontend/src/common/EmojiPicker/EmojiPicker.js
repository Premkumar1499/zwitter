import React from 'react'
import "emoji-mart/css/emoji-mart.css";
import './EmojiPicker.css'
import { Picker } from "emoji-mart";
import Popover from '@material-ui/core/Popover';


function EmojiPicker({ handleEmoji, targetElement, handleClose }) {

    const open = Boolean(targetElement);
    const id = open ? 'simple-popover' : undefined;

    return (
        <>

            <Popover
                id={id}
                open={open}
                anchorEl={targetElement}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                elevation={3}
            >
                <Picker
                    title="Pick your emoji…"
                    set="twitter"
                    onSelect={emoji => handleEmoji(emoji.native)}
                />


            </Popover>
        </>
    )
}

export default EmojiPicker
