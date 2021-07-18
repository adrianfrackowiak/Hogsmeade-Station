import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { auth, db } from '../config/firebase';
import IPageProps from '../interfaces/page';
import bgG from '../static/images/bggryffindor.png';
import bgR from '../static/images/bgravenclaw.png';
import bgS from '../static/images/bgslytherin.png';
import bgH from '../static/images/bghufflepuff.png';

const ProfilePage: React.FunctionComponent<IPageProps> = (props) => {
    useEffect(() => {
        document.body.style.backgroundImage = `url(${bgG})`;
    }, []);

    return (
        <Layout>
            <main>
                <h2>Home page</h2>
            </main>
        </Layout>
    );
};

export default ProfilePage;
