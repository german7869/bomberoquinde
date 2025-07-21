import axios from 'axios';

const api = axios.create({
  baseURL: 'http://190.12.150.183:8000',  // Asegúrate de que esta URL sea correcta

});

export default api;