
// src/components/ProductList.js
import React from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import axiosInstance from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './page.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Header from '../components/Header';

const ListInspector = () => {
  const navigate = useNavigate();  
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const itemsPerPage = 11;
  const [currentPage, setCurrentPage] = useState(1);
  
  const  opcionesmenu = [
    { id: 1, path: '/Agregari',name: 'Agregar Contribuyente' ,icono: ''},
    
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
           
        <table >
          <thead>
            <tr>
              <th >Cedula/Ruc</th>
              <th >Nombre</th>
              <th >Direccion</th>
              <th >email</th>
              <th >telefono</th>
            </tr>
          </thead>
        
          {currentItems.map((contribuyente) => (
            <tr key={contribuyente.cedula}>
              <td >{contribuyente.id }</td>
              <td >{contribuyente.nombre_insp }</td>
              <td >{contribuyente.direccion_insp}</td>
              <td >{contribuyente.email_insp}</td>
              <td >{contribuyente.celular_insp}</td>
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

export default ListInspector;
