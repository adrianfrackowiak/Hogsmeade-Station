import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import ErrorText from '../../components/ErrorText';
import { auth } from '../../config/firebase';
import logging from '../../config/logging';
import IPageProps from '../../interfaces/page';
import Layout from '../../components/Layout';

const ChangePasswordPage: React.FunctionComponent<IPageProps> = (props) => {
    const [changing, setChanging] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [old, setOld] = useState<string>('');
    const [confirm, setConfirm] = useState<string>('');
    const [error, setError] = useState<string>('');

    const history = useHistory();

    const passwordChangeRequest = () => {
        if (password !== confirm) {
            setError('Make sure your passwords are matching');
            return;
        }

        if (error !== '') setError('');

        setChanging(true);

        auth.currentUser
            ?.updatePassword(password)
            .then(() => {
                logging.info('Password change successful.');
                history.push('/');
            })
            .catch((error: { message: React.SetStateAction<string> }) => {
                logging.error(error);
                setChanging(false);
                setError(error.message);
            });
    };

    if (auth.currentUser?.providerData[0]?.providerId !== 'password')
        return <Redirect to="/" />;

    return (
        <Layout>
            <form>
                <input
                    autoComplete="new-password"
                    type="password"
                    name="oldpassword"
                    id="oldpassword"
                    placeholder="Enter current password"
                    onChange={(event) => setOld(event.target.value)}
                    value={old}
                />
                <input
                    autoComplete="new-password"
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your new password"
                    onChange={(event) => setPassword(event.target.value)}
                    value={password}
                />
                <input
                    autoComplete="new-password"
                    type="password"
                    name="confirm"
                    id="confirm"
                    placeholder="Confirm your new password"
                    onChange={(event) => setConfirm(event.target.value)}
                    value={confirm}
                />
                <button
                    disabled={changing}
                    onClick={() => passwordChangeRequest()}
                >
                    Change password
                </button>
                <ErrorText error={error} />
            </form>
        </Layout>
    );
};

export default ChangePasswordPage;
