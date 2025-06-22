// src/pages/SharedLandingPage.js

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Zap, TrendingUp, Users, Star, ArrowRight, Clock } from 'lucide-react';
import { getSocialProof } from '../utils/monetization';

const SharedLandingPage = () => {
	const { shareId } = useParams();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const referrer = searchParams.get('ref') || 'Un amico';
	const [socialProof, setSocialProof] = useState(getSocialProof());
	const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59 });

	useEffect(() => {
		// Track la visita
		trackVisit();

		// Aggiorna social proof
		const interval = setInterval(() => {
			setSocialProof(getSocialProof());
		}, 5000);

		// Countdown
		const countdown = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1 };
				if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59 };
				return { hours: 23, minutes: 59 };
			});
		}, 60000);

		return () => {
			clearInterval(interval);
			clearInterval(countdown);
		};
	}, []);

	const trackVisit = async () => {
		try {
			await fetch('/api/analytics/track', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					event: 'shared_link_visit',
					data: {
						shareId,
						referrer,
						timestamp: new Date(),
					},
				}),
			});
		} catch (error) {
			console.error('Error tracking visit:', error);
		}
	};

	const styles = {
		container: {
			minHeight: '100vh',
			background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
			color: 'white',
			padding: '2rem 1rem',
		},
		content: {
			maxWidth: '800px',
			margin: '0 auto',
		},
		referrerBadge: {
			display: 'inline-block',
			backgroundColor: 'rgba(255,255,255,0.2)',
			padding: '0.5rem 1rem',
			borderRadius: '9999px',
			marginBottom: '2rem',
			backdropFilter: 'blur(10px)',
		},
		hero: {
			textAlign: 'center',
			marginBottom: '3rem',
		},
		title: {
			fontSize: '3rem',
			fontWeight: 'bold',
			marginBottom: '1rem',
			lineHeight: 1.2,
		},
		subtitle: {
			fontSize: '1.5rem',
			marginBottom: '2rem',
			opacity: 0.9,
		},
		statsGrid: {
			display: 'grid',
			gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
			gap: '1rem',
			marginBottom: '3rem',
		},
		statCard: {
			backgroundColor: 'rgba(255,255,255,0.1)',
			padding: '1.5rem',
			borderRadius: '0.75rem',
			textAlign: 'center',
			backdropFilter: 'blur(10px)',
			border: '1px solid rgba(255,255,255,0.2)',
		},
		testimonial: {
			backgroundColor: 'rgba(255,255,255,0.1)',
			padding: '2rem',
			borderRadius: '0.75rem',
			marginBottom: '2rem',
			backdropFilter: 'blur(10px)',
			textAlign: 'center',
		},
		ctaSection: {
			backgroundColor: 'white',
			color: '#1a202c',
			padding: '2rem',
			borderRadius: '1rem',
			textAlign: 'center',
			boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
		},
		ctaButton: {
			display: 'inline-flex',
			alignItems: 'center',
			gap: '0.5rem',
			padding: '1rem 2rem',
			backgroundColor: '#10b981',
			color: 'white',
			border: 'none',
			borderRadius: '0.5rem',
			fontSize: '1.25rem',
			fontWeight: 'bold',
			cursor: 'pointer',
			transition: 'all 0.3s',
			marginTop: '1rem',
		},
		urgencyBanner: {
			backgroundColor: '#dc2626',
			padding: '1rem',
			borderRadius: '0.5rem',
			marginBottom: '2rem',
			textAlign: 'center',
			animation: 'pulse 2s infinite',
		},
		features: {
			display: 'grid',
			gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
			gap: '1rem',
			marginTop: '2rem',
		},
		feature: {
			display: 'flex',
			alignItems: 'center',
			gap: '0.5rem',
		},
	};

	// Dati fake ma credibili
	const stats = {
		savedThisMonth: Math.floor(Math.random() * 50000) + 100000,
		avgSavings: Math.floor(Math.random() * 500) + 1500,
		activeUsers: Math.floor(Math.random() * 5000) + 15000,
	};

	return (
		<div style={styles.container}>
			<style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

			<div style={styles.content}>
				{/* Badge referrer */}
				<div style={styles.referrerBadge}>
					⭐ {referrer} ti ha invitato a risparmiare sulla bolletta
				</div>

				{/* Hero */}
				<div style={styles.hero}>
					<h1 style={styles.title}>
						{referrer} sta risparmiando
						<br />
						<span style={{ color: '#10b981' }}>€1.847/anno</span>
						<br />
						sulla bolletta energetica
					</h1>
					<p style={styles.subtitle}>
						Scopri anche tu quanto puoi risparmiare in soli 2 minuti
					</p>
				</div>

				{/* Urgency Banner */}
				<div style={styles.urgencyBanner}>
					<Clock
						size={24}
						style={{ display: 'inline', marginRight: '0.5rem' }}
					/>
					<strong>OFFERTA LIMITATA:</strong> Analisi GRATUITA solo per le
					prossime {timeLeft.hours}h {timeLeft.minutes}m
				</div>

				{/* Stats Grid */}
				<div style={styles.statsGrid}>
					<div style={styles.statCard}>
						<TrendingUp size={32} style={{ marginBottom: '0.5rem' }} />
						<h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>
							€{stats.savedThisMonth.toLocaleString('it-IT')}
						</h3>
						<p style={{ margin: 0, opacity: 0.9 }}>Risparmiati questo mese</p>
					</div>
					<div style={styles.statCard}>
						<Zap size={32} style={{ marginBottom: '0.5rem' }} />
						<h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>
							€{stats.avgSavings}
						</h3>
						<p style={{ margin: 0, opacity: 0.9 }}>Risparmio medio/anno</p>
					</div>
					<div style={styles.statCard}>
						<Users size={32} style={{ marginBottom: '0.5rem' }} />
						<h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>
							{stats.activeUsers.toLocaleString('it-IT')}
						</h3>
						<p style={{ margin: 0, opacity: 0.9 }}>Famiglie risparmiano</p>
					</div>
				</div>

				{/* Social Proof */}
				<div style={styles.testimonial}>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							gap: '0.25rem',
							marginBottom: '1rem',
						}}
					>
						{[...Array(5)].map((_, i) => (
							<Star key={i} size={24} fill='#fbbf24' color='#fbbf24' />
						))}
					</div>
					<p
						style={{
							fontSize: '1.25rem',
							fontStyle: 'italic',
							marginBottom: '1rem',
						}}
					>
						"{socialProof}"
					</p>
					<p style={{ opacity: 0.8 }}>
						— Verificato da oltre 15.000 utenti soddisfatti
					</p>
				</div>

				{/* CTA Section */}
				<div style={styles.ctaSection}>
					<h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
						🎁 {referrer} ti regala l'Analisi Premium!
					</h2>
					<p
						style={{
							fontSize: '1.125rem',
							marginBottom: '1rem',
							color: '#4b5563',
						}}
					>
						Normalmente €47, oggi <strong>GRATIS</strong> per te
					</p>

					<div style={styles.features}>
						<div style={styles.feature}>
							<span style={{ color: '#10b981' }}>✓</span>
							<span>Analisi dettagliata in 2 minuti</span>
						</div>
						<div style={styles.feature}>
							<span style={{ color: '#10b981' }}>✓</span>
							<span>Piano di risparmio personalizzato</span>
						</div>
						<div style={styles.feature}>
							<span style={{ color: '#10b981' }}>✓</span>
							<span>Stima risparmio garantita</span>
						</div>
						<div style={styles.feature}>
							<span style={{ color: '#10b981' }}>✓</span>
							<span>Consulenza telefonica inclusa</span>
						</div>
					</div>

					<button
						style={styles.ctaButton}
						onClick={() => {
							// Track conversion
							fetch('/api/analytics/track', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({
									event: 'shared_link_conversion',
									data: { shareId, referrer },
								}),
							});

							// Naviga al calcolatore
							navigate('/?ref=' + encodeURIComponent(shareId));
						}}
						onMouseOver={(e) => {
							e.currentTarget.style.transform = 'scale(1.05)';
							e.currentTarget.style.boxShadow =
								'0 20px 25px -5px rgba(0, 0, 0, 0.1)';
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.transform = 'scale(1)';
							e.currentTarget.style.boxShadow = 'none';
						}}
					>
						Inizia l'Analisi Gratuita
						<ArrowRight size={24} />
					</button>

					<p
						style={{
							marginTop: '1rem',
							fontSize: '0.875rem',
							color: '#6b7280',
						}}
					>
						🔒 100% Gratuito • Nessuna carta di credito • Risultati immediati
					</p>
				</div>
			</div>
		</div>
	);
};

export default SharedLandingPage;
