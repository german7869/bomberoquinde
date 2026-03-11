// src/pages/Establecimientos.jsx

import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/api";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";

import { MdDeleteForever, MdEdit } from "react-icons/md";
import { FaPlus, FaFileAlt, FaSearch } from "react-icons/fa";

import "./page.css";
import "./establecimientos.css";

const Establecimientos = () => {

const { contribuyente_id } = useParams();

const [data,setData] = useState([]);
const [contribuyente,setContribuyente] = useState({});
const [search,setSearch] = useState("");

const itemsPerPage = 8;
const [currentPage,setCurrentPage] = useState(1);


const opcionesmenu = [

{
id:1,
path:`/establecimientoadd/${contribuyente_id}`,
name:"Agregar Establecimiento",
icono:FaPlus
},

{
id:2,
path:`/informeConadd/${contribuyente_id}`,
name:"Informe Construcción",
icono:FaFileAlt
}

];


useEffect(()=>{

axiosInstance
.get(`/contribuyentes/listador//${contribuyente_id}/`)
.then(res=>{

setData(res.data.contribuyenteE || []);
setContribuyente(res.data.contribuyente || {});

})
.catch(error=>{

console.error("Error cargando establecimientos",error);

});

},[contribuyente_id]);


const handleDelete = async(id,tieneInformes)=>{

if(tieneInformes){
alert("No se puede eliminar. Tiene informes registrados.");
return;
}

if(!window.confirm("¿Eliminar establecimiento?")) return;

try{

await axiosInstance.delete(`/contribuyentes/listadoe/${id}/`);

setData(prev=>prev.filter(e=>e.id!==id));

}catch(error){

console.error("Error eliminando",error);

}

};


const filtered = data.filter(e =>
(e.nombre_est || "")
.toLowerCase()
.includes(search.toLowerCase())
);


const totalPages = Math.ceil(filtered.length / itemsPerPage);

const currentItems = filtered.slice(
(currentPage-1)*itemsPerPage,
currentPage*itemsPerPage
);


return(

<div className="app">

<Header opcionesmenu={opcionesmenu}/>

<div className="container">

{/* INFORMACION CONTRIBUYENTE */}

<div className="card-contribuyente">

<h3>Información del Contribuyente</h3>

<div className="grid-info">

<div>
<strong>RUC</strong>
<p>{contribuyente.ruc}</p>
</div>

<div>
<strong>Nombre</strong>
<p>{contribuyente.nombre}</p>
</div>

<div>
<strong>Dirección</strong>
<p>{contribuyente.direccion}</p>
</div>

<div>
<strong>Representante</strong>
<p>{contribuyente.representante}</p>
</div>

</div>

</div>


{/* BUSCADOR */}

<div className="search-container">

<FaSearch/>

<input
type="text"
placeholder="Buscar establecimiento..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

</div>


{/* TABLA */}

<table className="tabla">

<thead>

<tr>

<th>ID</th>
<th>Nombre Comercial</th>
<th>Fecha Apertura</th>
<th>Actividad</th>
<th>Estado</th>
<th>Tipo Negocio</th>
<th>Solicitudes</th>
<th>Acciones</th>

</tr>

</thead>

<tbody>

{currentItems.map(est=>(

<tr key={est.id}>

<td>{est.id}</td>

<td>

<Link to={`/informes/${est.id}`}>
{est.nombre_est}
</Link>

</td>

<td>{est.fec_apertura}</td>

<td>{est.actividad}</td>

<td>{est.estado}</td>

<td>{est.tipo_negocio}</td>

<td>

<Link to={`/solicitudadd/${est.id}`}>
<button className="btn-solicitud">
+ Solicitud
</button>
</Link>

</td>

<td className="acciones">

<Link to={`/establecimientoedit/${est.id}`}>
<MdEdit title="Editar"/>
</Link>

<button
onClick={()=>handleDelete(est.id,est.tieneInformes)}
>
<MdDeleteForever title="Eliminar"/>
</button>

</td>

</tr>

))}

</tbody>

</table>


{/* PAGINACION */}

<div className="paginacion">

<button
disabled={currentPage===1}
onClick={()=>setCurrentPage(currentPage-1)}
>
Anterior
</button>

<span>
Página {currentPage} de {totalPages}
</span>

<button
disabled={currentPage===totalPages}
onClick={()=>setCurrentPage(currentPage+1)}
>
Siguiente
</button>

</div>

</div>

</div>

);

};

export default Establecimientos;