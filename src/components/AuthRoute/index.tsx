import React from 'react';
import { Redirect } from 'react-router-dom';
import { auth } from '../../config/firebase';
import logging from '../../config/logging';

const AuthRoute: React.FC = (props) => {
    const { children } = props;

    if (!auth.currentUser) {
        logging.warn('No user detected, redirecting');
        return <Redirect to="/login" />;
    }

    return <>{children}</>;
};

export default AuthRoute;
