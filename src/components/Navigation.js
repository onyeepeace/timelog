import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

const Header = () => {
    function handleClick(e) {
        e.preventDefault();
        const mainNav = document.getElementById('js-menu');
        mainNav.classList.toggle('active');
    }
    // mainNav.addEventListener('click', handleClick);

    return (
        <div>
            <header>
                <nav className='navbar'>
                    <span
                        className='navbar-toggle'
                        id='js-navbar-toggle'
                        onClick={handleClick}
                        aria-hidden='true'
                    >
                        &#9776;
                    </span>

                    <div className='left-nav'>
                        <NavLink to='/' className='name'>
                            TimeSheet
                        </NavLink>
                    </div>

                    <div className='right-nav'>
                        <ul className='main-nav' id='js-menu'>
                            <li>
                                <NavLink to='/' className='nav-links current'>
                                    TimeSheet
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to='/report' className='nav-links'>
                                    Report
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to='/projects' className='nav-links'>
                                    Projects
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to='/settings' className='nav-links'>
                                    Settings
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        </div>
    );
};

export default Header;
