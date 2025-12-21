import axios from 'axios';

const client = axios.create({
    baseURL: 'https://api.example.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptors can be added here
client.interceptors.request.use(
    (config) => {
        // Add auth token if available
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default client;
