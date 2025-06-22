import React, { useState, useEffect } from 'react';
import { FileText, Trash2, Eye, Calendar, TrendingUp } from 'lucide-react';
import StorageManager from '../utils/storage';

const ReportsPage = () => {
	const [reports, setReports] = useState([]);

	useEffect(() => {
		loadReports();
	}, []);

	const loadReports = () => {
		const savedReports = StorageManager.getReports();
		setReports(
			savedReports.sort((a, b) => new Date(b.date) - new Date(a.date))
		);
	};

	const deleteReport = (reportId) => {
		if (window.confirm('Sei sicuro di voler eliminare questo report?')) {
			const updatedReports = reports.filter((r) => r.id !== reportId);
			StorageManager.saveReports(updatedReports);
			setReports(updatedReports);
		}
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
	};

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
					<a
						href='/'
						style={{
							display: 'inline-block',
							padding: '0.75rem 1.5rem',
							backgroundColor: '#059669',
							color: 'white',
							borderRadius: '0.375rem',
							textDecoration: 'none',
						}}
					>
						Inizia Valutazione
					</a>
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
										Report del{' '}
										{new Date(report.date).toLocaleDateString('it-IT')}
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
											{new Date(report.date).toLocaleTimeString('it-IT', {
												hour: '2-digit',
												minute: '2-digit',
											})}
										</span>
										<span
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: '0.25rem',
											}}
										>
											<TrendingUp size={16} />
											Livello: {report.results.efficiencyLevel.level}
										</span>
									</div>
								</div>
								<div style={styles.actions}>
									<button
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
										{report.formData.consumption} kWh
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
										{report.formData.area} m²
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
										€{report.results.savingsPotential.annualSavings.toFixed(0)}
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
										{report.results.roi.toFixed(1)} anni
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
