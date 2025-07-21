// src/components/ProductList.js
import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Header from '../components/Header';
import image1 from '../assets/contactos.jpeg';

const Contact = () => {

   const  opcionesmenu = [
    { id: 1, path: '/',name: 'Inicio' ,icono: ''},
    { id: 2, path: '/Servicios',name: 'Nuestros Servicios' ,icono: ''},
    { id: 4, path: '/contact',name: 'Contactenos' ,icono: ''},
    { id: 3, path: '/about',name: 'Acerca de..' ,icono: ''},
    { id: 4, path: '/iniciar',name: 'Inciar Secion',icono: '' },
  ];        
   
  
  
  return (
   <div >
     <Header opcionesmenu={opcionesmenu} />
    <body className='container'>
        <img className="imagen" src={image1} width="65%" height="80%" />
               
     </body>   
    </div>  
  );
}

export default Contact;
