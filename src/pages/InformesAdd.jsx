// src/InspectionForm.jsx
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import './form.css'
import './informeadd.css'
import { jsPDF } from 'jspdf';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/api';
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
import { useNavigate } from 'react-router-dom';

const InspectionForm = () => {
  const navigate = useNavigate();
  const {establecimiento_id} = useParams(); // Obtiene el parámetro de la URL  
  const [activeTab, setActiveTab] = useState(0);
  const [rows, setRows] = useState([{ value: '' ,cantidad: '',capacidad: '',estado: '',caducidad: ''}]);
  const [loading, setLoading] = useState(true);
  const handleInputChange = (index, event) => {

    const newRows = [...rows];
    newRows[index].value = event.target.value;
    setRows(newRows);
  };
  const handlecantidadChange = (index, event) => {
    const newRows = [...rows];
    newRows[index].cantidad = event.target.value;
    setRows(newRows);
  };
  const handlecapacidadtChange = (index, event) => {
    const newRows = [...rows];
    newRows[index].capacidad = event.target.value;
    setRows(newRows);
  };
  const handlestadoChange = (index, event) => {
    const newRows = [...rows];
    newRows[index].estado = event.target.value;
    setRows(newRows);
  };
  const handlecaducaChange = (index, event) => {
    const newRows = [...rows];
    newRows[index].caducidad = event.target.value;
    setRows(newRows);
  };
  
  const [responseMessage, setResponseMessage] = useState(''); // Estado para el mensaje de respuesta  
  const [responseMessageD, setResponseMessageD] = useState(''); // Estado para el mensaje de respuesta  
  
  
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [numero, setNumeroInforme] = useState('');
  const [resultado, setResultadoInforme] = useState('');
  const [observacion, setObservacion] = useState('');
  const [recomendaciones, setRecomendaciones] = useState('');
  const [solicitud, setNroSolicitud] = useState('');
  const [inspector, setInspector] = useState({ id: '', nombre: '' });
  const [EstaCont, setEstacont] = useState([]);
  const [detalleExtintor, setDetalleExtintor] = useState([]);
  const [nombre, setNombre] = useState('');
  const [representante, setRepresentante] = useState('');
  const [razon, setRazon] = useState('');
  const [actividad, setActividad] = useState('');
  const [ci, setCi] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fecha, setFecha] = useState('');
  const [correo, setCorreo] = useState('');
  const [idCreado, setIdcreado] = useState('');
  const [direccion, setDireccion] = useState('');  
  const [referencia, setReferencia] = useState('');  
  const [tamano, setTamano] = useState({ id: '', descripcion: '' });


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
  const [tamanos, setTamanos] = useState([
    { id: 1, descripcion: 'Pequeño' },
    { id: 2, descripcion: 'Mediano' },
    { id: 3, descripcion: 'Grande' },
    
  ]);


  const  opcionesmenu = [
    
    
    
  ];   

  const [detalleinforme, setDetalleInforme] = useState([
    { id: 1, descripcion: 'Gasolinera',valor: false,categoria:'Realiza estas actividades' },
    { id: 2, descripcion: 'Bombonas de gas',valor: false,categoria:'Realiza estas actividades' },
    { id: 3, descripcion: 'Venta al por menor de GAS de bombonas 15KL',valor: false,categoria:'Realiza estas actividades' },
    { id: 4, descripcion: 'Venta de combustible al por menor',valor: false,categoria:'Realiza estas actividades' },
    { id: 5, descripcion: 'Distribuidora y acopio de gas',valor: false,categoria:'Realiza estas actividades' },
    { id: 6, descripcion: 'Transporte de gas',valor: false,categoria:'Realiza estas actividades' },
    { id: 7, descripcion: 'Ventad combustibles',valor: false,categoria:'Realiza estas actividades' },
    { id: 8, descripcion: 'Taller Mecanico e Indusstriales ',valor: false,categoria:'Realiza estas actividades' },
    { id: 9, descripcion: 'Estaciones bombeo',valor: false,categoria:'Realiza estas actividades' },
    { id: 10, descripcion: 'Extractora',valor: false,categoria:'Realiza estas actividades' },
    
    { id: 11, descripcion: 'Conocimiento de uso de Extintor',valor: false,categoria:'Cumple o no siguientes opciones ' },
    { id: 12, descripcion: 'Señalizacion segun INEN 439',valor: false,categoria:'Cumple o no siguientes opciones ' },
    { id: 13, descripcion: 'Detectores de Incendio',valor: false,categoria:'Cumple o no siguientes opciones ' },
    { id: 14, descripcion: 'Alarmar Sonoras y Visuales',valor: false,categoria:'Cumple o no siguientes opciones ' },
    { id: 15, descripcion: 'Salida de emergencia',valor: false,categoria:'Cumple o no siguientes opciones ' },
    { id: 16, descripcion: 'Pruebas de Presurisacion',valor: false,categoria:'Cumple o no siguientes opciones ' },
    { id: 17, descripcion: 'Cables y Brekes Adecuados',valor: false,categoria:'Cumple o no siguientes opciones ' },
    { id: 18, descripcion: 'Instalaciones Electricas',valor: false,categoria:'Cumple o no siguientes opciones '},
    { id: 19, descripcion: 'Gabinete contra incendios',valor: false,categoria:'Cumple o no siguientes opciones ' },
    { id: 20, descripcion: 'Plan de Contigencias',valor:false,categoria:'Cumple o no siguientes opciones ' },
    { id: 21, descripcion: 'Boton de Panico',valor: false,categoria:'Cumple o no siguientes opciones ' },
    { id: 22, descripcion: 'Plan de Emergencias',valor: false,categoria:'Cumple o no siguientes opciones ' },
    { id: 23, descripcion: 'Orden Limpieza',valor: false,categoria:'Cumple o no siguientes opciones ' },
    { id: 24, descripcion: 'Luces emergencia',valor: false,categoria:'Cumple o no siguientes opciones '},
    { id: 25, descripcion: 'Almacenamiento de GLP',valor: false,categoria:'caracteristicas de Alto riesgo' },
    { id: 26, descripcion: 'Liquidos Inflamables',valor: false,categoria:'caracteristicas de Alto riesgo' },
    { id: 27, descripcion: 'Solidos Inflamables',valor: false,categoria:'caracteristicas de Alto riesgo' },
    { id: 28, descripcion: 'otros',valor: false,categoria:'caracteristicas de Alto riesgo' },

    
  ]);
 

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
        setTelefono(data.telefono_est ? String(data.telefono_est) : '');
        setActividad(data.actividad ? String(data.actividad) : '');
        setRepresentante(data.contribuyente.representante ? String(data.contribuyente.representante) : '');
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


  const handleChange = (id) => {
    setDetalleInforme((prev) =>
      prev.map((opcion) =>
        opcion.id === id ? { ...opcion, valor: !opcion.valor } : opcion
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('numero_informe', parseInt(numero,10));
    formData.append('resultado_informe', resultado);
    formData.append('observacion',observacion);
    formData.append('recomendaciones', recomendaciones);
    formData.append('nrosocilitud', parseInt(solicitud,10));
    formData.append('establecimiento',  parseInt(establecimiento_id,10));
    formData.append('inspector',  parseInt(inspector.id,10));
    formData.append('tamano',  parseInt(tamano.id,10));
    formData.append('fecha_informe',  fecha);
    for (let pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
    try {
      
      const response = await axiosInstance.post(`/informes/listadoinfo/${establecimiento_id}/establecimiento/`, formData, {
        headers: {
         'Content-Type': 'multipart/form-data',

       },
     });
     if (response.data && response.data.id) {
       const idcreado = response.data.id; // Set idcreado from the response
       const fechaReg = response.data.fecha_informe; // Set idcreado from the response
       setFecha(fechaReg);
        setIdcreado( response.data.id);
        setResponseMessage('Datos grabados exitosamente: ' + JSON.stringify(response.data));

      // crear post detalle 
      for (const detalle of detalleinforme) {
        // Asegúrate de que 'id_informe' tenga un valor válido antes de enviar
             
        console.log(idcreado + idCreado + response.data.id + detalle.descripcion + detalle.valor + idcreado);  
          const detalleresponse = await axiosInstance.post(`/informes/DetalleI/${idCreado}/informe/`, {
            descripcion: detalle.descripcion,
            valor: detalle.valor,
            informe: idCreado,
          });
          
          console.log('Registro guardado:', detalleresponse.data);
          setResponseMessageD('Datos grabados exitosamente: ' + JSON.stringify(detalleresponse.data));
        }  
              // crear post detalle 
      for (const Extintor of rows) {
        // Asegúrate de que 'id_informe' tenga un valor válido antes de enviar
             
        
          //                                              
        const detalleEresponse = await axiosInstance.post(`/informes/DetalleE/${idCreado}/informe/`, {
            tipo: Extintor.value,
            cantidad: Extintor.cantidad,
            estado: Extintor.estado,
            capacidad: Extintor.capacidad,
            caducidad: Extintor.caducidad,
            informe: idCreado,
          });
          console.log('Registro guardado:', detalleEresponse.data);
          setDetalleExtintor(Array.isArray(detalleEresponse.data) ? detalleEresponse.data : [detalleEresponse.data]);
          
          setResponseMessageD('Datos grabados exitosamente: ' + JSON.stringify(detalleEresponse.data));
        }
        } else {
          console.error('id_informe no está definido para el registro:', detalle);
          setResponseMessageD('Error al grabar los datos: ' + error.message);
        }

     
    
      setResponseMessage('Error al grabar los datos: ' + error.message);
      
    } catch (error) {
    
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
   
    doc.text('Informe de Inspeccion Locales comerciales', 10, 40);
    doc.text(`Número de Informe: ${numero}`, 15, 50);
    
    doc.text(`RUC/CI:`, 12, 60);
    doc.text(`${EstaCont.contribuyente.ruc_cont}`, 35, 60);
    doc.text(`Razon social:`, 12, 65);
    doc.text(`${razon}`, 50, 65);
    doc.text(`Nombre Comercial:`, 12, 70);
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
    doc.text(`Categoria:`, 12, 100);
    doc.text(`${tamano.descripcion}`, 50, 100);

    doc.setFillColor(255, 0, 0); // Color rojo
    doc.rect(10, 105, 150, 1, 'F')
    
    let y = 111; // Starting Y position for details
    
    
    doc.setFontSize(10);
        // Imprime la encabezado extintor
        
        doc.setFillColor(255, 0, 0); // Color rojo
        doc.roundedRect(15, y-5, 180, 9, 3,3, 'F'); // Dibuja un rectángulo redondeado
        doc.setTextColor(255, 255, 255); // Color blanco
        doc.text(`Tipo`, 18, y);
        doc.text(`Esado`, 58, y);
        doc.text(`Cantidad`, 88, y);
        doc.text(`Capacidad`, 118, y);
        doc.text(`Caduca`, 158, y);

        y += 10; // Mueve hacia abajo para la siguiente línea
     
        doc.setTextColor(0, 0, 0); // Color negro
          for (const Ext of rows) {
        
          doc.text(`${Ext.value}`, 18, y);
          doc.text(`${Ext.estado}`, 58, y);
          doc.text(`${Ext.cantidad}`, 88, y);
          doc.text(`${Ext.capacidad}`, 118, y);
          doc.text(`${Ext.caducidad}`, 158, y);
        
          
          y += 10; // Mueve hacia abajo para la siguiente línea
        
          if (y > 270) { // Si la posición Y excede el límite de la página
            doc.addPage(); // Agrega una nueva página
            y = 10; // Reinicia la posición Y
          }
        };
      

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

    const lineHeight = 5; // Altura de cada línea
    const maxWidth = 190; // Ancho máximo del texto (ajusta según sea necesario)
    
    const observacionesLines = doc.splitTextToSize(`Observaciones: ${observacion}`, maxWidth);
doc.text(observacionesLines, 10, y);
y += observacionesLines.length * lineHeight; // Aumentar `y` según el número de líneas

 const recomendacionesLines = doc.splitTextToSize(`Recomendaciones: ${recomendaciones}`, maxWidth);
 doc.text(recomendacionesLines, 10, y);
 y += recomendacionesLines.length * lineHeight; // Aumentar `y` según el número de líneas
    
    
    y += 10; 
    doc.text('Firma Inspector' , 25, y);
          doc.text('Firma Solcitante', 100, y);
          y += 30; 
          doc.text(`____________________`, 25, y);
          doc.text(`____________________`, 100, y);
          y += 10; 
          doc.text(`Inspector: ${inspector.nombre}`, 25, y);
          doc.text(`${razon}`, 100, y);
    
    doc.save(`informe_${data.numero_informe}.pdf`);
    setRedirect(true);
};

if (redirect) {
                
  navigate(`/informes/${EstaCont.id}`);
  
  return <h2>Formulario enviado con éxito. PDF generado.</h2>;

 }

  const addRow = () => {
    setRows([...rows, { value: '' }]);
  };

  

  return (
    <div className="app"  >
      <Header opcionesmenu={opcionesmenu} />
      
    <div className='container informeadd-page' >

    <section className="infa-hero">
      <div>
        <p className="infa-kicker">Panel de creacion de informe</p>
        <p className="infa-subtitle">Complete las pestañas del formulario para registrar la inspeccion.</p>

        <div className="infa-est-grid">
          <div>
            <strong>ID Establecimiento</strong>
            <p>{EstaCont?.id || 'Sin dato'}</p>
          </div>

          <div>
            <strong>RUC / CI</strong>
            <p>{EstaCont?.contribuyente?.ruc_cont || 'Sin dato'}</p>
          </div>

          <div>
            <strong>Razon social</strong>
            <p>{EstaCont?.contribuyente?.nombre_cont || 'Contribuyente no disponible'}</p>
          </div>

          <div>
            <strong>Nombre comercial</strong>
            <p>{EstaCont?.nombre_est || 'Sin dato'}</p>
          </div>

          <div>
            <strong>Actividad</strong>
            <p>{EstaCont?.actividad || 'Sin dato'}</p>
          </div>
        </div>
      </div>

      <div className="infa-hero-actions">
        <button type="button" className="infa-action-secondary" onClick={() => navigate(`/informes/${establecimiento_id}`)}>
          Volver a informes
        </button>

        <button type="button" className="infa-action-primary" onClick={() => setActiveTab(0)}>
          Nuevo informe
        </button>
      </div>
    </section>

<div className="infa-tabs-shell">
  <div className="tabs infa-tabs" role="tablist" aria-label="Secciones del informe">
    <button type="button" role="tab" aria-selected={activeTab === 0} className={`infa-tab-button ${activeTab === 0 ? 'active' : ''}`} onClick={() => setActiveTab(0)}>
      <RiPlayListAddLine className="infa-tab-icon" /> Datos informe
    </button>
    <button type="button" role="tab" aria-selected={activeTab === 1} className={`infa-tab-button ${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>
      <FaFireExtinguisher className="infa-tab-icon" /> Extintores
    </button>
    <button type="button" role="tab" aria-selected={activeTab === 2} className={`infa-tab-button ${activeTab === 2 ? 'active' : ''}`} onClick={() => setActiveTab(2)}>
      <FaListCheck className="infa-tab-icon" /> Check list cumple
    </button>
    
  </div>

  <div className="infa-tab-tools">
    <select
      className="infa-tab-select"
      value={activeTab}
      onChange={(event) => setActiveTab(Number(event.target.value))}
      aria-label="Cambiar seccion del informe"
    >
      <option value={0}>Datos informe</option>
      <option value={1}>Extintores</option>
      <option value={2}>Check list cumple</option>
    </select>
  </div>
</div>

    <form onSubmit={handleSubmit} className="infa-form">   
      
    {activeTab === 0 && (
     <section className="infa-tab-panel"> 
      <h4 className="infa-panel-title">Datos informe</h4>
      <div className="infa-two-cols">
      <label className="infa-field infa-row-gap">
          <label>Numero del informe:</label>
          <input
            type="text"
            placeholder="Número Informe"
            value={numero}
            onChange={(e) => setNumeroInforme(e.target.value)}
          required
          />
     </label>
     <label className="infa-field">
        <label>Nro solicitud solicitado para inspeccion:</label>
        <input
          type="text"
          placeholder="Número Solicitud"
          value={solicitud}
          onChange={(e) => setNroSolicitud(e.target.value)}
          required
        />
     </label>
    </div>
    <label className="infa-field">
      <label>Fecha:</label>
      <input
        type="date"
        placeholder="Fecha"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        required
      />
      </label> 
    <div className="infa-two-cols infa-row-compact">
      <label className="infa-field">
        <label>Tamaño:</label>
        <select
         value={JSON.stringify(tamano)}
         onChange={(e) => {
          const selectedTamano = JSON.parse(e.target.value);
          setTamano(selectedTamano);
        }}
         
          required
        >
        <option value="">Seleccione un Tamaño</option>
        {tamanos.map((ins) => (
          <option key={ins.id} value={JSON.stringify({ id: ins.id, descripcion: ins.descripcion })}>
            {ins.descripcion}
          </option>
        ))}
          
        </select>
      </label>
      <label className="infa-field">
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
      </label>
      </div>
      <label className="infa-field">
      <label>Resultado (aprobado,negado,condicionado...etc):</label>   
      <input className="text-amplio"  
        type="text"
        placeholder="Resultado Informe"
        value={resultado}
        onChange={(e) => setResultadoInforme(e.target.value)}
        required
      />
      </label>
     
      <label className="infa-field">
      <label>Observaciones (explique si es necesario el resultado):</label>
      <input
        className="text-amplio" 
        type="text"
        placeholder="Observación"
        value={observacion}
        onChange={(e) => setObservacion(e.target.value)}
        required
      />
      </label>
      
      <label className="infa-field">
      <label>Recomendaciones</label>
      <textarea
        className="text-amplio" 
        placeholder="Recomendaciones"
        value={recomendaciones}
        onChange={(e) => setRecomendaciones(e.target.value)}
        required
      />
      </label>

      <div className="infa-step-actions">
        <button type="button" className="infa-prev-button" onClick={() => setActiveTab(2)}>
          Ir a Check list
        </button>
        <button type="button" className="infa-next-button" onClick={() => setActiveTab(1)}>
          Continuar a Extintores
        </button>
      </div>
      </section>
    )}
     {activeTab === 1 && (
      <section className="infa-tab-panel">
       <h4 className="infa-panel-title">Extintores</h4>
       
        <table className="infa-ext-table">
          <thead>
            <tr>
              <th >Tipo</th>
              <th >Cantidad</th>
              <th >estado</th>
              <th >Capacidad</th>
              <th >caduca</th>
               
            </tr>
          </thead>
          <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={row.value}
                  onChange={(event) => handleInputChange(index, event)}
                />
                </td>
                <td> 
                <input
                  type="text"
                  value={row.cantidad}
                  onChange={(event) => handlecantidadChange(index, event)}
                />
                 </td>
                 <td>
                <input
                  type="text"
                  value={row.estado}
                  onChange={(event) => handlestadoChange(index, event)}
                />
                 </td>
                 <td>
                <input
                  type="text"
                  value={row.capacidad}
                  onChange={(event) => handlecapacidadtChange(index, event)}
                />
                 </td>
                 <td>
                <input
                  type="date"
                  value={row.caducidad}
                  onChange={(event) => handlecaducaChange(index, event)}
                />
              </td>
            </tr>
          ))}
        </tbody> 
          </table>
          <button type="button" className="infa-add-row-button" onClick={addRow}>
             Agregar Datos otro Extintor
         </button>

         <div className="infa-step-actions">
           <button type="button" className="infa-prev-button" onClick={() => setActiveTab(0)}>
             Volver a Datos informe
           </button>
           <button type="button" className="infa-next-button" onClick={() => setActiveTab(2)}>
             Continuar a Check list
           </button>
         </div>
            
       
      </section>
     )}
   {activeTab === 2 && (
  <section className="infa-tab-panel">
  <h4 className="infa-panel-title">Check list cumple</h4>
  <div className="infa-table-scroll">
    <table className="infa-check-table">
      <thead>
        <tr>
          <th>Descripción</th>
          <th>Visto bueno</th>
        </tr>
      </thead>
      <tbody>
        {detalleinforme.map((opcion) => (
          <tr key={opcion.id}>
            <td>{opcion.descripcion}</td>
            <td>
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

  <div className="infa-step-actions">
    <button type="button" className="infa-prev-button" onClick={() => setActiveTab(0)}>
      Volver a Datos informe
    </button>
    <button type="button" className="infa-next-button" onClick={() => setActiveTab(1)}>
      Ir a Extintores
    </button>
  </div>
  </section>
)}

    <div className="infa-form-actions">
      <button className="infa-save-button" type="submit">Guardar</button>
      {responseMessage && (
        <button className="infa-pdf-button" type="button" onClick={generatePDF}>
          Generar PDF
        </button>
      )}
    </div>
    
    {error && <div className="error">{error}</div>} {/* Display error if exists */}
    </form>
    </div> 
      
    </div> 
  );
};

export default InspectionForm;