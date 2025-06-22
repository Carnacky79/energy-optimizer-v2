// src/App.js

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import CalculatorPage from './pages/CalculatorPage';
import ReportsPage from './pages/ReportsPage';
import TipsPage from './pages/TipsPage';
import RegisterPage from './pages/RegisterPage';
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
		<Router>
			<div style={styles.app}>
				<Header />
				<main style={styles.main}>
					<Routes>
						<Route path='/' element={<CalculatorPage />} />
						<Route path='/reports' element={<ReportsPage />} />
						<Route path='/tips' element={<TipsPage />} />
						<Route path='/register' element={<RegisterPage />} />
					</Routes>
				</main>
			</div>
		</Router>
	);
}

export default App;
