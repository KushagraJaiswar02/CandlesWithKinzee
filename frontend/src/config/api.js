// src/config/api.js
// Centralized API Configuration

// If VITE_API_URL is set (production), use it. 
// Otherwise default to empty string, which relies on the Vite proxy (development).
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default API_BASE_URL;
