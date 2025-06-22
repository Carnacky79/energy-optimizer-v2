// src/pages/LoginPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Leaf } from 'lucide-react';

const LoginPage = () => {
	const navigate = useNavigate();
	const { login, error } = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		const result = await login(formData);

		if (result.success) {
			navigate('/');
		}

		setLoading(false);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const styles = {
		container: {
			minHeight: 'calc(100vh - 80px)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			padding: '2rem 1rem',
		},
		card: {
			backgroundColor: 'white',
			borderRadius: '0.5rem',
			boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
			padding: '2rem',
			width: '100%',
			maxWidth: '400px',
		},
		logo: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			marginBottom: '2rem',
		},
		form: {
			display: 'flex',
			flexDirection: 'column',
			gap: '1.5rem',
		},
		inputGroup: {
			display: 'flex',
			flexDirection: 'column',
			gap: '0.5rem',
		},
		label: {
			fontSize: '0.875rem',
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
		error: {
			backgroundColor: '#fee2e2',
			border: '1px solid #fecaca',
			color: '#dc2626',
			padding: '0.75rem',
			borderRadius: '0.375rem',
			fontSize: '0.875rem',
		},
		button: {
			padding: '0.75rem',
			backgroundColor: '#059669',
			color: 'white',
			border: 'none',
			borderRadius: '0.375rem',
			fontSize: '1rem',
			fontWeight: '500',
			cursor: 'pointer',
			transition: 'all 0.2s',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: '0.5rem',
		},
		buttonDisabled: {
			backgroundColor: '#9ca3af',
			cursor: 'not-allowed',
		},
		divider: {
			display: 'flex',
			alignItems: 'center',
			gap: '1rem',
			margin: '1rem 0',
		},
		dividerLine: {
			flex: 1,
			height: '1px',
			backgroundColor: '#e5e7eb',
		},
		dividerText: {
			color: '#6b7280',
			fontSize: '0.875rem',
		},
		link: {
			color: '#059669',
			textDecoration: 'none',
			fontSize: '0.875rem',
			textAlign: 'center',
		},
	};

	return (
		<div style={styles.container}>
			<div style={styles.card}>
				<div style={styles.logo}>
					<Leaf size={40} color='#059669' />
					<h1 style={{ marginLeft: '0.5rem', fontSize: '1.5rem' }}>
						Energy Optimizer
					</h1>
				</div>

				<h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
					Bentornato!
				</h2>
				<p
					style={{
						textAlign: 'center',
						color: '#6b7280',
						marginBottom: '2rem',
					}}
				>
					Accedi per gestire i tuoi report energetici
				</p>

				{error && <div style={styles.error}>{error}</div>}

				<form onSubmit={handleSubmit} style={styles.form}>
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
							autoComplete='email'
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
								placeholder='La tua password'
								required
								autoComplete='current-password'
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
									}}
								/>
								<style>{`
                  @keyframes spin {
                    to { transform: rotate(360deg); }
                  }
                `}</style>
								Accesso in corso...
							</>
						) : (
							'Accedi'
						)}
					</button>
				</form>

				<div style={styles.divider}>
					<div style={styles.dividerLine} />
					<span style={styles.dividerText}>oppure</span>
					<div style={styles.dividerLine} />
				</div>

				<div style={{ textAlign: 'center' }}>
					<p style={{ marginBottom: '0.5rem', color: '#6b7280' }}>
						Non hai ancora un account?
					</p>
					<Link to='/register' style={styles.link}>
						Registrati gratuitamente
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
