// src/InspectionForm.jsx
import { useEffect, useLayoutEffect, useState } from 'react';
import Header from '../components/Header';
import './form.css'
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Contribuyentes from './Contribuyentes';
import { Navigate } from 'react-router-dom';

const ContribuyenteForm = () => {
  
  const [responseMessage, setResponseMessage] = useState(''); // Estado para el mensaje de respuesta  
  const [error, setError] = useState(null);
  const [ruc, setRuc] = useState('');
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [email, setEmail] = useState('');
  const [razon, setRazonsocial] = useState('');
  const [telefono, setTelefono] = useState('');
  const [celular, setCelular] = useState('');
  const [representante, setRepresentante] = useState('');
  const [parroquia, setParroquia] = useState('');
  const [parroquias, setparroquias] = useState([]);

  const  opcionesmenu = [
    { id: 1, path: '/',name: 'Volver' ,icono: ''},
   
    
  ];   
  useEffect(() => {
    // Obtener la lista de inspectores desde la API
    const fetchInspectores = async () => {
      try {
        const response = await axiosInstance.get('/contribuyentes/listadopar//');
        setparroquias(response.data);

      } catch (error) {
        console.error('Error al obtener inspectores:', error);
      }
    };

    fetchInspectores();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('ruc_cont', ruc);
    formData.append('nombre_cont', nombre);
    formData.append('direccion_cont', direccion);
    formData.append('email_cont', email);
    formData.append('razon_social_cont', razon);
    formData.append('telefono_cont',  telefono);
    formData.append('ceclular_cont',  celular);
    formData.append('representante',  representante);

    try {
      const response = await  axiosInstance.post('/contribuyentes/listadoC//', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Respuesta del servidor:', response.data);
      setResponseMessage('Datos grabados exitosamente: ' + JSON.stringify(response.data));
      
    } catch (error) {
      setResponseMessage('Error al grabar los datos: ' + error.message);
     
    }
      };


  

  return (
    <div  className="app">
      <Header opcionesmenu={opcionesmenu} />
    <body className='container' >
    <div className="informativo">  
          <p>Agrenado un nuenvo contribuyente</p>
          
          
      </div>
    <form onSubmit={handleSubmit}>   
    <button type="submit">Guardar</button>  
    <label>Ruc:</label>
    <input
        type="text"
        placeholder="cedula/ruc"
        value={ruc}
        onChange={(e) => setRuc(e.target.value)}
      />
      <label>Nombres ():</label>
    <input
        type="text"
        placeholder="Nombre(s))"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <label>Direccion:</label>
      <input
        type="text"
        placeholder="Direccion"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        required
      />
      <label>Email:</label>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <label>Razon Social:</label>
      <input
        type="text"
        placeholder="Razon Social"
        value={razon}
        onChange={(e) => setRazonsocial(e.target.value)}
        
      />
      <label>Telefono:</label>
      <input
        type="text"
        placeholder="Telefono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        
      />
      <label>Celular:</label>
      <input
        type="text"
        placeholder="Celular"
        value={celular}
        onChange={(e) => setCelular(e.target.value)}
        
      />
      <label>Representante (para compañias):</label>
      <input
        type="text"
        placeholder="representante"
        value={representante}
        onChange={(e) => setRepresentante(e.target.value)}
        
      />
       <div>
        <label>Parroquia:</label>
        <select
          value={parroquia}
          onChange={(e) => setParroquia(e.target.value)}
          required
        >
          <option value="">Seleccione una parroquia</option>
          {parroquias.map((par) => (
            <option key={par.id} value={par.id}>
              {par.nombre}
            </option>
          ))}
        </select>
      </div>

      
    </form>
    {responseMessage &&  <Navigate to={`/contribuyentes`} />}
    {error && <div className="error">{error}</div>} {/* Display error if exists */}
    </body> 
    
   
    </div>
  );
};

export default ContribuyenteForm;