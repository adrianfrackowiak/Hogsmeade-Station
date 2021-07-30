import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <p>
                created by{' '}
                <a
                    href="https://adrianfrackowiak.pl"
                    target="_blank"
                    rel="noreferrer"
                >
                    adrianfrackowiak
                </a>{' '}
                - all data and copyrights belongs to{' '}
                <a
                    href="https://www.wizardingworld.com/"
                    target="_blank"
                    rel="noreferrer"
                >
                    wizarding world
                </a>
            </p>
        </footer>
    );
};

export default Footer;
