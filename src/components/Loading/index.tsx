import React from 'react';
import loadingimg from '../../static/images/orbit.svg';

const Loading: React.FC = () => {
    return (
        <main className="loading">
            <img className="loading__img" src={loadingimg} alt="Loading" />
        </main>
    );
};

export default Loading;
