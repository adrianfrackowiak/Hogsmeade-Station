import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { auth, db } from '../config/firebase';
import IPageProps from '../interfaces/page';
import bgimg from '../static/images/bg.png';

const HomePage: React.FunctionComponent<IPageProps> = (props) => {
    useEffect(() => {
        document.body.style.backgroundImage = `url(${bgimg})`;
    }, []);

    return (
        <Layout>
            <main>
                <h2>Home page</h2>
            </main>
        </Layout>
    );
};

export default HomePage;
