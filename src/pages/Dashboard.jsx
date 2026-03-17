import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/api";
import Header from "../components/Header";

import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
CartesianGrid,
Legend
} from "recharts";

import "./dashboard.css";

const Dashboard = () => {

const [anio,setAnio] = useState(new Date().getFullYear());

const [totales,setTotales] = useState({});
const [grafica,setGrafica] = useState([]);

const [ultimasInspecciones,setUltimasInspecciones] = useState([]);
const [ultimosInformes,setUltimosInformes] = useState([]);

useEffect(()=>{

cargarDashboard();

},[anio]);

const cargarDashboard = async()=>{

try{

const res = await axiosInstance.get(`/dashboard/${anio}`);

setTotales(res.data.totales);
setGrafica(res.data.grafica);
setUltimasInspecciones(res.data.ultimas_inspecciones);
setUltimosInformes(res.data.ultimos_informes);

}catch(err){

console.log(err);

}

};
const opcionesmenu = [

{ id:1,path:"/",name:"Inicio"},
{ id:2,path:"/contribuyentes",name:"Contribuyentes"},
{ id:3,path:"/establecimientoslist",name:"Establecimientos"},
{ id:4,path:"/Listinformes",name:"Informes"},
{ id:5,path:"/iniciar",name:"Cerrar sesión"}

];

return(

<div>

<Header opcionesmenu={opcionesmenu}/>

<div className="dashboard">

<h2>Dashboard Bomberos Quinindé</h2>

{/* SELECT AÑO */}

<div className="anio">

<label>Año:</label>

<select
value={anio}
onChange={(e)=>setAnio(e.target.value)}
>

<option value="2026">2026</option>
<option value="2025">2025</option>
<option value="2024">2024</option>

</select>

</div>


{/* TARJETAS */}

<div className="cards">

<div className="card">

<h4>Servicios</h4>

{/* <p>{totales.servicios}</p> */}
 
</div>

<div className="card">

<h4>Inspecciones</h4>

{/* <p>{totales.inspecciones}</p> */}


</div>

<div className="card">

<h4>Informes permisos</h4>

{/* <p>{totales.permisos}</p> */}


</div>

<div className="card">

<h4>Informes construcción</h4>

{/* <p>{totales.construccion}</p> */}


</div>

<div className="card">

<h4>Establecimientos con informe</h4>

{/* <p>{totales.establecimientos}</p> */}


</div>

<div className="card">

<h4>Contribuyentes</h4>

{/* <p>{totales.contribuyentes}</p> */}


</div>

</div>


{/* GRAFICA */}

<h3>Informes por Mes</h3>

<BarChart width={800} height={300} data={grafica}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="mes"/>

<YAxis/>

<Tooltip/>

<Legend/>

<Bar dataKey="permisos"/>

<Bar dataKey="construccion"/>

</BarChart>


{/* ULTIMAS INSPECCIONES */}

<h3>Últimas Inspecciones</h3>

<table className="tabla">

<thead>

<tr>

<th>Fecha</th>
<th>Establecimiento</th>
<th>Inspector</th>

</tr>

</thead>

<tbody>



</tbody>

</table>


{/* ULTIMOS INFORMES */}

<h3>Últimos Informes</h3>

<table className="tabla">

<thead>

<tr>

<th>Fecha</th>
<th>Establecimiento</th>
<th>Tipo</th>

</tr>

</thead>

<tbody>



</tbody>

</table>

</div>

</div>

);

};

export default Dashboard;