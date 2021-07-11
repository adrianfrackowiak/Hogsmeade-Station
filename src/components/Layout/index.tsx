import React from 'react';
import Footer from '../Footer';
import Header from '../Header';

const Layout: React.FunctionComponent = ({ children }) => {
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
