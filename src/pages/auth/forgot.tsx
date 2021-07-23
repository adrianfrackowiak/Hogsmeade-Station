import React, { useState } from 'react';
import ErrorText from '../../components/ErrorText';
import Layout from '../../components/Layout';
import { auth } from '../../config/firebase';
import logging from '../../config/logging';
import IPageProps from '../../interfaces/page';

const ForgotPasswordPage: React.FunctionComponent<IPageProps> = (props) => {
    const [sending, setSending] = useState<boolean>(false);
    const [sent, setSent] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');

    const resetPasswordRequest = () => {
        if (error !== '') setError('');

        setSending(true);

        auth.sendPasswordResetEmail(email)
            .then(() => {
                logging.info('Email sent.');
                setSent(true);
                setSending(false);
            })
            .catch((error: { message: React.SetStateAction<string> }) => {
                logging.error(error);
                setError(error.message);
                setSending(false);
            });
    };

    return (
        <main className="forgot">
            {sent ? (
                <p>A link has been sent to your email with instructions.</p>
            ) : (
                <>
                    <h2>Please enter your email.</h2>
                    <form className="forgot__form">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email Address"
                            onChange={(event) => setEmail(event.target.value)}
                            value={email}
                        />
                        <button
                            disabled={sending}
                            onClick={() => resetPasswordRequest()}
                        >
                            Sent link
                        </button>
                        <ErrorText error={error} />
                    </form>
                </>
            )}
        </main>
    );
};

export default ForgotPasswordPage;
