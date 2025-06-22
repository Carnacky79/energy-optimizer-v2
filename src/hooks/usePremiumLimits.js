// src/hooks/usePremiumLimits.js

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const usePremiumLimits = () => {
	const { user, isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const [reportCount, setReportCount] = useState(0);

	useEffect(() => {
		// Conta i report salvati
		if (!isAuthenticated) {
			const localReports = JSON.parse(
				localStorage.getItem('energy_optimizer_reports') || '[]'
			);
			setReportCount(localReports.length);
		}
	}, [isAuthenticated]);

	const checkReportLimit = () => {
		// Se non autenticato e ha già 1 report, blocca
		if (!isAuthenticated && reportCount >= 1) {
			if (
				window.confirm(
					'Hai raggiunto il limite di report gratuiti!\n\n' +
						'Passa a Premium per:\n' +
						'✓ Report illimitati\n' +
						'✓ Analisi dettagliate\n' +
						'✓ PDF professionali\n' +
						'✓ Supporto esperto\n\n' +
						'Vuoi vedere i piani disponibili?'
				)
			) {
				navigate('/pricing');
			}
			return false;
		}

		// Se utente free (registrato ma non premium)
		if (
			isAuthenticated &&
			user?.subscriptionPlan === 'free' &&
			reportCount >= 3
		) {
			if (
				window.confirm(
					'Limite mensile raggiunto!\n\n' +
						'Con Premium ottieni:\n' +
						'✓ Report illimitati\n' +
						'✓ Analisi avanzate\n' +
						'✓ Priorità nel supporto\n\n' +
						'Passa a Premium ora?'
				)
			) {
				navigate('/pricing');
			}
			return false;
		}

		return true;
	};

	const isPremium = () => {
		return (
			isAuthenticated &&
			['premium', 'business'].includes(user?.subscriptionPlan)
		);
	};

	return {
		reportCount,
		checkReportLimit,
		isPremium,
		canCreateReport: !isAuthenticated ? reportCount < 1 : true,
		remainingReports: !isAuthenticated
			? Math.max(0, 1 - reportCount)
			: user?.subscriptionPlan === 'free'
			? Math.max(0, 3 - reportCount)
			: 999,
	};
};
