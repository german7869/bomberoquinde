import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/api";
import { Link } from "react-router-dom";
import Header from "../components/Header";

import {
GrDocumentPdf
} from "react-icons/gr";

import {
FaSearch,
FaEye
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

{ id:1,path:'/contribuyentesadd',name:'Agregar Contribuyente'},
{ id:2,path:'/ListInformes',name:'Informes Inspección'},
{ id:3,path:'/ListSolicitud',name:'Solicitudes Permisos'},
{ id:4,path:'/listinspectores',name:'Inspectores'}

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


<table className="tabla">

<thead>

<tr>

<th>#</th>
<th>Fecha</th>
<th>Establecimiento</th>
<th>Inspector</th>
<th>Resultado</th>
<th>Solicitud</th>
<th>Observación</th>
<th>Acciones</th>

</tr>

</thead>


<tbody>

{current.map(inf => (

<tr key={inf.id}>

<td>{inf.id}</td>

<td>{inf.fecha_informe}</td>

<td>{inf.establecimiento_nombre}</td>

<td>{inf.inspector_nombre}</td>

<td>

<span className={`estado ${inf.resultado_informe?.toLowerCase()}`}>
{inf.resultado_informe}
</span>

</td>

<td>{inf.nrosolicitud}</td>

<td>{inf.observacion}</td>


<td className="acciones">
  {/* `/informes/listadoinfo/${establecimiento_id}/establecimiento/` */}

<Link to={`/informespdf/${inf.establecimiento}/${inf.id}`}>
<GrDocumentPdf title="Generar PDF"/>
</Link>

<Link to={`/verinforme/${inf.id}`}>
<FaEye title="Ver Informe"/>
</Link>

</td>

</tr>

))}

</tbody>

</table>


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