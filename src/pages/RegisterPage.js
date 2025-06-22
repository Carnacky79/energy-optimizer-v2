// src/pages/RegisterPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Check } from 'lucide-react';

const RegisterPage = () => {
	const navigate = useNavigate();
	const { register, error } = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		acceptTerms: false,
	});

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.acceptTerms) {
			alert('Devi accettare i termini e condizioni');
			return;
		}

		setLoading(true);
		const result = await register(formData);

		if (result.success) {
			navigate('/');
		}

		setLoading(false);
	};

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));
	};

	const styles = {
		container: {
			maxWidth: '500px',
			margin: '0 auto',
			padding: '2rem 1rem',
		},
		form: {
			backgroundColor: 'white',
			borderRadius: '0.5rem',
			boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
			padding: '2rem',
		},
		inputGroup: {
			marginBottom: '1.5rem',
		},
		label: {
			display: 'block',
			marginBottom: '0.5rem',
			fontWeight: '500',
			color: '#374151',
		},
		inputWrapper: {
			position: 'relative',
		},
		input: {
			width: '100%',
			padding: '0.75rem',
			border: '1px solid #d1d5db',
			borderRadius: '0.375rem',
			fontSize: '1rem',
			outline: 'none',
			transition: 'border-color 0.2s',
		},
		inputFocus: {
			borderColor: '#059669',
		},
		inputError: {
			borderColor: '#ef4444',
		},
		passwordToggle: {
			position: 'absolute',
			right: '0.75rem',
			top: '50%',
			transform: 'translateY(-50%)',
			background: 'none',
			border: 'none',
			cursor: 'pointer',
			color: '#6b7280',
		},
		checkbox: {
			marginRight: '0.5rem',
		},
		button: {
			width: '100%',
			padding: '0.75rem',
			backgroundColor: '#059669',
			color: 'white',
			border: 'none',
			borderRadius: '0.375rem',
			fontSize: '1rem',
			fontWeight: '500',
			cursor: 'pointer',
			transition: 'all 0.2s',
		},
		buttonDisabled: {
			backgroundColor: '#9ca3af',
			cursor: 'not-allowed',
		},
		benefits: {
			backgroundColor: '#f0fdf4',
			border: '1px solid #86efac',
			borderRadius: '0.5rem',
			padding: '1rem',
			marginBottom: '2rem',
		},
		benefitItem: {
			display: 'flex',
			alignItems: 'center',
			gap: '0.5rem',
			marginBottom: '0.5rem',
		},
		error: {
			backgroundColor: '#fee2e2',
			border: '1px solid #fecaca',
			color: '#dc2626',
			padding: '0.75rem',
			borderRadius: '0.375rem',
			fontSize: '0.875rem',
			marginBottom: '1rem',
		},
		passwordStrength: {
			marginTop: '0.5rem',
			fontSize: '0.75rem',
		},
		strengthBar: {
			height: '4px',
			backgroundColor: '#e5e7eb',
			borderRadius: '2px',
			marginTop: '0.25rem',
			overflow: 'hidden',
		},
		strengthFill: {
			height: '100%',
			transition: 'width 0.3s, background-color 0.3s',
		},
	};

	// Password strength checker
	const getPasswordStrength = (password) => {
		let strength = 0;
		if (password.length >= 8) strength++;
		if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
		if (password.match(/[0-9]/)) strength++;
		if (password.match(/[^a-zA-Z0-9]/)) strength++;

		const levels = ['Debole', 'Media', 'Buona', 'Ottima'];
		const colors = ['#ef4444', '#f59e0b', '#eab308', '#10b981'];

		return {
			level: levels[strength - 1] || 'Molto debole',
			color: colors[strength - 1] || '#ef4444',
			percentage: (strength / 4) * 100,
		};
	};

	const passwordStrength = getPasswordStrength(formData.password);

	return (
		<div style={styles.container}>
			<h1
				style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}
			>
				Registrati Gratuitamente
			</h1>

			<div style={styles.benefits}>
				<h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>
					Vantaggi della registrazione:
				</h3>
				<div style={styles.benefitItem}>
					<Check size={20} color='#059669' />
					<span>Report salvati permanentemente nel cloud</span>
				</div>
				<div style={styles.benefitItem}>
					<Check size={20} color='#059669' />
					<span>Storico completo dei tuoi consumi</span>
				</div>
				<div style={styles.benefitItem}>
					<Check size={20} color='#059669' />
					<span>Notifiche e consigli personalizzati</span>
				</div>
				<div style={styles.benefitItem}>
					<Check size={20} color='#059669' />
					<span>Download PDF illimitati</span>
				</div>
				<div style={styles.benefitItem}>
					<Check size={20} color='#059669' />
					<span>Accesso da qualsiasi dispositivo</span>
				</div>
			</div>

			<form style={styles.form} onSubmit={handleSubmit}>
				{error && <div style={styles.error}>{error}</div>}

				<div style={styles.inputGroup}>
					<label style={styles.label}>Nome completo</label>
					<input
						type='text'
						name='name'
						value={formData.name}
						onChange={handleInputChange}
						style={{
							...styles.input,
							...(error ? styles.inputError : {}),
						}}
						placeholder='Mario Rossi'
						required
						disabled={loading}
					/>
				</div>

				<div style={styles.inputGroup}>
					<label style={styles.label}>Email</label>
					<input
						type='email'
						name='email'
						value={formData.email}
						onChange={handleInputChange}
						style={{
							...styles.input,
							...(error ? styles.inputError : {}),
						}}
						placeholder='mario.rossi@email.com'
						required
						disabled={loading}
					/>
				</div>

				<div style={styles.inputGroup}>
					<label style={styles.label}>Password</label>
					<div style={styles.inputWrapper}>
						<input
							type={showPassword ? 'text' : 'password'}
							name='password'
							value={formData.password}
							onChange={handleInputChange}
							style={{
								...styles.input,
								paddingRight: '3rem',
								...(error ? styles.inputError : {}),
							}}
							placeholder='Minimo 8 caratteri'
							required
							minLength={8}
							disabled={loading}
						/>
						<button
							type='button'
							onClick={() => setShowPassword(!showPassword)}
							style={styles.passwordToggle}
							tabIndex={-1}
						>
							{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
						</button>
					</div>
					{formData.password && (
						<div style={styles.passwordStrength}>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									marginBottom: '0.25rem',
								}}
							>
								<span>Sicurezza password:</span>
								<span
									style={{ color: passwordStrength.color, fontWeight: '500' }}
								>
									{passwordStrength.level}
								</span>
							</div>
							<div style={styles.strengthBar}>
								<div
									style={{
										...styles.strengthFill,
										width: `${passwordStrength.percentage}%`,
										backgroundColor: passwordStrength.color,
									}}
								/>
							</div>
						</div>
					)}
				</div>

				<div
					style={{
						...styles.inputGroup,
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<input
						type='checkbox'
						name='acceptTerms'
						checked={formData.acceptTerms}
						onChange={handleInputChange}
						style={styles.checkbox}
						required
						disabled={loading}
					/>
					<label style={{ fontWeight: 'normal', margin: 0 }}>
						Accetto i{' '}
						<a href='#' style={{ color: '#059669' }}>
							termini e condizioni
						</a>{' '}
						e la{' '}
						<a href='#' style={{ color: '#059669' }}>
							{' '}
							privacy policy
						</a>
					</label>
				</div>

				<button
					type='submit'
					style={{
						...styles.button,
						...(loading ? styles.buttonDisabled : {}),
					}}
					disabled={loading}
				>
					{loading ? (
						<>
							<div
								style={{
									border: '2px solid #ffffff',
									borderTopColor: 'transparent',
									borderRadius: '50%',
									width: '16px',
									height: '16px',
									animation: 'spin 0.8s linear infinite',
									display: 'inline-block',
									marginRight: '0.5rem',
								}}
							/>
							<style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
							Registrazione in corso...
						</>
					) : (
						'Registrati'
					)}
				</button>

				<div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
					<p style={{ color: '#6b7280' }}>
						Hai già un account?{' '}
						<Link to='/login' style={{ color: '#059669' }}>
							Accedi
						</Link>
					</p>
				</div>
			</form>
		</div>
	);
};

export default RegisterPage;
