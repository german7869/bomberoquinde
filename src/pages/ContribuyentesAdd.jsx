import { useEffect, useState } from "react";
import Header from "../components/Header";
import axiosInstance from "../utils/api";
import { useNavigate, useParams } from "react-router-dom";

import "./form.css";

const ContribuyentesAdd = () => {

const navigate = useNavigate();
const { ruc } = useParams();   // ← si existe es edición

const [modoEdicion,setModoEdicion] = useState(false);

const [form,setForm] = useState({

ruc_cont:"",
nombre_cont:"",
direccion_cont:"",
email_cont:"",
razon_social_cont:"",
telefono_cont:"",
ceclular_cont:"",
representante:"",
parroquia_id:""

});

const [parroquias,setParroquias] = useState([]);
const [mensaje,setMensaje] = useState("");

const opcionesmenu = [
{ id:1,path:"/contribuyentes",name:"Volver"}
];


useEffect(()=>{

axiosInstance.get("/contribuyentes/listadopar//")
.then(res=>{
setParroquias(res.data);
});

},[]);


useEffect(()=>{

if(!ruc) return;

setModoEdicion(true);

axiosInstance.get(`/contribuyentes/listadoC//${ruc}/`)
.then(res=>{

setForm(res.data);

});

},[ruc]);


const handleChange = (e)=>{

setForm({

...form,
[e.target.name]:e.target.value

});

};


const handleSubmit = async(e)=>{

e.preventDefault();

try{

if(modoEdicion){

await axiosInstance.put(

`/contribuyentes/listadoC//${ruc}/`,
form

);

setMensaje("Contribuyente actualizado");

}else{

await axiosInstance.post(

"/contribuyentes/listadoC//",
form

);

setMensaje("Contribuyente creado");

}

setTimeout(()=>{

navigate("/contribuyentes");

},1200);

}catch(err){

setMensaje("Error guardando datos");

}

};


return(

<div className="app">

<Header opcionesmenu={opcionesmenu}/>

<div className="container">

<h2>

{modoEdicion ? "Editar Contribuyente" : "Nuevo Contribuyente"}

</h2>


<form onSubmit={handleSubmit} className="form-grid">


<div>

<label>RUC / Cédula</label>

<input
name="ruc_cont"
value={form.ruc_cont}
onChange={handleChange}
disabled={modoEdicion}
/>

</div>


<div>

<label>Nombre</label>

<input
name="nombre_cont"
value={form.nombre_cont}
onChange={handleChange}
required
/>

</div>


<div>

<label>Dirección</label>

<input
name="direccion_cont"
value={form.direccion_cont}
onChange={handleChange}
/>

</div>


<div>

<label>Email</label>

<input
name="email_cont"
value={form.email_cont}
onChange={handleChange}
/>

</div>


<div>

<label>Razón Social</label>

<input
name="razon_social_cont"
value={form.razon_social_cont}
onChange={handleChange}
/>

</div>


<div>

<label>Teléfono</label>

<input
name="telefono_cont"
value={form.telefono_cont}
onChange={handleChange}
/>

</div>


<div>

<label>Celular</label>

<input
name="ceclular_cont"
value={form.ceclular_cont}
onChange={handleChange}
/>

</div>


<div>

<label>Representante</label>

<input
name="representante"
value={form.representante}
onChange={handleChange}
/>

</div>


<div>

<label>Parroquia</label>

<select
name="parroquia_id"
value={form.parroquia_id}
onChange={handleChange}
>

<option value="">Seleccione</option>

{parroquias.map(p=>(
<option key={p.id} value={p.id}>
{p.nombre}
</option>
))}

</select>

</div>


<div className="form-buttons">

<button type="submit">

{modoEdicion ? "Actualizar" : "Guardar"}

</button>

<button
type="button"
onClick={()=>navigate("/contribuyentes")}
>

Cancelar

</button>

</div>


</form>


{mensaje &&

<div className="mensaje">
{mensaje}
</div>

}


</div>

</div>

);

};

export default ContribuyentesAdd;