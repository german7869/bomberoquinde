
// src/components/ProductList.js
import React from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import axiosInstance from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './page.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Header from '../components/Header';
import { GrDocumentPdf } from "react-icons/gr";

const ListInforme = () => {
  const navigate = useNavigate();  
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const itemsPerPage = 11;
  const [currentPage, setCurrentPage] = useState(1);
  
  const  opcionesmenu = [
    { id: 1, path: '/Agregarc',name: 'Agregar Contribuyente' ,icono: ''},
    { id: 2, path: '/ListInformes',name: 'Listar Informes' ,icono: ''},
    { id: 3, path: '/ListSolicitud',name: 'Listar Solicitudes' ,icono: ''},
    { id: 4, path: '/listInpectores',name: 'Listar inspectores' ,icono: ''},
  ];     
  /* home user-o plus-square list-ul  search-plus */
  React.useEffect(() => {
    axiosInstance.get('/informes/listadoinfo//')
    .then((response) => {
      setData(response.data);
      
    });
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
              <th >Nro</th>
              <th >Fecha</th>
              <th >Establecimieto</th>
              <th >Inspector</th>
              <th >Resultado</th>
              <th >Solicitud</th>
              <th >Observacion</th>
              <th >PDF</th>
            
            </tr>
          </thead>
        
          {currentItems.map((inf) => (
            <tr key={inf.id}>
              <td >{inf.id }</td>
              <td >{inf.Fecha_informe}</td>
              <td >{inf.establecimiento}</td>
              <td >{inf.inspector}</td>
              <td >{inf.socilictud}</td>
              <td >{inf.observacion}</td>
              <td ><Link to={`/informespdf/${inf.establecimiento}/${inf.id}`}>
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

export default ListInforme;
