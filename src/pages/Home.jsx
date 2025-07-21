// src/components/ProductList.js
import React from 'react';
import Header from '../components/Header';
import './page.css'
const home = () => {
  const  opcionesmenu = [
    { id: 1, path: '/',name: 'Inicio' ,icono: ''},
    { id: 2, path: '/Servicios',name: 'Nuestros Servicios' ,icono: ''},
    { id: 4, path: '/contact',name: 'Contactenos' ,icono: ''},
    { id: 3, path: '/about',name: 'Acerca de..' ,icono: ''},
    { id: 4, path: '/iniciar',name: 'Inciar Secion',icono: '' },
  ];   
  return (
    <div className="app">
    <Header opcionesmenu={opcionesmenu} />
     <body className='container' > 
        <div>BOMBEROS DE QUININDÉ SIEMPRE LISTO</div>
    </body>
    </div>
    );
}

export default home;