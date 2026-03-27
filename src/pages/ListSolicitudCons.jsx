
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

const ListSolicitudcons = () => {
  const navigate = useNavigate();  
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const itemsPerPage = 11;
  const [currentPage, setCurrentPage] = useState(1);
  
  const  opcionesmenu = [
    
    
  ];     
  /* home user-o plus-square list-ul  search-plus */
  React.useEffect(() => {
    axiosInstance.get('/contribuyentes/listadoSolicitudconse//')
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
           
        <div className="solcon-grid-list" role="table">
          <div className="solcon-grid-header" role="row">
            <span>Fecha</span>
            <span>Numero</span>
            <span>Contribuyente</span>
            <span>Motivo</span>
            <span>PDF</span>
          </div>
          
          {currentItems.length === 0 ? (
            <p className="solcon-empty-state">No hay solicitudes de construcción.</p>
          ) : (
            currentItems.map((registro) => (
              <div className="solcon-grid-row" role="row" key={registro.id}>
                <span>{registro.fecha_solicitud}</span>
                <span>{registro.id}</span>
                <span>{registro.contribuyente.ruc_cont} {registro.contribuyente.nombre_cont}</span>
                <span>{registro.motivo}</span>
                <span className="solcon-actions">
                  <Link to={`/solicitudConpdf/${registro.contribuyente.ruc_cont}/${registro.id}`} title="Ver PDF">
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
