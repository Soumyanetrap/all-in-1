import React from 'react';
import { useLocation } from 'react-router-dom';
import Trips from '../Trip/Trips';

const VacationContainer = () => {
    const location = useLocation();
    const vacation = location.state?.vacation; 
    return (
        <Trips vacation={vacation} />
    );
};

export default VacationContainer;
