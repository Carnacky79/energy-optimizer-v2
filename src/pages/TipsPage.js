import React, { useState, useEffect } from 'react';
import { FileText, Trash2, Eye, Calendar, TrendingUp } from 'lucide-react';
import StorageManager from '../utils/storage';

const TipsPage = () => {
	const styles = {
		container: {
			maxWidth: '1200px',
			margin: '0 auto',
			padding: '2rem 1rem',
		},
		section: {
			backgroundColor: 'white',
			borderRadius: '0.5rem',
			boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
			padding: '2rem',
			marginBottom: '2rem',
		},
		grid: {
			display: 'grid',
			gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
			gap: '2rem',
		},
		tipCategory: {
			marginBottom: '2rem',
		},
		tipList: {
			listStyle: 'none',
			padding: 0,
		},
		tipItem: {
			display: 'flex',
			alignItems: 'flex-start',
			marginBottom: '1rem',
			padding: '1rem',
			backgroundColor: '#f9fafb',
			borderRadius: '0.375rem',
			transition: 'all 0.2s',
		},
		incentiveCard: {
			padding: '1.5rem',
			backgroundColor: '#f0fdf4',
			borderRadius: '0.5rem',
			border: '1px solid #86efac',
		},
	};

	const tips = {
		illuminazione: [
			'Sostituisci tutte le lampade tradizionali con LED ad alta efficienza',
			'Installa sensori di presenza nelle aree di passaggio',
			'Sfrutta al massimo la luce naturale con tende chiare',
			"Utilizza dimmer per regolare l'intensità luminosa",
			'Spegni sempre le luci quando esci da una stanza',
		],
		climatizzazione: [
			'Mantieni la temperatura a 20°C in inverno e 26°C in estate',
			'Installa valvole termostatiche sui radiatori',
			'Esegui manutenzione regolare degli impianti',
			"Utilizza ventilatori a soffitto per distribuire l'aria",
			"Chiudi porte e finestre quando l'impianto è in funzione",
		],
		isolamento: [
			"Verifica e migliora l'isolamento del tetto",
			'Sostituisci gli infissi vecchi con modelli a doppio vetro',
			'Sigilla crepe e fessure con materiali isolanti',
			'Installa pannelli isolanti sulle pareti esterne',
			'Utilizza paraspifferi per porte e finestre',
		],
		elettrodomestici: [
			'Scegli elettrodomestici di classe A++ o superiore',
			'Utilizza lavatrice e lavastoviglie a pieno carico',
			'Imposta programmi eco quando possibile',
			'Sbrina regolarmente frigorifero e congelatore',
			'Stacca i dispositivi in standby dalla presa',
		],
	};

	const incentives = [
		{
			title: 'Ecobonus 65%',
			description:
				'Detrazione fiscale per interventi di riqualificazione energetica',
			requirements: 'Sostituzione impianti, coibentazione, infissi',
		},
		{
			title: 'Bonus Casa 50%',
			description:
				'Detrazione per ristrutturazioni edilizie con efficientamento',
			requirements: 'Interventi di manutenzione straordinaria',
		},
		{
			title: 'Superbonus 70%',
			description: 'Detrazione per interventi trainanti di efficientamento',
			requirements: 'Miglioramento di almeno 2 classi energetiche',
		},
		{
			title: 'Conto Termico',
			description: 'Incentivi per produzione di energia termica da rinnovabili',
			requirements: 'Pompe di calore, solare termico, biomasse',
		},
	];

	return (
		<div style={styles.container}>
			<h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>
				Consigli per il Risparmio Energetico
			</h1>

			<div style={styles.section}>
				<h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
					Guide Pratiche per Categoria
				</h2>

				<div style={styles.grid}>
					<div style={styles.tipCategory}>
						<h3 style={{ color: '#059669', marginBottom: '1rem' }}>
							💡 Illuminazione
						</h3>
						<ul style={styles.tipList}>
							{tips.illuminazione.map((tip, index) => (
								<li
									key={index}
									style={styles.tipItem}
									onMouseOver={(e) => {
										e.currentTarget.style.backgroundColor = '#d1fae5';
										e.currentTarget.style.transform = 'translateX(4px)';
									}}
									onMouseOut={(e) => {
										e.currentTarget.style.backgroundColor = '#f9fafb';
										e.currentTarget.style.transform = 'translateX(0)';
									}}
								>
									<span style={{ color: '#059669', marginRight: '0.5rem' }}>
										•
									</span>
									{tip}
								</li>
							))}
						</ul>
					</div>

					<div style={styles.tipCategory}>
						<h3 style={{ color: '#2563eb', marginBottom: '1rem' }}>
							🌡️ Climatizzazione
						</h3>
						<ul style={styles.tipList}>
							{tips.climatizzazione.map((tip, index) => (
								<li
									key={index}
									style={styles.tipItem}
									onMouseOver={(e) => {
										e.currentTarget.style.backgroundColor = '#dbeafe';
										e.currentTarget.style.transform = 'translateX(4px)';
									}}
									onMouseOut={(e) => {
										e.currentTarget.style.backgroundColor = '#f9fafb';
										e.currentTarget.style.transform = 'translateX(0)';
									}}
								>
									<span style={{ color: '#2563eb', marginRight: '0.5rem' }}>
										•
									</span>
									{tip}
								</li>
							))}
						</ul>
					</div>

					<div style={styles.tipCategory}>
						<h3 style={{ color: '#f59e0b', marginBottom: '1rem' }}>
							🏠 Isolamento
						</h3>
						<ul style={styles.tipList}>
							{tips.isolamento.map((tip, index) => (
								<li
									key={index}
									style={styles.tipItem}
									onMouseOver={(e) => {
										e.currentTarget.style.backgroundColor = '#fef3c7';
										e.currentTarget.style.transform = 'translateX(4px)';
									}}
									onMouseOut={(e) => {
										e.currentTarget.style.backgroundColor = '#f9fafb';
										e.currentTarget.style.transform = 'translateX(0)';
									}}
								>
									<span style={{ color: '#f59e0b', marginRight: '0.5rem' }}>
										•
									</span>
									{tip}
								</li>
							))}
						</ul>
					</div>

					<div style={styles.tipCategory}>
						<h3 style={{ color: '#8b5cf6', marginBottom: '1rem' }}>
							🔌 Elettrodomestici
						</h3>
						<ul style={styles.tipList}>
							{tips.elettrodomestici.map((tip, index) => (
								<li
									key={index}
									style={styles.tipItem}
									onMouseOver={(e) => {
										e.currentTarget.style.backgroundColor = '#ede9fe';
										e.currentTarget.style.transform = 'translateX(4px)';
									}}
									onMouseOut={(e) => {
										e.currentTarget.style.backgroundColor = '#f9fafb';
										e.currentTarget.style.transform = 'translateX(0)';
									}}
								>
									<span style={{ color: '#8b5cf6', marginRight: '0.5rem' }}>
										•
									</span>
									{tip}
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>

			<div style={styles.section}>
				<h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
					💰 Incentivi Disponibili
				</h2>

				<div style={styles.grid}>
					{incentives.map((incentive, index) => (
						<div key={index} style={styles.incentiveCard}>
							<h3
								style={{
									fontSize: '1.125rem',
									fontWeight: 'bold',
									marginBottom: '0.5rem',
								}}
							>
								{incentive.title}
							</h3>
							<p style={{ marginBottom: '0.5rem' }}>{incentive.description}</p>
							<p
								style={{
									fontSize: '0.875rem',
									color: '#059669',
									fontWeight: '500',
								}}
							>
								Requisiti: {incentive.requirements}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default TipsPage;
