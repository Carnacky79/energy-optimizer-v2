// src/pages/ReportsPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	FileText,
	Trash2,
	Eye,
	Calendar,
	TrendingUp,
	Download,
	AlertCircle,
} from 'lucide-react';
import { reportsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import StorageManager from '../utils/storage';

const ReportsPage = () => {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();
	const [reports, setReports] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [timeRemaining, setTimeRemaining] = useState(null);

	useEffect(() => {
		if (isAuthenticated) {
			loadReports();
		} else {
			// Se non autenticato, carica dal localStorage
			loadLocalReports();
			// Controlla il tempo rimanente
			updateTimeRemaining();
		}
	}, [isAuthenticated]);

	useEffect(() => {
		// Aggiorna il timer ogni minuto
		if (!isAuthenticated) {
			const interval = setInterval(updateTimeRemaining, 60000);
			return () => clearInterval(interval);
		}
	}, [isAuthenticated]);

	const updateTimeRemaining = () => {
		const remaining = StorageManager.getGuestTimeRemaining();
		setTimeRemaining(remaining);
	};

	useEffect(() => {
		if (isAuthenticated) {
			loadReports();
		} else {
			// Se non autenticato, carica dal localStorage
			loadLocalReports();
		}
	}, [isAuthenticated]);

	const loadReports = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await reportsAPI.getAll();
			setReports(response.data.reports);
		} catch (error) {
			console.error('Error loading reports:', error);
			setError('Errore nel caricamento dei report');
		} finally {
			setLoading(false);
		}
	};

	const loadLocalReports = () => {
		try {
			// Usa StorageManager invece di accedere direttamente al localStorage
			const localReports = StorageManager.getReports();
			setReports(localReports);
		} catch (error) {
			console.error('Error loading local reports:', error);
			setReports([]);
		} finally {
			setLoading(false);
		}
	};

	const deleteReport = async (reportId) => {
		if (!window.confirm('Sei sicuro di voler eliminare questo report?')) {
			return;
		}

		try {
			if (isAuthenticated) {
				await reportsAPI.delete(reportId);
				setReports(reports.filter((r) => r.id !== reportId));
			} else {
				// Elimina dal localStorage usando StorageManager
				const updatedReports = reports.filter((r) => r.id !== reportId);
				StorageManager.saveReports(updatedReports);
				setReports(updatedReports);
			}
		} catch (error) {
			console.error('Error deleting report:', error);
			alert("Errore nell'eliminazione del report");
		}
	};

	const viewReport = (report) => {
		// Salva il report temporaneamente per la visualizzazione
		sessionStorage.setItem('currentReport', JSON.stringify(report));
		// Naviga alla pagina di dettaglio con l'ID del report
		navigate(`/report/${report.id}`);
	};

	const styles = {
		container: {
			maxWidth: '1200px',
			margin: '0 auto',
			padding: '2rem 1rem',
		},
		header: {
			marginBottom: '2rem',
		},
		loading: {
			textAlign: 'center',
			padding: '4rem 2rem',
		},
		error: {
			backgroundColor: '#fee2e2',
			border: '1px solid #fecaca',
			color: '#dc2626',
			padding: '1rem',
			borderRadius: '0.375rem',
			marginBottom: '1rem',
			display: 'flex',
			alignItems: 'center',
			gap: '0.5rem',
		},
		emptyState: {
			textAlign: 'center',
			padding: '4rem 2rem',
			backgroundColor: 'white',
			borderRadius: '0.5rem',
			boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
		},
		reportCard: {
			backgroundColor: 'white',
			borderRadius: '0.5rem',
			boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
			padding: '1.5rem',
			marginBottom: '1rem',
			transition: 'all 0.2s',
		},
		reportHeader: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: '1rem',
		},
		reportGrid: {
			display: 'grid',
			gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
			gap: '1rem',
		},
		metricCard: {
			padding: '1rem',
			backgroundColor: '#f9fafb',
			borderRadius: '0.375rem',
		},
		actions: {
			display: 'flex',
			gap: '0.5rem',
		},
		actionButton: {
			padding: '0.5rem',
			backgroundColor: 'transparent',
			border: '1px solid #e5e7eb',
			borderRadius: '0.375rem',
			cursor: 'pointer',
			transition: 'all 0.2s',
		},
		notAuthenticatedBanner: {
			backgroundColor: '#fef3c7',
			border: '1px solid #fbbf24',
			borderRadius: '0.375rem',
			padding: '1rem',
			marginBottom: '1rem',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
	};

	if (loading) {
		return (
			<div style={styles.container}>
				<div style={styles.loading}>
					<div
						style={{
							border: '4px solid #f3f3f3',
							borderTop: '4px solid #059669',
							borderRadius: '50%',
							width: '40px',
							height: '40px',
							animation: 'spin 1s linear infinite',
							margin: '0 auto 1rem',
						}}
					/>
					<style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
					<p>Caricamento report...</p>
				</div>
			</div>
		);
	}

	return (
		<div style={styles.container}>
			<div style={styles.header}>
				<h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
					I miei Report
				</h1>
				<p style={{ color: '#6b7280' }}>
					Storico delle tue valutazioni energetiche
				</p>
			</div>

			{!isAuthenticated && reports.length > 0 && (
				<>
					{timeRemaining && (
						<div
							style={{
								...styles.notAuthenticatedBanner,
								marginBottom: '1rem',
								backgroundColor: '#fee2e2',
								borderColor: '#fecaca',
							}}
						>
							<div
								style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
							>
								<AlertCircle size={20} color='#dc2626' />
								<span style={{ color: '#dc2626' }}>
									⏰ I tuoi report verranno cancellati tra{' '}
									<strong>
										{timeRemaining.hours}h {timeRemaining.minutes}m
									</strong>
								</span>
							</div>
							<button
								onClick={() => navigate('/register')}
								style={{
									padding: '0.5rem 1rem',
									backgroundColor: '#dc2626',
									color: 'white',
									border: 'none',
									borderRadius: '0.375rem',
									cursor: 'pointer',
									fontWeight: 'bold',
								}}
							>
								Salva Permanentemente
							</button>
						</div>
					)}
					<div style={styles.notAuthenticatedBanner}>
						<div
							style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
						>
							<AlertCircle size={20} color='#f59e0b' />
							<span>
								I tuoi report sono salvati solo localmente. Registrati per
								salvarli nel cloud!
							</span>
						</div>
						<button
							onClick={() => navigate('/register')}
							style={{
								padding: '0.5rem 1rem',
								backgroundColor: '#059669',
								color: 'white',
								border: 'none',
								borderRadius: '0.375rem',
								cursor: 'pointer',
							}}
						>
							Registrati
						</button>
					</div>
				</>
			)}

			{error && (
				<div style={styles.error}>
					<AlertCircle size={20} />
					<span>{error}</span>
				</div>
			)}

			{reports.length === 0 ? (
				<div style={styles.emptyState}>
					<FileText
						size={48}
						color='#d1d5db'
						style={{ marginBottom: '1rem' }}
					/>
					<h3 style={{ marginBottom: '0.5rem' }}>Nessun report salvato</h3>
					<p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
						Completa una valutazione energetica per salvare il tuo primo report
					</p>
					<button
						onClick={() => navigate('/')}
						style={{
							display: 'inline-block',
							padding: '0.75rem 1.5rem',
							backgroundColor: '#059669',
							color: 'white',
							border: 'none',
							borderRadius: '0.375rem',
							textDecoration: 'none',
							cursor: 'pointer',
						}}
					>
						Inizia Valutazione
					</button>
				</div>
			) : (
				<div>
					{reports.map((report) => (
						<div
							key={report.id}
							style={styles.reportCard}
							onMouseOver={(e) => {
								e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
							}}
							onMouseOut={(e) => {
								e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
							}}
						>
							<div style={styles.reportHeader}>
								<div>
									<h3 style={{ marginBottom: '0.25rem' }}>
										{report.title ||
											`Report del ${new Date(
												report.createdAt || report.date
											).toLocaleDateString('it-IT')}`}
									</h3>
									<div
										style={{
											display: 'flex',
											gap: '1rem',
											fontSize: '0.875rem',
											color: '#6b7280',
										}}
									>
										<span
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: '0.25rem',
											}}
										>
											<Calendar size={16} />
											{new Date(report.createdAt || report.date).toLocaleString(
												'it-IT',
												{
													day: '2-digit',
													month: '2-digit',
													year: 'numeric',
													hour: '2-digit',
													minute: '2-digit',
												}
											)}
										</span>
										<span
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: '0.25rem',
											}}
										>
											<TrendingUp size={16} />
											Livello:{' '}
											{report.efficiencyLevel ||
												report.results?.efficiencyLevel?.level}
										</span>
									</div>
								</div>
								<div style={styles.actions}>
									<button
										onClick={() => viewReport(report)}
										style={styles.actionButton}
										title='Visualizza dettagli'
										onMouseOver={(e) =>
											(e.currentTarget.style.backgroundColor = '#f3f4f6')
										}
										onMouseOut={(e) =>
											(e.currentTarget.style.backgroundColor = 'transparent')
										}
									>
										<Eye size={20} />
									</button>
									{report.pdfUrl && (
										<button
											onClick={() => window.open(report.pdfUrl, '_blank')}
											style={styles.actionButton}
											title='Scarica PDF'
											onMouseOver={(e) =>
												(e.currentTarget.style.backgroundColor = '#f3f4f6')
											}
											onMouseOut={(e) =>
												(e.currentTarget.style.backgroundColor = 'transparent')
											}
										>
											<Download size={20} />
										</button>
									)}
									<button
										onClick={() => deleteReport(report.id)}
										style={styles.actionButton}
										title='Elimina report'
										onMouseOver={(e) => {
											e.currentTarget.style.backgroundColor = '#fee2e2';
											e.currentTarget.style.borderColor = '#ef4444';
										}}
										onMouseOut={(e) => {
											e.currentTarget.style.backgroundColor = 'transparent';
											e.currentTarget.style.borderColor = '#e5e7eb';
										}}
									>
										<Trash2 size={20} color='#ef4444' />
									</button>
								</div>
							</div>

							<div style={styles.reportGrid}>
								<div style={styles.metricCard}>
									<p
										style={{
											fontSize: '0.875rem',
											color: '#6b7280',
											marginBottom: '0.25rem',
										}}
									>
										Consumo mensile
									</p>
									<p style={{ fontWeight: 'bold' }}>
										{report.consumption || report.formData?.consumption} kWh
									</p>
								</div>
								<div style={styles.metricCard}>
									<p
										style={{
											fontSize: '0.875rem',
											color: '#6b7280',
											marginBottom: '0.25rem',
										}}
									>
										Superficie
									</p>
									<p style={{ fontWeight: 'bold' }}>
										{report.area || report.formData?.area} m²
									</p>
								</div>
								<div style={styles.metricCard}>
									<p
										style={{
											fontSize: '0.875rem',
											color: '#6b7280',
											marginBottom: '0.25rem',
										}}
									>
										Risparmio annuale
									</p>
									<p style={{ fontWeight: 'bold', color: '#059669' }}>
										€
										{parseFloat(
											report.annualSavings ||
												report.results?.savingsPotential?.annualSavings ||
												0
										).toFixed(0)}
									</p>
								</div>
								<div style={styles.metricCard}>
									<p
										style={{
											fontSize: '0.875rem',
											color: '#6b7280',
											marginBottom: '0.25rem',
										}}
									>
										ROI stimato
									</p>
									<p style={{ fontWeight: 'bold' }}>
										{parseFloat(report.roi || report.results?.roi || 0).toFixed(
											1
										)}{' '}
										anni
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ReportsPage;
