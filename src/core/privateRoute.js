import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserStorage } from './constant';
import Layout from '../components/layout';

const PrivateRoute = ({ component: RouteComponent, title, ...rest }) => {
    {document.title = `BodyGym - Antrenör Paneli ${title ? ' - ' + title : ''}`}
    return (
        <Route
            {...rest}
            render={routeProps => {
                return (
                    !!UserStorage()?.token || false ? (
                        <Layout>
                            <RouteComponent {...routeProps} />
                        </Layout>
                    ) : (
                        <Redirect to="/" />
                    )
                )
            }}
        />

    )
}

export default PrivateRoute;