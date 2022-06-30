import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserStorage } from './constant';

const PublicRoute = ({ component: Component, title, restricted, ...rest }) => {
    const token = UserStorage()?.token || false;

    document.title = `BodyGym ${title ? ' - ' + title : ''}`;
    return (
        <Route {...rest} render={props => (
            !!token && restricted ?
                <Redirect to="/students" />
                : <Component {...props} />
        )} />
    );
};

export default PublicRoute;