import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/api";
import { Link } from "react-router-dom";
import Header from "../components/Header";

import {
GrDocumentPdf
} from "react-icons/gr";

import {
FaSearch,
FaEye,
FaChartBar,
FaUsers,
FaFire,
FaHardHat
} from "react-icons/fa";

import "./page.css";
import "./Listadoinforme.css";

const ListInforme = () => {

const [data,setData] = useState([]);
const [search,setSearch] = useState("");
const [resultadoFilter,setResultadoFilter] = useState("");

const itemsPerPage = 10;
const [page,setPage] = useState(1);

const opcionesmenu = [

{ id:1,path:'/dashboard',name:'Dashboard', icono: FaChartBar},
{ id:2,path:'/contribuyentes',name:'Contribuyentes', icono: FaUsers},
{ id:3,path:'/ListInformes',name:'Informes', icono: FaEye},
{ id:4,path:'/ListSolicitud',name:'Solicitudes', icono: FaFire},
{ id:5,path:'/ListSolicitudCon',name:'Construccion', icono: FaHardHat},
{ id:6,path:'/listinspectores',name:'Inspectores', icono: FaUsers}

];

useEffect(()=>{

axiosInstance.get("/informes/listadoinfo//")
.then(res=>{
setData(res.data);
});

},[]);


const filtered = data.filter(i =>

(i.establecimiento_nombre || "")
.toLowerCase()
.includes(search.toLowerCase()) &&

(resultadoFilter === "" || i.resultado_informe === resultadoFilter)

);


const totalPages = Math.ceil(filtered.length / itemsPerPage);

const current = filtered.slice(

(page-1)*itemsPerPage,
page*itemsPerPage

);


return(

<div className="app">

<Header opcionesmenu={opcionesmenu}/>

<div className="container">

<h2>Listado de Informes de Inspección</h2>


{/* FILTROS */}

<div className="filtros">

<div className="buscador">

<FaSearch/>

<input
type="text"
placeholder="Buscar establecimiento..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

</div>


<select
value={resultadoFilter}
onChange={(e)=>setResultadoFilter(e.target.value)}
>

<option value="">Todos los resultados</option>
<option value="APROBADO">Aprobado</option>
<option value="NEGADO">Negado</option>
<option value="CONDICIONADO">Condicionado</option>

</select>

</div>


<div className="inf-grid-list" role="table" aria-label="Listado de informes">
  <div className="inf-grid-header" role="row">
    <span>#</span>
    <span>Fecha</span>
    <span>Establecimiento</span>
    <span>Inspector</span>
    <span>Resultado</span>
    <span>Solicitud</span>
    <span>Observación</span>
    <span>Acciones</span>
  </div>

  {current.length === 0 ? (
    <p className="inf-empty-state">No hay informes que mostrar.</p>
  ) : (
    current.map(inf => (
      <div className="inf-grid-row" role="row" key={inf.id}>
        <span>{inf.id}</span>
        <span>{inf.fecha_informe}</span>
        <span>{inf.establecimiento_nombre}</span>
        <span>{inf.inspector_nombre}</span>
        <span>
          <span className={`estado ${inf.resultado_informe?.toLowerCase()}`}>
            {inf.resultado_informe}
          </span>
        </span>
        <span>{inf.nrosolicitud}</span>
        <span>{inf.observacion}</span>
        <span className="inf-actions">
          <Link to={`/informespdf/${inf.establecimiento}/${inf.id}`} title="Generar PDF">
            <GrDocumentPdf />
          </Link>
          <Link to={`/verinforme/${inf.id}`} title="Ver Informe">
            <FaEye />
          </Link>
        </span>
      </div>
    ))
  )}
</div>


<div className="paginacion">

<button
disabled={page===1}
onClick={()=>setPage(page-1)}
>
Anterior
</button>

<span>
Página {page} de {totalPages}
</span>

<button
disabled={page===totalPages}
onClick={()=>setPage(page+1)}
>
Siguiente
</button>

</div>


</div>

</div>

);

};

export default ListInforme;