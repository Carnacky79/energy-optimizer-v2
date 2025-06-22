// src/components/Calculator/ResultsDisplay.js

import React from 'react';
import {
	PiggyBank,
	TrendingDown,
	Leaf,
	Lightbulb,
	Home,
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
} from 'recharts';

const styles = {
	container: {
		marginTop: '2rem',
	},
	scoreCard: {
		backgroundColor: 'white',
		borderRadius: '0.5rem',
		boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
		padding: '1.5rem',
		marginBottom: '1.5rem',
	},
	resultsGrid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
		gap: '1rem',
		marginBottom: '2rem',
	},
	resultCard: {
		backgroundColor: 'white',
		borderRadius: '0.5rem',
		boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
		padding: '1.5rem',
		textAlign: 'center',
		transition: 'transform 0.2s',
		cursor: 'default',
	},
	chartContainer: {
		backgroundColor: 'white',
		borderRadius: '0.5rem',
		boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
		padding: '1.5rem',
		marginBottom: '1rem',
	},
	tipsContainer: {
		backgroundColor: 'white',
		borderRadius: '0.5rem',
		boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
		padding: '1.5rem',
	},
	tipsGrid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
		gap: '1rem',
	},
	tipCard: {
		border: '1px solid #e5e7eb',
		borderRadius: '0.5rem',
		padding: '1rem',
		transition: 'all 0.2s',
	},
	priorityBadge: {
		display: 'inline-block',
		padding: '0.25rem 0.5rem',
		borderRadius: '0.25rem',
		fontSize: '0.75rem',
		fontWeight: 'bold',
		marginLeft: '0.5rem',
	},
};

