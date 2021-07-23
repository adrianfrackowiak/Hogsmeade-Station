import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { auth, db } from '../config/firebase';
import IPageProps from '../interfaces/page';
import bgimg from '../static/images/bg1.png';
import bglibimg from '../static/images/lib.jpg';
import bghatimg from '../static/images/hat.jpg';
import bgfavimg from '../static/images/hogs.jpg';

const HomePage: React.FunctionComponent<IPageProps> = (props) => {
    useEffect(() => {
        document.body.style.backgroundImage = `url(${bgimg})`;
    }, []);

    const bookstrackStyle = {
        backgroundImage: `url(${bglibimg})`,
    };

    const sortinghatStyle = {
        backgroundImage: `url(${bghatimg})`,
    };

    const favoritesStyle = {
        backgroundImage: `url(${bgfavimg})`,
    };

    return (
        <main className="home">
            <h1>Welcome to The Hogsmeade Station</h1>
            <p>
                If you could enter the Hogwart School, what type of witch or
                wizard would you be? Explore your profile personality with our
                sorting hat, books track or favorites.
            </p>

            <div className="home__nav">
                <Link to="/bookstracker">
                    <div style={bookstrackStyle} className="home__nav__post">
                        <p>Track your Harry Potter books</p>
                    </div>
                </Link>
                <Link to="/sortinghat">
                    <div style={sortinghatStyle} className="home__nav__post">
                        <p>Enter the Sorting Hat Ceremony</p>
                    </div>
                </Link>
                <Link to="/favorites">
                    <div style={favoritesStyle} className="home__nav__post">
                        <p>Choose your Favorites</p>
                    </div>
                </Link>
            </div>
        </main>
    );
};

export default HomePage;
