import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import ErrorText from '../../components/ErrorText';
import { auth } from '../../config/firebase';
import logging from '../../config/logging';
import IPageProps from '../../interfaces/page';
import queryString from 'querystring';
import Layout from '../../components/Layout';

const ResetPasswordPage: React.FunctionComponent<
    IPageProps & RouteComponentProps
> = (props) => {
    const [verifying, setVerifying] = useState<boolean>(true);
    const [verified, setVerified] = useState<boolean>(false);
    const [changing, setChanging] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [confirm, setConfirm] = useState<string>('');
    const [oobCode, setOobCode] = useState<string>('');
    const [error, setError] = useState<string>('');

    const history = useHistory();

    useEffect(() => {
        logging.info('Extracting code');

        let stringParams = queryString.parse(props.location.search);

        if (stringParams) {
            let oobCode = stringParams.oobCode as string;

            if (oobCode) {
                logging.info('Code found');
                verifyPasswordResetLink(oobCode);
            } else {
                logging.error('Unable to find code');
                setVerified(false);
                setVerifying(false);
            }
        } else {
            logging.error('Unable to find code');
            setVerified(false);
            setVerifying(false);
        }
        // eslint-disable-next-line
    }, []);

    const verifyPasswordResetLink = (_oobCode: string) => {
        auth.verifyPasswordResetCode(_oobCode)
            .then((result) => {
                logging.info(result);
                setOobCode(_oobCode);
                setVerified(true);
                setVerifying(false);
            })
            .catch((error) => {
                logging.error(error);
                setVerified(false);
                setVerifying(false);
            });
    };

    const passwordResetRequest = () => {
        if (password !== confirm) {
            setError('Make sure your passwords are matching');
            return;
        }

        if (error !== '') setError('');

        setChanging(true);

        auth.confirmPasswordReset(oobCode, password)
            .then(() => {
                history.push('/login');
            })
            .catch((error) => {
                logging.error(error);
                setError(error.message);
                setChanging(false);
            });
    };

    return (
        <Layout>
            {verifying ? (
                <p>Loading...</p>
            ) : (
                <>
                    {verified ? (
                        <>
                            <p>Please enter a strong password.</p>
                            <input
                                autoComplete="new-password"
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Enter your new password"
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                value={password}
                            />
                            <input
                                autoComplete="new-password"
                                type="password"
                                name="confirm"
                                id="confirm"
                                placeholder="Confirm your new password"
                                onChange={(event) =>
                                    setConfirm(event.target.value)
                                }
                                value={confirm}
                            />
                            <button
                                disabled={changing}
                                onClick={() => passwordResetRequest()}
                            >
                                Reset Password
                            </button>{' '}
                        </>
                    ) : (
                        <>
                            <p>Invalid code.</p>
                        </>
                    )}
                </>
            )}
        </Layout>
    );
};

export default ResetPasswordPage;
