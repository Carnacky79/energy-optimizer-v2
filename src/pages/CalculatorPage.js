// src/pages/CalculatorPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiggyBank, Leaf, Award, FileText, Download } from 'lucide-react';
import CalculatorForm from '../components/Calculator/CalculatorForm';
import ResultsDisplay from '../components/Calculator/ResultsDisplay';
import StorageManager from '../utils/storage';

const styles = {
	container: {
		maxWidth: '1200px',
		margin: '0 auto',
		padding: '2rem 1rem',
	},
	hero: {
		background: 'linear-gradient(to right, #059669, #2563eb)',
		borderRadius: '0.5rem',
		padding: '2rem',
		color: 'white',
		marginBottom: '2rem',
	},
	heroGrid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
		gap: '1rem',
		marginTop: '1.5rem',
	},
	heroCard: {
		backgroundColor: 'rgba(255,255,255,0.2)',
		borderRadius: '0.5rem',
		padding: '1rem',
		backdropFilter: 'blur(10px)',
	},
	actionButtons: {
		display: 'flex',
		justifyContent: 'center',
		gap: '1rem',
		marginTop: '2rem',
	},
	button: {
		padding: '0.75rem 1.5rem',
		borderRadius: '0.375rem',
		border: 'none',
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center',
		gap: '0.5rem',
		fontWeight: '500',
		transition: 'all 0.2s',
	},
	buttonPrimary: {
		backgroundColor: '#2563eb',
		color: 'white',
	},
	buttonSecondary: {
		backgroundColor: '#059669',
		color: 'white',
	},
};

const CalculatorPage = () => {
	const navigate = useNavigate();
	const [results, setResults] = useState(null);

	const handleCalculate = (formData) => {
		// Calcolo risultati
		const calculatedResults = calculateResults(formData);
		setResults(calculatedResults);
	};

	const calculateResults = (formData) => {
		const monthlyConsumption = parseFloat(formData.consumption);
		const monthlyBill = parseFloat(formData.bill);
		const area = parseFloat(formData.area);

		const efficiencyLevel = calculateEfficiencyLevel(monthlyConsumption, area);
		const savingsPotential = calculateSavingsPotential(
			monthlyBill,
			area,
			efficiencyLevel.factor
		);
		const investment = area * 35;
		const roi = investment / (savingsPotential.annualSavings || 1);
		const co2Savings = monthlyConsumption * 0.5 * 12;

		return {
			formData,
			efficiencyLevel,
			savingsPotential,
			investment,
			roi,
			co2Savings,
			tips: generateTips(efficiencyLevel.score),
		};
	};

	const calculateEfficiencyLevel = (consumption, area) => {
		const consumptionPerArea = consumption / area;

		if (consumptionPerArea < 5)
			return { level: 'Ottimo', score: 90, color: '#059669', factor: 0.3 };
		if (consumptionPerArea < 10)
			return { level: 'Buono', score: 75, color: '#2563eb', factor: 0.5 };
		if (consumptionPerArea < 15)
			return { level: 'Medio', score: 60, color: '#eab308', factor: 0.7 };
		if (consumptionPerArea < 20)
			return { level: 'Scarso', score: 40, color: '#f97316', factor: 0.9 };
		return { level: 'Critico', score: 25, color: '#dc2626', factor: 1.0 };
	};

	const calculateSavingsPotential = (bill, area, factor) => {
		const basePotential = bill * 0.45;
		return {
			monthlySavings: basePotential * factor,
			annualSavings: basePotential * factor * 12,
			percentage: Math.round(45 * factor),
		};
	};

	const generateTips = (score) => {
		const tips = [];

		if (score < 50) {
			tips.push({
				title: 'Illuminazione LED',
				description: 'Sostituisci tutte le lampade con LED ad alta efficienza',
				savings: 'Fino al 80% sui consumi di illuminazione',
				priority: 'alta',
			});
		}

		tips.push({
			title: 'Isolamento termico',
			description: "Migliora l'isolamento di pareti e infissi",
			savings: 'Riduzione del 30% sui costi di riscaldamento',
			priority: 'media',
		});

		tips.push({
			title: 'Gestione intelligente',
			description: 'Installa termostati smart e sistemi di controllo',
			savings: 'Ottimizzazione automatica dei consumi',
			priority: 'media',
		});

		return tips;
	};

	const saveReport = () => {
		if (!results) return;

		const report = {
			id: Date.now(),
			date: new Date().toISOString(),
			formData: results.formData,
			results: {
				efficiencyLevel: results.efficiencyLevel,
				savingsPotential: results.savingsPotential,
				investment: results.investment,
				roi: results.roi,
				co2Savings: results.co2Savings,
			},
		};

		// Recupera report esistenti
		const existingReports = StorageManager.getReports();

		// Aggiungi nuovo report
		const updatedReports = [...existingReports, report];

		// Salva (con scadenza se non registrato)
		StorageManager.saveReports(updatedReports);

		alert('Report salvato con successo!');
		navigate('/reports');
	};

	return (
		<div style={styles.container}>
			{/* Hero Section */}
			<div style={styles.hero}>
				<h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
					Ottimizza i tuoi consumi energetici
				</h1>
				<p style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
					Scopri quanto puoi risparmiare con semplici interventi di
					efficientamento
				</p>
				<div style={styles.heroGrid}>
					<div style={styles.heroCard}>
						<PiggyBank size={32} style={{ marginBottom: '0.5rem' }} />
						<h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
							Risparmio garantito
						</h3>
						<p style={{ fontSize: '0.875rem' }}>Fino al 45% sulla bolletta</p>
					</div>
					<div style={styles.heroCard}>
						<Leaf size={32} style={{ marginBottom: '0.5rem' }} />
						<h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
							Sostenibilità
						</h3>
						<p style={{ fontSize: '0.875rem' }}>Riduci le emissioni di CO2</p>
					</div>
					<div style={styles.heroCard}>
						<Award size={32} style={{ marginBottom: '0.5rem' }} />
						<h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
							Incentivi
						</h3>
						<p style={{ fontSize: '0.875rem' }}>Accedi a bonus e detrazioni</p>
					</div>
				</div>
			</div>

			{/* Calculator Form */}
			<CalculatorForm onCalculate={handleCalculate} />

			{/* Results */}
			{results && (
				<>
					<ResultsDisplay results={results} />

					<div style={styles.actionButtons}>
						<button
							onClick={saveReport}
							style={{ ...styles.button, ...styles.buttonPrimary }}
							onMouseOver={(e) => {
								e.currentTarget.style.transform = 'translateY(-1px)';
								e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
							}}
							onMouseOut={(e) => {
								e.currentTarget.style.transform = 'translateY(0)';
								e.currentTarget.style.boxShadow = 'none';
							}}
						>
							<FileText size={20} />
							Salva Report
						</button>
						<button
							onClick={() =>
								alert('Funzionalità PDF disponibile per utenti registrati')
							}
							style={{ ...styles.button, ...styles.buttonSecondary }}
						>
							<Download size={20} />
							Scarica PDF
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default CalculatorPage;
