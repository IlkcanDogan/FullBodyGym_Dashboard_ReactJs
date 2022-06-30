import React from 'react';
import { useLocation } from 'react-router-dom';
import { APP_DOMAIN } from '../core/constant';

function Sidebar() {
    const location = useLocation();

    return (
        <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled" id="accordionSidebar">

            <a className="sidebar-brand d-flex align-items-center justify-content-center" href="./students">
                <div className="sidebar-brand-icon rotate-n-15">
                    <i className="fas fa-laugh-wink"></i>
                </div>
                <div className="sidebar-brand-text mx-3">BODYGYM</div>
            </a>

            <hr className="sidebar-divider my-0" />

            <li className={`nav-item ${location.pathname === '/students' ? 'active' : null}`}>
                <a href={APP_DOMAIN + '/students'} className='nav-link'>
                    <i className="fas fa-fw fa-users"></i>
                    <span>Kursiyerler</span>
                </a>
            </li>

            <li className={`nav-item ${location.pathname === '/lists' ? 'active' : null}`}>
                <a href={APP_DOMAIN + '/lists'} className='nav-link'>
                    <i className="fas fa-fw fa-table"></i>
                    <span>Hedef Listelerim</span>
                </a>
            </li>

            <li className={`nav-item ${location.pathname === '/settings' ? 'active' : null}`}>
                <a href={APP_DOMAIN + '/settings'} className='nav-link'>
                    <i className="fas fa-fw fa-cog"></i>
                    <span>Hesap Ayarları</span>
                </a>
            </li>

            <hr className="sidebar-divider d-none d-md-block" />

            <div className="text-center d-none d-md-inline">
                <button className="rounded-circle border-0" id="sidebarToggle"></button>
            </div>

        </ul>
    )
}

export default Sidebar;