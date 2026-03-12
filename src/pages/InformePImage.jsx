import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../utils/api';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import './page.css'

const InformeImagenes = () => {
  const { informe_id } = useParams(); // Obtiene el parámetro de la URL
  const [selectedFile, setSelectedFile] = useState(null);
  const [images, setImages] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/informes/listadoinfo/${informe_id}/imagenes/`);
        setData(response.data);
        console.log('Respuesta del servidor:', response.data);
      } catch (error) {
        console.error('Error al obtener las imágenes:', error);
      }
    };

    fetchData();
  }, [informe_id]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Previene el comportamiento predeterminado del formulario

    if (!selectedFile) {
      alert('Por favor, selecciona un archivo para subir.');
      return;
    }

    const formData = new FormData();
    formData.append('imagen', selectedFile);
    formData.append('informe', informe_id); // Agregar informe_id como string

    try {
      const response = await axiosInstance.post(`/informes/listadoinfo/${informe_id}/imagenes/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Suponiendo que la respuesta contiene la URL de la imagen
      setImages((prevImages) => [...prevImages, response.data.imagen]);
      setSelectedFile(null);
    } catch (error) {
        console.error('Error al subir la imagen:', error);
    }
  };

  const items = Array.isArray(data) ? data : [];
  const  opcionesmenu = [
    
  ];
  
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="app"> 
    <Header opcionesmenu={opcionesmenu}  / >
    <body className='container'>
    <div>
      <p>Subir Imágenes</p>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Subir</button>
      </form>

      <h2>Imágenes Guardadas</h2>
      <div className="gallery">
        {items.map((i) => (
          <div className="gallery-item" key={i}>
            <img key={i.id} src={i.imagen} alt="Imagen guardada" />
          </div>  
        ))}
      </div>
      <button onClick={handleRefresh}>
        Refrescar Página
      </button>
    </div>
    </body>   
    </div>
  );
};

export default InformeImagenes;