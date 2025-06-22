// src/pages/ReportDetailPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	ArrowLeft,
	Download,
	Share2,
	Printer,
	PiggyBank,
	TrendingDown,
	Leaf,
	Home,
	Lightbulb,
	Shield,
} from 'lucide-react';
import {
	LineChart,
	Line,
	PieChart,
	Pie,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Cell,
} from 'recharts';
import { reportsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ShareModal from '../components/ShareModal';

const ReportDetailPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();
	const [report, setReport] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showShareModal, setShowShareModal] = useState(false);

	// Helper function per estrarre valori numerici in modo sicuro
	const getNumericValue = (value, defaultValue = 0) => {
		const num = parseFloat(value);
		return isNaN(num) ? defaultValue : num;
	};

	useEffect(() => {
		const loadReport = async () => {
			try {
				if (isAuthenticated && id !== 'local') {
					// Carica dal backend
					const response = await reportsAPI.getOne(id);
					setReport(response.data.report);
				} else {
					// Carica dal sessionStorage per visualizzazione temporanea
					const tempReport = JSON.parse(
						sessionStorage.getItem('currentReport') || '{}'
					);
					setReport(tempReport);
				}
			} catch (error) {
				console.error('Errore caricamento report:', error);
				navigate('/reports');
			} finally {
				setLoading(false);
			}
		};

		loadReport();
	}, [id, isAuthenticated, navigate]);

	const styles = {
		container: {
			maxWidth: '1200px',
			margin: '0 auto',
			padding: '2rem',
		},
		header: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: '2rem',
		},
		backButton: {
			display: 'flex',
			alignItems: 'center',
			gap: '0.5rem',
			padding: '0.5rem 1rem',
			border: '1px solid #d1d5db',
			borderRadius: '0.375rem',
			backgroundColor: 'white',
			cursor: 'pointer',
			fontSize: '0.875rem',
		},
		actions: {
			display: 'flex',
			gap: '0.5rem',
		},
		actionButton: {
			display: 'flex',
			alignItems: 'center',
			gap: '0.5rem',
			padding: '0.5rem 1rem',
			border: '1px solid #d1d5db',
			borderRadius: '0.375rem',
			backgroundColor: 'white',
			cursor: 'pointer',
			fontSize: '0.875rem',
		},
		metricsGrid: {
			display: 'grid',
			gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
			gap: '1.5rem',
			marginBottom: '2rem',
		},
		metricCard: {
			backgroundColor: 'white',
			padding: '1.5rem',
			borderRadius: '0.5rem',
			boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
			display: 'flex',
			alignItems: 'center',
			gap: '1rem',
		},
		metricValue: {
			fontSize: '1.875rem',
			fontWeight: 'bold',
			color: '#1f2937',
		},
		metricLabel: {
			fontSize: '0.875rem',
			color: '#6b7280',
		},
		section: {
			backgroundColor: 'white',
			padding: '1.5rem',
			borderRadius: '0.5rem',
			boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
			marginBottom: '1.5rem',
		},
		sectionTitle: {
			fontSize: '1.125rem',
			fontWeight: '600',
			marginBottom: '1rem',
			color: '#1f2937',
		},
		chartContainer: {
			height: '300px',
			marginTop: '1rem',
		},
		recommendationList: {
			listStyle: 'none',
			padding: 0,
		},
		recommendationItem: {
			display: 'flex',
			alignItems: 'flex-start',
			gap: '0.75rem',
			padding: '0.75rem',
			marginBottom: '0.5rem',
			backgroundColor: '#f9fafb',
			borderRadius: '0.375rem',
		},
		priorityBadge: {
			display: 'inline-block',
			padding: '0.25rem 0.75rem',
			borderRadius: '9999px',
			fontSize: '0.75rem',
			fontWeight: '500',
		},
		dataGrid: {
			display: 'grid',
			gridTemplateColumns: 'repeat(2, 1fr)',
			gap: '1rem',
		},
		dataItem: {
			display: 'flex',
			justifyContent: 'space-between',
			padding: '0.5rem 0',
			borderBottom: '1px solid #e5e7eb',
		},
		dataLabel: {
			color: '#6b7280',
			fontSize: '0.875rem',
		},
		dataValue: {
			fontWeight: '500',
			color: '#1f2937',
		},
		upsellBanner: {
			backgroundColor: '#fef3c7',
			border: '1px solid #fcd34d',
			borderRadius: '0.5rem',
			padding: '1.5rem',
			textAlign: 'center',
			marginTop: '2rem',
		},
		upsellTitle: {
			fontSize: '1.125rem',
			fontWeight: '600',
			marginBottom: '0.5rem',
			color: '#92400e',
		},
		premiumButton: {
			marginTop: '1rem',
			padding: '0.75rem 2rem',
			backgroundColor: '#f59e0b',
			color: 'white',
			border: 'none',
			borderRadius: '0.375rem',
			fontWeight: '500',
			cursor: 'pointer',
		},
	};

	if (loading) {
		return (
			<div style={styles.container}>
				<div style={{ textAlign: 'center', padding: '4rem' }}>
					<div className='spinner' />
					<p style={{ marginTop: '1rem', color: '#6b7280' }}>
						Caricamento report...
					</p>
				</div>
			</div>
		);
	}

	if (!report) {
		return (
			<div style={styles.container}>
				<div style={{ textAlign: 'center', padding: '4rem' }}>
					<p style={{ marginBottom: '1rem', color: '#6b7280' }}>
						Report non trovato
					</p>
					<button
						onClick={() => navigate('/reports')}
						style={styles.backButton}
					>
						Torna ai report
					</button>
				</div>
			</div>
		);
	}

	// Estrai i valori in modo sicuro
	const annualSavings = getNumericValue(
		report?.annualSavings ||
			report?.results?.savingsPotential?.annualSavings ||
			report?.results?.annualSavings
	);

	const monthlySavings = getNumericValue(
		report?.monthlySavings ||
			report?.results?.savingsPotential?.monthlySavings ||
			report?.results?.monthlySavings ||
			annualSavings / 12
	);

	const currentBill = getNumericValue(
		report?.data?.bill || report?.data?.currentBill || 100
	);

	const consumption = getNumericValue(
		report?.data?.consumption || report?.data?.monthlyConsumption || 300
	);

	const co2Savings = getNumericValue(
		report?.co2Savings ||
			report?.results?.environmental?.co2Savings ||
			report?.results?.co2Saved ||
			0
	);

	const efficiencyLevel = report?.results?.efficiencyLevel || 'C';
	const recommendations =
		report?.recommendations || report?.results?.recommendations || [];

	// Dati per i grafici
	const monthlyData = [
		{
			month: 'Gen',
			attuale: currentBill,
			ottimizzato: currentBill - monthlySavings,
		},
		{
			month: 'Feb',
			attuale: currentBill,
			ottimizzato: currentBill - monthlySavings,
		},
		{
			month: 'Mar',
			attuale: currentBill,
			ottimizzato: currentBill - monthlySavings,
		},
		{
			month: 'Apr',
			attuale: currentBill,
			ottimizzato: currentBill - monthlySavings,
		},
		{
			month: 'Mag',
			attuale: currentBill,
			ottimizzato: currentBill - monthlySavings,
		},
		{
			month: 'Giu',
			attuale: currentBill,
			ottimizzato: currentBill - monthlySavings,
		},
	];

	const consumptionData = [
		{ name: 'Illuminazione', value: consumption * 0.15 },
		{ name: 'Riscaldamento', value: consumption * 0.35 },
		{ name: 'Elettrodomestici', value: consumption * 0.3 },
		{ name: 'Acqua calda', value: consumption * 0.2 },
	];

	const savingsData = [
		{ category: 'Illuminazione', risparmio: monthlySavings * 0.25 },
		{ category: 'Riscaldamento', risparmio: monthlySavings * 0.4 },
		{ category: 'Elettrodomestici', risparmio: monthlySavings * 0.2 },
		{ category: 'Comportamento', risparmio: monthlySavings * 0.15 },
	];

	const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

	const priorityColors = {
		Alta: { bg: '#fee2e2', color: '#dc2626' },
		Media: { bg: '#fed7aa', color: '#ea580c' },
		Bassa: { bg: '#d1fae5', color: '#059669' },
	};

	const renderRecommendation = (rec) => {
		// Se è una stringa, restituiscila direttamente
		if (typeof rec === 'string') {
			return rec;
		}

		// Se è un oggetto, estrai il testo principale
		if (typeof rec === 'object' && rec !== null) {
			return rec.title || rec.action || rec.description || JSON.stringify(rec);
		}

		// Fallback
		return 'Raccomandazione';
	};

	return (
		<div style={styles.container}>
			{/* Header */}
			<div style={styles.header}>
				<button onClick={() => navigate('/reports')} style={styles.backButton}>
					<ArrowLeft size={20} />
					Torna ai report
				</button>
				<div style={styles.actions}>
					<button style={styles.actionButton} onClick={() => window.print()}>
						<Printer size={20} />
						Stampa
					</button>
					<button
						style={styles.actionButton}
						onClick={() => setShowShareModal(true)}
					>
						<Share2 size={20} />
						Condividi
					</button>
					{isAuthenticated ? (
						<button
							style={{
								...styles.actionButton,
								backgroundColor: '#3b82f6',
								color: 'white',
							}}
							onClick={() => alert('Generazione PDF disponibile a breve')}
						>
							<Download size={20} />
							Scarica PDF
						</button>
					) : (
						<button
							style={{
								...styles.actionButton,
								backgroundColor: '#f59e0b',
								color: 'white',
							}}
							onClick={() => navigate('/register')}
						>
							<Shield size={20} />
							Registrati per PDF
						</button>
					)}
				</div>
			</div>

			{/* Titolo Report */}
			<h1
				style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}
			>
				{report.title ||
					`Report del ${new Date(report.createdAt).toLocaleDateString(
						'it-IT'
					)}`}
			</h1>

			{/* Metriche principali */}
			<div style={styles.metricsGrid}>
				<div style={styles.metricCard}>
					<PiggyBank size={32} color='#10b981' />
					<div>
						<div style={styles.metricValue}>€{annualSavings.toFixed(0)}</div>
						<div style={styles.metricLabel}>Risparmio Annuale</div>
					</div>
				</div>

				<div style={styles.metricCard}>
					<TrendingDown size={32} color='#3b82f6' />
					<div>
						<div style={styles.metricValue}>
							€{monthlySavings.toFixed(0)}/mese
						</div>
						<div style={styles.metricLabel}>Risparmio Mensile</div>
					</div>
				</div>

				<div style={styles.metricCard}>
					<Leaf size={32} color='#10b981' />
					<div>
						<div style={styles.metricValue}>{co2Savings.toFixed(2)} ton</div>
						<div style={styles.metricLabel}>CO2 Risparmiata</div>
					</div>
				</div>

				<div style={styles.metricCard}>
					<Home size={32} color='#f59e0b' />
					<div>
						<div style={styles.metricValue}>Classe {efficiencyLevel}</div>
						<div style={styles.metricLabel}>Efficienza Energetica</div>
					</div>
				</div>
			</div>

			{/* Grafici */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '2fr 1fr',
					gap: '1.5rem',
				}}
			>
				{/* Proiezione spesa mensile */}
				<div style={styles.section}>
					<h3 style={styles.sectionTitle}>📊 Proiezione Spesa Mensile</h3>
					<div style={styles.chartContainer}>
						<ResponsiveContainer width='100%' height='100%'>
							<LineChart data={monthlyData}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='month' />
								<YAxis />
								<Tooltip formatter={(value) => `€${value.toFixed(0)}`} />
								<Legend />
								<Line
									type='monotone'
									dataKey='attuale'
									stroke='#ef4444'
									name='Spesa Attuale'
								/>
								<Line
									type='monotone'
									dataKey='ottimizzato'
									stroke='#10b981'
									name='Spesa Ottimizzata'
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Distribuzione consumi */}
				<div style={styles.section}>
					<h3 style={styles.sectionTitle}>🥧 Distribuzione Consumi</h3>
					<div style={styles.chartContainer}>
						<ResponsiveContainer width='100%' height='100%'>
							<PieChart>
								<Pie
									data={consumptionData}
									cx='50%'
									cy='50%'
									labelLine={false}
									label={({ name, percent }) =>
										`${name} ${(percent * 100).toFixed(0)}%`
									}
									outerRadius={80}
									fill='#8884d8'
									dataKey='value'
								>
									{consumptionData.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip formatter={(value) => `${value.toFixed(0)} kWh`} />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>

			{/* Potenziale risparmio per categoria */}
			<div style={styles.section}>
				<h3 style={styles.sectionTitle}>
					💰 Potenziale Risparmio per Categoria
				</h3>
				<div style={styles.chartContainer}>
					<ResponsiveContainer width='100%' height='100%'>
						<BarChart data={savingsData}>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis dataKey='category' />
							<YAxis />
							<Tooltip formatter={(value) => `€${value.toFixed(0)}`} />
							<Bar dataKey='risparmio' fill='#10b981' />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Piano d'azione consigliato */}
			<div style={styles.section}>
				<h3 style={styles.sectionTitle}>📋 Piano d'Azione Consigliato</h3>
				<ul style={styles.recommendationList}>
					{recommendations.length > 0 ? (
						recommendations.map((rec, index) => {
							const priority = typeof rec === 'object' ? rec.priority : null;
							const savings = typeof rec === 'object' ? rec.savings : null;

							return (
								<li key={index} style={styles.recommendationItem}>
									<Lightbulb size={20} color='#f59e0b' />
									<div style={{ flex: 1 }}>
										<div style={{ marginBottom: '0.25rem' }}>
											{renderRecommendation(rec)}
										</div>
										<div
											style={{
												display: 'flex',
												gap: '0.5rem',
												alignItems: 'center',
											}}
										>
											{priority && (
												<span
													style={{
														...styles.priorityBadge,
														backgroundColor:
															priorityColors[priority]?.bg || '#f3f4f6',
														color: priorityColors[priority]?.color || '#6b7280',
													}}
												>
													Priorità {priority}
												</span>
											)}
											{savings && (
												<span
													style={{ fontSize: '0.875rem', color: '#10b981' }}
												>
													Risparmio: €{savings}/anno
												</span>
											)}
										</div>
									</div>
								</li>
							);
						})
					) : (
						// Raccomandazioni di default...
						<>
							<li style={styles.recommendationItem}>
								<Lightbulb size={20} color='#f59e0b' />
								<div style={{ flex: 1 }}>
									<div style={{ marginBottom: '0.25rem' }}>
										Sostituisci le lampadine con LED
									</div>
									<span
										style={{
											...styles.priorityBadge,
											backgroundColor: '#fee2e2',
											color: '#dc2626',
										}}
									>
										Priorità Alta
									</span>
								</div>
							</li>
							<li style={styles.recommendationItem}>
								<Lightbulb size={20} color='#f59e0b' />
								<div style={{ flex: 1 }}>
									<div style={{ marginBottom: '0.25rem' }}>
										Installa un termostato programmabile
									</div>
									<span
										style={{
											...styles.priorityBadge,
											backgroundColor: '#fee2e2',
											color: '#dc2626',
										}}
									>
										Priorità Alta
									</span>
								</div>
							</li>
							<li style={styles.recommendationItem}>
								<Lightbulb size={20} color='#f59e0b' />
								<div style={{ flex: 1 }}>
									<div style={{ marginBottom: '0.25rem' }}>
										Migliora l'isolamento termico
									</div>
									<span
										style={{
											...styles.priorityBadge,
											backgroundColor: '#fed7aa',
											color: '#ea580c',
										}}
									>
										Priorità Media
									</span>
								</div>
							</li>
						</>
					)}
				</ul>
			</div>

			{/* Dati tecnici */}
			<div style={styles.section}>
				<h3 style={styles.sectionTitle}>🔧 Dati Tecnici dell'Analisi</h3>
				<div style={styles.dataGrid}>
					<div style={styles.dataItem}>
						<span style={styles.dataLabel}>Consumo mensile</span>
						<span style={styles.dataValue}>{consumption} kWh</span>
					</div>
					<div style={styles.dataItem}>
						<span style={styles.dataLabel}>Spesa mensile attuale</span>
						<span style={styles.dataValue}>€{currentBill}</span>
					</div>
					<div style={styles.dataItem}>
						<span style={styles.dataLabel}>Efficienza stimata</span>
						<span style={styles.dataValue}>
							{Math.round((1 - monthlySavings / currentBill) * 100)}%
						</span>
					</div>
					<div style={styles.dataItem}>
						<span style={styles.dataLabel}>ROI stimato</span>
						<span style={styles.dataValue}>
							{((annualSavings / 1000) * 100).toFixed(0)}%
						</span>
					</div>
				</div>
			</div>

			{/* Upsell per non registrati */}
			{!isAuthenticated && (
				<div style={styles.upsellBanner}>
					<h3 style={styles.upsellTitle}>🚀 Sblocca il Potenziale Completo!</h3>
					<p>Registrati per ottenere:</p>
					<ul
						style={{
							marginTop: '0.5rem',
							textAlign: 'left',
							display: 'inline-block',
						}}
					>
						<li>✅ Report PDF scaricabili</li>
						<li>✅ Consulenza personalizzata</li>
						<li>✅ Monitoraggio continuo dei risparmi</li>
						<li>✅ Accesso a fornitori certificati</li>
					</ul>
					<button
						onClick={() => navigate('/register')}
						style={styles.premiumButton}
					>
						Registrati Gratis
					</button>
				</div>
			)}

			{/* Share Modal */}
			{showShareModal && (
				<ShareModal report={report} onClose={() => setShowShareModal(false)} />
			)}
		</div>
	);
};

export default ReportDetailPage;
