import React, { useState, useEffect } from 'react';
import { FileText, Trash2, Eye, Calendar, TrendingUp } from 'lucide-react';
import StorageManager from '../utils/storage';

const RegisterPage = () => {
	const [formData, setFormData] = React.useState({
		name: '',
		email: '',
		password: '',
		acceptTerms: false,
	});

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!formData.name || !formData.email || !formData.password) {
			alert('Per favore compila tutti i campi');
			return;
		}

		if (!formData.acceptTerms) {
			alert('Devi accettare i termini e condizioni');
			return;
		}

		// Simula registrazione
		StorageManager.registerUser({
			name: formData.name,
			email: formData.email,
		});

		alert(
			'Registrazione completata! I tuoi report sono ora salvati permanentemente.'
		);
		window.location.href = '/';
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
		input: {
			width: '100%',
			padding: '0.75rem',
			border: '1px solid #d1d5db',
			borderRadius: '0.375rem',
			fontSize: '1rem',
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
		benefits: {
			backgroundColor: '#f0fdf4',
			border: '1px solid #86efac',
			borderRadius: '0.5rem',
			padding: '1rem',
			marginBottom: '2rem',
		},
	};

	return (
		<div style={styles.container}>
			<h1
				style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}
			>
				Registrati Gratuitamente
			</h1>

			<div style={styles.benefits}>
				<h3 style={{ marginBottom: '0.5rem' }}>
					✅ Vantaggi della registrazione:
				</h3>
				<ul style={{ marginLeft: '1.5rem', fontSize: '0.875rem' }}>
					<li>Report salvati permanentemente</li>
					<li>Storico completo dei consumi</li>
					<li>Notifiche e consigli personalizzati</li>
					<li>Accesso a funzionalità premium</li>
					<li>Download PDF illimitati</li>
				</ul>
			</div>

			<form style={styles.form} onSubmit={handleSubmit}>
				<div style={styles.inputGroup}>
					<label style={styles.label}>Nome</label>
					<input
						type='text'
						name='name'
						value={formData.name}
						onChange={handleInputChange}
						style={styles.input}
						placeholder='Mario Rossi'
						required
					/>
				</div>

				<div style={styles.inputGroup}>
					<label style={styles.label}>Email</label>
					<input
						type='email'
						name='email'
						value={formData.email}
						onChange={handleInputChange}
						style={styles.input}
						placeholder='mario.rossi@email.com'
						required
					/>
				</div>

				<div style={styles.inputGroup}>
					<label style={styles.label}>Password</label>
					<input
						type='password'
						name='password'
						value={formData.password}
						onChange={handleInputChange}
						style={styles.input}
						placeholder='Minimo 8 caratteri'
						required
					/>
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
					/>
					<label style={{ fontWeight: 'normal' }}>
						Accetto i{' '}
						<a href='#' style={{ color: '#059669' }}>
							termini e condizioni
						</a>
					</label>
				</div>

				<button
					type='submit'
					style={styles.button}
					onMouseOver={(e) =>
						(e.currentTarget.style.backgroundColor = '#047857')
					}
					onMouseOut={(e) =>
						(e.currentTarget.style.backgroundColor = '#059669')
					}
				>
					Registrati
				</button>
			</form>
		</div>
	);
};

export default RegisterPage;
