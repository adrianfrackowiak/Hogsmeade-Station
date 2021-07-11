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
        <Layout>
            <form>
                <input
                    type="first-name"
                    name="first-name"
                    id="first-name"
                    placeholder="Enter your first name"
                    onChange={(event) => setFirstName(event.target.value)}
                    value={firstName}
                />
                <input
                    type="last-name"
                    name="last-name"
                    id="last-name"
                    placeholder="Enter your last name"
                    onChange={(event) => setLastName(event.target.value)}
                    value={lastName}
                />
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
                <input
                    autoComplete="new-password"
                    type="password"
                    name="confirm"
                    id="confirm"
                    placeholder="Confirm your password"
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
                    Already have an account? <Link to="/login">Login.</Link>
                </p>
                <ErrorText error={error} />
            </form>
        </Layout>
    );
};

export default RegisterPage;
