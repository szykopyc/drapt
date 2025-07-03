import axios from 'axios';

// Dynamically pick backend URL based on where the frontend is running
const backendHost =
    window.location.hostname === "localhost"
        ? "http://localhost:8000"
        : "http://192.168.0.21:8000";

const ApiClient = axios.create({
    baseURL: backendHost,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default ApiClient;