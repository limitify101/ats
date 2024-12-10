import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from './LoadingScreen';

function PrivateRoute({ element }) {
    const { currentUser,isloading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.setItem('lastVisitedRoute',location.pathname);
        if(isloading){
            return <LoadingScreen brandName='ATS'/>
        }
        if (!currentUser) {
          navigate('/auth/login'); // Redirect to login if no user is authenticated
        }
      }, [currentUser, navigate,location]);

    return element;
}

export default PrivateRoute;
