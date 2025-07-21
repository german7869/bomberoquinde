// src/InspectionForm.jsx
import { useEffect, useLayoutEffect, useState } from 'react';
import Header from '../components/Header';
import './form.css'
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/api';

import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import image1 from '../assets/logoq.jpeg';

const SolicitudConadd = () => {
  const navigate = useNavigate();
  const {establecimiento_id} = useParams(); // Obtiene el parámetro de la URL
  const [redirect, setRedirect] = useState(false);
  const [responseMessage, setResponseMessage] = useState(''); // Estado para el mensaje de respuesta  
  const [error, setError] = useState(null);
  const [solicituddata, setSolicituddata] = useState(null);
  const [fecha, setFecha]  = useState('');
  const [numero, setNumero] = useState('');
  const [motivo, setMotivo] = useState('');
  
  const [inspector, setInspector] = useState({ id: '', nombre: '' });
  const [inspectores, setInspectores] = useState([]);
  const [EstaCont, setEstacont] = useState([]);
  const [nombre, setNombre] = useState('');
  const [razon, setRazon] = useState('');
  const [actividad, setActividad] = useState('');
  const [ci, setCi] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [referencia, setReferencia] = useState('');

  const  opcionesmenu = [
    { id: 1, path: '/',name: 'Volver' ,icono: ''},
   
    
  ];   
  useEffect(() => {
    // Obtener la lista de inspectores desde la API
    const fetchInspectores = async () => {
      try {
        const response = await axiosInstance.get('/contribuyentes/listadoins//');
        setInspectores(response.data);
      } catch (error) {
        console.error('Error al obtener inspectores:', error);
      }
    };

    fetchInspectores();
  }, []);

  useEffect(() => {
    // Obtener la lista de inspectores desde la API
    const fetchcontribuyente = async () => {
      try {
        if (!establecimiento_id) {
          console.error('establecimiento_id no está definido');
          return;
        }
        //http://177.234.231.228:7001/contribuyentes/listadoec//2/

        const response = await axiosInstance.get(`/contribuyentes/listadoec//${establecimiento_id}/`);
        setEstacont(response.data);
        console.log(response.data);
        const data = response.data
        setNombre(data.nombre_est ? String(data.nombre_est) : '');
        setCi(data.contribuyente.ruc_cont ? String(data.contribuyente.ruc_cont) : '');
        setTelefono(data.contribuyente.telefono_cont ? String(data.contribuyente.telefono_cont) : '');
        setActividad(data.actividad ? String(data.actividad) : '');
        setDireccion(data.direccion_est ? String(data.direccion_est) : '');
        setReferencia(data.refeencia_est ? String(data.refeencia_est) : ''); 
        setRazon(data.contribuyente.nombre_cont ? String(data.contribuyente.nombre_cont) : '');
        setCorreo(data.contribuyente.email_cont ? String(data.contribuyente.email_cont ): '');
      } catch (error) {
        console.error('Error al obtener inspectores:', error);
      }
    };

    fetchcontribuyente();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('fecha_solicitud', JSON.stringify(fecha));
    formData.append('numero_soicitud', numero);
    formData.append('motivo', JSON.stringify(motivo));
    formData.append('establecimiento',  establecimiento_id);
    for (let pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]); }
    try {
      
      const response = await  axiosInstance.post(`/contribuyentes/listadoSolicitud//`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Respuesta del servidor:', response.data);
      setResponseMessage('Datos grabados exitosamente: ' + JSON.stringify(response.data));
      
    } catch (error) {
      setResponseMessage('Error al grabar los datos: ' + error.message);
     
    }
      };


  
    const generatePDF = (contribuyente) => {
      const doc = new jsPDF();

      // Load the logo image (make sure to replace 'logo.png' with your actual logo path)
      const logo = new Image();
      logo.src = image1; // Path to your logo image
      
          // Add logo to the PDF
          doc.addImage(logo, 'PNG', 2, 2, 40, 25); // Adjust the size and position as needed
  
          // Add content to the PDF
          doc.setFillColor(255, 0, 0); // Color rojo
          doc.rect(45, 5, 145, 22, 'F')
          doc.setTextColor(255, 255, 255); // Color blanco
          doc.setFontSize(22);
          doc.text('Cuerpo de Bomberos Quininde', 70, 14);

// Restablecer el color del texto a negro para el resto del documento
doc.setTextColor(0, 0, 0); // Color negro
doc.setFontSize(12);
          doc.setFillColor(200, 200, 200); // RGB for gray
          doc.roundedRect(30, 35, 160, 25, 5,5, 'F'); // Dibuja un rectángulo redondeado
          
          doc.setTextColor(255, 0, 0); // Color blanco

          // Define the text to be centered
          const text = 'SOLICITUD DE INSPECCIÓN DE PERMISO DE';

          const textWidth = doc.getTextWidth(text);
          const x = (doc.internal.pageSize.width - textWidth) / 2;
          const y = 40;
  
          doc.text(text, x, y);
          doc.text('FUNCIONAMIENTO AÑO 2025', 80, 50);
          doc.setTextColor(0, 0, 0); // Color negro
          doc.setFontSize(12);
          doc.text(`Fecha:`, 15, 70);
          doc.text(`${fecha}`, 50, 70);
          doc.text(`Número de Solicitud: `, 15, 80);
          doc.text(` ${numero}`, 60, 80);
          
          doc.setFontSize(12);

         doc.setFillColor(200, 200, 200); // RGB for gray
         doc.setTextColor(255, 0, 0); // Color blanco        
          const x2 = (doc.internal.pageSize.width - doc.getTextWidth('DATOS DEL REPRESENTANTE LEGAL, GERENTE O PROPIETARIO')) / 2;
          const y2 = 95;
          doc.roundedRect(30, 87, 160, 12, 5,5, 'F'); // Dibuja un rectángulo redondeado
          doc.text('DATOS DEL REPRESENTANTE LEGAL, GERENTE O PROPIETARIO', x2, y2);
          doc.setTextColor(255, 0, 0); // Color blanco
         
          doc.setTextColor(0, 0, 0); // Color negro
          doc.setFontSize(12);
          doc.text('NOMBRES Y APELLIDOS:', 15, 110);
          doc.text(` ${razon}`,70,110)

          doc.text('CI:', 15, 120);
          doc.text(` ${ci}`,70,120)
          doc.text('TELÉFONO:', 140, 120);
          doc.text( `${telefono}`, 180, 120);
         
          doc.setFillColor(200, 200, 200); // RGB for gray
          doc.setTextColor(255, 0, 0); // Color blanco        
           const x3 = (doc.internal.pageSize.width - doc.getTextWidth('DATOS DEL INMUEBLE A INSPECCIONAR')) / 2;
           const y3 = 135;
           doc.roundedRect(30, 127, 160, 12, 5,5, 'F'); // Dibuja un rectángulo redondeado
           doc.text('DATOS DEL INMUEBLE A INSPECCIONAR', x3, y3);
           doc.setTextColor(255, 0, 0); // Color blanco
           doc.setTextColor(0, 0, 0); // Color negro
           doc.text('Razón Social:', 15, 145);
           doc.text(` ${nombre}`,45,145) 
           doc.text('Direccion Local:', 15, 150); 
           doc.text(` ${direccion}`,45,150)
           doc.text('Referencia:', 15, 155); 
           doc.text(` ${referencia}`,45,155)
           
           doc.text('Correo:', 15, 160); 
           doc.text(` ${correo}`,45,160)
           doc.text('Actividad:', 25, 165);
           doc.text(` ${actividad}`,45,165)

           doc.setFillColor(200, 200, 200); // RGB for gray
          doc.setTextColor(255, 0, 0); // Color blanco        
           const x4 = (doc.internal.pageSize.width - doc.getTextWidth('OBSERVACION MOTIVO INSPECCION')) / 2;
           const y4 = 175;
           doc.roundedRect(30, 168, 160, 12, 5,5, 'F'); // Dibuja un rectángulo redondeado
           doc.text('OBSERVACION MOTIVO INSPECCION', x4, y4);
           doc.setTextColor(255, 0, 0); // Color blanco
           doc.setTextColor(0, 0, 0); // Color negro
           doc.text(` ${motivo}`, 20, 185);
          
          
          doc.text('Firma Inspector' , 25, 210);
          doc.text('Firma Solcitante', 100, 210);
          doc.text(`____________________`, 25, 230);
          doc.text(`____________________`, 100, 230);
          doc.text(`Inspector: ${inspector.nombre}`, 25, 235);
          doc.text(`${razon}`, 100, 235);

          doc.save('inspeccion_permiso.pdf');
          setRedirect(true);
        };  
  
        if (redirect) {
                
          navigate(`/establecimientos/${EstaCont.contribuyente.ruc_cont}`);
          return <h2>Formulario enviado con éxito. PDF generado.</h2>;

         }
  return (
    <div  className="app">
      <Header opcionesmenu={opcionesmenu} />
    <body className='container' >
    <div className="informativo">  
          <p>Agrenado Solicitud de isnpeccion para permisos de Locales comerciales</p>
          
          
      </div>
    <form onSubmit={handleSubmit}>   
    
    <div>
    {EstaCont ? (
      <>
        <label>id: {EstaCont.id}</label>
        {EstaCont.contribuyente ? (
          <>
            <label>CI: {EstaCont.contribuyente.ruc_cont}</label>
            <label>Razon social: {EstaCont.contribuyente.nombre_cont}</label>
          </>
        ) : (
          <label>Contribuyente no disponible</label>
        )}
        <label>Nombre Comercial: {EstaCont.nombre_est}</label>
        <label>Activida: {EstaCont.actividad}</label>
      </>
    ) : (
      <label>Cargando datos...</label>
    )}
  </div>
    
    <input
        type="text"
        placeholder="Numero"
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
        required
      />
      <div className="form-group">
      <label>Fecha:</label>
      <input
        type="date"
        placeholder="Fecha"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        required
      />
      </div>
      <div className="form-group">
      <label>Motivo:</label>
      <input
        type="text"
        placeholder="Motivo"
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
        required
      />
       </div>    
        <div>
        <label>Inspector:</label>
      <select
        value={JSON.stringify(inspector)}
        onChange={(e) => {
          const selectedInspector = JSON.parse(e.target.value);
          setInspector(selectedInspector);
        }}
        required
      >
        <option value="">Seleccione un inspector</option>
        {inspectores.map((ins) => (
          <option key={ins.id} value={JSON.stringify({ id: ins.id, nombre: ins.nombre_insp })}>
            {ins.nombre_insp}
          </option>
        ))}
      </select>
      {inspector.nombre && <p>Inspector seleccionado: {inspector.nombre}</p>}
      </div>

      {!responseMessage && (
        <button type="submit">Guardar</button>    
      )}   
    </form>
    {responseMessage && (
            <div>
                <button onClick={generatePDF}>Generar PDF</button>
                
            </div>
          )}
    
    {error && <div className="error">{error}</div>} {/* Display error if exists */}
    </body> 
    
   
    </div>
  );
};

export default SolicitudConadd;