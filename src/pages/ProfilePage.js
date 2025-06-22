import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
	User,
	Mail,
	Calendar,
	Award,
	TrendingUp,
	Leaf,
	FileText,
} from 'lucide-react';

const ProfilePage = () => {
	const { user, updateProfile } = useAuth();
	const [editing, setEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: user?.name || '',
		profile: {
			company: user?.profile?.company || '',
			phone: user?.profile?.phone || '',
		},
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		const result = await updateProfile(formData);
		if (result.success) {
			setEditing(false);
			alert('Profilo aggiornato con successo!');
		}
	};

	const styles = {
		container: {
			maxWidth: '800px',
			margin: '0 auto',
			padding: '2rem 1rem',
		},
		card: {
			backgroundColor: 'white',
			borderRadius: '0.5rem',
			boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
			padding: '2rem',
			marginBottom: '2rem',
		},
		header: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: '2rem',
		},
		statsGrid: {
			display: 'grid',
			gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
			gap: '1rem',
			marginBottom: '2rem',
		},
		statCard: {
			padding: '1.5rem',
			backgroundColor: '#f9fafb',
			borderRadius: '0.375rem',
			textAlign: 'center',
		},
		button: {
			padding: '0.5rem 1rem',
			backgroundColor: '#059669',
			color: 'white',
			border: 'none',
			borderRadius: '0.375rem',
			cursor: 'pointer',
		},
	};

	return (
		<div style={styles.container}>
			<h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Il mio Profilo</h1>

			<div style={styles.card}>
				<div style={styles.header}>
					<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
						<div
							style={{
								width: '60px',
								height: '60px',
								backgroundColor: '#e5e7eb',
								borderRadius: '50%',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<User size={30} color='#6b7280' />
						</div>
						<div>
							<h2 style={{ margin: 0 }}>{user?.name}</h2>
							<p
								style={{
									margin: 0,
									color: '#6b7280',
									display: 'flex',
									alignItems: 'center',
									gap: '0.5rem',
								}}
							>
								<Mail size={16} /> {user?.email}
							</p>
						</div>
					</div>
					<button onClick={() => setEditing(!editing)} style={styles.button}>
						{editing ? 'Annulla' : 'Modifica'}
					</button>
				</div>

				{editing ? (
					<form onSubmit={handleSubmit}>
						<div style={{ marginBottom: '1rem' }}>
							<label style={{ display: 'block', marginBottom: '0.5rem' }}>
								Nome
							</label>
							<input
								type='text'
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								style={{
									width: '100%',
									padding: '0.5rem',
									border: '1px solid #d1d5db',
									borderRadius: '0.375rem',
								}}
							/>
						</div>
						<button type='submit' style={styles.button}>
							Salva modifiche
						</button>
					</form>
				) : (
					<div style={{ color: '#6b7280' }}>
						<p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
							<Calendar size={16} />
							Registrato il{' '}
							{new Date(user?.createdAt || Date.now()).toLocaleDateString(
								'it-IT'
							)}
						</p>
						<p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
							<Award size={16} />
							Piano: {user?.subscription?.plan || 'Free'}
						</p>
					</div>
				)}
			</div>

			<div style={styles.card}>
				<h3 style={{ marginBottom: '1.5rem' }}>Le tue Statistiche</h3>
				<div style={styles.statsGrid}>
					<div style={styles.statCard}>
						<FileText
							size={32}
							color='#059669'
							style={{ marginBottom: '0.5rem' }}
						/>
						<h4 style={{ margin: '0 0 0.5rem' }}>Report Totali</h4>
						<p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
							{user?.stats?.totalReports || 0}
						</p>
					</div>
					<div style={styles.statCard}>
						<TrendingUp
							size={32}
							color='#2563eb'
							style={{ marginBottom: '0.5rem' }}
						/>
						<h4 style={{ margin: '0 0 0.5rem' }}>Risparmi Totali</h4>
						<p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
							€{user?.stats?.totalSavings?.toFixed(0) || 0}
						</p>
					</div>
					<div style={styles.statCard}>
						<Leaf
							size={32}
							color='#10b981'
							style={{ marginBottom: '0.5rem' }}
						/>
						<h4 style={{ margin: '0 0 0.5rem' }}>CO2 Risparmiata</h4>
						<p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
							{(user?.stats?.co2Saved / 1000)?.toFixed(1) || 0} ton
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
