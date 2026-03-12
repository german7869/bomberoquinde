import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/api";
import { Link } from "react-router-dom";
import Header from "../components/Header";

import {
FaSearch,
FaEdit,
FaBuilding,
FaFire,
FaHardHat,
FaHistory,
FaUserPlus,
FaClipboardList,
FaFileAlt,
FaUsers,
FaChartBar
} from "react-icons/fa";

import "./contribuyentes.css";

const PermisosList = () => {

const [data,setData] = useState([]);
const [parroquias,setParroquias] = useState([]);

const [search,setSearch] = useState("");
const [parroquia,setParroquia] = useState("");

const itemsPerPage = 10;
const [page,setPage] = useState(1);


const opcionesmenu = [

{ id:1, path:'/contribuyentesadd', name:'Agregar Contribuyente', icono:FaUserPlus },

{ id:2, path:'/ListInformes', name:'Informes', icono:FaClipboardList },

{ id:3, path:'/ListSolicitud', name:'Solicitudes', icono:FaFire },

{ id:4, path:'/ListsolicitudCon', name:'Construcción', icono:FaHardHat },

{ id:5, path:'/listinspectores', name:'Inspectores', icono:FaUsers },

{ id:6, path:'/reportes-inspectores', name:'Reportes', icono:FaChartBar },

{ id:7, path:'/establecimientoslist', name:'Todos Establecimientos', icono:FaBuilding }

];


useEffect(()=>{

axiosInstance.get("/contribuyentes/listadoC//")
.then(res=>{
setData(res.data);
});

},[]);


useEffect(()=>{

axiosInstance.get("/contribuyentes/listadopar//")
.then(res=>{
setParroquias(res.data);
})
.catch(err=>{
console.error("Error cargando parroquias",err);
});

},[]);


const getNombreParroquia = (id)=>{

const p = parroquias.find(par => par.id === parseInt(parseFloat(id)));

return p ? p.nombre : "";

};


const filtered = data.filter(c =>

(c.nombre_cont || "")
.toLowerCase()
.includes(search.toLowerCase())

&&

(parroquia === "" || String(c.parroquia_id) === String(parroquia))

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

<h2 className="titulo">Listado de Contribuyentes</h2>


<div className="filtros">

<div className="buscador">

<FaSearch/>

<input
type="text"
placeholder="Buscar contribuyente..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

</div>


<select
value={parroquia}
onChange={(e)=>setParroquia(e.target.value)}
>

<option value="">Todas las parroquias</option>

{parroquias.map(p=>(
<option key={p.id} value={p.id}>
{p.nombre}
</option>
))}

</select>

</div>


<table className="tabla">

<thead>

<tr>

<th>RUC / CI</th>
<th>Nombre</th>
<th>Dirección</th>
<th>Representante</th>
<th>Parroquia</th>
<th>Acciones</th>

</tr>

</thead>


<tbody>

{current.map(c => (

<tr key={c.ruc_cont}>

<td>{c.ruc_cont}</td>

<td>

<Link to={`/establecimientos/${c.ruc_cont}`}>
{c.nombre_cont}
</Link>

</td>

<td>{c.direccion_cont}</td>

<td>{c.representante}</td>

<td>{getNombreParroquia(c.parroquia_id)}</td>


<td className="acciones">

<Link to={`/contribuyentesadd/${c.ruc_cont}`}>
<FaEdit title="Editar"/>
</Link>

<Link to={`/establecimientos/${c.ruc_cont}`}>
<FaBuilding title="Establecimientos"/>
</Link>

<Link to={`/solicitudadd/${c.ruc_cont}`}>
<FaFire title="Solicitud Inspección"/>
</Link>

<Link to={`/solicitudConadd/${c.ruc_cont}`}>
<FaHardHat title="Permiso Construcción"/>
</Link>

<Link to={`/historial-permisos/${c.ruc_cont}`}>
<FaHistory title="Historial Permisos"/>
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

export default PermisosList;
