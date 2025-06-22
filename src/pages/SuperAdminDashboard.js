// src/pages/SuperAdminDashboard.js

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
	AreaChart,
	Area,
} from 'recharts';
import {
	Users,
	TrendingUp,
	Euro,
	Calendar,
	AlertCircle,
	Shield,
	Download,
	Filter,
	Search,
	ChevronDown,
} from 'lucide-react';
import { adminAPI } from '../services/api';

const SuperAdminDashboard = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState('overview');
	const [globalStats, setGlobalStats] = useState(null);
	const [users, setUsers] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterSubscription, setFilterSubscription] = useState('all');
	const [dateRange, setDateRange] = useState('30');

	useEffect(() => {
		loadData();
	}, [activeTab, dateRange]);

	const loadData = async () => {
		try {
			setLoading(true);

			if (activeTab === 'overview') {
				const response = await adminAPI.getGlobalAnalytics({ days: dateRange });
				setGlobalStats(response.data);
			} else if (activeTab === 'users') {
				const response = await adminAPI.getAllUsers({
					search: searchTerm,
					subscriptionType: filterSubscription,
				});
				setUsers(response.data.users);
			}
		} catch (error) {
			console.error('Error loading admin data:', error);
		} finally {
			setLoading(false);
		}
	};

	const styles = {
		container: {
			backgroundColor: '#f3f4f6',
			minHeight: '100vh',
		},
		header: {
			backgroundColor: '#1f2937',
			color: 'white',
			padding: '1.5rem 2rem',
			boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
		},
		headerContent: {
			maxWidth: '1400px',
			margin: '0 auto',
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		title: {
			fontSize: '1.75rem',
			fontWeight: 'bold',
			display: 'flex',
			alignItems: 'center',
			gap: '0.5rem',
		},
		tabs: {
			display: 'flex',
			gap: '2rem',
			borderBottom: '1px solid #374151',
			paddingTop: '1rem',
		},
		tab: {
			padding: '0.5rem 0',
			cursor: 'pointer',
			borderBottom: '2px solid transparent',
			transition: 'all 0.2s',
		},
		tabActive: {
			borderBottomColor: '#3b82f6',
		},
		content: {
			maxWidth: '1400px',
			margin: '0 auto',
			padding: '2rem',
		},
		kpiGrid: {
			display: 'grid',
			gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
			gap: '1.5rem',
			marginBottom: '2rem',
		},
		kpiCard: {
			backgroundColor: 'white',
			padding: '1.5rem',
			borderRadius: '0.5rem',
			boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
			position: 'relative',
		},
		kpiHeader: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'flex-start',
			marginBottom: '1rem',
		},
		kpiTitle: {
			color: '#6b7280',
			fontSize: '0.875rem',
			fontWeight: '500',
		},
		kpiValue: {
			fontSize: '2.5rem',
			fontWeight: 'bold',
			color: '#1f2937',
		},
		kpiSubtext: {
			fontSize: '0.875rem',
			color: '#9ca3af',
			marginTop: '0.5rem',
		},
		chartContainer: {
			backgroundColor: 'white',
			padding: '1.5rem',
			borderRadius: '0.5rem',
			boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
			marginBottom: '1.5rem',
		},
		usersTable: {
			backgroundColor: 'white',
			borderRadius: '0.5rem',
			boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
			overflow: 'hidden',
		},
		searchBar: {
			padding: '1rem',
			borderBottom: '1px solid #e5e7eb',
			display: 'flex',
			gap: '1rem',
			alignItems: 'center',
		},
		searchInput: {
			flex: 1,
			padding: '0.5rem 1rem',
			border: '1px solid #d1d5db',
			borderRadius: '0.375rem',
			fontSize: '0.875rem',
		},
		filterSelect: {
			padding: '0.5rem 1rem',
			border: '1px solid #d1d5db',
			borderRadius: '0.375rem',
			fontSize: '0.875rem',
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
		actionButton: {
			padding: '0.25rem 0.5rem',
			fontSize: '0.75rem',
			borderRadius: '0.25rem',
			border: '1px solid #d1d5db',
			backgroundColor: 'white',
			cursor: 'pointer',
			marginRight: '0.25rem',
		},
	};

	const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

	if (loading) {
		return (
			<div style={styles.container}>
				<div style={{ textAlign: 'center', padding: '4rem' }}>
					<div className='spinner' />
					<p style={{ marginTop: '1rem', color: '#6b7280' }}>
						Caricamento dati amministratore...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div style={styles.container}>
			{/* Header */}
			<div style={styles.header}>
				<div style={styles.headerContent}>
					<div>
						<h1 style={styles.title}>
							<Shield size={32} />
							Super Admin Dashboard
						</h1>
						<div style={styles.tabs}>
							<div
								style={{
									...styles.tab,
									...(activeTab === 'overview' ? styles.tabActive : {}),
								}}
								onClick={() => setActiveTab('overview')}
							>
								Panoramica
							</div>
							<div
								style={{
									...styles.tab,
									...(activeTab === 'users' ? styles.tabActive : {}),
								}}
								onClick={() => setActiveTab('users')}
							>
								Utenti
							</div>
							<div
								style={{
									...styles.tab,
									...(activeTab === 'revenue' ? styles.tabActive : {}),
								}}
								onClick={() => setActiveTab('revenue')}
							>
								Revenue
							</div>
							<div
								style={{
									...styles.tab,
									...(activeTab === 'analytics' ? styles.tabActive : {}),
								}}
								onClick={() => setActiveTab('analytics')}
							>
								Analytics
							</div>
						</div>
					</div>
					<div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
						<select
							value={dateRange}
							onChange={(e) => setDateRange(e.target.value)}
							style={styles.filterSelect}
						>
							<option value='7'>Ultimi 7 giorni</option>
							<option value='30'>Ultimi 30 giorni</option>
							<option value='90'>Ultimi 90 giorni</option>
							<option value='365'>Ultimo anno</option>
						</select>
						<button
							onClick={() => alert('Export completo disponibile')}
							style={{
								...styles.filterSelect,
								cursor: 'pointer',
								display: 'flex',
								alignItems: 'center',
								gap: '0.5rem',
							}}
						>
							<Download size={16} />
							Export
						</button>
					</div>
				</div>
			</div>

			{/* Content */}
			<div style={styles.content}>
				{activeTab === 'overview' && globalStats && (
					<>
						{/* KPI Cards */}
						<div style={styles.kpiGrid}>
							<div style={styles.kpiCard}>
								<div style={styles.kpiHeader}>
									<div>
										<div style={styles.kpiTitle}>Utenti Totali</div>
										<div style={styles.kpiValue}>
											{globalStats.kpi.totalUsers.toLocaleString()}
										</div>
										<div style={styles.kpiSubtext}>
											+{globalStats.kpi.newUsersThisMonth} questo mese
										</div>
									</div>
									<Users size={32} color='#3b82f6' />
								</div>
							</div>

							<div style={styles.kpiCard}>
								<div style={styles.kpiHeader}>
									<div>
										<div style={styles.kpiTitle}>Utenti Premium</div>
										<div style={styles.kpiValue}>
											{globalStats.kpi.premiumUsers.toLocaleString()}
										</div>
										<div style={styles.kpiSubtext}>
											{globalStats.kpi.conversionRate}% conversion rate
										</div>
									</div>
									<TrendingUp size={32} color='#10b981' />
								</div>
							</div>

							<div style={styles.kpiCard}>
								<div style={styles.kpiHeader}>
									<div>
										<div style={styles.kpiTitle}>Revenue Mensile</div>
										<div style={styles.kpiValue}>
											€{globalStats.kpi.monthlyRevenue.toLocaleString()}
										</div>
										<div style={styles.kpiSubtext}>+23% vs mese scorso</div>
									</div>
									<Euro size={32} color='#f59e0b' />
								</div>
							</div>

							<div style={styles.kpiCard}>
								<div style={styles.kpiHeader}>
									<div>
										<div style={styles.kpiTitle}>Report Totali</div>
										<div style={styles.kpiValue}>
											{globalStats.kpi.totalReports.toLocaleString()}
										</div>
										<div style={styles.kpiSubtext}>
											~
											{Math.round(
												globalStats.kpi.totalReports /
													globalStats.kpi.totalUsers
											)}{' '}
											per utente
										</div>
									</div>
									<Calendar size={32} color='#8b5cf6' />
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
							{/* Growth Chart */}
							<div style={styles.chartContainer}>
								<h3
									style={{
										fontSize: '1.125rem',
										fontWeight: '600',
										marginBottom: '1rem',
									}}
								>
									Crescita Utenti e Revenue
								</h3>
								<ResponsiveContainer width='100%' height={300}>
									<AreaChart data={globalStats.dailyMetrics}>
										<CartesianGrid strokeDasharray='3 3' />
										<XAxis dataKey='date' />
										<YAxis yAxisId='left' />
										<YAxis yAxisId='right' orientation='right' />
										<Tooltip />
										<Legend />
										<Area
											yAxisId='left'
											type='monotone'
											dataKey='newUsers'
											stroke='#3b82f6'
											fill='#3b82f6'
											fillOpacity={0.3}
											name='Nuovi Utenti'
										/>
										<Area
											yAxisId='right'
											type='monotone'
											dataKey='revenue'
											stroke='#10b981'
											fill='#10b981'
											fillOpacity={0.3}
											name='Revenue (€)'
										/>
									</AreaChart>
								</ResponsiveContainer>
							</div>

							{/* Subscription Distribution */}
							<div style={styles.chartContainer}>
								<h3
									style={{
										fontSize: '1.125rem',
										fontWeight: '600',
										marginBottom: '1rem',
									}}
								>
									Distribuzione Abbonamenti
								</h3>
								<ResponsiveContainer width='100%' height={300}>
									<PieChart>
										<Pie
											data={globalStats.usersBySubscription}
											cx='50%'
											cy='50%'
											labelLine={false}
											label={({ subscriptionType, count }) =>
												`${subscriptionType}: ${count}`
											}
											outerRadius={80}
											fill='#8884d8'
											dataKey='count'
										>
											{globalStats.usersBySubscription.map((entry, index) => (
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

						{/* Top Referrers */}
						<div style={styles.chartContainer}>
							<h3
								style={{
									fontSize: '1.125rem',
									fontWeight: '600',
									marginBottom: '1rem',
								}}
							>
								🏆 Top Referrer (Affiliati)
							</h3>
							<table style={styles.table}>
								<thead>
									<tr>
										<th style={styles.th}>Utente</th>
										<th style={styles.th}>Email</th>
										<th style={styles.th}>Condivisioni</th>
										<th style={styles.th}>Conversioni</th>
										<th style={styles.th}>Revenue Generato</th>
										<th style={styles.th}>Premio</th>
									</tr>
								</thead>
								<tbody>
									{globalStats.topReferrers.map((user) => (
										<tr key={user.id}>
											<td style={styles.td}>{user.name}</td>
											<td style={styles.td}>{user.email}</td>
											<td style={styles.td}>{user.totalShares}</td>
											<td style={styles.td}>{user.conversions}</td>
											<td style={styles.td}>€{user.revenueGenerated}</td>
											<td style={styles.td}>
												{user.conversions >= 10 && (
													<span
														style={{
															...styles.badge,
															backgroundColor: '#fef3c7',
															color: '#f59e0b',
														}}
													>
														🏆 Gold
													</span>
												)}
												{user.conversions >= 5 && user.conversions < 10 && (
													<span
														style={{
															...styles.badge,
															backgroundColor: '#e0e7ff',
															color: '#6366f1',
														}}
													>
														🥈 Silver
													</span>
												)}
												{user.conversions >= 3 && user.conversions < 5 && (
													<span
														style={{
															...styles.badge,
															backgroundColor: '#fed7aa',
															color: '#ea580c',
														}}
													>
														🥉 Bronze
													</span>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</>
				)}

				{activeTab === 'users' && (
					<div style={styles.usersTable}>
						{/* Search and Filters */}
						<div style={styles.searchBar}>
							<div style={{ position: 'relative', flex: 1 }}>
								<Search
									size={20}
									style={{
										position: 'absolute',
										left: '0.75rem',
										top: '50%',
										transform: 'translateY(-50%)',
										color: '#9ca3af',
									}}
								/>
								<input
									type='text'
									placeholder='Cerca utente per nome o email...'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									style={{ ...styles.searchInput, paddingLeft: '2.5rem' }}
								/>
							</div>
							<select
								value={filterSubscription}
								onChange={(e) => setFilterSubscription(e.target.value)}
								style={styles.filterSelect}
							>
								<option value='all'>Tutti gli utenti</option>
								<option value='free'>Solo Free</option>
								<option value='premium'>Solo Premium</option>
								<option value='expired'>Scaduti</option>
							</select>
							<button
								onClick={loadData}
								style={{
									...styles.filterSelect,
									backgroundColor: '#3b82f6',
									color: 'white',
									cursor: 'pointer',
								}}
							>
								Filtra
							</button>
						</div>

						{/* Users Table */}
						<table style={styles.table}>
							<thead>
								<tr>
									<th style={styles.th}>ID</th>
									<th style={styles.th}>Nome</th>
									<th style={styles.th}>Email</th>
									<th style={styles.th}>Tipo</th>
									<th style={styles.th}>Piano</th>
									<th style={styles.th}>Scadenza</th>
									<th style={styles.th}>Report</th>
									<th style={styles.th}>Ultimo Accesso</th>
									<th style={styles.th}>Azioni</th>
								</tr>
							</thead>
							<tbody>
								{users.map((user) => (
									<tr key={user.id}>
										<td style={styles.td}>#{user.id}</td>
										<td style={styles.td}>
											<div style={{ fontWeight: '500' }}>{user.name}</div>
										</td>
										<td style={styles.td}>{user.email}</td>
										<td style={styles.td}>
											<span
												style={{
													...styles.badge,
													backgroundColor:
														user.subscriptionType === 'premium'
															? '#dcfce7'
															: '#f3f4f6',
													color:
														user.subscriptionType === 'premium'
															? '#16a34a'
															: '#6b7280',
												}}
											>
												{user.subscriptionType}
											</span>
										</td>
										<td style={styles.td}>{user.subscriptionPlan || '-'}</td>
										<td style={styles.td}>
											{user.subscriptionExpiry
												? new Date(user.subscriptionExpiry).toLocaleDateString(
														'it-IT'
												  )
												: '-'}
											{user.subscriptionExpiry &&
												new Date(user.subscriptionExpiry) < new Date() && (
													<span
														style={{
															color: '#ef4444',
															fontSize: '0.75rem',
															display: 'block',
														}}
													>
														Scaduto
													</span>
												)}
										</td>
										<td style={styles.td}>{user.reportCount || 0}</td>
										<td style={styles.td}>
											{user.lastLoginAt
												? new Date(user.lastLoginAt).toLocaleDateString('it-IT')
												: 'Mai'}
										</td>
										<td style={styles.td}>
											<button
												onClick={() => navigate(`/admin/user/${user.id}`)}
												style={styles.actionButton}
											>
												Dettagli
											</button>
											<button
												onClick={() => alert(`Modifica utente ${user.id}`)}
												style={styles.actionButton}
											>
												Modifica
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
};

export default SuperAdminDashboard;
