import React from 'react'
import { CloseIcon } from '../common/Icon'
import TopModal from '../common/TopModal'
import TweetContainer from '../common/TweetContainer'


function Tweet({ handleClose }) {

    return (
        <>
            <TopModal onClose={handleClose}>
                <div className="modalCloseButton">
                    <span className="pointer" onClick={handleClose}>
                        <CloseIcon />
                    </span>
                </div>

                <TweetContainer label="tweetImg" textareaMinHeight={4} placeholder="What's happening?" onSubmit={handleClose} />


            </TopModal>
        </>
    )
}

export default Tweet
