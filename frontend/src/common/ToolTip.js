import React from "react";
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
    tooltip: {
        fontSize: "1.1rem",
        marginTop: '6px'
    }
})
const ToolTip = (props) => {
    const classes = useStyles()

    return (
        <Tooltip title={props.title} placement="bottom" classes={{ tooltip: classes.tooltip }}>
            {props.children}
        </Tooltip>
    );
};

export default ToolTip;
