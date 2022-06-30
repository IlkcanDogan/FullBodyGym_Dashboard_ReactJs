import React from 'react';
import { useHistory } from 'react-router-dom';
import { UserStorage } from '../core/constant';

function Topbar() {
    let pageTitle = document.title.split('-')[2];

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = './coach';
    }

    return (
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-2">
                <i className="fa fa-bars"></i>
            </button>

            <h1 className="h5 mb-0 text-gray-800">{pageTitle}</h1>

            <ul className="navbar-nav ml-auto">

                <li className="nav-item dropdown no-arrow">
                    <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                        <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                            {UserStorage().profile.firstname + ' ' + UserStorage().profile.lastname}
                        </span>
                        <img className="img-profile rounded-circle" src="https://fullbodygym.xyz/coach/img/undraw_profile.svg" />
                    </a>

                    <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                        <button className="dropdown-item" onClick={handleLogout}>
                            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                            Çıkış Yap
                        </button>
                    </div>
                </li>
            </ul>
        </nav>
    )
}

export default Topbar;