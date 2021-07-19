import React from 'react';
import { useHistory } from 'react-router-dom';
import Layout from '../../components/Layout';
import { auth } from '../../config/firebase';
import logging from '../../config/logging';
import IPageProps from '../../interfaces/page';

const LogoutPage: React.FunctionComponent<IPageProps> = (props) => {
    const history = useHistory();

    const Logout = () => {
        auth.signOut()
            .then(() => history.push('/login'))
            .catch((error) => logging.error(error));
    };

    return (
        <>
            <p>Are you sure you want to logout?</p>
            <div>
                <button onClick={() => history.goBack()}>Cancel</button>
                <button onClick={() => Logout()}>Logout</button>
            </div>
        </>
    );
};

export default LogoutPage;
