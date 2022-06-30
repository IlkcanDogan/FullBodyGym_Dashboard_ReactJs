import React from 'react';
import Helmet from 'react-helmet';

//components
import Sidebar from './sidebar';
import Topbar from './topbar';

function Layout({ children }) {
    return (
        <div id="wrapper">
            <Sidebar />

            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">

                    <Topbar />
                    <div className="container-fluid">
                        {children}
                    </div>
                </div>
            </div>
            <Helmet>
                <script src="https://fullbodygym.xyz/coach/js/global.min.js"></script>
            </Helmet>
        </div>
    )
}

export default Layout;