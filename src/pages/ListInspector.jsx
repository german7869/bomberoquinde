
// src/components/ProductList.js
import React from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import axiosInstance from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './page.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './listinspector.css'
import Header from '../components/Header';
import { FaChartBar, FaClipboardList, FaFire, FaHardHat, FaPlus, FaUsers } from "react-icons/fa";

const ListInspector = () => {
  const navigate = useNavigate();  
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const itemsPerPage = 11;
  const [currentPage, setCurrentPage] = useState(1);
  
  const  opcionesmenu = [
    { id: 1, path: '/dashboard', name: 'Dashboard', icono: FaChartBar },
    { id: 2, path: '/contribuyentes', name: 'Contribuyentes', icono: FaUsers },
    { id: 3, path: '/ListInformes', name: 'Informes', icono: FaClipboardList },
    { id: 4, path: '/ListSolicitud', name: 'Solicitudes', icono: FaFire },
    { id: 5, path: '/ListSolicitudCon', name: 'Construccion', icono: FaHardHat },
    { id: 6, path: '/inspectorAdd',name: 'Nuevo Inspector', icono: FaPlus },
    
  ];     
  /* home user-o plus-square list-ul  search-plus */
  React.useEffect(() => {
    axiosInstance.get('/contribuyentes/listadoins//')
    .then((response) => {
      setData(response.data);
      
    });
  }, []);

  /**# useEffect(() => {
  #   const results = data.filter(item =>
  #    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  #  );
  #  setFilteredData(results);
  #}, [searchTerm, data]);
  /**/
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

  const currentItems = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
 
  
  return (
   <div   >
    <Header opcionesmenu={opcionesmenu} />
    <body className='container'>
         
        <div className="search-container">
          <input type="text" className="textbuscar" placeholder="Buscar Contribuyentes"/>  
        </div>
           
        <div className="ins-grid-list" role="table">
          <div className="ins-grid-header" role="row">
            <span>Cedula/RUC</span>
            <span>Nombre</span>
            <span>Dirección</span>
            <span>Email</span>
            <span>Teléfono</span>
          </div>
          
          {currentItems.length === 0 ? (
            <p className="ins-empty-state">No hay inspectores registrados.</p>
          ) : (
            currentItems.map((contribuyente) => (
              <div className="ins-grid-row" role="row" key={contribuyente.cedula}>
                <span>{contribuyente.id}</span>
                <span>{contribuyente.nombre_insp}</span>
                <span>{contribuyente.direccion_insp}</span>
                <span>{contribuyente.email_insp}</span>
                <span>{contribuyente.celular_insp}</span>
              </div>
            ))
          )}
        </div>
        <div>
          <button onClick={handlePrevious} disabled={currentPage === 1}>Anterior</button>
          <span> Página {currentPage} de {totalPages} </span>
          <button onClick={handleNext} disabled={currentPage === totalPages}>Siguiente</button>
       </div>
     </body>   
    </div>  
  );
}

export default ListInspector;
