
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
           
        <table >
          <thead>
            <tr>
              <th >Fecha</th>
              <th >Numero</th>
              <th >Establecimiento</th>
              <th >ruc</th>
              <th >PDF</th>
            </tr>
          </thead>
        
          {currentItems.map((registro) => (
            <tr key={registro.id}>
              <td >{registro.fecha_solicitud }</td>
              <td >{registro.id  }</td>
               <td >{registro.establecimiento.nombre_est}</td>
               <td >{registro.establecimiento.contribuyente}</td>
              <td ><Link to={`/Solicitudpdf/${registro.establecimiento.id}/${registro.id}`}>
                 <button > 
                   <GrDocumentPdf style={{ marginRight: '8px' }} />
                   </button></Link>
                  </td>
                
            </tr>    
          ))}
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

export default ListSolicitudcons;
