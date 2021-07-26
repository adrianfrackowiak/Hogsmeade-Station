import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { auth } from '../../config/firebase';

const Header: React.FC = () => {
    const [mobileNav, setMobileNav] = useState<boolean>(false);

    return (
        <>
            {mobileNav ? (
                <div className="mobile--nav">
                    <button
                        onClick={() => setMobileNav(false)}
                        className="mobile--nav__button"
                    >
                        <FaTimes />
                    </button>
                    <nav className="mobile--nav__nav">
                        <ul className="mobile--nav__nav__menu">
                            <li>
                                <Link
                                    to="/"
                                    onClick={() => setMobileNav(false)}
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/bookstracker"
                                    onClick={() => setMobileNav(false)}
                                >
                                    Books Tracker
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/sortinghat"
                                    onClick={() => setMobileNav(false)}
                                >
                                    Sorting Hat
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/favorites"
                                    onClick={() => setMobileNav(false)}
                                >
                                    Favorites
                                </Link>
                            </li>
                        </ul>
                        {auth.currentUser ? (
                            <ul className="mobile--nav__nav__profile">
                                <li>
                                    <Link
                                        to="/profile"
                                        onClick={() => setMobileNav(false)}
                                    >
                                        Profile
                                    </Link>
                                </li>
                            </ul>
                        ) : (
                            <ul className="mobile--nav__nav__profile">
                                <li>
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileNav(false)}
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/register"
                                        onClick={() => setMobileNav(false)}
                                    >
                                        Register
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </nav>
                </div>
            ) : (
                <>
                    <header className="header">
                        <div className="header__logo">
                            <h1>Hogsmeade Station</h1>
                        </div>
                        <nav className="header__nav">
                            <ul className="header__nav__menu">
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                <li>
                                    <Link to="/bookstracker">
                                        Books Tracker
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/sortinghat">Sorting Hat</Link>
                                </li>
                                <li>
                                    <Link to="/favorites">Favorites</Link>
                                </li>
                            </ul>
                            {auth.currentUser ? (
                                <ul className="header__nav__profile">
                                    <li>
                                        <Link to="/profile">Profile</Link>
                                    </li>
                                </ul>
                            ) : (
                                <ul className="header__nav__profile">
                                    <li>
                                        <Link to="/login">Login</Link>
                                    </li>
                                    <li>
                                        <Link to="/register">Register</Link>
                                    </li>
                                </ul>
                            )}
                        </nav>
                    </header>
                    <header className="header--mobile">
                        <div className="header--mobile__logo">
                            <h1>Hogsmeade Station</h1>
                        </div>
                        <button
                            className="header--mobile__hamburger"
                            onClick={() => setMobileNav(true)}
                        >
                            <FaBars className="ham--nav" />
                        </button>
                    </header>
                </>
            )}
        </>
    );
};

export default Header;
