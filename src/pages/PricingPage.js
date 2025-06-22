// src/pages/PricingPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Star, Zap, Crown, Clock } from 'lucide-react';
import {
	getUrgencyMessage,
	calculateReportValue,
	getSocialProof,
	getTestimonials,
} from '../utils/monetization';

const PricingPage = () => {
	const navigate = useNavigate();
	const [urgency, setUrgency] = useState(getUrgencyMessage());
	const [socialProof, setSocialProof] = useState(getSocialProof());
	const [selectedPlan, setSelectedPlan] = useState('premium');
	const [timeLeft, setTimeLeft] = useState({
		hours: 23,
		minutes: 59,
		seconds: 59,
	});

	useEffect(() => {
		// Update social proof every 5 seconds
		const socialInterval = setInterval(() => {
			setSocialProof(getSocialProof());
		}, 5000);

		// Countdown timer
		const timerInterval = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
				if (prev.minutes > 0)
					return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
				if (prev.hours > 0)
					return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
				return { hours: 23, minutes: 59, seconds: 59 };
			});
		}, 1000);

		return () => {
			clearInterval(socialInterval);
			clearInterval(timerInterval);
		};
	}, []);

	const reportValue = calculateReportValue();
	const testimonials = getTestimonials();

	const plans = [
		{
			id: 'free',
			name: 'Basic',
			price: 0,
			period: '',
			features: [
				{ text: '1 report energetico', included: true },
				{ text: 'Calcolo risparmio base', included: true },
				{ text: 'Consigli generici', included: true },
				{ text: 'Report PDF', included: false },
				{ text: 'Analisi dettagliata', included: false },
				{ text: 'Piano personalizzato', included: false },
				{ text: 'Supporto esperto', included: false },
				{ text: 'Garanzia soddisfatti', included: false },
			],
			cta: 'Piano Attuale',
			disabled: true,
		},
		{
			id: 'premium',
			name: 'Premium',
			price: 9.9,
			originalPrice: 19.9,
			period: '/mese',
			yearlyPrice: 79,
			popular: true,
			features: [
				{ text: 'Report illimitati', included: true },
				{ text: 'Calcolo risparmio avanzato', included: true },
				{ text: 'Piano risparmio personalizzato', included: true },
				{ text: 'Report PDF professionali', included: true },
				{ text: 'Analisi dettagliata PRO', included: true },
				{ text: 'Accesso fornitori certificati', included: true },
				{ text: 'Supporto prioritario', included: true },
				{ text: 'Garanzia 30 giorni', included: true },
			],
			cta: 'Inizia Ora',
			savings: '50% di sconto',
		},
		{
			id: 'consultant',
			name: 'Consulenza Expert',
			price: 197,
			originalPrice: 397,
			period: 'una tantum',
			vip: true,
			features: [
				{ text: 'Tutto del piano Premium', included: true },
				{ text: 'Consulenza 1-a-1 (30 min)', included: true },
				{ text: 'Analisi professionale', included: true },
				{ text: 'Report dettagliato 20+ pagine', included: true },
				{ text: 'Piano azione personalizzato', included: true },
				{ text: 'Certificato efficienza', included: true },
				{ text: 'Follow-up 3 mesi', included: true },
				{ text: 'Garanzia risultati', included: true },
			],
			cta: 'Consulenza Immediata',
			limited: 'Solo 3 posti disponibili',
		},
	];

	const styles = {
		container: {
			maxWidth: '1200px',
			margin: '0 auto',
			padding: '2rem 1rem',
		},
		urgencyBanner: {
			background: 'linear-gradient(to right, #ef4444, #f97316)',
			color: 'white',
			padding: '1rem',
			borderRadius: '0.5rem',
			textAlign: 'center',
			marginBottom: '2rem',
			fontWeight: 'bold',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: '1rem',
		},
		countdown: {
			display: 'flex',
			gap: '0.5rem',
			fontSize: '1.25rem',
		},
		header: {
			textAlign: 'center',
			marginBottom: '3rem',
		},
		valueProposition: {
			backgroundColor: '#fef3c7',
			border: '2px solid #fbbf24',
			borderRadius: '0.5rem',
			padding: '1.5rem',
			marginBottom: '3rem',
		},
		plansGrid: {
			display: 'grid',
			gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
			gap: '2rem',
			marginBottom: '3rem',
		},
		planCard: {
			backgroundColor: 'white',
			borderRadius: '0.5rem',
			boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
			padding: '2rem',
			position: 'relative',
			transition: 'all 0.3s',
		},
		popularBadge: {
			position: 'absolute',
			top: '-0.75rem',
			left: '50%',
			transform: 'translateX(-50%)',
			backgroundColor: '#10b981',
			color: 'white',
			padding: '0.25rem 1rem',
			borderRadius: '9999px',
			fontSize: '0.875rem',
			fontWeight: 'bold',
		},
		socialProof: {
			backgroundColor: '#f0fdf4',
			padding: '1rem',
			borderRadius: '0.5rem',
			textAlign: 'center',
			marginBottom: '3rem',
			animation: 'fadeIn 0.5s',
		},
		testimonials: {
			marginBottom: '3rem',
		},
		testimonialCard: {
			backgroundColor: 'white',
			padding: '1.5rem',
			borderRadius: '0.5rem',
			boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
			marginBottom: '1rem',
		},
		guarantee: {
			textAlign: 'center',
			padding: '2rem',
			backgroundColor: '#f9fafb',
			borderRadius: '0.5rem',
		},
	};

	return (
		<div style={styles.container}>
			{/* Urgency Banner */}
			<div style={styles.urgencyBanner}>
				<Zap size={24} />
				<span>{urgency.text}</span>
				<div style={styles.countdown}>
					<Clock size={20} />
					<span>{String(timeLeft.hours).padStart(2, '0')}:</span>
					<span>{String(timeLeft.minutes).padStart(2, '0')}:</span>
					<span>{String(timeLeft.seconds).padStart(2, '0')}</span>
				</div>
			</div>

			{/* Header */}
			<div style={styles.header}>
				<h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
					Scegli il Piano Perfetto per Te
				</h1>
				<p style={{ fontSize: '1.25rem', color: '#6b7280' }}>
					Risparmia fino al <strong style={{ color: '#10b981' }}>45%</strong>{' '}
					sulla bolletta energetica
				</p>
			</div>

			{/* Value Proposition */}
			<div style={styles.valueProposition}>
				<h3 style={{ marginBottom: '1rem' }}>
					💰 Valore Totale del Report Premium: €{reportValue.total}
				</h3>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
						gap: '0.5rem',
					}}
				>
					{reportValue.components.map((item, i) => (
						<div
							key={i}
							style={{ display: 'flex', justifyContent: 'space-between' }}
						>
							<span>{item.item}</span>
							<span style={{ fontWeight: 'bold' }}>€{item.value}</span>
						</div>
					))}
				</div>
				<div
					style={{ marginTop: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}
				>
					Oggi solo €{reportValue.discount}/anno - Risparmi €
					{reportValue.savings}!
				</div>
			</div>

			{/* Social Proof Ticker */}
			<div style={styles.socialProof}>
				<p style={{ fontSize: '1.125rem' }}>
					<span style={{ color: '#10b981' }}>🟢</span> {socialProof}
				</p>
			</div>

			{/* Pricing Plans */}
			<div style={styles.plansGrid}>
				{plans.map((plan) => (
					<div
						key={plan.id}
						style={{
							...styles.planCard,
							border: plan.popular ? '2px solid #10b981' : '1px solid #e5e7eb',
							transform: selectedPlan === plan.id ? 'scale(1.05)' : 'scale(1)',
						}}
						onMouseOver={(e) => {
							if (!plan.disabled) {
								e.currentTarget.style.transform = 'scale(1.05)';
								e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
							}
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.transform =
								selectedPlan === plan.id ? 'scale(1.05)' : 'scale(1)';
							e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
						}}
					>
						{plan.popular && (
							<div style={styles.popularBadge}>
								<Star
									size={14}
									style={{ display: 'inline', marginRight: '0.25rem' }}
								/>
								PIÙ POPOLARE
							</div>
						)}

						{plan.vip && (
							<div
								style={{ ...styles.popularBadge, backgroundColor: '#7c3aed' }}
							>
								<Crown
									size={14}
									style={{ display: 'inline', marginRight: '0.25rem' }}
								/>
								VIP
							</div>
						)}

						<h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
							{plan.name}
						</h3>

						<div style={{ marginBottom: '1.5rem' }}>
							{plan.originalPrice && (
								<span
									style={{
										textDecoration: 'line-through',
										color: '#9ca3af',
										marginRight: '0.5rem',
									}}
								>
									€{plan.originalPrice}
								</span>
							)}
							<span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
								{plan.price === 0 ? 'Gratis' : `€${plan.price}`}
							</span>
							<span style={{ color: '#6b7280' }}>{plan.period}</span>
							{plan.yearlyPrice && (
								<p
									style={{
										fontSize: '0.875rem',
										color: '#10b981',
										marginTop: '0.25rem',
									}}
								>
									o €{plan.yearlyPrice}/anno (risparmia 2 mesi!)
								</p>
							)}
						</div>

						{plan.savings && (
							<div
								style={{
									backgroundColor: '#fee2e2',
									color: '#dc2626',
									padding: '0.5rem',
									borderRadius: '0.25rem',
									marginBottom: '1rem',
									fontWeight: 'bold',
									textAlign: 'center',
								}}
							>
								{plan.savings}
							</div>
						)}

						{plan.limited && (
							<div
								style={{
									backgroundColor: '#fef3c7',
									color: '#f59e0b',
									padding: '0.5rem',
									borderRadius: '0.25rem',
									marginBottom: '1rem',
									fontWeight: 'bold',
									textAlign: 'center',
								}}
							>
								⚡ {plan.limited}
							</div>
						)}

						<ul style={{ marginBottom: '1.5rem' }}>
							{plan.features.map((feature, i) => (
								<li
									key={i}
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: '0.5rem',
										marginBottom: '0.5rem',
										color: feature.included ? '#374151' : '#9ca3af',
									}}
								>
									{feature.included ? (
										<Check size={20} color='#10b981' />
									) : (
										<X size={20} color='#ef4444' />
									)}
									<span
										style={{
											textDecoration: feature.included
												? 'none'
												: 'line-through',
										}}
									>
										{feature.text}
									</span>
								</li>
							))}
						</ul>

						<button
							onClick={() => {
								if (!plan.disabled) {
									setSelectedPlan(plan.id);
									// Qui implementerai Stripe
									alert(`Implementare pagamento per ${plan.name}`);
								}
							}}
							disabled={plan.disabled}
							style={{
								width: '100%',
								padding: '0.75rem',
								backgroundColor: plan.disabled
									? '#e5e7eb'
									: plan.vip
									? '#7c3aed'
									: '#10b981',
								color: plan.disabled ? '#9ca3af' : 'white',
								border: 'none',
								borderRadius: '0.375rem',
								fontSize: '1rem',
								fontWeight: 'bold',
								cursor: plan.disabled ? 'default' : 'pointer',
								transition: 'all 0.2s',
							}}
						>
							{plan.cta}
						</button>
					</div>
				))}
			</div>

			{/* Testimonials */}
			<div style={styles.testimonials}>
				<h2
					style={{
						fontSize: '2rem',
						textAlign: 'center',
						marginBottom: '2rem',
					}}
				>
					Cosa Dicono i Nostri Clienti
				</h2>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
						gap: '1rem',
					}}
				>
					{testimonials.map((testimonial, i) => (
						<div key={i} style={styles.testimonialCard}>
							<div
								style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}
							>
								<div
									style={{
										width: '50px',
										height: '50px',
										borderRadius: '50%',
										backgroundColor: '#e5e7eb',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontWeight: 'bold',
									}}
								>
									{testimonial.image}
								</div>
								<div>
									<h4 style={{ fontWeight: 'bold' }}>{testimonial.name}</h4>
									<p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
										{testimonial.location}
									</p>
									<div style={{ display: 'flex', gap: '0.25rem' }}>
										{[...Array(testimonial.rating)].map((_, i) => (
											<Star key={i} size={16} fill='#fbbf24' color='#fbbf24' />
										))}
									</div>
								</div>
							</div>
							<p style={{ fontStyle: 'italic', marginBottom: '0.5rem' }}>
								"{testimonial.text}"
							</p>
							<p style={{ fontWeight: 'bold', color: '#10b981' }}>
								Risparmio: {testimonial.savings}
							</p>
						</div>
					))}
				</div>
			</div>

			{/* Guarantee */}
			<div style={styles.guarantee}>
				<h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
					🛡️ Garanzia 30 Giorni Soddisfatti o Rimborsati
				</h3>
				<p style={{ color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
					Siamo così sicuri che amerai i nostri servizi che offriamo una
					garanzia completa di 30 giorni. Se non sei soddisfatto al 100%, ti
					rimborsiamo l'intero importo. Nessuna domanda.
				</p>
			</div>
		</div>
	);
};

export default PricingPage;
