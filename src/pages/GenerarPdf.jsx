import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import axiosInstance from '../utils/api';
import { useParams } from 'react-router-dom';

const PdfGenerator = () => {
    const { informe_id } = useParams();
    const [informes, setInformes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInformes = async () => {
            try {
                const response = await axiosInstance.get(`/informes/listadoinfo//${informe_id}/`);
                setInformes(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchInformes();
    }, [informe_id]);

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Datos obtenidos de la API:', 10, 10);

        if (Array.isArray(informes) && informes.length > 0) {
            informes.forEach((item, index) => {
                const yPosition = 20 + (index * 30);
                doc.text(`Informe #${item.numero_informe}`, 10, yPosition);
                doc.text(`Fecha: ${item.fecha_informe}`, 10, yPosition + 5);
                doc.text(`Resultado: ${item.resultado_informe}`, 10, yPosition + 10);
                doc.text(`Observación: ${item.observacion || 'N/A'}`, 10, yPosition + 15);
                doc.text(`Recomendaciones: ${item.recomendaciones || 'N/A'}`, 10, yPosition + 20);
            });
        } else {
            doc.text('No se encontraron informes disponibles.', 10, 20);
        }

        doc.save('data.pdf');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching data: {error.message}</div>;

    return (
        <div>
            <h1>Generador de PDF</h1>
            <button onClick={generatePDF}>Generar PDF</button>
            <div>
                <h2>Datos:</h2>
                <pre>{JSON.stringify(informes, null, 2)}</pre>
            </div>
        </div>
    );
};

export default PdfGenerator;