import React, { useEffect, useState } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import AuthRoute from './components/AuthRoute';
import Layout from './components/Layout';
import { auth, db } from './config/firebase';
import logging from './config/logging';
import routes from './config/routes';
import IProfile from './interfaces/profile';
import bgimg from './static/images/bg1.png';

const Application: React.FunctionComponent = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [userProfile, setUserProfile] = useState<IProfile>();

    const getDatabaseProfile = () => {
        const database = db.ref();

        if (auth.currentUser) {
            database
                .child('users/')
                .child(auth.currentUser.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        setUserProfile(snapshot.val());
                    } else {
                        console.log('No data available');
                    }

                    setLoading(false);
                })
                .catch((error: any) => {
                    console.error(error);
                });
        }
    };

    useEffect(() => {
        document.body.style.backgroundImage = `url(${bgimg})`;

        auth.onAuthStateChanged((user: any) => {
            if (user) {
                logging.info('User detected.');
                getDatabaseProfile();
            } else {
                logging.info('No user detected');
            }
        });
    }, []);

    useEffect(() => {
        getDatabaseProfile();
    }, [userProfile]);

    if (loading) return <h2>Loading...</h2>;

    return (
        <Layout>
            <Switch>
                {routes.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        render={(routeProps: RouteComponentProps<any>) => {
                            if (route.protected)
                                return (
                                    <AuthRoute>
                                        <route.component
                                            {...routeProps}
                                            userProfile={userProfile}
                                            {...userProfile}
                                        />
                                    </AuthRoute>
                                );

                            return (
                                <route.component
                                    {...routeProps}
                                    userProfile={userProfile}
                                    {...userProfile}
                                />
                            );
                        }}
                    />
                ))}
            </Switch>
        </Layout>
    );
};

export default Application;
