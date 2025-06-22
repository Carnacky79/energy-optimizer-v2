// src/contexts/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import StorageManager from '../utils/storage';

const AuthContext = createContext({});

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Check if user is logged in on mount
	useEffect(() => {
		checkAuth();
	}, []);

	const checkAuth = async () => {
		try {
			const token = localStorage.getItem('authToken');
			if (token) {
				const response = await authAPI.getMe();
				setUser(response.data.user);
			}
		} catch (error) {
			console.error('Auth check failed:', error);
			localStorage.removeItem('authToken');
			localStorage.removeItem('user');
		} finally {
			setLoading(false);
		}
	};

	const register = async (userData) => {
		try {
			setError(null);
			const response = await authAPI.register(userData);
			const { token, user } = response.data;

			// Save token and user
			localStorage.setItem('authToken', token);
			localStorage.setItem('user', JSON.stringify(user));
			setUser(user);

			// Convert guest data to registered user
			StorageManager.registerUser(user);

			return { success: true };
		} catch (error) {
			const message =
				error.response?.data?.message || 'Errore durante la registrazione';
			setError(message);
			return { success: false, error: message };
		}
	};

	const login = async (credentials) => {
		try {
			setError(null);
			const response = await authAPI.login(credentials);
			const { token, user } = response.data;

			// Save token and user
			localStorage.setItem('authToken', token);
			localStorage.setItem('user', JSON.stringify(user));
			setUser(user);

			return { success: true };
		} catch (error) {
			const message =
				error.response?.data?.message || 'Errore durante il login';
			setError(message);
			return { success: false, error: message };
		}
	};

	const logout = () => {
		localStorage.removeItem('authToken');
		localStorage.removeItem('user');
		setUser(null);
		window.location.href = '/';
	};

	const updateProfile = async (data) => {
		try {
			setError(null);
			const response = await authAPI.updateProfile(data);
			const updatedUser = response.data.user;

			setUser(updatedUser);
			localStorage.setItem('user', JSON.stringify(updatedUser));

			return { success: true };
		} catch (error) {
			const message =
				error.response?.data?.message || "Errore durante l'aggiornamento";
			setError(message);
			return { success: false, error: message };
		}
	};

	const value = {
		user,
		loading,
		error,
		isAuthenticated: !!user,
		register,
		login,
		logout,
		updateProfile,
		checkAuth,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
