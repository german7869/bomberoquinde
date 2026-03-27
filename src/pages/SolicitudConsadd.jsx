import { useEffect, useState } from "react";
import Header from "../components/Header";
import "./solicitudconsadd-modern.css";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/api";
import { jsPDF } from "jspdf";
import image1 from "../assets/logoq.jpeg";

const SolicitudConadd = () => {
  const { contribuyente_id } = useParams();
  const [redirect, setRedirect] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");

  const [fecha, setFecha] = useState("");
  const [numero, setNumero] = useState("");
  const [motivo, setMotivo] = useState("");

  const [inspector, setInspector] = useState({ id: "", nombre: "" });
  const [inspectores, setInspectores] = useState([]);

  const [contribuyente, setContribuyente] = useState(null);
  const [nombre, setNombre] = useState("");
  const [ci, setCi] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");

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
    const fetchContribuyente = async () => {
      try {
        if (!contribuyente_id) {
          setError("contribuyente_id no esta definido");
          return;
        }

        const response = await axiosInstance.get(
          `/contribuyentes/listadoC//${contribuyente_id}/`
        );

        const data = response.data;
        setContribuyente(data);
        setNombre(data?.nombre_cont ? String(data.nombre_cont) : "");
        setCi(data?.ruc_cont ? String(data.ruc_cont) : "");
        setTelefono(data?.telefono_cont ? String(data.telefono_cont) : "");
        setDireccion(data?.direccion_cont ? String(data.direccion_cont) : "");
        setCorreo(data?.email_cont ? String(data.email_cont) : "");
      } catch (requestError) {
        console.error("Error al obtener contribuyente:", requestError);
        setError("No se pudieron cargar los datos del contribuyente");
      }
    };

    fetchContribuyente();
  }, [contribuyente_id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("fecha_solicitud", JSON.stringify(fecha));
    formData.append("numero_soicitud", numero);
    formData.append("motivo", JSON.stringify(motivo));
    formData.append("contribuyente", contribuyente_id);

    try {
      const response = await axiosInstance.post(
        "/contribuyentes/listadoSolicitudcons//",
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
    doc.text("Cuerpo de Bomberos Quinide", 70, 14);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFillColor(200, 200, 200);
    doc.roundedRect(30, 35, 160, 20, 5, 5, "F");

    doc.setTextColor(255, 0, 0);
    const text = "SOLICITUD DE INSPECCION DE PERMISO DE";
    const textWidth = doc.getTextWidth(text);
    const x = (doc.internal.pageSize.width - textWidth) / 2;

    doc.text(text, x, 40);
    doc.text("CONTRUCCION", 80, 50);

    doc.setTextColor(0, 0, 0);
    doc.text("Fecha:", 15, 70);
    doc.text(`${fecha}`, 55, 70);
    doc.text("Numero de solicitud:", 15, 80);
    doc.text(`${numero}`, 55, 80);

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
    doc.text(`${nombre}`, 70, 110);
    doc.text("CI:", 15, 120);
    doc.text(`${ci}`, 70, 120);
    doc.text("TELEFONO:", 120, 120);
    doc.text(`${telefono}`, 150, 120);
    doc.text("Direccion Local:", 15, 130);
    doc.text(`${direccion}`, 70, 130);
    doc.text("Correo:", 15, 135);
    doc.text(`${correo}`, 70, 135);

    doc.setFillColor(200, 200, 200);
    doc.setTextColor(255, 0, 0);
    const x4 =
      (doc.internal.pageSize.width - doc.getTextWidth("OBSERVACION MOTIVO INSPECCION")) / 2;
    doc.roundedRect(30, 148, 160, 11, 5, 5, "F");
    doc.text("OBSERVACION MOTIVO INSPECCION", x4, 155);

    doc.setTextColor(0, 0, 0);
    doc.text(`${motivo}`, 20, 175);
    doc.text("Firma Inspector", 25, 210);
    doc.text("Firma Solcitante", 100, 210);
    doc.text("____________________", 25, 230);
    doc.text("____________________", 100, 230);
    doc.text(`Inspector: ${inspector.nombre}`, 25, 235);
    doc.text(`${nombre}`, 100, 235);

    doc.save("inspeccion_permiso.pdf");

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl);
    setRedirect(true);
  };

  if (redirect) {
    return <h2>Formulario enviado con exito. PDF generado.</h2>;
  }

  return (
    <div className="app">
      <Header opcionesmenu={opcionesmenu} />

      <div className="container solcons-page">
        <section className="solcons-hero">
          <div>
            <p className="solcons-kicker">Panel de solicitud</p>
            <h2>Solicitud de inspeccion para permisos de construccion</h2>
            <p className="solcons-subtitle">
              Complete los datos de la solicitud y genere el PDF para continuar el tramite.
            </p>

            <div className="solcons-meta-grid">
              <div>
                <strong>ID contribuyente</strong>
                <p>{contribuyente?.ruc_cont || "Sin dato"}</p>
              </div>
              <div>
                <strong>Nombre</strong>
                <p>{contribuyente?.nombre_cont || "Sin dato"}</p>
              </div>
              <div>
                <strong>Telefono</strong>
                <p>{contribuyente?.telefono_cont || "Sin dato"}</p>
              </div>
            </div>
          </div>

          <div className="solcons-hero-actions">
            <button type="submit" form="solcons-form" className="solcons-primary-button" disabled={Boolean(responseMessage)}>
              Guardar solicitud
            </button>
          </div>
        </section>

        <section className="solcons-form-shell">
          <form id="solcons-form" onSubmit={handleSubmit} className="solcons-form-grid">
            <label className="solcons-field">
              <span>Numero solicitud</span>
              <input
                type="text"
                placeholder="Numero"
                value={numero}
                onChange={(event) => setNumero(event.target.value)}
                required
              />
            </label>

            <label className="solcons-field">
              <span>Fecha</span>
              <input
                type="date"
                value={fecha}
                onChange={(event) => setFecha(event.target.value)}
                required
              />
            </label>

            <label className="solcons-field solcons-field-full">
              <span>Motivo</span>
              <input
                type="text"
                placeholder="Motivo"
                value={motivo}
                onChange={(event) => setMotivo(event.target.value)}
                required
              />
            </label>

            <label className="solcons-field solcons-field-full">
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
            <div className="solcons-actions-row">
              <p className="solcons-info-banner">{responseMessage}</p>
              <button type="button" className="solcons-primary-button" onClick={generatePDF}>
                Generar PDF
              </button>
            </div>
          )}

          {error && <p className="solcons-info-banner solcons-info-error">{error}</p>}
        </section>
      </div>
    </div>
  );
};

export default SolicitudConadd;
