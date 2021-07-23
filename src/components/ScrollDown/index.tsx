import React from 'react';
import { WiStars } from 'react-icons/wi';

const ScrollDown: React.FC = () => {
    return (
        <div className="scroll-down">
            <WiStars size={32} className="arrows a1" />
            <WiStars size={32} className="arrows a2" />
            <WiStars size={32} className="arrows a3" />
        </div>
    );
};

export default ScrollDown;
