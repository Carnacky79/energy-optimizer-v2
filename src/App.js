// src/App.js

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import ProtectedRoute from './components/ProtectedRoute';
import CalculatorPage from './pages/CalculatorPage';
import ReportsPage from './pages/ReportsPage';
import TipsPage from './pages/TipsPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import PricingPage from './pages/PricingPage';
import StorageManager from './utils/storage';

const styles = {
	app: {
		minHeight: '100vh',
		backgroundColor: '#f9fafb',
		display: 'flex',
		flexDirection: 'column',
	},
	main: {
		flex: 1,
	},
};

function App() {
	useEffect(() => {
		// Pulisci dati scaduti all'avvio
		StorageManager.cleanExpiredData();

		// Controlla periodicamente i dati scaduti
		const interval = setInterval(() => {
			StorageManager.cleanExpiredData();
		}, 60000); // Ogni minuto

		return () => clearInterval(interval);
	}, []);

	return (
		<AuthProvider>
			<Router>
				<div style={styles.app}>
					<Header />
					<main style={styles.main}>
						<Routes>
							{/* Public routes */}
							<Route path='/' element={<CalculatorPage />} />
							<Route path='/tips' element={<TipsPage />} />
							<Route path='/login' element={<LoginPage />} />
							<Route path='/register' element={<RegisterPage />} />
							<Route path='/pricing' element={<PricingPage />} />
							<Route path='/reports' element={<ReportsPage />} />

							{/* Protected routes */}
							<Route
								path='/profile'
								element={
									<ProtectedRoute>
										<ProfilePage />
									</ProtectedRoute>
								}
							/>
						</Routes>
					</main>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;
