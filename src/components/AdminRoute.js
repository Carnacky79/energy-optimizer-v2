// src/components/AdminRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
	const { user, isAuthenticated, loading } = useAuth();

	if (loading) {
		return <div>Caricamento...</div>;
	}

	if (!isAuthenticated || user?.role !== 'superadmin') {
		return <Navigate to='/' />;
	}

	return children;
};

export default AdminRoute;
