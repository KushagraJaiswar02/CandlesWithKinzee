import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>; // Or a spinner
    }

    if (user && user.isAdmin) {
        return children;
    }

    return <Navigate to="/login" />;
};

export default AdminRoute;
