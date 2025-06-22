// src/components/ScarcityBanner.js

import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, AlertCircle } from 'lucide-react';

const ScarcityBanner = () => {
	const [viewers, setViewers] = useState(47);
	const [spotsLeft, setSpotsLeft] = useState(3);
	const [lastPurchase, setLastPurchase] = useState({
		name: 'Marco R.',
		city: 'Milano',
		time: 2,
	});

	useEffect(() => {
		// Simula attività in tempo reale
		const interval = setInterval(() => {
			// Viewers casuali
			setViewers((prev) => {
				const change = Math.random() > 0.5 ? 1 : -1;
				return Math.max(25, Math.min(75, prev + change));
			});

			// Occasionalmente riduci i posti
			if (Math.random() > 0.8 && spotsLeft > 1) {
				setSpotsLeft((prev) => prev - 1);

				// Genera acquisto fake
				const names = [
					'Giuseppe T.',
					'Anna S.',
					'Luigi M.',
					'Maria C.',
					'Roberto F.',
				];
				const cities = ['Roma', 'Napoli', 'Torino', 'Palermo', 'Bologna'];
				setLastPurchase({
					name: names[Math.floor(Math.random() * names.length)],
					city: cities[Math.floor(Math.random() * cities.length)],
					time: Math.floor(Math.random() * 5) + 1,
				});
			}
		}, 5000);

		return () => clearInterval(interval);
	}, [spotsLeft]);

	const styles = {
		container: {
			position: 'fixed',
			bottom: '20px',
			left: '20px',
			backgroundColor: 'white',
			borderRadius: '0.5rem',
			boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
			padding: '1rem',
			maxWidth: '300px',
			zIndex: 50,
			animation: 'slideUp 0.5s',
		},
		header: {
			display: 'flex',
			alignItems: 'center',
			gap: '0.5rem',
			marginBottom: '0.75rem',
			color: '#dc2626',
			fontWeight: 'bold',
		},
		viewers: {
			display: 'flex',
			alignItems: 'center',
			gap: '0.5rem',
			marginBottom: '0.5rem',
			fontSize: '0.875rem',
		},
		purchase: {
			backgroundColor: '#f0fdf4',
			padding: '0.5rem',
			borderRadius: '0.25rem',
			fontSize: '0.875rem',
			marginBottom: '0.5rem',
		},
		spots: {
			backgroundColor: '#fee2e2',
			padding: '0.5rem',
			borderRadius: '0.25rem',
			fontSize: '0.875rem',
			fontWeight: 'bold',
			textAlign: 'center',
			color: '#dc2626',
		},
	};

	return (
		<>
			<style>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
			<div style={styles.container}>
				<div style={styles.header}>
					<AlertCircle size={20} />
					<span>Alta Richiesta!</span>
				</div>

				<div style={styles.viewers}>
					<Users size={16} />
					<span>
						<strong>{viewers}</strong> persone stanno guardando ora
					</span>
				</div>

				<div style={styles.purchase}>
					<TrendingUp
						size={16}
						style={{ display: 'inline', marginRight: '0.25rem' }}
					/>
					<strong>{lastPurchase.name}</strong> da {lastPurchase.city} si è
					iscritto {lastPurchase.time} minuti fa
				</div>

				<div style={styles.spots}>
					⚠️ Solo {spotsLeft} posti rimasti al prezzo scontato!
				</div>
			</div>
		</>
	);
};

export default ScarcityBanner;
