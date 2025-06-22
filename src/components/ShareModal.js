// src/components/ShareModal.js

import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Share2, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ShareModal = ({ report, onClose }) => {
	const { user } = useAuth();
	const [copied, setCopied] = useState(false);
	const [shareId, setShareId] = useState('');
	const [shareStats, setShareStats] = useState({ shares: 0, clicks: 0 });

	useEffect(() => {
		// Genera un ID unico per il tracking
		const id = generateShareId();
		setShareId(id);

		// Salva il link di condivisione nel backend per tracking
		saveShareLink(id);
	}, []);

	const generateShareId = () => {
		return `${user?.id || 'guest'}_${Date.now()}_${Math.random()
			.toString(36)
			.substr(2, 9)}`;
	};

	const saveShareLink = async (id) => {
		try {
			// Salva nel backend per tracking
			await fetch('/api/analytics/track', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					event: 'share_created',
					data: {
						shareId: id,
						reportId: report.id,
						userId: user?.id,
						timestamp: new Date(),
					},
				}),
			});
		} catch (error) {
			console.error('Error tracking share:', error);
		}
	};

	// Messaggi ottimizzati per viralità
	const messages = {
		main:
			'🚨 Ho appena scoperto che posso risparmiare €' +
			Math.round(
				report.annualSavings ||
					report.results?.savingsPotential?.annualSavings ||
					1847
			) +
			" all'anno sulla bolletta energetica!",
		whatsapp:
			"💰 *INCREDIBILE!* Ho fatto l'analisi energetica gratuita e potrei risparmiare *€" +
			Math.round(
				report.annualSavings ||
					report.results?.savingsPotential?.annualSavings ||
					1847
			) +
			" all'anno!*\n\n📊 Il mio livello di efficienza: " +
			(report.efficiencyLevel ||
				report.results?.efficiencyLevel?.level ||
				'Scarso') +
			'\n⚡ Potenziale risparmio: ' +
			(report.savingsPercentage ||
				report.results?.savingsPotential?.percentage ||
				38) +
			"%\n\n🎁 Fai anche tu l'analisi GRATIS (solo per oggi):",
		facebook:
			'🤯 Non ci credevo ma è vero! Posso risparmiare €' +
			Math.round(
				report.annualSavings ||
					report.results?.savingsPotential?.annualSavings ||
					1847
			) +
			" all'anno sulla bolletta!\n\n✅ Analisi gratuita in 2 minuti\n✅ Piano personalizzato di risparmio\n✅ Nessun impegno\n\nProva anche tu 👇",
		linkedin:
			'💡 Ottimizzazione Energetica: Come ho scoperto di poter risparmiare €' +
			Math.round(
				report.annualSavings ||
					report.results?.savingsPotential?.annualSavings ||
					1847
			) +
			" all'anno\n\nHo appena completato un'analisi energetica professionale che ha rivelato un potenziale di risparmio del " +
			(report.savingsPercentage ||
				report.results?.savingsPotential?.percentage ||
				38) +
			"% sui miei consumi.\n\nIn un'epoca di costi energetici crescenti, l'efficienza è fondamentale per la sostenibilità aziendale.\n\n#EfficenzaEnergetica #Sostenibilità #RisparmioEnergetico",
		twitter:
			'💰 Mind = Blown! 🤯\n\nHo scoperto che posso risparmiare €' +
			Math.round(
				report.annualSavings ||
					report.results?.savingsPotential?.annualSavings ||
					1847
			) +
			'/anno sulla bolletta energetica!\n\n⚡ Analisi gratuita in 2 min\n✅ ' +
			(report.savingsPercentage ||
				report.results?.savingsPotential?.percentage ||
				38) +
			'% di risparmio\n🌱 Meno CO2\n\nProva anche tu 👉',
	};

	const shareUrl = `${
		window.location.origin
	}/shared/${shareId}?ref=${encodeURIComponent(user?.name || 'Amico')}`;

	const shareLinks = {
		whatsapp: `https://wa.me/?text=${encodeURIComponent(
			messages.whatsapp + '\n' + shareUrl
		)}`,
		facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
			shareUrl
		)}&quote=${encodeURIComponent(messages.facebook)}`,
		linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
			shareUrl
		)}&summary=${encodeURIComponent(messages.linkedin)}`,
		twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
			messages.twitter
		)}&url=${encodeURIComponent(shareUrl)}`,
	};

	const handleShare = (platform) => {
		// Track share
		fetch('/api/analytics/track', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				event: 'share_clicked',
				data: {
					shareId,
					platform,
					userId: user?.id,
				},
			}),
		});

		// Apri il link di condivisione
		window.open(shareLinks[platform], '_blank', 'width=600,height=400');
	};

	const copyLink = () => {
		navigator.clipboard.writeText(shareUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);

		// Track copy
		fetch('/api/analytics/track', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				event: 'link_copied',
				data: { shareId, userId: user?.id },
			}),
		});
	};

	const styles = {
		overlay: {
			position: 'fixed',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			zIndex: 9999,
		},
		modal: {
			backgroundColor: 'white',
			borderRadius: '0.75rem',
			maxWidth: '500px',
			width: '90%',
			maxHeight: '90vh',
			overflow: 'auto',
			position: 'relative',
		},
		header: {
			padding: '1.5rem',
			borderBottom: '1px solid #e5e7eb',
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		content: {
			padding: '1.5rem',
		},
		previewBox: {
			backgroundColor: '#f9fafb',
			border: '1px solid #e5e7eb',
			borderRadius: '0.5rem',
			padding: '1rem',
			marginBottom: '1.5rem',
		},
		socialButtons: {
			display: 'grid',
			gridTemplateColumns: 'repeat(2, 1fr)',
			gap: '1rem',
			marginBottom: '1.5rem',
		},
		socialButton: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: '0.5rem',
			padding: '0.75rem',
			borderRadius: '0.5rem',
			border: 'none',
			cursor: 'pointer',
			fontWeight: 'bold',
			transition: 'all 0.2s',
		},
		linkBox: {
			display: 'flex',
			gap: '0.5rem',
			marginBottom: '1.5rem',
		},
		linkInput: {
			flex: 1,
			padding: '0.75rem',
			border: '1px solid #e5e7eb',
			borderRadius: '0.5rem',
			fontSize: '0.875rem',
			backgroundColor: '#f9fafb',
		},
		copyButton: {
			padding: '0.75rem 1rem',
			backgroundColor: copied ? '#10b981' : '#6b7280',
			color: 'white',
			border: 'none',
			borderRadius: '0.5rem',
			cursor: 'pointer',
			display: 'flex',
			alignItems: 'center',
			gap: '0.5rem',
			transition: 'all 0.2s',
		},
		incentive: {
			backgroundColor: '#fef3c7',
			border: '1px solid #fbbf24',
			borderRadius: '0.5rem',
			padding: '1rem',
			marginBottom: '1rem',
		},
		stats: {
			backgroundColor: '#f0fdf4',
			borderRadius: '0.5rem',
			padding: '1rem',
			display: 'flex',
			justifyContent: 'space-around',
			textAlign: 'center',
		},
	};

	const socialPlatforms = [
		{
			name: 'whatsapp',
			label: 'WhatsApp',
			color: '#25D366',
			icon: '📱',
		},
		{
			name: 'facebook',
			label: 'Facebook',
			color: '#1877F2',
			icon: '👥',
		},
		{
			name: 'linkedin',
			label: 'LinkedIn',
			color: '#0A66C2',
			icon: '💼',
		},
		{
			name: 'twitter',
			label: 'X',
			color: '#000000',
			icon: '𝕏',
		},
	];

	return (
		<div style={styles.overlay} onClick={onClose}>
			<div style={styles.modal} onClick={(e) => e.stopPropagation()}>
				<div style={styles.header}>
					<h2 style={{ fontSize: '1.5rem', margin: 0 }}>
						<Share2
							size={24}
							style={{ display: 'inline', marginRight: '0.5rem' }}
						/>
						Condividi i tuoi Risultati
					</h2>
					<button
						onClick={onClose}
						style={{
							background: 'none',
							border: 'none',
							cursor: 'pointer',
							color: '#6b7280',
						}}
					>
						<X size={24} />
					</button>
				</div>

				<div style={styles.content}>
					{/* Incentivo per condividere */}
					<div style={styles.incentive}>
						<h3 style={{ margin: '0 0 0.5rem', fontSize: '1.125rem' }}>
							🎁 Condividi e Ottieni Premium GRATIS!
						</h3>
						<p style={{ margin: 0, fontSize: '0.875rem' }}>
							Per ogni 3 amici che si registrano dal tuo link, ricevi 1 mese di
							Premium gratis!
							<br />
							<strong>Hai già invitato: {shareStats.shares} persone</strong>
						</p>
					</div>

					{/* Preview del messaggio */}
					<div style={styles.previewBox}>
						<p style={{ margin: '0 0 0.5rem', fontWeight: 'bold' }}>
							Anteprima messaggio:
						</p>
						<p style={{ margin: 0, fontSize: '0.875rem' }}>{messages.main}</p>
					</div>

					{/* Bottoni social */}
					<div style={styles.socialButtons}>
						{socialPlatforms.map((platform) => (
							<button
								key={platform.name}
								onClick={() => handleShare(platform.name)}
								style={{
									...styles.socialButton,
									backgroundColor: platform.color,
									color: 'white',
								}}
								onMouseOver={(e) => {
									e.currentTarget.style.transform = 'translateY(-2px)';
									e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
								}}
								onMouseOut={(e) => {
									e.currentTarget.style.transform = 'translateY(0)';
									e.currentTarget.style.boxShadow = 'none';
								}}
							>
								<span style={{ fontSize: '1.25rem' }}>{platform.icon}</span>
								{platform.label}
							</button>
						))}
					</div>

					{/* Copia link */}
					<div style={styles.linkBox}>
						<input
							type='text'
							value={shareUrl}
							readOnly
							style={styles.linkInput}
							onClick={(e) => e.target.select()}
						/>
						<button onClick={copyLink} style={styles.copyButton}>
							{copied ? <Check size={20} /> : <Copy size={20} />}
							{copied ? 'Copiato!' : 'Copia'}
						</button>
					</div>

					{/* Statistiche (se disponibili) */}
					{user && (
						<div style={styles.stats}>
							<div>
								<Users size={24} color='#10b981' />
								<p style={{ margin: '0.25rem 0 0', fontWeight: 'bold' }}>
									{shareStats.clicks}
								</p>
								<p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
									Click ricevuti
								</p>
							</div>
							<div>
								<Share2 size={24} color='#3b82f6' />
								<p style={{ margin: '0.25rem 0 0', fontWeight: 'bold' }}>
									{shareStats.shares}
								</p>
								<p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
									Condivisioni
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ShareModal;
