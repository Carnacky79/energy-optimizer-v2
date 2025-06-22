// src/pages/CalculatorPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiggyBank, Leaf, Award, FileText, Download } from 'lucide-react';
import CalculatorForm from '../components/Calculator/CalculatorForm';
import ResultsDisplay from '../components/Calculator/ResultsDisplay';
import StorageManager from '../utils/storage';
import { reportsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { generateOptimisticResults } from '../utils/monetization';
import { usePremiumLimits } from '../hooks/usePremiumLimits';
import ExitIntentPopup from '../components/ExitIntentPopup';
import ScarcityBanner from '../components/ScarcityBanner';
import SavingsWheel from '../components/SavingsWheel';

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
	const { isAuthenticated } = useAuth();
	const { checkReportLimit, remainingReports } = usePremiumLimits();
	const [results, setResults] = useState(null);
	const [saving, setSaving] = useState(false);
	const [showWheel, setShowWheel] = useState(false);
	const [wheelShown, setWheelShown] = useState(false);

	const handleCalculate = (formData) => {
		// Calcolo risultati
		const calculatedResults = calculateResults(formData);
		setResults(calculatedResults);

		// Mostra la ruota dopo il primo calcolo se non registrato
		if (
			!isAuthenticated &&
			!wheelShown &&
			!sessionStorage.getItem('wheelShown')
		) {
			setTimeout(() => {
				setShowWheel(true);
				setWheelShown(true);
				sessionStorage.setItem('wheelShown', 'true');
			}, 2000);
		}
	};

	const calculateResults = (formData) => {
		// Usa i risultati ottimistici per aumentare le conversioni
		const optimisticData = generateOptimisticResults(formData);

		const monthlyConsumption = parseFloat(formData.consumption);
		const monthlyBill = parseFloat(formData.bill);
		const area = parseFloat(formData.area);

		const efficiencyLevel = calculateEfficiencyLevel(monthlyConsumption, area);

		// Usa i dati ottimistici invece dei calcoli reali
		const savingsPotential = {
			monthlySavings: optimisticData.annualSavings / 12,
			annualSavings: optimisticData.annualSavings,
			percentage: optimisticData.savingsPercentage,
		};

		return {
			formData,
			efficiencyLevel,
			savingsPotential,
			investment: optimisticData.investment,
			roi: parseFloat(optimisticData.roi),
			co2Savings: optimisticData.co2Savings,
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

	const saveReport = async () => {
		if (!results) return;

		// Controlla i limiti prima di salvare
		if (!checkReportLimit()) {
			return;
		}

		setSaving(true);

		try {
			if (isAuthenticated) {
				// Salva nel database tramite API
				const reportData = {
					title: `Report del ${new Date().toLocaleDateString('it-IT')}`,
					// Form data
					consumption: parseFloat(results.formData.consumption),
					bill: parseFloat(results.formData.bill),
					area: parseFloat(results.formData.area),
					heatingType: results.formData.heatingType,
					buildingType: results.formData.buildingType,
					occupants: results.formData.occupants
						? parseInt(results.formData.occupants)
						: null,
					usageTime: results.formData.usageTime,
					// Results
					efficiencyLevel: results.efficiencyLevel.level,
					efficiencyScore: results.efficiencyLevel.score,
					efficiencyColor: results.efficiencyLevel.color,
					efficiencyFactor: results.efficiencyLevel.factor,
					monthlySavings: results.savingsPotential.monthlySavings,
					annualSavings: results.savingsPotential.annualSavings,
					savingsPercentage: results.savingsPotential.percentage,
					investment: results.investment,
					roi: results.roi,
					co2Savings: results.co2Savings,
					recommendations: results.tips,
				};

				await reportsAPI.create(reportData);
				alert('Report salvato con successo nel tuo account!');
			} else {
				// Salva localmente per utenti non autenticati
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

				alert(
					'Report salvato localmente! Registrati per salvarlo permanentemente.'
				);
			}

			navigate('/reports');
		} catch (error) {
			console.error('Error saving report:', error);
			alert('Errore nel salvataggio del report. Riprova.');
		} finally {
			setSaving(false);
		}
	};

	return (
		<div style={styles.container}>
			{/* Popup e componenti di conversione */}
			<ExitIntentPopup />
			{!isAuthenticated && <ScarcityBanner />}
			{showWheel && (
				<SavingsWheel
					onComplete={(discount) => {
						setShowWheel(false);
						navigate(`/pricing?discount=${discount}`);
					}}
				/>
			)}

			{/* Hero Section */}
			<div style={styles.hero}>
				<h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
					Ottimizza i tuoi consumi energetici
				</h1>
				<p style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
					Scopri quanto puoi risparmiare con semplici interventi di
					efficientamento
				</p>
				{!isAuthenticated && remainingReports === 0 && (
					<div
						style={{
							backgroundColor: 'rgba(255,255,255,0.2)',
							borderRadius: '0.5rem',
							padding: '1rem',
							marginBottom: '1rem',
						}}
					>
						<p style={{ fontWeight: 'bold' }}>
							⚠️ Hai esaurito i report gratuiti!
							<button
								onClick={() => navigate('/pricing')}
								style={{
									marginLeft: '1rem',
									padding: '0.5rem 1rem',
									backgroundColor: 'white',
									color: '#059669',
									border: 'none',
									borderRadius: '0.375rem',
									cursor: 'pointer',
									fontWeight: 'bold',
								}}
							>
								Passa a Premium
							</button>
						</p>
					</div>
				)}
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
							style={{
								...styles.button,
								...styles.buttonPrimary,
								...(saving
									? { backgroundColor: '#9ca3af', cursor: 'not-allowed' }
									: {}),
							}}
							disabled={saving}
							onMouseOver={(e) => {
								if (!saving) {
									e.currentTarget.style.transform = 'translateY(-1px)';
									e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
								}
							}}
							onMouseOut={(e) => {
								e.currentTarget.style.transform = 'translateY(0)';
								e.currentTarget.style.boxShadow = 'none';
							}}
						>
							<FileText size={20} />
							{saving ? 'Salvataggio...' : 'Salva Report'}
						</button>
						<button
							onClick={() => {
								if (isAuthenticated) {
									alert(
										'Funzionalità PDF disponibile a breve per utenti registrati'
									);
								} else {
									alert('Registrati per scaricare i report in PDF');
									navigate('/register');
								}
							}}
							style={{ ...styles.button, ...styles.buttonSecondary }}
						>
							<Download size={20} />
							Scarica PDF
						</button>
					</div>

					{/* Premium Upsell Banner */}
					{!isAuthenticated && (
						<div
							style={{
								background: 'linear-gradient(to right, #f59e0b, #10b981)',
								borderRadius: '0.5rem',
								padding: '2rem',
								marginTop: '2rem',
								color: 'white',
								textAlign: 'center',
							}}
						>
							<h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
								🎯 Sblocca il Tuo Pieno Potenziale di Risparmio!
							</h3>
							<p style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>
								Il piano Premium include analisi dettagliate, piani
								personalizzati e supporto esperto
							</p>
							<button
								onClick={() => navigate('/pricing')}
								style={{
									backgroundColor: 'white',
									color: '#f59e0b',
									padding: '0.75rem 2rem',
									border: 'none',
									borderRadius: '0.375rem',
									fontSize: '1.125rem',
									fontWeight: 'bold',
									cursor: 'pointer',
								}}
							>
								Scopri Premium →
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default CalculatorPage;
