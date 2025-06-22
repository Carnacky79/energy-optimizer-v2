// src/components/SavingsWheel.js

import React, { useState } from 'react';
import { Gift, Star } from 'lucide-react';

const SavingsWheel = ({ onComplete }) => {
	const [isSpinning, setIsSpinning] = useState(false);
	const [result, setResult] = useState(null);
	const [hasSpun, setHasSpun] = useState(false);

	// Premi "casuali" (ma sempre buoni)
	const prizes = [
		{ discount: 30, color: '#10b981', text: '30% SCONTO' },
		{ discount: 50, color: '#3b82f6', text: '50% SCONTO' },
		{ discount: 40, color: '#8b5cf6', text: '40% SCONTO' },
		{ discount: 70, color: '#f59e0b', text: '70% SCONTO!!!' },
		{ discount: 35, color: '#ec4899', text: '35% SCONTO' },
		{ discount: 45, color: '#14b8a6', text: '45% SCONTO' },
	];

	const spin = () => {
		if (hasSpun) return;

		setIsSpinning(true);
		setHasSpun(true);

		// "Casualmente" seleziona sempre 50% o 70%
		setTimeout(() => {
			const goodPrizes = [1, 3]; // Indici di 50% e 70%
			const selectedIndex =
				goodPrizes[Math.floor(Math.random() * goodPrizes.length)];
			const prize = prizes[selectedIndex];

			setResult(prize);
			setIsSpinning(false);

			// Salva in localStorage
			localStorage.setItem('wheelDiscount', prize.discount);

			// Callback dopo 2 secondi
			setTimeout(() => {
				onComplete(prize.discount);
			}, 2000);
		}, 3000);
	};

	const styles = {
		overlay: {
			position: 'fixed',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: 'rgba(0, 0, 0, 0.9)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			zIndex: 9999,
		},
		container: {
			backgroundColor: 'white',
			borderRadius: '1rem',
			padding: '2rem',
			maxWidth: '500px',
			width: '90%',
			textAlign: 'center',
		},
		title: {
			fontSize: '2rem',
			fontWeight: 'bold',
			marginBottom: '1rem',
			background: 'linear-gradient(to right, #f59e0b, #10b981)',
			WebkitBackgroundClip: 'text',
			WebkitTextFillColor: 'transparent',
		},
		wheelContainer: {
			position: 'relative',
			width: '300px',
			height: '300px',
			margin: '0 auto 2rem',
		},
		wheel: {
			width: '100%',
			height: '100%',
			borderRadius: '50%',
			position: 'relative',
			overflow: 'hidden',
			border: '8px solid #fbbf24',
			animation: isSpinning ? 'spin 3s ease-out' : 'none',
		},
		segment: {
			position: 'absolute',
			width: '50%',
			height: '50%',
			transformOrigin: '100% 100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			fontWeight: 'bold',
			color: 'white',
			fontSize: '0.875rem',
		},
		pointer: {
			position: 'absolute',
			top: '-20px',
			left: '50%',
			transform: 'translateX(-50%)',
			width: 0,
			height: 0,
			borderLeft: '20px solid transparent',
			borderRight: '20px solid transparent',
			borderTop: '40px solid #dc2626',
		},
		button: {
			padding: '1rem 3rem',
			backgroundColor: '#10b981',
			color: 'white',
			border: 'none',
			borderRadius: '0.5rem',
			fontSize: '1.25rem',
			fontWeight: 'bold',
			cursor: 'pointer',
			animation: 'pulse 2s infinite',
		},
		result: {
			fontSize: '3rem',
			fontWeight: 'bold',
			marginBottom: '1rem',
			animation: 'bounce 0.5s',
		},
	};

	return (
		<div style={styles.overlay}>
			<style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(${1440 + Math.random() * 360}deg); }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
			<div style={styles.container}>
				<Gift size={48} color='#f59e0b' style={{ marginBottom: '1rem' }} />

				<h2 style={styles.title}>🎉 SEI STATO SELEZIONATO! 🎉</h2>

				<p style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>
					Gira la ruota per scoprire il tuo <strong>SCONTO ESCLUSIVO</strong>
				</p>

				{!result ? (
					<>
						<div style={styles.wheelContainer}>
							<div style={styles.wheel}>
								{prizes.map((prize, index) => (
									<div
										key={index}
										style={{
											...styles.segment,
											backgroundColor: prize.color,
											transform: `rotate(${index * 60}deg)`,
											clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
										}}
									>
										<span
											style={{ transform: 'rotate(30deg)', marginLeft: '20px' }}
										>
											{prize.text}
										</span>
									</div>
								))}
							</div>
							<div style={styles.pointer} />
						</div>

						<button
							style={{
								...styles.button,
								...(hasSpun
									? { backgroundColor: '#9ca3af', cursor: 'not-allowed' }
									: {}),
							}}
							onClick={spin}
							disabled={hasSpun}
						>
							{isSpinning ? 'GIRANDO...' : 'GIRA LA RUOTA!'}
						</button>
					</>
				) : (
					<>
						<div style={{ ...styles.result, color: result.color }}>
							🎊 {result.text} 🎊
						</div>
						<p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
							Complimenti! Hai vinto uno sconto speciale!
						</p>
						<div
							style={{
								display: 'flex',
								gap: '0.25rem',
								justifyContent: 'center',
							}}
						>
							{[...Array(5)].map((_, i) => (
								<Star key={i} size={24} fill='#fbbf24' color='#fbbf24' />
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default SavingsWheel;
