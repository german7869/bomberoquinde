import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-bomberos-h6qj.onrender.com',  // Asegúrate de que esta URL sea correcta
                 
});

export default api;