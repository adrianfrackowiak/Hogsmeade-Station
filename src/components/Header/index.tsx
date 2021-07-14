import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../config/firebase';

const Header: React.FC = () => {
    return (
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
                        <Link to="/bookstracker">Books Tracker</Link>
                    </li>
                    <li>
                        <Link to="/sortinghat">Sorting Hat</Link>
                    </li>
                    <li>Favorites</li>
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
    );
};

export default Header;
