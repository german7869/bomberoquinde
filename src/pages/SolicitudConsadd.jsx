// src/InspectionForm.jsx
import { useEffect, useLayoutEffect, useState } from 'react';
import Header from '../components/Header';
import './form.css'
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/api';
import { useNavigate } from 'react-router-dom';

import Contribuyentes from './Contribuyentes';
import { Navigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import image1 from '../assets/logoq.jpeg';

const SolicitudConadd = () => {
  const navigate = useNavigate();
  const [redirect, setRedirect] = useState(false);
  const {contribuyente_id} = useParams(); // Obtiene el parámetro de la URL
  const [responseMessage, setResponseMessage] = useState(''); // Estado para el mensaje de respuesta  
  const [error, setError] = useState(null);
  const [fecha, setFecha]  = useState('');
  const [numero, setNumero] = useState('');
  const [motivo, setMotivo] = useState('');
  
  const [inspector, setInspector] = useState({ id: '', nombre: '' });
  const [inspectores, setInspectores] = useState([]);
  const [contribuyente, setContribuyente] = useState([]);
  const [nombre, setNombre] = useState('');
  const [razon, setRazon] = useState('');
  
  const [ci, setCi] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  
  const [direccion, setDireccion] = useState('');
 
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
        if (!contribuyente_id) {
          console.error('contribuyente_id no está definido');
          return;
        }
        //axiosInstance.get('/contribuyentes/listadoC//')
        const response = await axiosInstance.get(`/contribuyentes/listadoC//${contribuyente_id}/`);
        setContribuyente(response.data);
        const data = response.data
        setNombre(data.nombre_cont ? String(data.nombre_cont) : '');
        setCi(data.ruc_cont ? String(data.ruc_cont) : '');
        setTelefono(data.telefono_cont ? String(data.telefono_cont) : '');
        setDireccion(data.direccion_cont ? String(data.direccion_cont) : '');
        setCorreo(data.email_cont ? String(data.email_cont ): '');
      } catch (error) {
        
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
    formData.append('contribuyente',  contribuyente_id);
    for (let pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]); }
    try {
      
      const response = await  axiosInstance.post(`/contribuyentes/listadoSolicitudcons//`, formData, {
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
            doc.text('Cuerpo de Bomberos Quinide', 70, 14);
  
  // Restablecer el color del texto a negro para el resto del documento
  doc.setTextColor(0, 0, 0); // Color negro
  doc.setFontSize(12);
            doc.setFillColor(200, 200, 200); // RGB for gray
            doc.roundedRect(30, 35, 160, 20, 5,5, 'F'); // Dibuja un rectángulo redondeado
            
            doc.setTextColor(255, 0, 0); // Color blanco
  
            // Define the text to be centered
            const text = 'SOLICITUD DE INSPECCIÓN DE PERMISO DE';
  
            const textWidth = doc.getTextWidth(text);
            const x = (doc.internal.pageSize.width - textWidth) / 2;
            const y = 40;
    
            doc.text(text, x, y);
            doc.text('CONTRUCCION', 80, 50);
            doc.setTextColor(0, 0, 0); // Color negro
            doc.setFontSize(12);
            doc.text(`Fecha:`, 15, 70);
            doc.text(`${fecha}`, 55, 70);
            doc.text(`Número de solicitud: `, 15, 80);
            doc.text(` ${numero}`, 55, 80);
            
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
            doc.text(` ${nombre}`,70,110)
  
            doc.text('CI:', 15, 120);
            doc.text(` ${ci}`,70,120)
            doc.text('TELÉFONO:', 120, 120);
            doc.text( `${telefono}`, 150, 120);
                      
             doc.text('Direccion Local:', 15, 130); 
             doc.text(` ${direccion}`,70,130)
             
             doc.text('Correo:', 15, 135); 
             doc.text(` ${correo}`,70,135);
            

             doc.setFillColor(200, 200, 200); // RGB for gray
             doc.setTextColor(255, 0, 0); // Color blanco        
             const x4 = (doc.internal.pageSize.width - doc.getTextWidth('OBSERVACION MOTIVO INSPECCION')) / 2;
             const y4 = 155;
             doc.roundedRect(30, 148, 160, 11, 5,5, 'F'); // Dibuja un rectángulo redondeado
             doc.text('OBSERVACION MOTIVO INSPECCION', x4, y4);
             doc.setTextColor(255, 0, 0); // Color blanco
             doc.setTextColor(0, 0, 0); // Color negro
            doc.text(` ${motivo}`, 20, 175);
            
            
            doc.text('Firma Inspector' , 25, 210);
            doc.text('Firma Solcitante', 100, 210);
            doc.text(`____________________`, 25, 230);
            doc.text(`____________________`, 100, 230);
            doc.text(`Inspector: ${inspector.nombre}`, 25, 235);
            doc.text(`${nombre}`, 100, 235);
            doc.save('inspeccion_permiso.pdf');
            // Guardar el PDF en un Blob
            const pdfBlob = doc.output('blob');

            // C  rear una URL para el Blob
            const pdfUrl = URL.createObjectURL(pdfBlob);

            window.open(pdfUrl);
            setRedirect(true);
          };  
    
  
          if (redirect) {
                
         //  navigate('/contribuyentes');
           return <h2>Formulario enviado con éxito. PDF generado.</h2>;

          }

    return (
    <div  className="app">
      <Header opcionesmenu={opcionesmenu} /> 
    <div className='container' >
    <div className="informativo">  
          <p>Agrenado Solicitud de isnpeccion para permisos de Construccion</p>
          
          
      </div>
    <form onSubmit={handleSubmit}>   
    
    <div>
    {contribuyente ? (
      <>
        <label>id: {contribuyente.ruc_cont}</label>
        
        <label>CI : {contribuyente.ruc_cont}</label>
        <label>Nombre : {contribuyente.nombre_cont}</label>
        
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
    </div> 
    
   
    </div>
  );
};

export default SolicitudConadd;