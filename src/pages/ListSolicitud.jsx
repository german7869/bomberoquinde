
// src/components/ProductList.js
import React from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import axiosInstance from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './page.css'
import './listadosolicitud.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Header from '../components/Header';
import { GrDocumentPdf } from "react-icons/gr";
import { FaChartBar, FaClipboardList, FaFire, FaHardHat, FaUsers } from "react-icons/fa";

const ListSolicitudcons = () => {
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
    { id: 6, path: '/listinspectores', name: 'Inspectores', icono: FaUsers },
  ];     
  /* home user-o plus-square list-ul  search-plus */
  React.useEffect(() => {
    axiosInstance.get('/contribuyentes/listadoSolicitude//')
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
           
        <div className="sol-grid-list" role="table">
          <div className="sol-grid-header" role="row">
            <span>Fecha</span>
            <span>Numero</span>
            <span>Establecimiento</span>
            <span>RUC</span>
            <span>PDF</span>
          </div>
          
          {currentItems.length === 0 ? (
            <p className="sol-empty-state">No hay solicitudes registradas.</p>
          ) : (
            currentItems.map((registro) => (
              <div className="sol-grid-row" role="row" key={registro.id}>
                <span>{registro.fecha_solicitud}</span>
                <span>{registro.id}</span>
                <span>{registro.establecimiento.nombre_est}</span>
                <span>{registro.establecimiento.contribuyente}</span>
                <span className="sol-actions">
                  <Link to={`/Solicitudpdf/${registro.establecimiento.id}/${registro.id}`} title="Ver PDF">
                    <GrDocumentPdf />
                  </Link>
                </span>
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

export default ListSolicitudcons;
