// src/components/ExitIntentPopup.js

import React, { useState, useEffect } from 'react';
import { X, Zap, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ExitIntentPopup = () => {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();
	const [show, setShow] = useState(false);
	const [timeLeft, setTimeLeft] = useState(10);
	const [hasShown, setHasShown] = useState(false);

	useEffect(() => {
		// Non mostrare se l'utente è già autenticato o l'ha già visto
		if (isAuthenticated || hasShown) return;

		let timeout;
		const handleMouseLeave = (e) => {
			// Rileva quando il mouse esce dall'area della pagina (verso l'alto)
			if (e.clientY <= 0 && !hasShown) {
				setShow(true);
				setHasShown(true);
				sessionStorage.setItem('exitIntentShown', 'true');
			}
		};

		// Mostra dopo 30 secondi se non ha ancora interagito
		timeout = setTimeout(() => {
			if (!hasShown && !sessionStorage.getItem('exitIntentShown')) {
				setShow(true);
				setHasShown(true);
				sessionStorage.setItem('exitIntentShown', 'true');
			}
		}, 30000);

		document.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			document.removeEventListener('mouseleave', handleMouseLeave);
			clearTimeout(timeout);
		};
	}, [isAuthenticated, hasShown]);

	useEffect(() => {
		if (show && timeLeft > 0) {
			const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [show, timeLeft]);

	if (!show) return null;

	const styles = {
		overlay: {
			position: 'fixed',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: 'rgba(0, 0, 0, 0.8)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			zIndex: 9999,
			animation: 'fadeIn 0.3s',
		},
		popup: {
			backgroundColor: 'white',
			borderRadius: '0.75rem',
			maxWidth: '500px',
			width: '90%',
			padding: '2rem',
			position: 'relative',
			animation: 'slideIn 0.3s',
		},
		closeButton: {
			position: 'absolute',
			top: '1rem',
			right: '1rem',
			background: 'none',
			border: 'none',
			cursor: 'pointer',
			color: '#6b7280',
		},
		urgentBadge: {
			backgroundColor: '#fee2e2',
			color: '#dc2626',
			padding: '0.5rem 1rem',
			borderRadius: '9999px',
			display: 'inline-block',
			marginBottom: '1rem',
			fontWeight: 'bold',
			animation: 'pulse 2s infinite',
		},
		title: {
			fontSize: '2rem',
			fontWeight: 'bold',
			marginBottom: '1rem',
			color: '#111827',
		},
		countdown: {
			fontSize: '3rem',
			fontWeight: 'bold',
			color: '#dc2626',
			textAlign: 'center',
			marginBottom: '1rem',
		},
		features: {
			backgroundColor: '#f9fafb',
			borderRadius: '0.5rem',
			padding: '1rem',
			marginBottom: '1.5rem',
		},
		feature: {
			display: 'flex',
			alignItems: 'center',
			gap: '0.5rem',
			marginBottom: '0.5rem',
		},
		cta: {
			width: '100%',
			padding: '1rem',
			backgroundColor: '#10b981',
			color: 'white',
			border: 'none',
			borderRadius: '0.5rem',
			fontSize: '1.25rem',
			fontWeight: 'bold',
			cursor: 'pointer',
			animation: 'pulse 2s infinite',
			marginBottom: '0.5rem',
		},
		skip: {
			width: '100%',
			padding: '0.5rem',
			backgroundColor: 'transparent',
			color: '#6b7280',
			border: 'none',
			cursor: 'pointer',
			fontSize: '0.875rem',
		},
	};

	return (
		<>
			<style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
			<div style={styles.overlay} onClick={() => setShow(false)}>
				<div style={styles.popup} onClick={(e) => e.stopPropagation()}>
					<button style={styles.closeButton} onClick={() => setShow(false)}>
						<X size={24} />
					</button>

					<div style={styles.urgentBadge}>
						⚡ OFFERTA ESCLUSIVA - SOLO PER TE!
					</div>

					<h2 style={styles.title}>Aspetta! Non perdere il 70% di SCONTO</h2>

					<div style={styles.countdown}>
						00:00:{String(timeLeft).padStart(2, '0')}
					</div>

					<p style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>
						<strong>Questa offerta scade quando chiudi questa pagina!</strong>
					</p>

					<div style={styles.features}>
						<div style={styles.feature}>
							<Zap size={20} color='#10b981' />
							<span>Report illimitati invece di solo 1</span>
						</div>
						<div style={styles.feature}>
							<Zap size={20} color='#10b981' />
							<span>Risparmio garantito fino a €2.400/anno</span>
						</div>
						<div style={styles.feature}>
							<Zap size={20} color='#10b981' />
							<span>Consulenza telefonica GRATIS (valore €97)</span>
						</div>
						<div style={styles.feature}>
							<Zap size={20} color='#10b981' />
							<span>Garanzia 60 giorni soddisfatti o rimborsati</span>
						</div>
					</div>

					<p style={{ textAlign: 'center', marginBottom: '1rem' }}>
						<s style={{ color: '#9ca3af' }}>€19.90/mese</s>{' '}
						<span
							style={{
								fontSize: '1.5rem',
								fontWeight: 'bold',
								color: '#10b981',
							}}
						>
							Solo €5.99/mese
						</span>
					</p>

					<button
						style={styles.cta}
						onClick={() => {
							setShow(false);
							navigate('/pricing?offer=exit70');
						}}
					>
						🎯 ATTIVA L'OFFERTA ORA
					</button>

					<button style={styles.skip} onClick={() => setShow(false)}>
						No grazie, preferisco pagare il prezzo pieno
					</button>
				</div>
			</div>
		</>
	);
};

export default ExitIntentPopup;
