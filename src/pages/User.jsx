import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React  from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import Contribuyentes from './Contribuyentes';
import ExisteUsuario from './ExisteUsuario';
import axiosInstance from '../utils/api'
import { useNavigate } from 'react-router-dom';
import './page.css'
import Header from '../components/Header';
import { useUser  } from './usercontext'
import { FaUser , FaEnvelope, FaLock } from 'react-icons/fa';

const User = () => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleInputChange = (e) =>  {
    setUsername(e.target.value);
 }
const handleSubmit = async (e) =>  {
  e.preventDefault(); // Prevent default form submission
  setLoading(true); // Set loading to true
  try {
    const response = await axiosInstance.get(`/login/login//${username}/`);
    // Assuming you have a function to handle successful login
    
    navigate('/contribuyentes');
  } catch (err) {
    setError(err.response ? err.response.data : 'An error occurred'); // Handle error
  } finally {
    setLoading(false); // Set loading to false
  }
};
const  opcionesmenu = [
  { id: 1, path: '/',name: 'Inicio' ,icono: ''},
  { id: 2, path: '/Servicios',name: 'Nuestros Servicios' ,icono: ''},
  { id: 4, path: '/contact',name: 'Contactenos' ,icono: ''},
  { id: 3, path: '/about',name: 'Acerca de..' ,icono: ''},
  { id: 4, path: '/iniciar',name: 'Inciar Secion',icono: '' },
];   
return (
  <div  className="app">
   <Header opcionesmenu={opcionesmenu} />
     
    <body className='container' >
    
       <form  className='login' onSubmit={handleSubmit} >
        <div >
         <label ><FaUser  /> Nombre usuario </label>
         <input
           type="text"
           name="Username"
           value={username}
           onChange={handleInputChange}
           required
         />
        </div>
        <div>
         <label><FaLock /> Clave:</label>
         <input
           type="password"
           name="password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           required
         />
       </div>
       <button type="submit" >
            {loading ? 'Iniciando...' : 'Iniciar'}
          </button>
          {error && <div className="error">{error}</div>} {/* Display error if exists */}
      </form>
      
    </body> 
    
   
    </div>

  );
};

export default User;