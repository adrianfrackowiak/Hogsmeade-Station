import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import IPageProps from '../interfaces/page';

const ProfilePage: React.FunctionComponent<IPageProps> = (props) => {
    return (
        <>
            <p>Welcome to this page that is protected by Friebase auth!</p>
            <p>
                Change your password <Link to="/change">here</Link>.
            </p>
            <p>
                Click <Link to="/logout">here</Link> to logout. Hello{' '}
                {auth.currentUser?.uid}
            </p>
        </>
    );
};

export default ProfilePage;
