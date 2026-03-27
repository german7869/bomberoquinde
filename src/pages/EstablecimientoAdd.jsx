import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import "./form.css";
import "./establecimientoadd.css";
import { Navigate, Link, useParams } from "react-router-dom";
import axiosInstance from "../utils/api";

const getArrayFromResponse = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data?.results)) {
    return payload.data.results;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
};

const EstablecimientoForm = () => {
  const { contribuyente_id } = useParams();

  const [responseMessage, setResponseMessage] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [referencia, setReferencia] = useState("");
  const [tipo, setTipo] = useState("");
  const [actividad, setActividad] = useState("");
  const [parroquia, setParroquia] = useState("");
  const [parroquias, setParroquias] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);

  const opcionesmenu = [];

  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        setLoadingCatalogs(true);
        const [parroquiasResponse, tiposResponse] = await Promise.all([
          axiosInstance.get("/contribuyentes/listadopar//"),
          axiosInstance.get("/contribuyentes/listadotip//"),
        ]);

        setParroquias(getArrayFromResponse(parroquiasResponse.data));
        setTipos(getArrayFromResponse(tiposResponse.data));
      } catch (error) {
        console.error("Error cargando catalogos", error);
      } finally {
        setLoadingCatalogs(false);
      }
    };

    loadCatalogs();
  }, []);

  const tiposActivos = useMemo(() => (Array.isArray(tipos) ? tipos : []), [tipos]);
  const parroquiasActivas = useMemo(
    () => (Array.isArray(parroquias) ? parroquias : []),
    [parroquias]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("nombre_est", nombre);
    formData.append("direccion_est", direccion);
    formData.append("referencia_est", referencia);
    formData.append("actividad", actividad);
    formData.append("tipo_negocio", tipo);
    formData.append("parroquia", parseInt(parroquia, 10));
    formData.append("contribuyente", contribuyente_id);

    try {
      const response = await axiosInstance.post("/contribuyentes/listadoe//", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResponseMessage(`Datos grabados exitosamente: ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.error("Error al guardar establecimiento", error);
      setResponseMessage(`Error al grabar los datos: ${error.message}`);
    }
  };

  if (responseMessage && !responseMessage.toLowerCase().startsWith("error")) {
    return <Navigate to={`/establecimientos/${contribuyente_id}`} />;
  }

  return (
    <div className="app">
      <Header opcionesmenu={opcionesmenu} />

      <div className="container estadd-page">
        <section className="estadd-hero">
          <div>
            <p className="estadd-kicker">Panel de nuevo establecimiento</p>
            <p className="estadd-subtitle">
              Registre la informacion del establecimiento para el contribuyente seleccionado.
            </p>

            <div className="estadd-meta-grid">
              <div>
                <strong>Contribuyente ID</strong>
                <p>{contribuyente_id}</p>
              </div>

              <div>
                <strong>Tipos de negocio</strong>
                <p>{tiposActivos.length}</p>
              </div>

              <div>
                <strong>Parroquias</strong>
                <p>{parroquiasActivas.length}</p>
              </div>
            </div>
          </div>

          <div className="estadd-hero-actions">
            <Link to={`/establecimientos/${contribuyente_id}`} className="estadd-secondary-button">
              Volver a establecimientos
            </Link>
            <button type="submit" form="estadd-form" className="estadd-primary-button">
              Guardar establecimiento
            </button>
          </div>
        </section>

        <section className="estadd-form-shell">
          {loadingCatalogs && <p className="estadd-info-banner">Cargando catalogos...</p>}

          <form id="estadd-form" onSubmit={handleSubmit} className="estadd-form-grid">
            <label className="estadd-field">
              <span>Nombre comercial</span>
              <input
                type="text"
                placeholder="Nombre del establecimiento"
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                required
              />
            </label>

            <label className="estadd-field">
              <span>Direccion</span>
              <input
                type="text"
                placeholder="Direccion"
                value={direccion}
                onChange={(event) => setDireccion(event.target.value)}
                required
              />
            </label>

            <label className="estadd-field estadd-field-full">
              <span>Referencia</span>
              <input
                type="text"
                placeholder="Referencia de ubicacion"
                value={referencia}
                onChange={(event) => setReferencia(event.target.value)}
                required
              />
            </label>

            <label className="estadd-field estadd-field-full">
              <span>Actividad (segun SRI)</span>
              <input
                type="text"
                placeholder="Actividad"
                value={actividad}
                onChange={(event) => setActividad(event.target.value)}
                required
              />
            </label>

            <label className="estadd-field">
              <span>Tipo de negocio</span>
              <select value={tipo} onChange={(event) => setTipo(event.target.value)} required>
                <option value="">Seleccione un tipo</option>
                {tiposActivos.map((item) => (
                  <option key={item.codigo} value={item.codigo}>
                    {item.nombre_tip} {item.precio ? `- ${item.precio}` : ""}
                  </option>
                ))}
              </select>
            </label>

            <label className="estadd-field">
              <span>Parroquia</span>
              <select value={parroquia} onChange={(event) => setParroquia(event.target.value)} required>
                <option value="">Seleccione una parroquia</option>
                {parroquiasActivas.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre}
                  </option>
                ))}
              </select>
            </label>
          </form>

          {responseMessage && responseMessage.toLowerCase().startsWith("error") && (
            <p className="estadd-info-banner estadd-info-error">{responseMessage}</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default EstablecimientoForm;
