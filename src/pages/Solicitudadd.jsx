import { useEffect, useState } from "react";
import Header from "../components/Header";
import "./solicitudadd-modern.css";
import { Navigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/api";
import { jsPDF } from "jspdf";
import image1 from "../assets/logoq.jpeg";

const SolicitudConadd = () => {
  const { establecimiento_id } = useParams();
  const [redirectPath, setRedirectPath] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");

  const [fecha, setFecha] = useState("");
  const [numero, setNumero] = useState("");
  const [motivo, setMotivo] = useState("");

  const [inspector, setInspector] = useState({ id: "", nombre: "" });
  const [inspectores, setInspectores] = useState([]);

  const [estaCont, setEstaCont] = useState(null);
  const [nombre, setNombre] = useState("");
  const [razon, setRazon] = useState("");
  const [actividad, setActividad] = useState("");
  const [ci, setCi] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [referencia, setReferencia] = useState("");

  const opcionesmenu = [{ id: 1, path: "/", name: "Volver", icono: "" }];

  useEffect(() => {
    const fetchInspectores = async () => {
      try {
        const response = await axiosInstance.get("/contribuyentes/listadoins//");
        setInspectores(Array.isArray(response.data) ? response.data : []);
      } catch (requestError) {
        console.error("Error al obtener inspectores:", requestError);
      }
    };

    fetchInspectores();
  }, []);

  useEffect(() => {
    const fetchEstablecimiento = async () => {
      try {
        if (!establecimiento_id) {
          setError("establecimiento_id no esta definido");
          return;
        }

        const response = await axiosInstance.get(
          `/contribuyentes/listadoec//${establecimiento_id}/`
        );
        const data = response.data;

        setEstaCont(data);
        setNombre(data?.nombre_est ? String(data.nombre_est) : "");
        setCi(data?.contribuyente?.ruc_cont ? String(data.contribuyente.ruc_cont) : "");
        setTelefono(
          data?.contribuyente?.telefono_cont ? String(data.contribuyente.telefono_cont) : ""
        );
        setActividad(data?.actividad ? String(data.actividad) : "");
        setDireccion(data?.direccion_est ? String(data.direccion_est) : "");
        setReferencia(data?.refeencia_est ? String(data.refeencia_est) : "");
        setRazon(data?.contribuyente?.nombre_cont ? String(data.contribuyente.nombre_cont) : "");
        setCorreo(data?.contribuyente?.email_cont ? String(data.contribuyente.email_cont) : "");
      } catch (requestError) {
        console.error("Error al obtener establecimiento:", requestError);
        setError("No se pudieron cargar los datos del establecimiento");
      }
    };

    fetchEstablecimiento();
  }, [establecimiento_id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("fecha_solicitud", JSON.stringify(fecha));
    formData.append("numero_soicitud", numero);
    formData.append("motivo", JSON.stringify(motivo));
    formData.append("establecimiento", establecimiento_id);

    try {
      const response = await axiosInstance.post(
        "/contribuyentes/listadoSolicitud//",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResponseMessage(`Datos grabados exitosamente: ${JSON.stringify(response.data)}`);
    } catch (requestError) {
      setResponseMessage(`Error al grabar los datos: ${requestError.message}`);
      setError("No se pudo guardar la solicitud");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const logo = new Image();
    logo.src = image1;

    doc.addImage(logo, "PNG", 2, 2, 40, 25);
    doc.setFillColor(255, 0, 0);
    doc.rect(45, 5, 145, 22, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("Cuerpo de Bomberos Quininde", 70, 14);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFillColor(200, 200, 200);
    doc.roundedRect(30, 35, 160, 25, 5, 5, "F");

    doc.setTextColor(255, 0, 0);
    const text = "SOLICITUD DE INSPECCION DE PERMISO DE";
    const textWidth = doc.getTextWidth(text);
    const x = (doc.internal.pageSize.width - textWidth) / 2;

    doc.text(text, x, 40);
    doc.text("FUNCIONAMIENTO ANO 2025", 80, 50);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text("Fecha:", 15, 70);
    doc.text(`${fecha}`, 50, 70);
    doc.text("Numero de Solicitud:", 15, 80);
    doc.text(`${numero}`, 60, 80);

    doc.setFillColor(200, 200, 200);
    doc.setTextColor(255, 0, 0);
    const x2 =
      (doc.internal.pageSize.width -
        doc.getTextWidth("DATOS DEL REPRESENTANTE LEGAL, GERENTE O PROPIETARIO")) /
      2;
    doc.roundedRect(30, 87, 160, 12, 5, 5, "F");
    doc.text("DATOS DEL REPRESENTANTE LEGAL, GERENTE O PROPIETARIO", x2, 95);

    doc.setTextColor(0, 0, 0);
    doc.text("NOMBRES Y APELLIDOS:", 15, 110);
    doc.text(`${razon}`, 70, 110);
    doc.text("CI:", 15, 120);
    doc.text(`${ci}`, 70, 120);
    doc.text("TELEFONO:", 140, 120);
    doc.text(`${telefono}`, 180, 120);

    doc.setFillColor(200, 200, 200);
    doc.setTextColor(255, 0, 0);
    const x3 =
      (doc.internal.pageSize.width - doc.getTextWidth("DATOS DEL INMUEBLE A INSPECCIONAR")) / 2;
    doc.roundedRect(30, 127, 160, 12, 5, 5, "F");
    doc.text("DATOS DEL INMUEBLE A INSPECCIONAR", x3, 135);

    doc.setTextColor(0, 0, 0);
    doc.text("Razon Social:", 15, 145);
    doc.text(`${nombre}`, 45, 145);
    doc.text("Direccion Local:", 15, 150);
    doc.text(`${direccion}`, 45, 150);
    doc.text("Referencia:", 15, 155);
    doc.text(`${referencia}`, 45, 155);
    doc.text("Correo:", 15, 160);
    doc.text(`${correo}`, 45, 160);
    doc.text("Actividad:", 25, 165);
    doc.text(`${actividad}`, 45, 165);

    doc.setFillColor(200, 200, 200);
    doc.setTextColor(255, 0, 0);
    const x4 =
      (doc.internal.pageSize.width - doc.getTextWidth("OBSERVACION MOTIVO INSPECCION")) / 2;
    doc.roundedRect(30, 168, 160, 12, 5, 5, "F");
    doc.text("OBSERVACION MOTIVO INSPECCION", x4, 175);

    doc.setTextColor(0, 0, 0);
    doc.text(`${motivo}`, 20, 185);
    doc.text("Firma Inspector", 25, 210);
    doc.text("Firma Solicitante", 100, 210);
    doc.text("____________________", 25, 230);
    doc.text("____________________", 100, 230);
    doc.text(`Inspector: ${inspector.nombre}`, 25, 235);
    doc.text(`${razon}`, 100, 235);

    doc.save("inspeccion_permiso.pdf");

    const rucCont = estaCont?.contribuyente?.ruc_cont;
    if (rucCont) {
      setRedirectPath(`/establecimientos/${rucCont}`);
    }
  };

  if (redirectPath) {
    return <Navigate to={redirectPath} />;
  }

  return (
    <div className="app">
      <Header opcionesmenu={opcionesmenu} />

      <div className="container soladd-page">
        <section className="soladd-hero">
          <div>
            <p className="soladd-kicker">Panel de solicitud</p>
            <h2>Solicitud de inspeccion para locales comerciales</h2>
            <p className="soladd-subtitle">
              Complete la solicitud y genere el PDF para el tramite del permiso de funcionamiento.
            </p>

            <div className="soladd-meta-grid">
              <div>
                <strong>ID establecimiento</strong>
                <p>{estaCont?.id || "Sin dato"}</p>
              </div>
              <div>
                <strong>Contribuyente</strong>
                <p>{estaCont?.contribuyente?.nombre_cont || "No disponible"}</p>
              </div>
              <div>
                <strong>Actividad</strong>
                <p>{estaCont?.actividad || "Sin dato"}</p>
              </div>
            </div>
          </div>

          <div className="soladd-hero-actions">
            <button
              type="button"
              className="soladd-secondary-button"
              onClick={() => setRedirectPath(estaCont?.contribuyente?.ruc_cont ? `/establecimientos/${estaCont.contribuyente.ruc_cont}` : "")}
            >
              Volver
            </button>
            <button type="submit" form="soladd-form" className="soladd-primary-button" disabled={Boolean(responseMessage)}>
              Guardar solicitud
            </button>
          </div>
        </section>

        <section className="soladd-form-shell">
          <form id="soladd-form" onSubmit={handleSubmit} className="soladd-form-grid">
            <label className="soladd-field">
              <span>Numero solicitud</span>
              <input
                type="text"
                placeholder="Numero"
                value={numero}
                onChange={(event) => setNumero(event.target.value)}
                required
              />
            </label>

            <label className="soladd-field">
              <span>Fecha</span>
              <input
                type="date"
                value={fecha}
                onChange={(event) => setFecha(event.target.value)}
                required
              />
            </label>

            <label className="soladd-field soladd-field-full">
              <span>Motivo</span>
              <input
                type="text"
                placeholder="Motivo"
                value={motivo}
                onChange={(event) => setMotivo(event.target.value)}
                required
              />
            </label>

            <label className="soladd-field soladd-field-full">
              <span>Inspector</span>
              <select
                value={JSON.stringify(inspector)}
                onChange={(event) => {
                  const selectedInspector = JSON.parse(event.target.value);
                  setInspector(selectedInspector);
                }}
                required
              >
                <option value="">Seleccione un inspector</option>
                {inspectores.map((item) => (
                  <option
                    key={item.id}
                    value={JSON.stringify({ id: item.id, nombre: item.nombre_insp })}
                  >
                    {item.nombre_insp}
                  </option>
                ))}
              </select>
            </label>
          </form>

          {responseMessage && (
            <div className="soladd-actions-row">
              <p className="soladd-info-banner">{responseMessage}</p>
              <button type="button" className="soladd-primary-button" onClick={generatePDF}>
                Generar PDF
              </button>
            </div>
          )}

          {error && <p className="soladd-info-banner soladd-info-error">{error}</p>}
        </section>
      </div>
    </div>
  );
};

export default SolicitudConadd;
