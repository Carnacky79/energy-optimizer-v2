// src/services/api.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor to add auth token
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('authToken');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor to handle errors
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Token expired or invalid
			localStorage.removeItem('authToken');
			localStorage.removeItem('user');
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);

// Auth endpoints
export const authAPI = {
	register: (data) => api.post('/auth/register', data),
	login: (data) => api.post('/auth/login', data),
	getMe: () => api.get('/auth/me'),
	updateProfile: (data) => api.put('/auth/profile', data),
	changePassword: (data) => api.put('/auth/change-password', data),
};

// Reports endpoints
export const reportsAPI = {
	getAll: () => api.get('/reports'),
	getOne: (id) => api.get(`/reports/${id}`),
	create: (data) => api.post('/reports', data),
	update: (id, data) => api.put(`/reports/${id}`, data),
	delete: (id) => api.delete(`/reports/${id}`),
};

// Users endpoints
export const usersAPI = {
	getStats: () => api.get('/users/stats'),
	getSubscription: () => api.get('/users/subscription'),
};

// Analytics API
export const analyticsAPI = {
	trackShare: (data) => api.post('/analytics/share', data),
	trackClick: (shareId, data) => api.post(`/analytics/click/${shareId}`, data),
	trackConversion: (data) => api.post('/analytics/conversion', data),
	getUserAnalytics: (params) => api.get('/analytics/user', { params }),
};

// Admin API
export const adminAPI = {
	getGlobalAnalytics: (params) => api.get('/admin/analytics', { params }),
	getAllUsers: (params) => api.get('/admin/users', { params }),
	getUser: (userId) => api.get(`/admin/users/${userId}`),
	updateUser: (userId, data) => api.put(`/admin/users/${userId}`, data),
	deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
};

export default api;
