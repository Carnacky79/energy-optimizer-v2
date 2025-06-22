// src/pages/AnalyticsDashboard.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import {
	TrendingUp,
	Users,
	MousePointer,
	Share2,
	Award,
	Calendar,
	Download,
	Filter,
} from 'lucide-react';
import { analyticsAPI } from '../services/api';

const AnalyticsDashboard = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [analytics, setAnalytics] = useState(null);
	const [dateRange, setDateRange] = useState('30');
	const [error, setError] = useState(null);

	useEffect(() => {
		loadAnalytics();
	}, [dateRange]);

	const loadAnalytics = async () => {
		try {
			setLoading(true);
			const endDate = new Date();
			const startDate = new Date();
			startDate.setDate(startDate.getDate() - parseInt(dateRange));

			const response = await analyticsAPI.getUserAnalytics({
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString(),
			});

			setAnalytics(response.data);
			setError(null);
		} catch (error) {
			console.error('Error loading analytics:', error);
			setError('Errore nel caricamento delle analytics');
		} finally {
			setLoading(false);
		}
	};

	const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

	const styles = {
		container: {
			maxWidth: '1200px',
			margin: '0 auto',
			padding: '2rem',
		},
		header: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: '2rem',
		},
		title: {
			fontSize: '2rem',
			fontWeight: 'bold',
			color: '#1f2937',
		},
		filters: {
			display: 'flex',
			gap: '1rem',
			alignItems: 'center',
		},
		select: {
			padding: '0.5rem 1rem',
			borderRadius: '0.375rem',
			border: '1px solid #d1d5db',
			fontSize: '0.875rem',
		},
		grid: {
			display: 'grid',
			gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
			gap: '1.5rem',
			marginBottom: '2rem',
		},
		kpiCard: {
			backgroundColor: 'white',
			padding: '1.5rem',
			borderRadius: '0.5rem',
			boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
			position: 'relative',
			overflow: 'hidden',
		},
		kpiIcon: {
			position: 'absolute',
			right: '1rem',
			top: '1rem',
			opacity: 0.1,
		},
		kpiValue: {
			fontSize: '2rem',
			fontWeight: 'bold',
			color: '#1f2937',
			marginBottom: '0.25rem',
		},
		kpiLabel: {
			fontSize: '0.875rem',
			color: '#6b7280',
		},
		kpiChange: {
			fontSize: '0.75rem',
			marginTop: '0.5rem',
			display: 'flex',
			alignItems: 'center',
			gap: '0.25rem',
		},
		chartContainer: {
			backgroundColor: 'white',
			padding: '1.5rem',
			borderRadius: '0.5rem',
			boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
			marginBottom: '1.5rem',
		},
		chartTitle: {
			fontSize: '1.125rem',
			fontWeight: '600',
			marginBottom: '1rem',
			color: '#1f2937',
		},
		tableContainer: {
			backgroundColor: 'white',
			borderRadius: '0.5rem',
			boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
			overflow: 'hidden',
		},
		table: {
			width: '100%',
			borderCollapse: 'collapse',
		},
		th: {
			backgroundColor: '#f9fafb',
			padding: '0.75rem',
			textAlign: 'left',
			fontSize: '0.875rem',
			fontWeight: '600',
			color: '#6b7280',
			borderBottom: '1px solid #e5e7eb',
		},
		td: {
			padding: '0.75rem',
			fontSize: '0.875rem',
			borderBottom: '1px solid #f3f4f6',
		},
		badge: {
			display: 'inline-block',
			padding: '0.25rem 0.75rem',
			borderRadius: '9999px',
			fontSize: '0.75rem',
			fontWeight: '500',
		},
		rewardBanner: {
			backgroundColor: '#fef3c7',
			border: '1px solid #fcd34d',
			borderRadius: '0.5rem',
			padding: '1rem',
			marginBottom: '1.5rem',
			display: 'flex',
			alignItems: 'center',
			gap: '1rem',
		},
	};

	if (loading) {
		return (
			<div style={styles.container}>
				<div style={{ textAlign: 'center', padding: '4rem' }}>
					<div className='spinner' />
					<p style={{ marginTop: '1rem', color: '#6b7280' }}>
						Caricamento analytics...
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div style={styles.container}>
				<div style={{ textAlign: 'center', padding: '4rem', color: '#ef4444' }}>
					<p>{error}</p>
					<button
						onClick={loadAnalytics}
						style={{
							marginTop: '1rem',
							padding: '0.5rem 1rem',
							borderRadius: '0.375rem',
							backgroundColor: '#3b82f6',
							color: 'white',
							border: 'none',
							cursor: 'pointer',
						}}
					>
						Riprova
					</button>
				</div>
			</div>
		);
	}

	const { overview, platformStats, dailyStats, topShares } = analytics || {};

	return (
		<div style={styles.container}>
			{/* Header */}
			<div style={styles.header}>
				<h1 style={styles.title}>📊 Le Tue Analytics</h1>
				<div style={styles.filters}>
					<Filter size={20} />
					<select
						value={dateRange}
						onChange={(e) => setDateRange(e.target.value)}
						style={styles.select}
					>
						<option value='7'>Ultimi 7 giorni</option>
						<option value='30'>Ultimi 30 giorni</option>
						<option value='90'>Ultimi 90 giorni</option>
					</select>
					<button
						onClick={() =>
							alert('Export CSV disponibile nella versione Premium')
						}
						style={{
							...styles.select,
							cursor: 'pointer',
							backgroundColor: '#f3f4f6',
						}}
					>
						<Download
							size={16}
							style={{ display: 'inline', marginRight: '0.5rem' }}
						/>
						Esporta
					</button>
				</div>
			</div>

			{/* Reward Banner */}
			{overview?.totalConversions >= 3 && (
				<div style={styles.rewardBanner}>
					<Award size={24} color='#f59e0b' />
					<div>
						<strong>Complimenti!</strong> Hai guadagnato{' '}
						{Math.floor(overview.totalConversions / 3)} mesi gratis!
						<br />
						<span style={{ fontSize: '0.875rem' }}>
							Continua a condividere per ottenere più ricompense.
						</span>
					</div>
				</div>
			)}

			{/* KPI Cards */}
			<div style={styles.grid}>
				<div style={styles.kpiCard}>
					<Share2 size={48} style={styles.kpiIcon} />
					<div style={styles.kpiValue}>{overview?.totalShares || 0}</div>
					<div style={styles.kpiLabel}>Condivisioni Totali</div>
					<div style={{ ...styles.kpiChange, color: '#10b981' }}>
						<TrendingUp size={14} />
						+12% vs mese scorso
					</div>
				</div>

				<div style={styles.kpiCard}>
					<MousePointer size={48} style={styles.kpiIcon} />
					<div style={styles.kpiValue}>{overview?.totalClicks || 0}</div>
					<div style={styles.kpiLabel}>Click Ricevuti</div>
					<div style={{ ...styles.kpiChange, color: '#10b981' }}>
						CTR:{' '}
						{overview?.totalShares > 0
							? ((overview.totalClicks / overview.totalShares) * 100).toFixed(1)
							: 0}
						%
					</div>
				</div>

				<div style={styles.kpiCard}>
					<Users size={48} style={styles.kpiIcon} />
					<div style={styles.kpiValue}>{overview?.totalConversions || 0}</div>
					<div style={styles.kpiLabel}>Amici Registrati</div>
					<div style={{ ...styles.kpiChange, color: '#f59e0b' }}>
						{overview?.conversionRate || 0}% conversion rate
					</div>
				</div>

				<div style={styles.kpiCard}>
					<TrendingUp size={48} style={styles.kpiIcon} />
					<div style={styles.kpiValue}>{overview?.viralCoefficient || 0}</div>
					<div style={styles.kpiLabel}>Coefficiente Virale</div>
					<div
						style={{
							...styles.kpiChange,
							color: overview?.viralCoefficient > 1 ? '#10b981' : '#ef4444',
						}}
					>
						{overview?.viralCoefficient > 1
							? 'Crescita virale! 🚀'
							: 'Serve più engagement'}
					</div>
				</div>
			</div>

			{/* Charts */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '2fr 1fr',
					gap: '1.5rem',
				}}
			>
				{/* Trend Chart */}
				<div style={styles.chartContainer}>
					<h3 style={styles.chartTitle}>📈 Andamento nel Tempo</h3>
					<ResponsiveContainer width='100%' height={300}>
						<LineChart data={dailyStats || []}>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis dataKey='date' />
							<YAxis />
							<Tooltip />
							<Legend />
							<Line
								type='monotone'
								dataKey='shares'
								stroke='#3b82f6'
								name='Condivisioni'
							/>
							<Line
								type='monotone'
								dataKey='clicks'
								stroke='#10b981'
								name='Click'
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>

				{/* Platform Pie Chart */}
				<div style={styles.chartContainer}>
					<h3 style={styles.chartTitle}>📱 Performance per Piattaforma</h3>
					<ResponsiveContainer width='100%' height={300}>
						<PieChart>
							<Pie
								data={platformStats || []}
								cx='50%'
								cy='50%'
								labelLine={false}
								label={({ platform, clicks }) => `${platform}: ${clicks}`}
								outerRadius={80}
								fill='#8884d8'
								dataKey='clicks'
							>
								{(platformStats || []).map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Top Shares Table */}
			<div style={styles.tableContainer}>
				<div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
					<h3 style={{ ...styles.chartTitle, margin: 0 }}>
						🏆 Le Tue Migliori Condivisioni
					</h3>
				</div>
				<table style={styles.table}>
					<thead>
						<tr>
							<th style={styles.th}>Data</th>
							<th style={styles.th}>Piattaforma</th>
							<th style={styles.th}>Click</th>
							<th style={styles.th}>Conversioni</th>
							<th style={styles.th}>Performance</th>
						</tr>
					</thead>
					<tbody>
						{(topShares || []).map((share, index) => (
							<tr key={share.id}>
								<td style={styles.td}>
									{new Date(share.createdAt).toLocaleDateString('it-IT')}
								</td>
								<td style={styles.td}>
									<span
										style={{
											...styles.badge,
											backgroundColor: COLORS[index % COLORS.length] + '20',
											color: COLORS[index % COLORS.length],
										}}
									>
										{share.platform}
									</span>
								</td>
								<td style={styles.td}>{share.clickCount}</td>
								<td style={styles.td}>{share.conversions}</td>
								<td style={styles.td}>
									<div style={{ display: 'flex', gap: '0.5rem' }}>
										{share.conversions > 0 && <span>🔥</span>}
										{share.clickCount > 10 && <span>📈</span>}
										{share.conversions / share.clickCount > 0.2 && (
											<span>⭐</span>
										)}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default AnalyticsDashboard;
