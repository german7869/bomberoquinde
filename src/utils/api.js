import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dizziest-kaia-unsantirically.ngrok-free.dev',  // Asegúrate de que esta URL sea correcta

});

export default api;