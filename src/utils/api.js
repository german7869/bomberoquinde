import axios from 'axios';

const api = axios.create({
  baseURL: 'http://api-sigesott.duckdns.org:8000',  // Asegúrate de que esta URL sea correcta

});

export default api;