import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function PublicRoute({ component: Component, isAuth, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => isAuth ? <Redirect to={{ pathname: '/home' }} /> : <Component {...props} />}
        />
    )
}

export default PublicRoute;