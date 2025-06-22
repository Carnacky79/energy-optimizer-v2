import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, loading } = useAuth();

	if (loading) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
				}}
			>
				<div style={{ textAlign: 'center' }}>
					<div
						style={{
							border: '4px solid #f3f3f3',
							borderTop: '4px solid #059669',
							borderRadius: '50%',
							width: '40px',
							height: '40px',
							animation: 'spin 1s linear infinite',
							margin: '0 auto 1rem',
						}}
					/>
					<style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
					<p>Caricamento...</p>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	return children;
};

export default ProtectedRoute;
