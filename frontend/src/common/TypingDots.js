import React from 'react'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    dotsContainer: {
        margin: "20px"
    },
    dot: {
        display: 'inline-block',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        marginRight: '3px',
        backgroundColor: 'var(--secondaryColor)',
        animation: '$wave 1.3s linear infinite',
        '&:nth-child(2)': {
            animationDelay: '-1.1s'
        },
        '&:nth-child(3)': {
            animationDelay: '-0.9s'
        },
    },
    '@keyframes wave': {
        '0%, 60%, 100%': {
            transform: 'initial'
        },

        '30%': {
            transform: 'translateY(-8px)'
        }
    }
})

function TypingDots() {
    const classes = useStyles()

    return (
        <div className={classes.dotsContainer}>
            <span className={classes.dot}></span>
            <span className={classes.dot}></span>
            <span className={classes.dot}></span>
        </div>
    )
}

export default TypingDots
