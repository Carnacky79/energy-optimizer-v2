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
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
} from 'recharts';
import { reportsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const ReportDetailPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();
	const [report, setReport] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadReport = async () => {
			try {
				if (isAuthenticated && id !== 'local') {
					// Carica dal backend
					const response = await reportsAPI.getOne(id);
					setReport(response.data.report);
				} else {
					// Carica dal sessionStorage o localStorage
					const tempReport = sessionStorage.getItem('currentReport');
					if (tempReport) {
						setReport(JSON.parse(tempReport));
					} else {
						// Cerca nel localStorage
						const localReports = JSON.parse(
							localStorage.getItem('energy_optimizer_reports') || '[]'
						);
						const found = localReports.find((r) => r.id.toString() === id);
						setReport(found);
					}
				}
			} catch (error) {
				console.error('Error loading report:', error);
			} finally {
				setLoading(false);
			}
		};

		loadReport();
	}, [id, isAuthenticated]);

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
				<div>Caricamento report...</div>
			</div>
		);
	}

	if (!report) {
		return (
			<div style={{ textAlign: 'center', padding: '4rem' }}>
				<h2>Report non trovato</h2>
				<button
					onClick={() => navigate('/reports')}
					style={{ marginTop: '1rem' }}
				>
					Torna ai report
				</button>
			</div>
		);
	}

	// Prepara i dati per i grafici
	const savingsData = [
		{
			month: 'Gen',
			attuale: report.bill || report.formData?.bill || 100,
			ottimizzato: (report.bill || report.formData?.bill || 100) * 0.7,
		},
		{
			month: 'Feb',
			attuale: (report.bill || report.formData?.bill || 100) * 0.95,
			ottimizzato: (report.bill || report.formData?.bill || 100) * 0.95 * 0.7,
		},
		{
			month: 'Mar',
			attuale: (report.bill || report.formData?.bill || 100) * 0.9,
			ottimizzato: (report.bill || report.formData?.bill || 100) * 0.9 * 0.7,
		},
		{
			month: 'Apr',
			attuale: (report.bill || report.formData?.bill || 100) * 1.1,
			ottimizzato: (report.bill || report.formData?.bill || 100) * 1.1 * 0.7,
		},
		{
			month: 'Mag',
			attuale: (report.bill || report.formData?.bill || 100) * 1.2,
			ottimizzato: (report.bill || report.formData?.bill || 100) * 1.2 * 0.7,
		},
		{
			month: 'Giu',
			attuale: (report.bill || report.formData?.bill || 100) * 1.3,
			ottimizzato: (report.bill || report.formData?.bill || 100) * 1.3 * 0.7,
		},
	];

	const consumptionBreakdown = [
		{ name: 'Riscaldamento', value: 35, color: '#ef4444' },
		{ name: 'Illuminazione', value: 25, color: '#3b82f6' },
		{ name: 'Elettrodomestici', value: 20, color: '#10b981' },
		{ name: 'Acqua calda', value: 15, color: '#f59e0b' },
		{ name: 'Altro', value: 5, color: '#8b5cf6' },
	];

	const savingsBreakdown = [
		{ categoria: 'Illuminazione', attuale: 50, risparmio: 70 },
		{ categoria: 'Riscaldamento', attuale: 200, risparmio: 30 },
		{ categoria: 'Elettrodomestici', attuale: 80, risparmio: 25 },
		{ categoria: 'Acqua calda', attuale: 60, risparmio: 40 },
		{ categoria: 'Standby', attuale: 20, risparmio: 90 },
	];

	// Estrai i dati del report
	const efficiency =
		report.efficiencyLevel || report.results?.efficiencyLevel?.level || 'N/D';
	const annualSavings =
		report.annualSavings ||
		report.results?.savingsPotential?.annualSavings ||
		0;
	const monthlySavings =
		report.monthlySavings ||
		report.results?.savingsPotential?.monthlySavings ||
		annualSavings / 12;
	const roi = report.roi || report.results?.roi || 0;
	const co2Savings = report.co2Savings || report.results?.co2Savings || 0;

	const styles = {
		container: {
			maxWidth: '1200px',
			margin: '0 auto',
			padding: '2rem 1rem',
		},
		header: {
			marginBottom: '2rem',
		},
		backButton: {
			display: 'flex',
			alignItems: 'center',
			gap: '0.5rem',
			padding: '0.5rem 1rem',
			backgroundColor: '#f3f4f6',
			border: 'none',
			borderRadius: '0.375rem',
			cursor: 'pointer',
			marginBottom: '1rem',
		},
		titleSection: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: '2rem',
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
			backgroundColor: 'white',
			border: '1px solid #e5e7eb',
			borderRadius: '0.375rem',
			cursor: 'pointer',
		},
		section: {
			backgroundColor: 'white',
			borderRadius: '0.5rem',
			boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
			padding: '2rem',
			marginBottom: '2rem',
		},
		metricsGrid: {
			display: 'grid',
			gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
			gap: '1.5rem',
			marginBottom: '2rem',
		},
		metricCard: {
			textAlign: 'center',
			padding: '1.5rem',
			backgroundColor: '#f9fafb',
			borderRadius: '0.5rem',
		},
		chartGrid: {
			display: 'grid',
			gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
			gap: '2rem',
		},
		recommendation: {
			display: 'flex',
			gap: '1rem',
			padding: '1rem',
			backgroundColor: '#f9fafb',
			borderRadius: '0.5rem',
			marginBottom: '1rem',
		},
		premiumBanner: {
			background: 'linear-gradient(to right, #7c3aed, #2563eb)',
			color: 'white',
			padding: '2rem',
			borderRadius: '0.5rem',
			textAlign: 'center',
		},
	};

	const getIcon = (title) => {
		if (title?.includes('Illuminazione')) return <Lightbulb size={24} />;
		if (title?.includes('Isolamento')) return <Home size={24} />;
		if (title?.includes('Gestione')) return <Shield size={24} />;
		return <TrendingDown size={24} />;
	};

	return (
		<div style={styles.container}>
			<div style={styles.header}>
				<button style={styles.backButton} onClick={() => navigate('/reports')}>
					<ArrowLeft size={20} />
					Torna ai report
				</button>

				<div style={styles.titleSection}>
					<div>
						<h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
							{report.title ||
								`Report del ${new Date(
									report.createdAt || report.date
								).toLocaleDateString('it-IT')}`}
						</h1>
						<p style={{ color: '#6b7280' }}>
							Creato il{' '}
							{new Date(report.createdAt || report.date).toLocaleString(
								'it-IT'
							)}
						</p>
					</div>
					<div style={styles.actions}>
						<button style={styles.actionButton} onClick={() => window.print()}>
							<Printer size={20} />
							Stampa
						</button>
						<button
							style={styles.actionButton}
							onClick={() => alert('Funzione disponibile per utenti Premium')}
						>
							<Download size={20} />
							PDF
						</button>
						<button
							style={styles.actionButton}
							onClick={() => alert('Funzione disponibile a breve')}
						>
							<Share2 size={20} />
							Condividi
						</button>
					</div>
				</div>
			</div>

			{/* Riepilogo Principale */}
			<div style={styles.section}>
				<h2 style={{ marginBottom: '1.5rem' }}>Riepilogo Analisi Energetica</h2>

				<div style={styles.metricsGrid}>
					<div style={styles.metricCard}>
						<h3 style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
							Efficienza Energetica
						</h3>
						<p
							style={{
								fontSize: '2.5rem',
								fontWeight: 'bold',
								color: '#059669',
							}}
						>
							{efficiency}
						</p>
					</div>
					<div style={styles.metricCard}>
						<PiggyBank
							size={48}
							color='#10b981'
							style={{ marginBottom: '0.5rem' }}
						/>
						<h3 style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
							Risparmio Annuale
						</h3>
						<p
							style={{
								fontSize: '2.5rem',
								fontWeight: 'bold',
								color: '#10b981',
							}}
						>
							€{annualSavings.toFixed(0)}
						</p>
						<p style={{ color: '#6b7280' }}>
							€{monthlySavings.toFixed(0)}/mese
						</p>
					</div>
					<div style={styles.metricCard}>
						<TrendingDown
							size={48}
							color='#2563eb'
							style={{ marginBottom: '0.5rem' }}
						/>
						<h3 style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
							ROI Stimato
						</h3>
						<p
							style={{
								fontSize: '2.5rem',
								fontWeight: 'bold',
								color: '#2563eb',
							}}
						>
							{roi.toFixed(1)} anni
						</p>
					</div>
					<div style={styles.metricCard}>
						<Leaf
							size={48}
							color='#10b981'
							style={{ marginBottom: '0.5rem' }}
						/>
						<h3 style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
							CO2 Risparmiata
						</h3>
						<p
							style={{
								fontSize: '2.5rem',
								fontWeight: 'bold',
								color: '#10b981',
							}}
						>
							{(co2Savings / 1000).toFixed(1)} ton
						</p>
						<p style={{ color: '#6b7280' }}>all'anno</p>
					</div>
				</div>
			</div>

			{/* Grafici */}
			<div style={styles.section}>
				<h2 style={{ marginBottom: '1.5rem' }}>Analisi Dettagliata</h2>

				<div style={styles.chartGrid}>
					<div>
						<h3 style={{ marginBottom: '1rem' }}>Proiezione Spesa Mensile</h3>
						<ResponsiveContainer width='100%' height={300}>
							<LineChart data={savingsData}>
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
									strokeWidth={2}
								/>
								<Line
									type='monotone'
									dataKey='ottimizzato'
									stroke='#10b981'
									name='Spesa Ottimizzata'
									strokeWidth={2}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>

					<div>
						<h3 style={{ marginBottom: '1rem' }}>Distribuzione Consumi</h3>
						<ResponsiveContainer width='100%' height={300}>
							<PieChart>
								<Pie
									data={consumptionBreakdown}
									cx='50%'
									cy='50%'
									labelLine={false}
									label={(entry) => `${entry.name} ${entry.value}%`}
									outerRadius={80}
									fill='#8884d8'
									dataKey='value'
								>
									{consumptionBreakdown.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>

				<div style={{ marginTop: '2rem' }}>
					<h3 style={{ marginBottom: '1rem' }}>
						Potenziale di Risparmio per Categoria
					</h3>
					<ResponsiveContainer width='100%' height={300}>
						<BarChart data={savingsBreakdown}>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis dataKey='categoria' />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar
								dataKey='attuale'
								fill='#ef4444'
								name='Consumo Attuale (€)'
							/>
							<Bar dataKey='risparmio' fill='#10b981' name='Risparmio (%)' />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Raccomandazioni */}
			<div style={styles.section}>
				<h2 style={{ marginBottom: '1.5rem' }}>Piano d'Azione Consigliato</h2>

				{(
					report.recommendations ||
					report.results?.tips || [
						{
							title: 'Illuminazione LED',
							description:
								'Sostituisci tutte le lampade con LED ad alta efficienza',
							savings: 'Fino al 80% sui consumi',
							priority: 'alta',
						},
						{
							title: 'Isolamento termico',
							description: "Migliora l'isolamento di pareti e infissi",
							savings: 'Riduzione del 30% sui costi',
							priority: 'media',
						},
						{
							title: 'Gestione intelligente',
							description: 'Installa termostati smart',
							savings: 'Ottimizzazione automatica',
							priority: 'media',
						},
					]
				).map((rec, index) => (
					<div key={index} style={styles.recommendation}>
						<div
							style={{
								padding: '0.5rem',
								backgroundColor:
									rec.priority === 'alta' ? '#fee2e2' : '#f0fdf4',
								borderRadius: '0.5rem',
								height: 'fit-content',
							}}
						>
							{getIcon(rec.title)}
						</div>
						<div style={{ flex: 1 }}>
							<h4 style={{ marginBottom: '0.5rem' }}>{rec.title}</h4>
							<p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>
								{rec.description}
							</p>
							<p style={{ color: '#059669', fontWeight: 'bold' }}>
								{rec.savings}
							</p>
						</div>
						<div
							style={{
								padding: '0.25rem 0.75rem',
								backgroundColor:
									rec.priority === 'alta' ? '#dc2626' : '#f59e0b',
								color: 'white',
								borderRadius: '0.25rem',
								fontSize: '0.875rem',
								height: 'fit-content',
							}}
						>
							Priorità {rec.priority || 'media'}
						</div>
					</div>
				))}
			</div>

			{/* Dati Tecnici */}
			<div style={styles.section}>
				<h2 style={{ marginBottom: '1.5rem' }}>Dati Tecnici</h2>

				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(2, 1fr)',
						gap: '1rem',
					}}
				>
					<div>
						<h4 style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
							Informazioni Edificio
						</h4>
						<p>
							Superficie:{' '}
							<strong>{report.area || report.formData?.area} m²</strong>
						</p>
						<p>
							Tipo:{' '}
							<strong>
								{report.buildingType || report.formData?.buildingType}
							</strong>
						</p>
						<p>
							Riscaldamento:{' '}
							<strong>
								{report.heatingType || report.formData?.heatingType}
							</strong>
						</p>
						{(report.occupants || report.formData?.occupants) && (
							<p>
								Occupanti:{' '}
								<strong>
									{report.occupants || report.formData?.occupants}
								</strong>
							</p>
						)}
					</div>
					<div>
						<h4 style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
							Consumi Attuali
						</h4>
						<p>
							Consumo mensile:{' '}
							<strong>
								{report.consumption || report.formData?.consumption} kWh
							</strong>
						</p>
						<p>
							Spesa mensile:{' '}
							<strong>€{report.bill || report.formData?.bill}</strong>
						</p>
						<p>
							Consumo per m²:{' '}
							<strong>
								{(
									(report.consumption || report.formData?.consumption) /
									(report.area || report.formData?.area)
								).toFixed(1)}{' '}
								kWh/m²
							</strong>
						</p>
					</div>
				</div>
			</div>

			{/* Premium Upsell */}
			{!isAuthenticated && (
				<div style={styles.premiumBanner}>
					<h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
						🚀 Sblocca l'Analisi Completa Premium
					</h2>
					<p style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>
						Ottieni un piano dettagliato personalizzato con oltre 50 consigli
						specifici per la tua situazione
					</p>
					<button
						onClick={() => navigate('/pricing')}
						style={{
							padding: '1rem 2rem',
							backgroundColor: 'white',
							color: '#7c3aed',
							border: 'none',
							borderRadius: '0.5rem',
							fontSize: '1.125rem',
							fontWeight: 'bold',
							cursor: 'pointer',
						}}
					>
						Passa a Premium →
					</button>
				</div>
			)}
		</div>
	);
};

export default ReportDetailPage;
