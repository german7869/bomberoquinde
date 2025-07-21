// src/components/ProductList.js
import React from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import axiosInstance from '../utils/api';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import GenerarPdf from './GenerarPdf'; 
import InformeImage from './InformeImage';
import './page.css'
import './informe.css'
import { FaSearch , FaAddressCard , FaLock,FaCheckDouble,FaImages  } from 'react-icons/fa';
import { GrDocumentPdf } from "react-icons/gr";
const InformesList = () => {
  const {establecimiento_id} = useParams(); // Obtiene el parámetro de la URL
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const  opcionesmenu = [
    { id: 1, path: `/InformeAdd/${establecimiento_id}`,name: 'Agregar Informe' ,icono: ''},
    { id: 2, path: '/Agregars',name: 'Agregar Solicitud' ,icono: ''},
    

  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const response = await axiosInstance.get(`/informes/listadoinfo/${establecimiento_id}/establecimiento/`);
        setData(response.data);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

   
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
 
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      
    }
  };

  const handleGeneratePdf = () => {
    // Call the function to generate the PDF
    // Assuming PdfGenerator has a method to generate PDF
    <GenerarPdf />
  };
  
  const items = Array.isArray(data) ? data : [];
  //const currentItems = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="app"> 
     <Header opcionesmenu={opcionesmenu}  / >
     <body className='container'>
     <div className="informativo">  
          <p>contribuyente : {establecimiento_id}  Nombre: 
          Direccion: 
          representante: </p>
      </div>    
          <div className="search-container">
          <input type="text" className="textbuscar" placeholder="Buscar Informes"/>
         </div>
           
        <table className="my-table3">
          <thead>
            <tr>
              <th >id</th>
              <th >imagenes</th>
              <th >Fecha</th>
              <th >Solicitud</th>
              <th >Inspector</th>
               <th >Observacion</th>
               <th >Resultado</th>
               <th >PDF</th>
               
            </tr>
          </thead>
         
         {items.map((establecimiento) => (
            <tr key={establecimiento.id}>
              <td >{establecimiento.id}</td>
              <td ><Link to={`/InformeImage/${establecimiento.id}`}>
              <button > 
              <FaImages style={{ marginRight: '8px' }} /></button></Link></td>
              <td >{establecimiento.Fecha_informe}</td>
              <td >{establecimiento.nro_socilitud}</td>
              <td >{establecimiento.inspector}</td>
              <td ><Link to={`/InformesAdd/${establecimiento_id}`}>{establecimiento.observacion}</Link></td>
              <td >{establecimiento.resultado_informe}</td>
              <td ><Link to={`/informespdf/${establecimiento.id}`}>
              <button > 
              <GrDocumentPdf style={{ marginRight: '8px' }} /></button></Link></td>
             
              
              
            </tr>    
             ) )
            }
          </table>
        <div>
          <button onClick={handlePrevious} disabled={currentPage === 1}>Anterior</button>
          <span> Página {currentPage} de {totalPages} </span>
           <button onClick={handleNext} disabled={currentPage === totalPages}>Siguiente</button>
         </div>
    
    </body>   
    </div>
  );
}

export default InformesList;