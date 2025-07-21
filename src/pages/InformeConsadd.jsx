// src/InspectionForm.jsx
import { useEffect, useLayoutEffect, useState } from 'react';
import Header from '../components/Header';
import './form.css'
import { jsPDF } from 'jspdf';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/api';
import { Navigate } from 'react-router-dom';
import React from 'react';
import { LuFireExtinguisher } from "react-icons/lu";
import { FaFireExtinguisher } from "react-icons/fa6";
import { FaListCheck } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import image1 from '../assets/logoq.jpeg';
import imagevisto from '../assets/visto.png';
import imatele from '../assets/tele.png';
import imagenocumple from '../assets/nocumple.png';
import { RiPlayListAddLine } from "react-icons/ri";


const InformecontrucionForm = () => {
  const {contribuyente_id} = useParams(); // Obtiene el parámetro de la URL  
  const [activeTab, setActiveTab] = useState(0);
    
  const [tamanol, setTamanol] = useState('');   
  const [responseMessage, setResponseMessage] = useState(''); // Estado para el mensaje de respuesta  
  const [responseMessageD, setResponseMessageD] = useState(''); // Estado para el mensaje de respuesta  
  
  
  const [error, setError] = useState(null);

  const [numero, setNumeroInforme] = useState('');
  const [resultado, setResultadoInforme] = useState('');
  const [observacion, setObservacion] = useState('');
  const [recomendaciones, setRecomendaciones] = useState('');
  const [solicitud, setNroSolicitud] = useState('');
  const [inspector, setInspector] = useState({ id: '', nombre: '' });
  const [Contribuyentes, setContribuyentes] = useState([]);  
  const [nombre, setNombre] = useState('');
  const [representante, setRepresentante] = useState('');
  const [razon, setRazon] = useState('');
  
  const [ci, setCi] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fecha, setFecha] = useState('');
  const [correo, setCorreo] = useState('');
  const [idCreado, setIdCreado] = useState('');
  const [direccion, setDireccion] = useState(''); 
   const [tamano, setTamano] = useState('');
  const [arealote, setAreaLote] = useState('');
  const [tipoconstrucion, setTipoCons] = useState('');
  const [tipoesctructura, setTipoestructura] = useState('');
 
  const [plantascons, setNroPplantasCons] = useState('');
  const [plantasAcons, setNroplantasAcons] = useState('');
  const [areacons, setAreacons] = useState('');


  const [inspectores, setInspectores] = useState([]);

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

  const [tiposestructura, setTiposestructura] = useState([
    { id: 1, descripcion: 'Hormigon' },
    { id: 2, descripcion: 'Madera' },
    { id: 3, descripcion: 'Mixto' },
    { id: 4, descripcion: 'Metalica' },
    { id: 5, descripcion: 'Otros' },
    
    
  ]);
  const [tamanos, setTamanos] = useState([
    { id: 1, descripcion: 'Pequeño' },
    { id: 2, descripcion: 'Mediano' },
    { id: 3, descripcion: 'Grande' },
    
  ]);

 const [detalleinforme, setDetalleInforme] = useState([
    { id: 1, descripcion: 'Terreno en lugar de riesgo',valor: false,categoria:'Indique el riesgo en el que esta el bien' },
    { id: 2, descripcion: 'Rivera del rio',valor: false,categoria:'Indique el riesgo en el que esta el bien' },
    { id: 3, descripcion: 'Zonas de Deslizamiento',valor: false,categoria:'Indique el riesgo en el que esta el bien' },
    { id: 4, descripcion: 'Zona de Hundimiento',valor: false,categoria:'Indique el riesgo en el que esta el bien' },
    { id: 5, descripcion: 'Area de desbordamiento',valor: false,categoria:'Indique el riesgo en el que esta el bien' },
    { id: 6, descripcion: 'Inundaciones Pluvial fluvial',valor: false,categoria:'Indique el riesgo en el que esta el bien' },
    { id: 7, descripcion: 'Cuenta con plan de emergencia',valor: false,categoria:'Indique el riesgo en el que esta el bien' },
    { id: 8, descripcion: 'Areas de peligro con tendido electrico',valor: false,categoria:'Indique el riesgo en el que esta el bien' },
    
  
  ]);
  const  opcionesmenu = [
   
    
  ];   

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
        setContribuyentes(response.data);
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
    formData.append('numero_informe', parseInt(numero,10));
    formData.append('resultado_informe', JSON.stringify(resultado));
    formData.append('observacion', JSON.stringify(observacion));
    formData.append('recomendaciones', JSON.stringify(recomendaciones));
    formData.append('nrosocilitud', parseInt(solicitud,10));
    formData.append('contribuyente',  parseInt(contribuyente_id,10));
    formData.append('fecha_informe',  fecha);

    formData.append('tipoconstruccion',  parseInt(tipoconstrucion,10));
    formData.append('arealote',  parseInt(arealote,10));
    formData.append('tipoesctructura',  parseInt(tipoesctructura,10));
    formData.append('tamaño',  parseInt(tamano,10));
    formData.append('nroplantaconstruidas',  parseInt(plantascons,10));
    formData.append('nroplantaenconstruccion',  parseInt(plantasAcons,10));
    formData.append('areaconstruccion',  parseInt(areacons,10));
    formData.append('inspector',  parseInt(inspector.id,10));
    for (let pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
  }
    try {
      
      const response = await axiosInstance.post(`/informes/listadoinfocons//${contribuyente_id}/informe/`, formData, {
        headers: {
         'Content-Type': 'multipart/form-data',

       },
     });
     if (response.data && response.data.id) {
       const idcreado = response.data.id; // Set idcreado from the response
        setidCreado( response.data.id);
      setResponseMessage('Datos grabados exitosamente: ' + JSON.stringify(response.data));

      // crear post detalle 
      for (const detalle of detalleinforme) {
        // Asegúrate de que 'id_informe' tenga un valor válido antes de enviar
             
        console.log(detalle.descripcion + detalle.valor + idcreado);  
          const detalleresponse = await axiosInstance.post(`/informes/DetalleEcons/${idCreado}/informe/`, {
            descripcion: detalle.descripcion,
            valor: detalle.valor,
            informe: idCreado,
          });
          console.log('Registro guardado:', response.data);
          setResponseMessageD('Datos grabados exitosamente: ' + JSON.stringify(response.data));
        }
        } else {
          console.error('id_informe no está definido para el registro:', detalle);
          setResponseMessageD('Error al grabar los datos: ' + error.message);
        }
      
     
      console.log('Respuesta del servidor:', response.data);
      setResponseMessage('Error al grabar los datos: ' + error.message);
      
    } catch (error) {
      console.error('Error al enviar el informe:', error);
      setResponseMessage('Error al grabar los datos: ' + error.message);
    }
  };

 
  const generatePDF = (data) => {
    const doc = new jsPDF();
    const logo = new Image();
    const visto = new Image();
    const icotele = new Image();
    const icoemail = new Image();
    const icodirec = new Image();
    const novisto = new Image();
    
    logo.src = image1; // Path to your logo image
    visto.src = imagevisto; // Path to your logo image
    icotele.src = imatele; 
    novisto.src = imagenocumple; // Path to your logo image
    
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
    // Add content to the PDF
   
    doc.text('Informe de Inspeccion para permiso de Construccion', 10, 40);
    doc.text(`Número de Informe: ${idCreado}`, 15, 50);
    
    doc.text(`RUC/CI:`, 12, 60);
    doc.text(`${ci}`, 35, 60);
    doc.text(`Razon social:`, 12, 65);
    doc.text(`${nombre}`, 50, 70);
    doc.text(`Direccion:`, 12, 75);
    doc.text(`${direccion}`, 50, 75);
    doc.text(`Telefono:`, 12, 80);
    doc.text(`${telefono}`, 50, 80);
    doc.text(`Email:`, 12, 85);
    doc.text(`${correo}`, 50, 85);
    doc.text(`Representante:`, 12, 90);
    doc.text(`${representante}`, 50, 90);
    doc.text(`Fecha:`, 12, 95);
    doc.text(`${fecha}`, 50, 95);
    doc.setFillColor(255, 0, 0); // Color rojo
    doc.rect(10, 98, 150, 1, 'F')
    
    let y = 105; // Starting Y position for details

    doc.setFontSize(12);
        doc.setFillColor(255, 0, 0); // Color rojo
        doc.roundedRect(15, y-5, 150, 9, 2,2, 'F'); // Dibuja un rectángulo redondeado
        doc.setTextColor(255, 255, 255); // Color blanco
        doc.text('Datos Tecnicos', 18, y);
        y += 10; // Mueve hacia abajo para la siguiente línea
        
        doc.setTextColor(0, 0, 0); // Color negro
        
        doc.text(`Tipo de Cosntruccion:`, 12, y);
        doc.text(`${tipoconstrucion}`, 50, y);
        y += 5;
        doc.text(`Area de Lote:`, 12, y);
        doc.text(`${arealote}`, 50, y);
        y += 5;
        doc.text(`Tamaño:`, 12, y);
        doc.text(`${tamano}`, 50, y);
        y += 5;
        doc.text(`Tipo de Estructura:`, 12, y);
        doc.text(`${tipoesctructura}`, 50, y);
        y += 5;
        doc.text(`Nro de Planta construidas:`, 12, y);
        doc.text(`${plantascons}`, 70, y);
        y += 5;
        doc.text(`Plantas a Contruir:`, 12, y);
        doc.text(`${plantasAcons}`, 80, y);
        y += 5;
        doc.text(`Area de Contruccion:`, 12, y);
        doc.text(`${areacons}`, 50,y);
        y += 10;

    
    
    
    doc.setFontSize(10);
        // Imprime la encabezado extintor
    
    y += 15; // Mueve hacia abajo para la siguiente línea
    let previousCategory = ''; // Variable para almacenar la categoría anterior
    doc.setFontSize(10);
    detalleinforme.forEach((detalle) => {
    // Verifica si la categoría ha cambiado
    if (detalle.categoria !== previousCategory) {
        // Imprime la nueva categoría
        doc.setFontSize(12);
        doc.setFillColor(255, 0, 0); // Color rojo
        doc.roundedRect(15, y-5, 150, 9, 2,2, 'F'); // Dibuja un rectángulo redondeado
        doc.setTextColor(255, 255, 255); // Color blanco
        doc.text(`${detalle.categoria}`, 18, y);
        y += 10; // Mueve hacia abajo para la siguiente línea
        previousCategory = detalle.categoria; // Actualiza la categoría anterior
    }
    doc.setTextColor(0, 0, 0); // Color negro
    doc.setFontSize(10);
    // Imprime la descripción y el icono en la misma línea
    doc.text(`${detalle.descripcion}`, 12, y);
    doc.addImage(detalle.valor ? visto : novisto, 'PNG', 100, y - 5, 7, 3); // Ajusta la posición vertical del icono

    y += 10; // Mueve hacia abajo para la siguiente línea
    if (y >= 265) { // Si la posición Y excede el límite de la página
      doc.setFontSize(9);
      doc.addImage(icotele, 'PNG', 15, y , 7, 3); // Ajusta la posición vertical del icono
      doc.text(`(06) 2738 207`, 23, y);
      y += 10; // Mueve hacia abajo para la siguiente línea
    }
    if (y > 270) { // Si la posición Y excede el límite de la página
      doc.addPage(); // Agrega una nueva página
      y = 10; // Reinicia la posición Y
  }
});

doc.setFontSize(12);
    // Save the PDF
    y += 10; 
    doc.text(`Resultado: ${resultado}`, 10, y);
    
    y += 5; 
    doc.text(`Observaciones: ${observacion}`, 10, y);
    y += 5; 
    doc.text(`Recomendaciones: ${recomendaciones}`, 10, y);
    
    y += 10; 
    doc.text('Firma Inspector' , 25, y);
          doc.text('Firma Solcitante', 100, y);
          y += 30; 
          doc.text(`____________________`, 25, y);
          doc.text(`____________________`, 100, y);
          y += 10; 
          doc.text(`Inspector: ${inspector.nombre}`, 25, y);
          doc.text(`${inspector.nombre}`, 100, y);
    
    doc.save(`informe_${data.numero_informe}.pdf`);
};

  const addRow = () => {
    setRows([...rows, { value: '' }]);
  };

  const handleChange = (id) => {
    setDetalleInforme((prev) =>
      prev.map((opcion) =>
        opcion.id === id ? { ...opcion, valor: !opcion.valor } : opcion
      )
    );
  };


  return (
    <div className="app"  >
      <Header opcionesmenu={opcionesmenu} />
    
    <body className='container' >
    
    <div style={{ padding: '12px',width: '450px', backgroundColor: 'red', color: 'white', borderRadius: '8px', marginBottom: '2px' }}>
     {Contribuyentes ? (
      <>
       <label>id: {Contribuyentes.ruc_cont}</label>
       
      <label>Nombre : {Contribuyentes.nombre_cont}</label>
      <label>Direcdion: {Contribuyentes.direccion_cont}</label>
    </>
  ) : (
    <label>Cargando datos...</label>
  )}
</div>



<div style={{ width: '65%', borderRadius: '8px', overflow: 'hidden' }}>
  <div className="tabs" style={{ display: 'flex', justifyContent: 'space-around', backgroundColor: 'black', borderRadius: '8px' }}>
    <button onClick={() => setActiveTab(0)} style={{ flex: 1, border: 'none', padding: '10px', borderRadius: '8px', backgroundColor: 'transparent', cursor: 'pointer' }}>
      <RiPlayListAddLine style={{ marginRight: '10px' }} /> Datos Informe
    </button>
    <button onClick={() => setActiveTab(1)} style={{ flex: 1, border: 'none', padding: '10px', borderRadius: '8px', backgroundColor: 'transparent', cursor: 'pointer' }}>
      <FaFireExtinguisher style={{ marginRight: '10px' }} /> Datos Tecnicos
    </button>
    <button onClick={() => setActiveTab(2)} style={{ flex: 1, border: 'none', padding: '10px', borderRadius: '8px', backgroundColor: 'transparent', cursor: 'pointer' }}>
      <FaListCheck style={{ marginRight: '10px' }} /> Opciones seleccionar si/no
    </button>
    
  </div>
</div>

    <form onSubmit={handleSubmit}>   
      
    {activeTab === 0 && (
     <div> 
      <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ marginRight: '10px' }}>
          <label>Numero del informe:  {idCreado} </label>
          
     </div>
     </div>
     <div>
        <label>Nro solicitud solicitado para inspeccion:</label>
        <input
          type="text"
          placeholder="Número Solicitud"
          value={solicitud}
          onChange={(e) => setNroSolicitud(e.target.value)}
          required
        />
     </div>
     <div className="form-group" style={{ display: 'flex', alignItems: 'center',height:'50px' }}>
      <label>Fecha:</label>
      <input
        type="date"
        placeholder="Fecha"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        required
      />
      </div>
  
    <div className="form-group" style={{ display: 'flex', alignItems: 'center',height:'70px' }}>
        <label>Tamaño:</label>
        <select
          value={tamano}
          onChange={(e) => setTamano(e.target.value)}
          required
        >
          <option value="">Seleccione Tipo</option>
          {tamanos.map((ins) => (
            <option key={ins.id} value={ins.descripcion}>
              {ins.descripcion}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group" style={{ display: 'flex', alignItems: 'center',height:'50px' }}>
        
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

      <label>Resultado (aprobado,negado,condicionado...etc):</label>   
      <input className="text-amplio"  
        type="text"
        placeholder="Resultado Informe"
        value={resultado}
        onChange={(e) => setResultadoInforme(e.target.value)}
        required
      />
     
      <label>Observaciones (explique si es necesario el resultado):</label>
      <input
        className="text-amplio" 
        type="text"
        placeholder="Observación"
        value={observacion}
        onChange={(e) => setObservacion(e.target.value)}
        required
      />
      
      <label>Recomendaciones</label>
      <input
        className="text-amplio" 
        type="textarea"
        placeholder="Recomendaciones"
        value={recomendaciones}
        onChange={(e) => setRecomendaciones(e.target.value)}
        required
      />
      </div>
    )}
     {activeTab === 1 && (
      <div>
    
    <div className="form-group">
      <label>Tipo de Cosntruccion:</label>
      <input
        type="text"
        placeholder="tipo de construccion"
        value={tipoconstrucion}
        onChange={(e) => setTipoCons(e.target.value)}
        required
      />
      </div> 
      <div className="form-group">
      <label>Area lote:</label>
      <input
        type="text"
        placeholder="Ares de todo lote m2"
        value={arealote}
        onChange={(e) => setAreaLote(e.target.value)}
        required
      />
      </div> 
      
      <div>
        <label>Tipo Estructura:</label>
        <select
          value={tipoesctructura}
          onChange={(e) => setTipoestructura(e.target.value)}
          required
        >
          <option value="">Seleccione Tipo</option>
          {tiposestructura.map((ins) => (
            <option key={ins.id} value={ins.id}>
              {ins.descripcion}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Definir el Tamaño :</label>
        <select
          value={tamanol}
          onChange={(e) => setTamanol(e.target.value)}
          required
        >
          <option value="">Seleccione Tamaño</option>
          {tamanos.map((ins) => (
            <option key={ins.id} value={ins.id}>
              {ins.descripcion}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
      <label>Nro de plantas construidas:</label>
      <input
        type="text"
        placeholder="Nro de plantas contruidas"
        value={plantascons}
        onChange={(e) => setNroPplantasCons(e.target.value)}
        required
      />
      </div> 
      <div className="form-group">
      <label>Nro de plantas a construir:</label>
      <input
        type="text"
        placeholder="Nro de plantas a contruir"
        value={plantasAcons}
        onChange={(e) => setNroplantasAcons(e.target.value)}
        required
      />
      </div> 
      <div className="form-group">
      <label>Area en contrucion:</label>
      <input
        type="text"
        placeholder="area construccion"
        value={areacons}
        onChange={(e) => setAreacons(e.target.value)}
        required
      />
       </div>
     </div>
    )}
         
   {activeTab === 2 && (
  <div style={{ overflowX: 'auto', maxWidth: '100%', maxHeight: '300px' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Descripción</th>
          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Visto bueno</th>
        </tr>
      </thead>
      <tbody>
        {detalleinforme.map((opcion) => (
          <tr key={opcion.id}>
            <td style={{ border: '1px solid #ddd', padding: '10px' }}>{opcion.descripcion}</td>
            <td style={{ border: '1px solid #ddd', padding: '10px' }}>
              <input
                type="checkbox"
                checked={opcion.valor}
                onChange={() => handleChange(opcion.id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

    
    <button type="submit">Guardar</button>  
    {responseMessage && (
            <div>
                <button onClick={generatePDF}>Generar PDF</button>
                
            </div>
          )}
    
    {error && <div className="error">{error}</div>} {/* Display error if exists */}
    </form>
    </body> 
      
    </div> 
  );
};

export default InformecontrucionForm;