const ResultsDisplay = ({ results }) => {
	// Dati per i grafici
	const savingsData = [
		{
			month: 'Gen',
			attuale: results.formData.bill * 1,
			ottimizzato:
				results.formData.bill * (1 - results.savingsPotential.percentage / 100),
		},
		{
			month: 'Feb',
			attuale: results.formData.bill * 0.95,
			ottimizzato:
				results.formData.bill *
				0.95 *
				(1 - results.savingsPotential.percentage / 100),
		},
		{
			month: 'Mar',
			attuale: results.formData.bill * 0.9,
			ottimizzato:
				results.formData.bill *
				0.9 *
				(1 - results.savingsPotential.percentage / 100),
		},
		{
			month: 'Apr',
			attuale: results.formData.bill * 1.1,
			ottimizzato:
				results.formData.bill *
				1.1 *
				(1 - results.savingsPotential.percentage / 100),
		},
		{
			month: 'Mag',
			attuale: results.formData.bill * 1.2,
			ottimizzato:
				results.formData.bill *
				1.2 *
				(1 - results.savingsPotential.percentage / 100),
		},
		{
			month: 'Giu',
			attuale: results.formData.bill * 1.3,
			ottimizzato:
				results.formData.bill *
				1.3 *
				(1 - results.savingsPotential.percentage / 100),
		},
	];

	const consumptionBreakdown = [
		{ categoria: 'Riscaldamento', percentuale: 35, risparmio: 30 },
		{ categoria: 'Illuminazione', percentuale: 25, risparmio: 70 },
		{ categoria: 'Elettrodomestici', percentuale: 20, risparmio: 25 },
		{ categoria: 'Acqua calda', percentuale: 15, risparmio: 40 },
		{ categoria: 'Altro', percentuale: 5, risparmio: 10 },
	];

	const getIcon = (title) => {
		switch (title) {
			case 'Illuminazione LED':
				return <Lightbulb size={20} />;
			case 'Isolamento termico':
				return <Home size={20} />;
			case 'Gestione intelligente':
				return <Shield size={20} />;
			default:
				return <TrendingDown size={20} />;
		}
	};

	const getPriorityColor = (priority) => {
		switch (priority) {
			case 'alta':
				return '#dc2626';
			case 'media':
				return '#f59e0b';
			case 'bassa':
				return '#10b981';
			default:
				return '#6b7280';
		}
	};

	return (
		<div style={styles.container}>
			{/* Efficiency Score */}
			<div style={styles.scoreCard}>
				<h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
					Il tuo livello di efficienza energetica
				</h3>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<div>
						<p
							style={{
								fontSize: '2rem',
								fontWeight: 'bold',
								color: results.efficiencyLevel.color,
							}}
						>
							{results.efficiencyLevel.level}
						</p>
						<p style={{ color: '#6b7280' }}>
							Punteggio: {results.efficiencyLevel.score}/100
						</p>
					</div>
					<div style={{ textAlign: 'right' }}>
						<p
							style={{
								fontSize: '1.5rem',
								fontWeight: 'bold',
								color: '#059669',
							}}
						>
							-{results.savingsPotential.percentage}%
						</p>
						<p style={{ color: '#6b7280' }}>Potenziale di risparmio</p>
					</div>
				</div>
			</div>

			{/* Key Metrics */}
			<div style={styles.resultsGrid}>
				<div
					style={styles.resultCard}
					onMouseOver={(e) =>
						(e.currentTarget.style.transform = 'translateY(-2px)')
					}
					onMouseOut={(e) =>
						(e.currentTarget.style.transform = 'translateY(0)')
					}
				>
					<PiggyBank
						size={32}
						color='#059669'
						style={{ marginBottom: '0.5rem' }}
					/>
					<h4 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
						Risparmio Annuale
					</h4>
					<p
						style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}
					>
						€{results.savingsPotential.annualSavings.toFixed(0)}
					</p>
					<p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
						€{results.savingsPotential.monthlySavings.toFixed(0)}/mese
					</p>
				</div>

				<div
					style={styles.resultCard}
					onMouseOver={(e) =>
						(e.currentTarget.style.transform = 'translateY(-2px)')
					}
					onMouseOut={(e) =>
						(e.currentTarget.style.transform = 'translateY(0)')
					}
				>
					<TrendingDown
						size={32}
						color='#2563eb'
						style={{ marginBottom: '0.5rem' }}
					/>
					<h4 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
						ROI Stimato
					</h4>
					<p
						style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}
					>
						{results.roi.toFixed(1)} anni
					</p>
					<p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
						Investimento: €{results.investment.toFixed(0)}
					</p>
				</div>

				<div
					style={styles.resultCard}
					onMouseOver={(e) =>
						(e.currentTarget.style.transform = 'translateY(-2px)')
					}
					onMouseOut={(e) =>
						(e.currentTarget.style.transform = 'translateY(0)')
					}
				>
					<Leaf size={32} color='#059669' style={{ marginBottom: '0.5rem' }} />
					<h4 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
						CO2 Risparmiata
					</h4>
					<p
						style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}
					>
						{(results.co2Savings / 1000).toFixed(1)} ton
					</p>
					<p style={{ fontSize: '0.875rem', color: '#6b7280' }}>All'anno</p>
				</div>
			</div>

			{/* Charts */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
					gap: '1rem',
					marginBottom: '2rem',
				}}
			>
				<div style={styles.chartContainer}>
					<h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
						Proiezione Bollette (€/mese)
					</h4>
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

				<div style={styles.chartContainer}>
					<h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
						Potenziale di Risparmio per Categoria (%)
					</h4>
					<ResponsiveContainer width='100%' height={300}>
						<BarChart data={consumptionBreakdown}>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis
								dataKey='categoria'
								angle={-45}
								textAnchor='end'
								height={80}
							/>
							<YAxis />
							<Tooltip />
							<Bar dataKey='risparmio' fill='#10b981' name='Risparmio %' />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Recommended Actions */}
			<div style={styles.tipsContainer}>
				<h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
					Azioni Consigliate
				</h3>
				<div style={styles.tipsGrid}>
					{results.tips.map((tip, index) => (
						<div
							key={index}
							style={styles.tipCard}
							onMouseOver={(e) => {
								e.currentTarget.style.borderColor = '#059669';
								e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
							}}
							onMouseOut={(e) => {
								e.currentTarget.style.borderColor = '#e5e7eb';
								e.currentTarget.style.boxShadow = 'none';
							}}
						>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									marginBottom: '0.5rem',
								}}
							>
								<div
									style={{
										padding: '0.5rem',
										backgroundColor: '#d1fae5',
										borderRadius: '0.5rem',
										marginRight: '0.75rem',
									}}
								>
									{getIcon(tip.title)}
								</div>
								<h4 style={{ fontWeight: 'bold', flex: 1 }}>{tip.title}</h4>
								<span
									style={{
										...styles.priorityBadge,
										backgroundColor: getPriorityColor(tip.priority) + '20',
										color: getPriorityColor(tip.priority),
									}}
								>
									Priorità {tip.priority}
								</span>
							</div>
							<p
								style={{
									fontSize: '0.875rem',
									color: '#6b7280',
									marginBottom: '0.5rem',
								}}
							>
								{tip.description}
							</p>
							<p
								style={{
									fontSize: '0.875rem',
									fontWeight: 'bold',
									color: '#059669',
								}}
							>
								{tip.savings}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ResultsDisplay;
