// src/InspectionForm.jsx
import { useEffect, useLayoutEffect, useState } from 'react';
import Header from '../components/Header';
import './form.css'
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/api';

import { Navigate } from 'react-router-dom';

const EstablecimientoForm = () => {
  const  {contribuyente_id} = useParams(); // Obtiene el parámetro de la URL  
  const [responseMessage, setResponseMessage] = useState(''); // Estado para el mensaje de respuesta      
  
  const [error, setError] = useState(null);
  
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [referencia, setReferencia] = useState('');
  const [apertura, setApertura] = useState('');
  const [estado, setEstado] = useState('');
  const [tipo, settipo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [actividad, setActividad] = useState('');
  const [parroquia, setParroquia] = useState('');
  const [parroquias, setparroquias] = useState([]);
  
  const [tipos, settipos] = useState([]);


  const  opcionesmenu = [
    
      
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
  useEffect(() => {
    // Obtener la lista de inspectores desde la API
    const fetchtipos = async () => {
      try {
        const response = await axiosInstance.get('/contribuyentes/listadotip//');
        settipos(response.data);
    } catch (error) {
        console.error('Error al obtener inspectores:', error);
      }
    };

    fetchtipos();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    formData.append('nombre_est', nombre);
    formData.append('direccion_est', direccion);
    formData.append('referencia_est', referencia);
    formData.append('actividad', actividad);
    formData.append('tipo_negocio',  tipo);
    formData.append('parroquia',  parseInt(parroquia,10));
    formData.append('contribuyente',  contribuyente_id);
    for (let pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
    }

    try {
      const response = await  axiosInstance.post('/contribuyentes/listadoe//', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',

        },
      });
      console.log('Respuesta del servidor:', response.data);
      setResponseMessage('Datos grabados exitosamente: ' + JSON.stringify(response.data));
      
    } catch (error) {
      console.error('Error al enviar el informe:', error);
      setResponseMessage('Error al grabar los datos: ' + error.message);
    }
  };


  

  return (
    <div  className="app">
      <Header opcionesmenu={opcionesmenu} />
    <body className='container' >
    <div className="informativo">  
          <p>Agrenado un nuenvo  Establecimiento para </p>
          
          
      </div>
    <form onSubmit={handleSubmit}>   
    <button type="submit">Guardar</button>  
    <label>Nombre comercial del negocio:</label>
    <input
        type="text"
        placeholder="nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <label>Direccion :</label>
    <input
        type="text"
        placeholder="Direccion"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        required
      />
       <label>Referencia :</label>   
      <input className="text-amplio"  
        type="text"
        placeholder="Referecnia de la ubicacion del negocio"
        value={referencia}
        onChange={(e) => setReferencia(e.target.value)}
        required
      />
     
      <label>Actividad de su negocio(como esta en SRI):</label>
      <input className="text-amplio"  
        type="textarea"
        placeholder="actividad"
        value={actividad}
        onChange={(e) => setActividad(e.target.value)}
        required

      />
      <div>
        <label>Tipo de Negocio:</label>
        <select
          value={tipo}
          onChange={(e) => settipo(e.target.value)}
          required
        >
          <option value="">Seleccione un tipo de negocio</option>
          {tipos.map((par) => (
            <option key={par.codigo} value={par.codigo}>
              {par.nombre_tip} {par.precio} 
            </option>
          ))}
        </select>
      </div>      <div>
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
    {responseMessage &&  <Navigate to={`/establecimientos/${contribuyente_id}`} />}
    {error && <div className="error">{error}</div>} {/* Display error if exists */}
    </body> 
    
   
    </div>
  );
};

export default EstablecimientoForm;