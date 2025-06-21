import React, { useState } from 'react';
import {
	Calculator,
	PiggyBank,
	Leaf,
	Lightbulb,
	Home,
	TrendingDown,
	Award,
	FileText,
	Download,
	ChevronRight,
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

// Stili CSS inline per evitare dipendenze da Tailwind
const styles = {
	container: {
		minHeight: '100vh',
		backgroundColor: '#f9fafb',
		fontFamily:
			'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
	},
	header: {
		backgroundColor: 'white',
		boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
		padding: '1rem 0',
	},
	headerContent: {
		maxWidth: '1200px',
		margin: '0 auto',
		padding: '0 1rem',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	logo: {
		display: 'flex',
		alignItems: 'center',
		fontSize: '1.5rem',
		fontWeight: 'bold',
		color: '#111827',
	},
	nav: {
		display: 'flex',
		gap: '1rem',
	},
	navButton: {
		padding: '0.5rem 1rem',
		borderRadius: '0.375rem',
		border: 'none',
		cursor: 'pointer',
		transition: 'all 0.2s',
	},
	navButtonActive: {
		backgroundColor: '#059669',
		color: 'white',
	},
	navButtonInactive: {
		backgroundColor: 'transparent',
		color: '#4b5563',
	},
	main: {
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
	},
	formCard: {
		backgroundColor: 'white',
		borderRadius: '0.5rem',
		boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
		padding: '1.5rem',
		marginBottom: '2rem',
	},
	stepIndicator: {
		display: 'flex',
		alignItems: 'center',
		marginBottom: '2rem',
	},
	step: {
		width: '40px',
		height: '40px',
		borderRadius: '50%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontWeight: 'bold',
	},
	stepActive: {
		backgroundColor: '#059669',
		color: 'white',
	},
	stepInactive: {
		backgroundColor: '#e5e7eb',
		color: '#6b7280',
	},
	stepLine: {
		flex: 1,
		height: '2px',
		margin: '0 0.5rem',
	},
	stepLineActive: {
		backgroundColor: '#059669',
	},
	stepLineInactive: {
		backgroundColor: '#e5e7eb',
	},
	formGrid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
		gap: '1rem',
	},
	inputGroup: {
		marginBottom: '1rem',
	},
	label: {
		display: 'block',
		marginBottom: '0.25rem',
		fontWeight: '500',
		color: '#374151',
	},
	input: {
		width: '100%',
		padding: '0.5rem 0.75rem',
		border: '1px solid #d1d5db',
		borderRadius: '0.375rem',
		fontSize: '1rem',
	},
	select: {
		width: '100%',
		padding: '0.5rem 0.75rem',
		border: '1px solid #d1d5db',
		borderRadius: '0.375rem',
		fontSize: '1rem',
		backgroundColor: 'white',
	},
	buttonGroup: {
		display: 'flex',
		justifyContent: 'space-between',
		marginTop: '1.5rem',
	},
	button: {
		padding: '0.5rem 1.5rem',
		borderRadius: '0.375rem',
		border: 'none',
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center',
		gap: '0.5rem',
		fontWeight: '500',
	},
	buttonPrimary: {
		backgroundColor: '#059669',
		color: 'white',
	},
	buttonSecondary: {
		backgroundColor: '#e5e7eb',
		color: '#374151',
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
	},
	chartContainer: {
		backgroundColor: 'white',
		borderRadius: '0.5rem',
		boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
		padding: '1.5rem',
		marginBottom: '1rem',
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
	},
};

const EnergyOptimizer = () => {
	const [formData, setFormData] = useState({
		consumption: '',
		bill: '',
		area: '',
		heatingType: 'gas',
		buildingType: 'residenziale',
		occupants: '',
		usageTime: '',
	});

	const [results, setResults] = useState(null);
	const [currentStep, setCurrentStep] = useState(1);
	const [savedReports, setSavedReports] = useState([]);
	const [activeSection, setActiveSection] = useState('calculator');

	const savingsData = [
		{ month: 'Gen', consumoAttuale: 1000, consumoOttimizzato: 600 },
		{ month: 'Feb', consumoAttuale: 950, consumoOttimizzato: 570 },
		{ month: 'Mar', consumoAttuale: 900, consumoOttimizzato: 540 },
		{ month: 'Apr', consumoAttuale: 1100, consumoOttimizzato: 660 },
		{ month: 'Mag', consumoAttuale: 1200, consumoOttimizzato: 720 },
		{ month: 'Giu', consumoAttuale: 1300, consumoOttimizzato: 780 },
	];

	const consumptionBreakdown = [
		{ categoria: 'Riscaldamento', percentuale: 35, risparmio: 30 },
		{ categoria: 'Illuminazione', percentuale: 25, risparmio: 70 },
		{ categoria: 'Elettrodomestici', percentuale: 20, risparmio: 25 },
		{ categoria: 'Acqua calda', percentuale: 15, risparmio: 40 },
		{ categoria: 'Altro', percentuale: 5, risparmio: 10 },
	];

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const calculateResults = () => {
		const monthlyConsumption = parseFloat(formData.consumption);
		const monthlyBill = parseFloat(formData.bill);
		const area = parseFloat(formData.area);

		if (!monthlyConsumption || !monthlyBill || !area) {
			alert('Per favore compila tutti i campi richiesti');
			return;
		}

		const efficiencyLevel = calculateEfficiencyLevel(monthlyConsumption, area);
		const savingsPotential = calculateSavingsPotential(
			monthlyBill,
			area,
			efficiencyLevel.factor
		);
		const investment = area * 35;
		const roi = investment / (savingsPotential.annualSavings || 1);
		const co2Savings = monthlyConsumption * 0.5 * 12;

		setResults({
			efficiencyLevel,
			savingsPotential,
			investment,
			roi,
			co2Savings,
			tips: generateTips(efficiencyLevel.score),
		});
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
				icon: <Lightbulb size={20} />,
				title: 'Illuminazione LED',
				description: 'Sostituisci tutte le lampade con LED ad alta efficienza',
				savings: 'Fino al 80% sui consumi di illuminazione',
			});
		}

		tips.push({
			icon: <Home size={20} />,
			title: 'Isolamento termico',
			description: "Migliora l'isolamento di pareti e infissi",
			savings: 'Riduzione del 30% sui costi di riscaldamento',
		});

		tips.push({
			icon: <TrendingDown size={20} />,
			title: 'Gestione intelligente',
			description: 'Installa termostati smart e sistemi di controllo',
			savings: 'Ottimizzazione automatica dei consumi',
		});

		return tips;
	};

	const saveReport = () => {
		if (!results) return;

		const report = {
			id: Date.now(),
			date: new Date().toLocaleDateString('it-IT'),
			formData: { ...formData },
			results: { ...results },
		};

		setSavedReports((prev) => [...prev, report]);
		alert('Report salvato con successo!');
	};

	return (
		<div style={styles.container}>
			<header style={styles.header}>
				<div style={styles.headerContent}>
					<div style={styles.logo}>
						<Leaf size={32} color='#059669' style={{ marginRight: '0.5rem' }} />
						<span>Energy Optimizer</span>
					</div>
					<nav style={styles.nav}>
						<button
							onClick={() => setActiveSection('calculator')}
							style={{
								...styles.navButton,
								...(activeSection === 'calculator'
									? styles.navButtonActive
									: styles.navButtonInactive),
							}}
						>
							Calcolatore
						</button>
						<button
							onClick={() => setActiveSection('reports')}
							style={{
								...styles.navButton,
								...(activeSection === 'reports'
									? styles.navButtonActive
									: styles.navButtonInactive),
							}}
						>
							I miei Report
						</button>
						<button
							onClick={() => setActiveSection('tips')}
							style={{
								...styles.navButton,
								...(activeSection === 'tips'
									? styles.navButtonActive
									: styles.navButtonInactive),
							}}
						>
							Consigli
						</button>
					</nav>
				</div>
			</header>

			<main style={styles.main}>
				{activeSection === 'calculator' && (
					<>
						<div style={styles.hero}>
							<h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
								Ottimizza i tuoi consumi energetici
							</h2>
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
									<p style={{ fontSize: '0.875rem' }}>
										Fino al 45% sulla bolletta
									</p>
								</div>
								<div style={styles.heroCard}>
									<Leaf size={32} style={{ marginBottom: '0.5rem' }} />
									<h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
										Sostenibilità
									</h3>
									<p style={{ fontSize: '0.875rem' }}>
										Riduci le emissioni di CO2
									</p>
								</div>
								<div style={styles.heroCard}>
									<Award size={32} style={{ marginBottom: '0.5rem' }} />
									<h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
										Incentivi
									</h3>
									<p style={{ fontSize: '0.875rem' }}>
										Accedi a bonus e detrazioni
									</p>
								</div>
							</div>
						</div>

						<div style={styles.formCard}>
							<h3
								style={{
									fontSize: '1.25rem',
									marginBottom: '1.5rem',
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<Calculator
									size={24}
									color='#059669'
									style={{ marginRight: '0.5rem' }}
								/>
								Calcolatore di Risparmio Energetico
							</h3>

							<div style={styles.stepIndicator}>
								{[1, 2, 3].map((step) => (
									<React.Fragment key={step}>
										<div
											style={{
												...styles.step,
												...(currentStep >= step
													? styles.stepActive
													: styles.stepInactive),
											}}
										>
											{step}
										</div>
										{step < 3 && (
											<div
												style={{
													...styles.stepLine,
													...(currentStep > step
														? styles.stepLineActive
														: styles.stepLineInactive),
												}}
											/>
										)}
									</React.Fragment>
								))}
							</div>

							{currentStep === 1 && (
								<div>
									<h4 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
										Informazioni sui consumi
									</h4>
									<div style={styles.formGrid}>
										<div style={styles.inputGroup}>
											<label style={styles.label}>Consumo mensile (kWh)</label>
											<input
												type='number'
												name='consumption'
												value={formData.consumption}
												onChange={handleInputChange}
												style={styles.input}
												placeholder='es. 350'
											/>
										</div>
										<div style={styles.inputGroup}>
											<label style={styles.label}>Bolletta mensile (€)</label>
											<input
												type='number'
												name='bill'
												value={formData.bill}
												onChange={handleInputChange}
												style={styles.input}
												placeholder='es. 150'
											/>
										</div>
									</div>
								</div>
							)}

							{currentStep === 2 && (
								<div>
									<h4 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
										Caratteristiche dell'edificio
									</h4>
									<div style={styles.formGrid}>
										<div style={styles.inputGroup}>
											<label style={styles.label}>Superficie (m²)</label>
											<input
												type='number'
												name='area'
												value={formData.area}
												onChange={handleInputChange}
												style={styles.input}
												placeholder='es. 100'
											/>
										</div>
										<div style={styles.inputGroup}>
											<label style={styles.label}>Tipo di edificio</label>
											<select
												name='buildingType'
												value={formData.buildingType}
												onChange={handleInputChange}
												style={styles.select}
											>
												<option value='residenziale'>Residenziale</option>
												<option value='ufficio'>Ufficio</option>
												<option value='commerciale'>Commerciale</option>
												<option value='industriale'>Industriale</option>
											</select>
										</div>
									</div>
								</div>
							)}

							{currentStep === 3 && (
								<div>
									<h4 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
										Dettagli aggiuntivi
									</h4>
									<div style={styles.formGrid}>
										<div style={styles.inputGroup}>
											<label style={styles.label}>Tipo di riscaldamento</label>
											<select
												name='heatingType'
												value={formData.heatingType}
												onChange={handleInputChange}
												style={styles.select}
											>
												<option value='gas'>Gas metano</option>
												<option value='elettrico'>Elettrico</option>
												<option value='pompa_calore'>Pompa di calore</option>
												<option value='altro'>Altro</option>
											</select>
										</div>
										<div style={styles.inputGroup}>
											<label style={styles.label}>Numero occupanti</label>
											<input
												type='number'
												name='occupants'
												value={formData.occupants}
												onChange={handleInputChange}
												style={styles.input}
												placeholder='es. 4'
											/>
										</div>
									</div>
								</div>
							)}

							<div style={styles.buttonGroup}>
								<button
									onClick={() =>
										setCurrentStep((prev) => Math.max(1, prev - 1))
									}
									style={{
										...styles.button,
										...styles.buttonSecondary,
										visibility: currentStep === 1 ? 'hidden' : 'visible',
									}}
								>
									Indietro
								</button>
								{currentStep < 3 ? (
									<button
										onClick={() => setCurrentStep((prev) => prev + 1)}
										style={{ ...styles.button, ...styles.buttonPrimary }}
									>
										Avanti
										<ChevronRight size={16} />
									</button>
								) : (
									<button
										onClick={calculateResults}
										style={{ ...styles.button, ...styles.buttonPrimary }}
									>
										<Calculator size={16} />
										Calcola Risparmio
									</button>
								)}
							</div>
						</div>

						{results && (
							<>
								<div style={styles.formCard}>
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
											<p style={{ color: '#6b7280' }}>
												Potenziale di risparmio
											</p>
										</div>
									</div>
								</div>

								<div style={styles.resultsGrid}>
									<div style={styles.resultCard}>
										<PiggyBank
											size={32}
											color='#059669'
											style={{ marginBottom: '0.5rem' }}
										/>
										<h4 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
											Risparmio Annuale
										</h4>
										<p
											style={{
												fontSize: '1.5rem',
												fontWeight: 'bold',
												color: '#059669',
											}}
										>
											€{results.savingsPotential.annualSavings.toFixed(0)}
										</p>
										<p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
											€{results.savingsPotential.monthlySavings.toFixed(0)}/mese
										</p>
									</div>
									<div style={styles.resultCard}>
										<TrendingDown
											size={32}
											color='#2563eb'
											style={{ marginBottom: '0.5rem' }}
										/>
										<h4 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
											ROI Stimato
										</h4>
										<p
											style={{
												fontSize: '1.5rem',
												fontWeight: 'bold',
												color: '#2563eb',
											}}
										>
											{results.roi.toFixed(1)} anni
										</p>
										<p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
											Tempo di recupero investimento
										</p>
									</div>
									<div style={styles.resultCard}>
										<Leaf
											size={32}
											color='#059669'
											style={{ marginBottom: '0.5rem' }}
										/>
										<h4 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
											CO2 Risparmiata
										</h4>
										<p
											style={{
												fontSize: '1.5rem',
												fontWeight: 'bold',
												color: '#059669',
											}}
										>
											{(results.co2Savings / 1000).toFixed(1)} ton
										</p>
										<p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
											All'anno
										</p>
									</div>
								</div>

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
											Proiezione Consumi
										</h4>
										<ResponsiveContainer width='100%' height={300}>
											<LineChart data={savingsData}>
												<CartesianGrid strokeDasharray='3 3' />
												<XAxis dataKey='month' />
												<YAxis />
												<Tooltip />
												<Legend />
												<Line
													type='monotone'
													dataKey='consumoAttuale'
													stroke='#ef4444'
													name='Consumo Attuale'
												/>
												<Line
													type='monotone'
													dataKey='consumoOttimizzato'
													stroke='#10b981'
													name='Consumo Ottimizzato'
												/>
											</LineChart>
										</ResponsiveContainer>
									</div>
									<div style={styles.chartContainer}>
										<h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
											Potenziale di Risparmio per Categoria
										</h4>
										<ResponsiveContainer width='100%' height={300}>
											<BarChart data={consumptionBreakdown}>
												<CartesianGrid strokeDasharray='3 3' />
												<XAxis dataKey='categoria' />
												<YAxis />
												<Tooltip />
												<Bar
													dataKey='risparmio'
													fill='#10b981'
													name='Risparmio %'
												/>
											</BarChart>
										</ResponsiveContainer>
									</div>
								</div>

								<div style={styles.formCard}>
									<h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
										Azioni Consigliate
									</h3>
									<div style={styles.tipsGrid}>
										{results.tips.map((tip, index) => (
											<div key={index} style={styles.tipCard}>
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
														{tip.icon}
													</div>
													<h4 style={{ fontWeight: 'bold' }}>{tip.title}</h4>
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

								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										gap: '1rem',
									}}
								>
									<button
										onClick={saveReport}
										style={{
											...styles.button,
											backgroundColor: '#2563eb',
											color: 'white',
										}}
									>
										<FileText size={20} />
										Salva Report
									</button>
									<button
										onClick={() =>
											alert(
												'Funzionalità di download PDF sarà implementata con il backend'
											)
										}
										style={{ ...styles.button, ...styles.buttonPrimary }}
									>
										<Download size={20} />
										Scarica PDF
									</button>
								</div>
							</>
						)}
					</>
				)}

				{activeSection === 'reports' && (
					<div style={styles.formCard}>
						<h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
							I miei Report Salvati
						</h3>
						{savedReports.length === 0 ? (
							<div
								style={{
									textAlign: 'center',
									padding: '3rem 0',
									color: '#6b7280',
								}}
							>
								<FileText
									size={48}
									color='#d1d5db'
									style={{ margin: '0 auto 1rem' }}
								/>
								<p>Nessun report salvato</p>
								<p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
									Completa una valutazione energetica per salvare il tuo primo
									report
								</p>
							</div>
						) : (
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: '1rem',
								}}
							>
								{savedReports.map((report) => (
									<div
										key={report.id}
										style={{ ...styles.tipCard, padding: '1rem' }}
									>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
											}}
										>
											<div>
												<h4 style={{ fontWeight: 'bold' }}>
													Report del {report.date}
												</h4>
												<p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
													Consumo: {report.formData.consumption} kWh/mese |
													Superficie: {report.formData.area} m² | Risparmio: €
													{report.results.savingsPotential.annualSavings.toFixed(
														0
													)}
													/anno
												</p>
											</div>
											<button
												style={{
													color: '#2563eb',
													background: 'none',
													border: 'none',
													cursor: 'pointer',
												}}
											>
												Visualizza
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{activeSection === 'tips' && (
					<div>
						<div style={styles.formCard}>
							<h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
								Consigli per il Risparmio Energetico
							</h3>
							<div
								style={{
									display: 'grid',
									gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
									gap: '1.5rem',
								}}
							>
								<div>
									<h4
										style={{
											fontSize: '1.125rem',
											color: '#059669',
											marginBottom: '1rem',
										}}
									>
										Illuminazione
									</h4>
									<ul style={{ listStyle: 'none', padding: 0 }}>
										<li style={{ marginBottom: '0.5rem' }}>
											<span style={{ color: '#059669', marginRight: '0.5rem' }}>
												•
											</span>
											Sostituisci tutte le lampade con LED ad alta efficienza
										</li>
										<li style={{ marginBottom: '0.5rem' }}>
											<span style={{ color: '#059669', marginRight: '0.5rem' }}>
												•
											</span>
											Installa sensori di presenza nelle aree di passaggio
										</li>
										<li style={{ marginBottom: '0.5rem' }}>
											<span style={{ color: '#059669', marginRight: '0.5rem' }}>
												•
											</span>
											Sfrutta al massimo la luce naturale
										</li>
									</ul>
								</div>
								<div>
									<h4
										style={{
											fontSize: '1.125rem',
											color: '#2563eb',
											marginBottom: '1rem',
										}}
									>
										Climatizzazione
									</h4>
									<ul style={{ listStyle: 'none', padding: 0 }}>
										<li style={{ marginBottom: '0.5rem' }}>
											<span style={{ color: '#2563eb', marginRight: '0.5rem' }}>
												•
											</span>
											Mantieni la temperatura a 20°C in inverno e 26°C in estate
										</li>
										<li style={{ marginBottom: '0.5rem' }}>
											<span style={{ color: '#2563eb', marginRight: '0.5rem' }}>
												•
											</span>
											Installa valvole termostatiche sui radiatori
										</li>
										<li style={{ marginBottom: '0.5rem' }}>
											<span style={{ color: '#2563eb', marginRight: '0.5rem' }}>
												•
											</span>
											Esegui manutenzione regolare degli impianti
										</li>
									</ul>
								</div>
							</div>
						</div>

						<div
							style={{
								background: 'linear-gradient(to right, #f0fdf4, #dbeafe)',
								borderRadius: '0.5rem',
								padding: '1.5rem',
								marginTop: '1.5rem',
							}}
						>
							<h4 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
								Incentivi Disponibili
							</h4>
							<div
								style={{
									display: 'grid',
									gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
									gap: '1rem',
								}}
							>
								<div
									style={{
										backgroundColor: 'white',
										borderRadius: '0.5rem',
										padding: '1rem',
									}}
								>
									<h5 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
										Ecobonus 65%
									</h5>
									<p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
										Detrazione fiscale per interventi di riqualificazione
										energetica
									</p>
								</div>
								<div
									style={{
										backgroundColor: 'white',
										borderRadius: '0.5rem',
										padding: '1rem',
									}}
								>
									<h5 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
										Bonus Casa 50%
									</h5>
									<p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
										Detrazione per ristrutturazioni edilizie con efficientamento
									</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</main>
		</div>
	);
};

export default EnergyOptimizer;
