import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import ErrorText from '../../components/ErrorText';
import { auth } from '../../config/firebase';
import logging from '../../config/logging';
import IPageProps from '../../interfaces/page';

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
        <main className="login">
            <h2>Login to Your Account</h2>
            <form className="login__form">
                <label htmlFor="email">Email Adress</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={(event) => setEmail(event.target.value)}
                    value={email}
                />
                <label htmlFor="password">Password</label>
                <input
                    autoComplete="new-password"
                    type="password"
                    name="password"
                    id="password"
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
                    Don't have an account?
                    <br /> <Link to="/register">REGISTER</Link>
                </p>

                <ErrorText error={error} />
            </form>
        </main>
    );
};

export default LoginPage;
