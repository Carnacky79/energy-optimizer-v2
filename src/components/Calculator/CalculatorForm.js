// src/components/Calculator/CalculatorForm.js

import React, { useState } from 'react';
import { Calculator, ChevronRight } from 'lucide-react';

const styles = {
	formCard: {
		backgroundColor: 'white',
		borderRadius: '0.5rem',
		boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
		padding: '1.5rem',
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
		transition: 'all 0.3s',
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
		transition: 'all 0.3s',
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
		fontSize: '0.875rem',
	},
	input: {
		width: '100%',
		padding: '0.5rem 0.75rem',
		border: '1px solid #d1d5db',
		borderRadius: '0.375rem',
		fontSize: '1rem',
		transition: 'border-color 0.2s',
		outline: 'none',
	},
	inputFocus: {
		borderColor: '#059669',
	},
	select: {
		width: '100%',
		padding: '0.5rem 0.75rem',
		border: '1px solid #d1d5db',
		borderRadius: '0.375rem',
		fontSize: '1rem',
		backgroundColor: 'white',
		cursor: 'pointer',
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
		transition: 'all 0.2s',
	},
	buttonPrimary: {
		backgroundColor: '#059669',
		color: 'white',
	},
	buttonSecondary: {
		backgroundColor: '#e5e7eb',
		color: '#374151',
	},
	buttonHover: {
		transform: 'translateY(-1px)',
		boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
	},
};

const CalculatorForm = ({ onCalculate }) => {
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState({
		consumption: '',
		bill: '',
		area: '',
		heatingType: 'gas',
		buildingType: 'residenziale',
		occupants: '',
		usageTime: '',
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const validateStep = (step) => {
		switch (step) {
			case 1:
				return formData.consumption && formData.bill;
			case 2:
				return formData.area && formData.buildingType;
			case 3:
				return true; // Step 3 è opzionale
			default:
				return false;
		}
	};

	const handleNext = () => {
		if (validateStep(currentStep)) {
			setCurrentStep((prev) => prev + 1);
		} else {
			alert('Per favore compila tutti i campi richiesti');
		}
	};

	const handlePrevious = () => {
		setCurrentStep((prev) => Math.max(1, prev - 1));
	};

	const handleCalculate = () => {
		if (validateStep(1) && validateStep(2)) {
			onCalculate(formData);
		} else {
			alert('Per favore compila tutti i campi richiesti');
		}
	};

	const steps = [
		{ number: 1, title: 'Consumi' },
		{ number: 2, title: 'Edificio' },
		{ number: 3, title: 'Dettagli' },
	];

	return (
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

			{/* Step Indicator */}
			<div style={styles.stepIndicator}>
				{steps.map((step, index) => (
					<React.Fragment key={step.number}>
						<div
							style={{
								...styles.step,
								...(currentStep >= step.number
									? styles.stepActive
									: styles.stepInactive),
							}}
							title={step.title}
						>
							{step.number}
						</div>
						{index < steps.length - 1 && (
							<div
								style={{
									...styles.stepLine,
									...(currentStep > step.number
										? styles.stepLineActive
										: styles.stepLineInactive),
								}}
							/>
						)}
					</React.Fragment>
				))}
			</div>

			{/* Step 1: Consumi */}
			{currentStep === 1 && (
				<div>
					<h4 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
						Informazioni sui consumi
					</h4>
					<div style={styles.formGrid}>
						<div style={styles.inputGroup}>
							<label style={styles.label}>Consumo mensile (kWh) *</label>
							<input
								type='number'
								name='consumption'
								value={formData.consumption}
								onChange={handleInputChange}
								style={styles.input}
								placeholder='es. 350'
								min='0'
								required
							/>
							<small style={{ color: '#6b7280', fontSize: '0.75rem' }}>
								Puoi trovarlo sulla tua bolletta
							</small>
						</div>
						<div style={styles.inputGroup}>
							<label style={styles.label}>Bolletta mensile (€) *</label>
							<input
								type='number'
								name='bill'
								value={formData.bill}
								onChange={handleInputChange}
								style={styles.input}
								placeholder='es. 150'
								min='0'
								required
							/>
							<small style={{ color: '#6b7280', fontSize: '0.75rem' }}>
								Importo medio mensile
							</small>
						</div>
					</div>
				</div>
			)}

			{/* Step 2: Edificio */}
			{currentStep === 2 && (
				<div>
					<h4 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
						Caratteristiche dell'edificio
					</h4>
					<div style={styles.formGrid}>
						<div style={styles.inputGroup}>
							<label style={styles.label}>Superficie (m²) *</label>
							<input
								type='number'
								name='area'
								value={formData.area}
								onChange={handleInputChange}
								style={styles.input}
								placeholder='es. 100'
								min='0'
								required
							/>
						</div>
						<div style={styles.inputGroup}>
							<label style={styles.label}>Tipo di edificio *</label>
							<select
								name='buildingType'
								value={formData.buildingType}
								onChange={handleInputChange}
								style={styles.select}
								required
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

			{/* Step 3: Dettagli */}
			{currentStep === 3 && (
				<div>
					<h4 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
						Dettagli aggiuntivi (opzionale)
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
								min='0'
							/>
						</div>
					</div>
				</div>
			)}

			{/* Navigation Buttons */}
			<div style={styles.buttonGroup}>
				<button
					onClick={handlePrevious}
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
						onClick={handleNext}
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
						Avanti
						<ChevronRight size={16} />
					</button>
				) : (
					<button
						onClick={handleCalculate}
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
						<Calculator size={16} />
						Calcola Risparmio
					</button>
				)}
			</div>
		</div>
	);
};

export default CalculatorForm;
