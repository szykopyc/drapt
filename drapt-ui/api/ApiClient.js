import axios from 'axios';

// Dynamically pick backend URL based on where the frontend is running
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const ApiClient = axios.create({
    baseURL: apiUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default ApiClient;