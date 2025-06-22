// src/utils/storage.js

const STORAGE_KEYS = {
	REPORTS: 'energy_optimizer_reports',
	USER_DATA: 'energy_optimizer_user',
	FIRST_VISIT: 'energy_optimizer_first_visit',
	GUEST_EXPIRY: 'energy_optimizer_guest_expiry',
};

const GUEST_EXPIRY_HOURS = 24; // Report degli ospiti scadono dopo 24 ore

class StorageManager {
	// Salva dati con timestamp
	static saveWithTimestamp(key, data) {
		const storageData = {
			data,
			timestamp: new Date().toISOString(),
			expiresAt: new Date(
				Date.now() + GUEST_EXPIRY_HOURS * 60 * 60 * 1000
			).toISOString(),
		};
		localStorage.setItem(key, JSON.stringify(storageData));
	}

	// Recupera dati verificando la scadenza
	static getWithExpiry(key) {
		const itemStr = localStorage.getItem(key);
		if (!itemStr) return null;

		try {
			const item = JSON.parse(itemStr);
			const now = new Date();

			// Se l'utente è registrato, non c'è scadenza
			if (this.isUserRegistered()) {
				return item.data || item;
			}

			// Per gli ospiti, verifica la scadenza
			if (item.expiresAt && new Date(item.expiresAt) < now) {
				localStorage.removeItem(key);
				return null;
			}

			return item.data || item;
		} catch (e) {
			return null;
		}
	}

	// Verifica se l'utente è registrato
	static isUserRegistered() {
		const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
		if (!userData) return false;

		try {
			const user = JSON.parse(userData);
			return user.isRegistered === true;
		} catch {
			return false;
		}
	}

	// Salva report
	static saveReports(reports) {
		if (this.isUserRegistered()) {
			// Utente registrato: salva senza scadenza
			localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
		} else {
			// Ospite: salva con scadenza
			this.saveWithTimestamp(STORAGE_KEYS.REPORTS, reports);
			this.setGuestExpiryWarning();
		}
	}

	// Recupera report
	static getReports() {
		if (this.isUserRegistered()) {
			const reports = localStorage.getItem(STORAGE_KEYS.REPORTS);
			return reports ? JSON.parse(reports) : [];
		} else {
			return this.getWithExpiry(STORAGE_KEYS.REPORTS) || [];
		}
	}

	// Imposta avviso scadenza per ospiti
	static setGuestExpiryWarning() {
		const expiryTime = new Date(
			Date.now() + GUEST_EXPIRY_HOURS * 60 * 60 * 1000
		);
		localStorage.setItem(STORAGE_KEYS.GUEST_EXPIRY, expiryTime.toISOString());
	}

	// Ottieni tempo rimanente per ospiti
	static getGuestTimeRemaining() {
		if (this.isUserRegistered()) return null;

		const expiryStr = localStorage.getItem(STORAGE_KEYS.GUEST_EXPIRY);
		if (!expiryStr) return null;

		const expiry = new Date(expiryStr);
		const now = new Date();
		const hoursRemaining = Math.max(0, (expiry - now) / (1000 * 60 * 60));

		return {
			hours: Math.floor(hoursRemaining),
			minutes: Math.floor((hoursRemaining % 1) * 60),
		};
	}

	// Registra utente (converte da ospite a registrato)
	static registerUser(userData) {
		const currentReports = this.getReports();

		// Salva dati utente
		localStorage.setItem(
			STORAGE_KEYS.USER_DATA,
			JSON.stringify({
				...userData,
				isRegistered: true,
				registeredAt: new Date().toISOString(),
			})
		);

		// Risalva i report senza scadenza
		localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(currentReports));

		// Rimuovi indicatori di scadenza
		localStorage.removeItem(STORAGE_KEYS.GUEST_EXPIRY);
	}

	// Pulisci dati scaduti
	static cleanExpiredData() {
		if (!this.isUserRegistered()) {
			this.getReports(); // Questo rimuoverà automaticamente i dati scaduti
		}
	}

	// Reset completo (per logout)
	static clearAll() {
		Object.values(STORAGE_KEYS).forEach((key) => {
			localStorage.removeItem(key);
		});
	}
}

export default StorageManager;
export { STORAGE_KEYS };
