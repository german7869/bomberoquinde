// src/components/ProductList.js
import React from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import axiosInstance from '../utils/api';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { MdDeleteForever } from "react-icons/md";

import './page.css'
import './establecimientos.css'
const EstablecimientosList = () => {
  const {contribuyente_id} = useParams(); // Obtiene el parámetro de la URL
  const [data, setData] = useState([]);
  
  

  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const  opcionesmenu = [
    { id: 1, path: `/establecimientoadd/${contribuyente_id}`,name: 'Agregar Estabelcimiento' ,icono: ''},
    { id: 1, path: `/informeConadd/${contribuyente_id}`,name: 'Agregar Informe Construccion' ,icono: ''},
      

  ];
  
  React.useEffect(() => { 
    axiosInstance.get(`/contribuyentes/listador//${contribuyente_id}/`)
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
  const handleDelete = async (id) => {
    try {
      axiosInstance.delete(`/contribuyentes/listadoe//${id}/`);
      
      setData(items.filter(item => item.id !== id)); // Actualiza el estado para eliminar el item de la lista
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      
    }
  };
  const items = Array.isArray(data.contribuyenteE) ? data.contribuyenteE : [];
  const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
   
  return (
    <div className="app"> 
     <Header opcionesmenu={opcionesmenu}  / >
     <body className='container'>
     <div className="informativo">  
          <p>contribuyente : {contribuyente_id}  Nombre:
          Direccion: {contribuyente_id}
          Representante: {contribuyente_id}</p>
      </div>    
          <div className="search-container">
          <input type="text" className="textbuscar" placeholder="Buscar Establecimientos.."/>
         </div>
           
        <table className="my-table2" >
          <thead>
            <tr>
              <th >id</th>
              <th >Nombre comerical</th>
              <th >Fecha apertura</th>
              <th >Actividad</th>
              <th >Estado</th>
              <th >Tipo Negocio</th>
              <th >click agergar Solicitud</th>
              <th >E</th>
            </tr>
          </thead>
         
         {items.map((establecimiento) => (
            <tr key={establecimiento.id}>
              <td >{establecimiento.id}</td>
              <td ><Link to={`/Informes/${establecimiento.id}`}>{establecimiento.nombre_est}</Link></td>
              <td >{establecimiento.fec_apertura }</td>
              <td >{establecimiento.actividad}</td>
              <td >{establecimiento.estado}</td>
              <td >{establecimiento.tipo_negocio}</td>
              <td ><Link to={`/solicitudadd/${establecimiento.id}`}>
              <button > +solicitud</button></Link></td>
              <td > <button onClick={() => handleDelete(establecimiento.id)}>
                  <MdDeleteForever style={{ marginRight: '8px' }} /></button>
                </td>
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

export default EstablecimientosList;