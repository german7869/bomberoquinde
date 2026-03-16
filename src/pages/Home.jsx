// src/pages/Home.jsx

import React, { useState, useEffect } from "react";
import Header from "../components/Header";

import "./page.css";
import "./home.css";

import img1 from "../assets/bomberos1.jpg";
import img2 from "../assets/bomberos2.jpg";
import img3 from "../assets/bomberos3.jpg";

const Home = () => {

const opcionesmenu = [

{ id:1, path:'/', name:'Inicio' },
{ id:2, path:'/Servicios', name:'Nuestros Servicios' },
{ id:3, path:'/contact', name:'Contáctenos' },
{ id:4, path:'/about', name:'Acerca de' },
{ id:5, path:'/iniciar', name:'Iniciar Sesión' }

];

const images = [img1,img2,img3];

const [index,setIndex] = useState(0);

useEffect(()=>{

const interval = setInterval(()=>{

setIndex(prev => (prev + 1) % images.length);

},4000);

return ()=>clearInterval(interval);

},[]);

return(

<div className="app">

<Header opcionesmenu={opcionesmenu}/>

<div className="container">

{/* SLIDER */}

<div className="slider">

<img
src={images[index]}
alt="Bomberos aqui va su estacio"
className="slider-img"
/>

<div className="slider-text">

<h1>BOMBEROS DE ....</h1>

<p>Siempre listos para servir a la comunidad...</p>

</div>

</div>


{/* INFORMACION */}

<div className="info-estacion">

<h2>Nuestra Estación</h2>

<p>

El Cuerpo de Bomberos de ...! trabaja para proteger
la vida, bienes y medio ambiente de la ciudadanía,
brindando servicios de emergencia, prevención e
inspecciones de seguridad.

</p>

</div>


{/* SERVICIOS */}

<div className="servicios">

<h2>Servicios a la Comunidad</h2>

<div className="servicios-grid">

<div className="servicio">

<h3>Inspección de Seguridad</h3>

<p>
Revisión de establecimientos para prevenir incendios.
</p>

</div>

<div className="servicio">

<h3>Permisos de Funcionamiento</h3>

<p>
Emisión de certificados para establecimientos.
</p>

</div>

<div className="servicio">

<h3>Emergencias</h3>

<p>
Atención inmediata a incendios y rescates.
</p>

</div>

</div>

</div>

</div>

</div>

);

};

export default Home;