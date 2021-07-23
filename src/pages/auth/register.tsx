import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import ErrorText from '../../components/ErrorText';
import Layout from '../../components/Layout';
import { auth, db } from '../../config/firebase';
import logging from '../../config/logging';
import IPageProps from '../../interfaces/page';

interface User {
    firstName: string;
    lastName: string;
    email: string;
}

const RegisterPage: React.FunctionComponent<IPageProps> = (props) => {
    const [registering, setRegistering] = useState<boolean>(false);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirm, setConfirm] = useState<string>('');
    const [error, setError] = useState<string>('');

    const history = useHistory();

    const signUpWithEmailAndPassword = (newUser: User) => {
        if (password !== confirm) {
            setError('Please make sure your passwords match.');
            return;
        }

        if (error !== '') setError('');

        setRegistering(true);

        auth.createUserWithEmailAndPassword(email, password)
            .then((result: any) => {
                logging.info(result);
                db.ref('users/' + result.user.uid)
                    .set(newUser)
                    .catch((error: any) => {
                        logging.error(error);
                    });

                history.push('/login');
            })
            .catch((error: { code: string | string[] }) => {
                logging.error(error);

                if (error.code.includes('auth/weak-password')) {
                    setError('Please enter a stronger password.');
                } else if (error.code.includes('auth/email-already-in-use')) {
                    setError('Email already in use.');
                } else {
                    setError('Unable to register.  Please try again later.');
                }

                setRegistering(false);
            });
    };

    return (
        <main className="register">
            <h2>Create New Account</h2>
            <form className="register__form">
                <label htmlFor="first-name">First Name</label>
                <input
                    type="first-name"
                    name="first-name"
                    id="first-name"
                    onChange={(event) => setFirstName(event.target.value)}
                    value={firstName}
                />
                <label htmlFor="last-name">Last Name</label>
                <input
                    type="last-name"
                    name="last-name"
                    id="last-name"
                    onChange={(event) => setLastName(event.target.value)}
                    value={lastName}
                />
                <label htmlFor="email">Email</label>
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
                <label htmlFor="confirm">Confirm Password</label>
                <input
                    autoComplete="new-password"
                    type="password"
                    name="confirm"
                    id="confirm"
                    onChange={(event) => setConfirm(event.target.value)}
                    value={confirm}
                />
                <button
                    disabled={registering}
                    onClick={() =>
                        signUpWithEmailAndPassword({
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                        })
                    }
                >
                    Sign Up
                </button>
                <p>
                    Already have an account?
                    <br /> <Link to="/login">LOGIN</Link>
                </p>
                <ErrorText error={error} />
            </form>
        </main>
    );
};

export default RegisterPage;
