import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import ErrorText from '../../components/ErrorText';
import { auth } from '../../config/firebase';
import logging from '../../config/logging';
import IPageProps from '../../interfaces/page';
import Layout from '../../components/Layout';

const LoginPage: React.FunctionComponent<IPageProps> = (props) => {
    const [authenticating, setAuthenticating] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const history = useHistory();

    const signInWithEmailAndPassword = () => {
        if (error !== '') setError('');

        setAuthenticating(true);

        auth.signInWithEmailAndPassword(email, password)
            .then((result) => {
                logging.info(result);
                history.push('/');
            })
            .catch((error) => {
                logging.error(error);
                setAuthenticating(false);
                setError(error.message);
            });
    };

    return (
        <Layout>
            <form>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email address"
                    onChange={(event) => setEmail(event.target.value)}
                    value={email}
                />
                <input
                    autoComplete="new-password"
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    onChange={(event) => setPassword(event.target.value)}
                    value={password}
                />
                <button
                    disabled={authenticating}
                    onClick={() => signInWithEmailAndPassword()}
                >
                    Login
                </button>
                <p>
                    Don't have an account? <Link to="/register">Register.</Link>
                </p>
                <p>
                    <Link to="/forgot">Forget your password?</Link>
                </p>
                <ErrorText error={error} />
            </form>
        </Layout>
    );
};

export default LoginPage;
