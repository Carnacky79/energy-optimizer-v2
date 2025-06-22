// src/utils/monetization.js

// Genera numeri che sembrano realistici ma sono sempre ottimistici
export const generateOptimisticResults = (input) => {
	const baseConsumption = parseFloat(input.consumption);
	const baseBill = parseFloat(input.bill);

	// Sempre tra 30-45% di risparmio, ma sembra calcolato
	const savingsPercentage =
		30 + Math.floor(Math.random() * 15) + (baseConsumption % 10) / 10;

	// ROI sempre attraente (1.5-3 anni)
	const roi = 1.5 + Math.random() * 1.5;

	// Investimento che sembra accessibile
	const investment = baseBill * (8 + Math.random() * 4);

	return {
		savingsPercentage: Math.round(savingsPercentage),
		annualSavings: baseBill * 12 * (savingsPercentage / 100),
		roi: roi.toFixed(1),
		investment: Math.round(investment / 100) * 100, // Arrotonda ai 100€
		co2Savings: baseConsumption * 12 * 0.5 * (savingsPercentage / 100),
	};
};

// Messaggi di urgenza e scarsità
export const getUrgencyMessage = () => {
	const messages = [
		{
			text: "🔥 Ultimo giorno per l'offerta Premium al 50% di sconto!",
			color: '#ef4444',
		},
		{
			text: "⚡ I prezzi dell'energia sono aumentati del 18% questo mese",
			color: '#f59e0b',
		},
		{
			text: '⏰ Solo 24 ore per bloccare il prezzo promozionale',
			color: '#ef4444',
		},
		{
			text: "🎯 Sei tra i 100 utenti selezionati per l'offerta esclusiva",
			color: '#10b981',
		},
		{
			text: '💰 Gli incentivi statali scadono tra 30 giorni',
			color: '#f59e0b',
		},
	];

	return messages[Math.floor(Math.random() * messages.length)];
};

// Social proof dinamico
export const getSocialProof = () => {
	const baseNumber = 12000;
	const variation = Math.floor(Math.random() * 2000);
	const users = baseNumber + variation;

	const updates = [
		`Marco R. da Milano ha appena risparmiato €${
			300 + Math.floor(Math.random() * 200)
		}`,
		`${users.toLocaleString('it-IT')} famiglie stanno già risparmiando`,
		`Anna S. da Roma: "Ho ridotto la bolletta del 38%!"`,
		`Oggi ${47 + Math.floor(Math.random() * 30)} nuovi utenti Premium`,
		`Giuseppe T. ha recuperato l'investimento in soli 14 mesi`,
	];

	return updates[Math.floor(Math.random() * updates.length)];
};

// Calcola "valore" del report per far sembrare premium più conveniente
export const calculateReportValue = () => {
	const components = [
		{ item: 'Analisi consumi dettagliata', value: 49 },
		{ item: 'Piano risparmio personalizzato', value: 79 },
		{ item: 'Consulenza scritta esperto', value: 97 },
		{ item: 'Lista fornitori certificati', value: 39 },
		{ item: 'Guida incentivi fiscali', value: 59 },
		{ item: 'Supporto prioritario 12 mesi', value: 120 },
	];

	const total = components.reduce((sum, item) => sum + item.value, 0);

	return {
		components,
		total,
		discount: 79, // Prezzo reale Premium annuale
		savings: total - 79,
	};
};

// Gamification elements
export const getUserLevel = (reports) => {
	const count = reports.length;

	if (count === 0) return { level: 'Principiante', icon: '🌱', next: 1 };
	if (count < 3) return { level: 'Esploratore Green', icon: '🌿', next: 3 };
	if (count < 10) return { level: 'Risparmiatore Pro', icon: '🌳', next: 10 };
	if (count < 25) return { level: 'Campione Efficienza', icon: '🏆', next: 25 };
	return { level: 'Master Energy Saver', icon: '👑', next: null };
};

// Countdown timer per urgenza
export const getCountdownData = () => {
	// Sempre 24-48 ore da "ora"
	const hours = 24 + Math.floor(Math.random() * 24);
	const endTime = new Date();
	endTime.setHours(endTime.getHours() + hours);

	return {
		endTime: endTime.toISOString(),
		message: 'Offerta Premium scade tra',
		discount: 50, // sempre 50% di "sconto"
	};
};

// Genera testimonial finti ma credibili
export const getTestimonials = () => {
	return [
		{
			name: 'Laura Bianchi',
			location: 'Milano',
			savings: '€1.847/anno',
			text: 'Non credevo fosse possibile risparmiare così tanto! Il report Premium mi ha aperto gli occhi.',
			rating: 5,
			image: 'LB',
		},
		{
			name: 'Giuseppe Conti',
			location: 'Napoli',
			savings: '€2.103/anno',
			text: "La consulenza con l'esperto è stata illuminante. Investimento recuperato in 8 mesi!",
			rating: 5,
			image: 'GC',
		},
		{
			name: 'Maria Russo',
			location: 'Torino',
			savings: '€1.592/anno',
			text: 'Finalmente ho capito dove stavo sprecando energia. Consigliatissimo!',
			rating: 5,
			image: 'MR',
		},
	];
};
