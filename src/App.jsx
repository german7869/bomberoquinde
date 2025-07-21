// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Contribuyentes from './pages/Contribuyentes';
import Establecimientos from './pages/Estabelcimientos';
import Servicios from './pages/Servicios';
import Informes from './pages/Informes';
import ListInforme from './pages/ListInforme';
import ListInspector from './pages/ListInspector';
import ListSolicitud from './pages/ListSolicitud';
import ListSolicitudCons from './pages/ListSolicitudCons';
import Solicitudadd from './pages/Solicitudadd';
import SolicitudConsadd from './pages/SolicitudConsadd';

import SolicitudConsPdf from './pages/SolicitudConsPdf';

import Solicitudpdf from './pages/solicitudpdf';


import  {UserProvider } from './pages/usercontext'
import InformesAdd from './pages/InformesAdd';
import InformeConsadd from './pages/InformeConsadd';
import InformeImage from './pages/InformeImage';
import Generarpdf from './pages/GenerarPdf';
import Certificado from './pages/Certificado';
import ContribuyentesAdd from './pages/ContribuyentesAdd';
import EstablecimientoAdd from './pages/EstablecimientoAdd';
import User from './pages/User';
import './app.css'

const App = () => {
  const  opcionesmenu = [
    { id: 1, path: '/',name: 'Inicio' ,icono: ''},
    { id: 2, path: '/Servicios',name: 'Nuestros Servicios' ,icono: ''},
    { id: 4, path: '/contact',name: 'Contactenos' ,icono: ''},
    { id: 3, path: '/about',name: 'Acerca de..' ,icono: ''},
    { id: 4, path: '/iniciar',name: 'Inciar Secion',icono: '' },
  ];

    return (
        
      
        <Router>
    
            
            
            
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/servicios" element={<Servicios />} />
                    <Route path="/contribuyentes" element={<Contribuyentes />} />
                    <Route path="/contribuyentesadd" element={<ContribuyentesAdd />} />
                    <Route path="/establecimientoadd/:contribuyente_id" element={<EstablecimientoAdd />} />
                    <Route path="/ListsolicitudCon/" element={<ListSolicitudCons />} />
                    <Route path="/solicitudConadd/:contribuyente_id" element={<SolicitudConsadd />} />
                    <Route path="/solicitudConpdf/:contribuyente_id/:solicitud_id" element={<SolicitudConsPdf />} />
                    <Route path="/informeConadd/:contribuyente_id" element={<InformeConsadd />} />
                    <Route path="/establecimientos/:contribuyente_id" element={<Establecimientos />} />
                    <Route path="/Listinformes/" element={<ListInforme />} />
                    <Route path="/ListSolicitud/" element={<ListSolicitud />} />
                    <Route path="/Listinspectores/" element={<ListInspector />} />
                    <Route path="/informes/:establecimiento_id" element={<Informes />} />
                    <Route path="/solicitudadd/:establecimiento_id" element={<Solicitudadd />} />
                    <Route path="/solicitudpdf/:establecimiento_id/:solicitud_id" element={<Solicitudpdf />} />
                    <Route path="/informeAdd/:establecimiento_id" element={<InformesAdd />} />
                    <Route path="/informepdf/:establecimiento_id" element={<InformesAdd />} />
                    <Route path="/informeImage/:informe_id" element={<InformeImage />} />
                    <Route path="/vistapreviainforme/:informe_id" element={<Generarpdf />} />
                    <Route path="/certficado" element={<Certificado />} />
                    <Route path="/iniciar" element={<User />} />
                    
                </Routes>
           
                <Footer  />
            
          </Router> 
        
    );
};

export default App;