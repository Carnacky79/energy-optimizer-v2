// src/components/Layout/Header.js

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Clock, AlertCircle, User, LogOut, Shield } from 'lucide-react';
import StorageManager from '../../utils/storage';
import { useAuth } from '../../contexts/AuthContext';

const styles = {
	header: {
		backgroundColor: 'white',
		boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
		position: 'sticky',
		top: 0,
		zIndex: 100,
	},
	container: {
		maxWidth: '1200px',
		margin: '0 auto',
		padding: '1rem',
	},
	nav: {
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
		textDecoration: 'none',
	},
	navLinks: {
		display: 'flex',
		gap: '2rem',
		alignItems: 'center',
	},
	navLink: {
		textDecoration: 'none',
		color: '#4b5563',
		fontWeight: '500',
		padding: '0.5rem 1rem',
		borderRadius: '0.375rem',
		transition: 'all 0.2s',
	},
	navLinkActive: {
		backgroundColor: '#f3f4f6',
		color: '#059669',
	},
	warningBanner: {
		backgroundColor: '#fef3c7',
		borderBottom: '1px solid #fbbf24',
		padding: '0.75rem',
	},
	warningContent: {
		maxWidth: '1200px',
		margin: '0 auto',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		fontSize: '0.875rem',
	},
	warningText: {
		display: 'flex',
		alignItems: 'center',
		gap: '0.5rem',
		color: '#92400e',
	},
	registerButton: {
		backgroundColor: '#059669',
		color: 'white',
		padding: '0.5rem 1rem',
		borderRadius: '0.375rem',
		textDecoration: 'none',
		fontSize: '0.875rem',
		fontWeight: '500',
		transition: 'all 0.2s',
	},
	userMenu: {
		position: 'relative',
	},
	userButton: {
		display: 'flex',
		alignItems: 'center',
		gap: '0.5rem',
		padding: '0.5rem 1rem',
		backgroundColor: '#f3f4f6',
		borderRadius: '0.375rem',
		border: 'none',
		cursor: 'pointer',
	},
};

const Header = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { user, logout, isAuthenticated } = useAuth();
	const [timeRemaining, setTimeRemaining] = useState(null);
	const [showUserMenu, setShowUserMenu] = useState(false);

	useEffect(() => {
		const checkStatus = () => {
			if (!isAuthenticated && !StorageManager.isUserRegistered()) {
				setTimeRemaining(StorageManager.getGuestTimeRemaining());
			} else {
				setTimeRemaining(null);
			}
		};

		checkStatus();
		const interval = setInterval(checkStatus, 60000); // Aggiorna ogni minuto

		return () => clearInterval(interval);
	}, [isAuthenticated]);

	const isActive = (path) => location.pathname === path;

	return (
		<>
			{/* Warning Banner per utenti non registrati */}
			{!isAuthenticated && timeRemaining && (
				<div style={styles.warningBanner}>
					<div style={styles.warningContent}>
						<div style={styles.warningText}>
							<AlertCircle size={16} />
							<Clock size={16} />
							<span>
								I tuoi report saranno cancellati tra {timeRemaining.hours}h{' '}
								{timeRemaining.minutes}m
							</span>
						</div>
						<Link to='/register' style={styles.registerButton}>
							Registrati per salvarli permanentemente
						</Link>
					</div>
				</div>
			)}

			{/* Header principale */}
			<header style={styles.header}>
				<div style={styles.container}>
					<nav style={styles.nav}>
						<Link to='/' style={styles.logo}>
							<Leaf
								size={32}
								color='#059669'
								style={{ marginRight: '0.5rem' }}
							/>
							<span>Energy Optimizer</span>
						</Link>

						<div style={styles.navLinks}>
							<Link
								to='/'
								style={{
									...styles.navLink,
									...(isActive('/') ? styles.navLinkActive : {}),
								}}
							>
								Calcolatore
							</Link>
							<Link
								to='/reports'
								style={{
									...styles.navLink,
									...(isActive('/reports') ? styles.navLinkActive : {}),
								}}
							>
								I miei Report
							</Link>
							<Link
								to='/tips'
								style={{
									...styles.navLink,
									...(isActive('/tips') ? styles.navLinkActive : {}),
								}}
							>
								Consigli
							</Link>
							<Link
								to='/pricing'
								style={{
									...styles.navLink,
									...(isActive('/pricing') ? styles.navLinkActive : {}),
									color: '#f59e0b',
									fontWeight: 'bold',
								}}
							>
								⭐ Premium
							</Link>

							{isAuthenticated ? (
								<div style={styles.userMenu}>
									<button
										style={styles.userButton}
										onClick={() => setShowUserMenu(!showUserMenu)}
									>
										<User size={20} />
										<span>{user?.name || 'Account'}</span>
									</button>
									{showUserMenu && (
										<div
											style={{
												position: 'absolute',
												top: '100%',
												right: 0,
												marginTop: '0.5rem',
												backgroundColor: 'white',
												border: '1px solid #e5e7eb',
												borderRadius: '0.375rem',
												boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
												minWidth: '200px',
												zIndex: 50,
											}}
										>
											<Link
												to='/profile'
												style={{
													display: 'block',
													padding: '0.75rem 1rem',
													textDecoration: 'none',
													color: '#374151',
													borderBottom: '1px solid #e5e7eb',
												}}
												onClick={() => setShowUserMenu(false)}
											>
												<User
													size={16}
													style={{ display: 'inline', marginRight: '0.5rem' }}
												/>
												Il mio profilo
											</Link>
											<button
												onClick={() => {
													setShowUserMenu(false);
													logout();
												}}
												style={{
													display: 'block',
													width: '100%',
													padding: '0.75rem 1rem',
													textAlign: 'left',
													background: 'none',
													border: 'none',
													cursor: 'pointer',
													color: '#374151',
												}}
											>
												<LogOut
													size={16}
													style={{ display: 'inline', marginRight: '0.5rem' }}
												/>
												Esci
											</button>
										</div>
									)}
								</div>
							) : (
								<div
									style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
								>
									<Link
										to='/login'
										style={{
											...styles.navLink,
											padding: '0.5rem 1rem',
										}}
									>
										Accedi
									</Link>
									<Link
										to='/register'
										style={{
											...styles.registerButton,
											backgroundColor: '#059669',
											color: 'white',
											padding: '0.75rem 1.5rem',
										}}
									>
										Registrati
									</Link>
									{user?.role === 'superadmin' && (
										<Link
											to='/admin'
											style={{
												display: 'block',
												padding: '0.75rem 1rem',
												textDecoration: 'none',
												color: '#1f2937',
												backgroundColor: '#fee2e2',
											}}
										>
											<Shield
												size={16}
												style={{ display: 'inline', marginRight: '0.5rem' }}
											/>
											Super Admin
										</Link>
									)}
								</div>
							)}
						</div>
					</nav>
				</div>
			</header>
		</>
	);
};

export default Header;
