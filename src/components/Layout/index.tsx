import React from 'react';
import IProfile from '../../interfaces/profile';
import Footer from '../Footer';
import Header from '../Header';

const Layout: React.FC<IProfile> = (props) => {
    const { children } = props;

    return (
        <div className="container">
            <div className="content">
                <Header />
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
