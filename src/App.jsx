// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Contribuyentes from "./pages/Contribuyentes";
import ContribuyentesAdd from "./pages/ContribuyentesAdd";

import EstablecimientosC from "./pages/Establecimientos"; 
import Establecimientoslist from "./pages/Establecimientoslist";

import EstablecimientoAdd from "./pages/EstablecimientoAdd";

import Informes from "./pages/Informes";
import Generarpdf from './pages/GenerarPdf'
import InformesAdd from "./pages/InformesAdd";

import Solicitudadd from "./pages/Solicitudadd";


import ListInforme from "./pages/ListInforme";
import ListSolicitud from "./pages/ListSolicitud";
import ListInspector from "./pages/ListInspector";
import Dashboard from "./pages/Dashboard";
import User from "./pages/User";
import InformeImage from './pages/InformeImage'
import "./app.css";

const App = () => {

return (

<Router>

<Routes>

<Route path="/" element={<Home />} />

<Route path="/about" element={<About />} />

<Route path="/contact" element={<Contact />} />
<Route path="/InformeImage/:informe_id" element={<InformeImage />} />


<Route path="/contribuyentes" element={<Contribuyentes />} />

<Route path="/contribuyentesadd" element={<ContribuyentesAdd />} />

<Route path="/contribuyentesadd/:ruc" element={<ContribuyentesAdd />} />

{/* establecimientos por contribuyente */}

<Route
path="/establecimientos/:contribuyente_id"
element={<EstablecimientosC />}
/>

{/* todos los establecimientos */}

<Route
path="/establecimientoslist"
element={<Establecimientoslist />}
/>

<Route
path="/establecimientoadd/:contribuyente_id"
element={<EstablecimientoAdd />}
/>

<Route
path="/informes/:establecimiento_id"
element={<Informes />}
/>

<Route
path="/informespdf/:establecimiento_id/:informe_id"
element={<Generarpdf />}
/>

<Route
path="/informeAdd/:establecimiento_id"
element={<InformesAdd />}
/>

<Route
path="/solicitudadd/:establecimiento_id"
element={<Solicitudadd />}
/>



<Route path="/Listinformes" element={<ListInforme />} />

<Route path="/ListSolicitud" element={<ListSolicitud />} />

<Route path="/Listinspectores" element={<ListInspector />} />

<Route path="/iniciar" element={<User />} />
<Route path="/dashboard" element={<Dashboard />} />

</Routes>

<Footer />

</Router>

);

};

export default App;