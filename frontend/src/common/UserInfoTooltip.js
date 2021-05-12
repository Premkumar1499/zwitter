import React from "react";
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
    tooltip: {
        fontSize: "1.1rem",
        marginTop: '6px',
        backgroundColor: 'var(--rootBgColor)',
        color: 'var(--rootTextColor)',
        borderRadius: '5px',
        boxShadow: '0 0 2px rgba(0, 0, 0, 0.1)',
        padding: '10px',
        width: '250px'
    }
})
const UserInfoTooltip = (props) => {
    const classes = useStyles()

    return (
        <Tooltip title={props.title}
            classes={{ tooltip: classes.tooltip }}
            delay={150}
            interactive={true}
        >
            {props.children}
        </Tooltip>
    );
};

export default UserInfoTooltip;
