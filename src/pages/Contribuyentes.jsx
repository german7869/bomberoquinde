// src/components/ProductList.js
import React from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import axiosInstance from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import './page.css'
import './contribuyentes.css'
import { FaSearch , FaAddressCard , FaLock,FaCheckDouble,FaImages  } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Header from '../components/Header';

const ContribuyentesList = () => {
  const navigate = useNavigate();  
  const [data, setData] = useState([]);
  const [datafilter, setdatafilter] = useState([]);
  const [searchCon, setSearchCon] = useState('');
  const itemsPerPage = 11;
  const [currentPage, setCurrentPage] = useState(1);
  
  const  opcionesmenu = [
    { id: 1, path: '/contribuyentesadd',name: 'Agregar Contribuyente' ,icono: 'FaAddressCard '},
    { id: 2, path: '/ListInformes',name: 'Listar Informes' ,icono: ''},
    { id: 3, path: '/ListSolicitud',name: 'Solicitudes Permisos' ,icono: ''},
    { id: 4, path: '/ListsolicitudCon/',name: 'Solicitudes Construccion' ,icono: ''},
    { id: 5, path: '/listinspectores',name: 'Listar inspectores' ,icono: ''},
  ];     
  /* home user-o plus-square list-ul  search-plus */
  React.useEffect(() => {
    axiosInstance.get('/contribuyentes/listadoC//')
    .then((response) => {
      setData(response.data);
      
    });
  }, []);



  const totalPages = Math.ceil(datafilter.length / itemsPerPage);
 
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
    const filteredContribuyentes = data.filter(contribuyente =>
      contribuyente.nombre_cont.toLowerCase().includes(searchCon.toLowerCase()) // Cambia 'nombre' por la propiedad que deseas filtrar
    );  
  
  
 
  
  return (
   <div className="app"  >
    <Header opcionesmenu={opcionesmenu} />
    <body className='container'>
         
        <div className="search-container">
          <label ><FaSearch  /> Buscar </label> 
          < input className="search-container"
            type="text"
            placeholder="Buscar contribuyente..."
            value={searchCon}
            onChange={(e) => setSearchCon(e.target.value)}
            /> 
        </div>
           
        <table className="my-table" >
          <thead>
            <tr>
              <th >Cedula/Ruc</th>
              <th >Nombre</th>
              <th >Direccion</th>
              <th >Representante</th>
              <th >Parroquia</th>
              <th >+ agregar Solicitud</th>
              <th >Ver Permiso(s)</th>

            </tr>
          </thead>
          <tbody>
           {(searchCon ? filteredContribuyentes : currentItems).map(contribuyente => (
          
            <tr key={contribuyente.ruc_cont}>
              <td>{contribuyente.ruc_cont }</td>
              <td ><Link to= {`/establecimientos/${contribuyente.ruc_cont}`} >{contribuyente.nombre_cont}</Link></td>
              <td >{contribuyente.direccion_cont}</td>
              <td >{contribuyente.representante}</td>
              <td >{contribuyente.parroquia_id}</td>
              <td className="centered-cell"><Link to={`/solicitudConadd/${contribuyente.ruc_cont}`}>
              <button >  
                <FaCheckDouble  style={{ marginRight: '8px' }} />Solicitud</button></Link></td>
              <td  ><Link to={`/solicitudConadd/${contribuyente.ruc_cont}`}>
              <button > Ver Permiso </button></Link></td>
            </tr>
            
          ))}
          </tbody>   
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

export default ContribuyentesList;
