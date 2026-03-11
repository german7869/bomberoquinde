import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/api';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';

import { FaImages, FaEdit, FaTrash } from 'react-icons/fa';
import { GrDocumentPdf } from "react-icons/gr";

import './page.css'
import './informe.css'

const InformesList = () => {

const { establecimiento_id } = useParams();

const [data,setData] = useState([]);
const [infoEstablecimiento,setInfoEstablecimiento] = useState({});

const [loading,setLoading] = useState(true);
const [error,setError] = useState(null);

const opcionesmenu = [

{ id:1, path:`/InformeAdd/${establecimiento_id}`, name:'Agregar Informe' },
{ id:2, path:`/solicitudadd/${establecimiento_id}`, name:'Agregar Solicitud' }

];

useEffect(()=>{

cargarDatos();

},[]);

useEffect(()=>{

axiosInstance.get(`/contribuyentes/listadoec//${establecimiento_id}/`)
.then(res=>{
setInfoEstablecimiento(res.data);
});

},[]);

const cargarDatos = async()=>{

try{

const res = await axiosInstance.get(`/informes/listadoinfo/${establecimiento_id}/establecimiento/`);

setData(res.data);


}catch(err){

setError(err.message);

}finally{

setLoading(false);

}

};


const eliminarInforme = async(id, tieneImagen, nroInforme)=>{

if(tieneImagen){

alert("No se puede eliminar, tiene imágenes cargadas");
return;

}

if(nroInforme){

alert("No se puede eliminar, el informe ya tiene número emitido");
return;

}

if(!window.confirm("¿Eliminar informe?")) return;

try{

await axiosInstance.delete(`/informes/eliminar/${id}/`);

setData(data.filter(i=>i.id !== id));

}catch(err){

alert("Error eliminando informe");

}

};


if(loading) return <p>Cargando...</p>;
if(error) return <p>Error: {error}</p>;

return (

<div className="app">

<Header opcionesmenu={opcionesmenu}/>

<div className='container'>

{/* INFORMACION SUPERIOR */}

<div className="panel-info">

<h3>Información del Establecimiento</h3>

<div className="info-grid">


<div>
<strong>Establecimiento:</strong> {infoEstablecimiento.nombre_est}
</div>

<div>
<strong>Dirección:</strong> {infoEstablecimiento.direccion_est}
</div>

<div>
<strong>Actividad:</strong> {infoEstablecimiento.actividad}
</div>

</div>

</div>


{/* TABLA */}

<table className="tabla-informes">

<thead>

<tr>

<th>ID</th>
<th>Fecha</th>
<th>Solicitud</th>
<th>Inspector</th>
<th>Observación</th>
<th>Resultado</th>
<th>Acciones</th>

</tr>

</thead>

<tbody>

{data.map((inf)=>(

<tr key={inf.id}>

<td>{inf.id}</td>

<td>{inf.Fecha_informe}</td>

<td>{inf.nro_socilitud}</td>

<td>{inf.inspector}</td>

<td>{inf.observacion}</td>

<td>{inf.resultado_informe}</td>

<td className="acciones">

<Link to={`/InformeImage/${establecimiento_id}`}>

<button className="btn-img" title="Ver imágenes del informe" >
<FaImages/>
</button>

</Link>

<Link to={`/InformesAdd/${inf.id}`}>

<button className="btn-edit" title="Editar  informe">
<FaEdit/>
</button>

</Link>

<Link to={`/informespdf/${inf.id}`}>

<button className="btn-pdf" title="PDF">
<GrDocumentPdf/>
</button>

</Link>

<button

className="btn-delete"

onClick={()=>eliminarInforme(
inf.id,
inf.tiene_imagen,
inf.nro_informe
)}

>

<FaTrash/>

</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

);

}

export default InformesList;