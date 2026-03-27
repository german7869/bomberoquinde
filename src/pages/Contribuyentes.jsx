import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBuilding,
  FaChartBar,
  FaClipboardList,
  FaDownload,
  FaEdit,
  FaFire,
  FaHardHat,
  FaHistory,
  FaMapMarkedAlt,
  FaSearch,
  FaUserPlus,
  FaUsers,
} from "react-icons/fa";

import Header from "../components/Header";
import axiosInstance from "../utils/api";

import "./contribuyentes.css";

const normalizeText = (value) =>
  value
    ?.toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim() || "";

const compareValues = (left, right, direction = "asc") => {
  if (left === right) {
    return 0;
  }

  if (left == null || left === "") {
    return direction === "asc" ? 1 : -1;
  }

  if (right == null || right === "") {
    return direction === "asc" ? -1 : 1;
  }

  if (left > right) {
    return direction === "asc" ? 1 : -1;
  }

  return direction === "asc" ? -1 : 1;
};

const getArrayFromResponse = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data?.results)) {
    return payload.data.results;
  }

  if (Array.isArray(payload?.data?.contribuyentes)) {
    return payload.data.contribuyentes;
  }

  if (Array.isArray(payload?.data?.parroquias)) {
    return payload.data.parroquias;
  }

  if (Array.isArray(payload?.payload?.results)) {
    return payload.payload.results;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.contribuyentes)) {
    return payload.contribuyentes;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
};

const normalizeContribuyente = (item) => ({
  ...item,
  ruc_cont: item?.ruc_cont ?? item?.ruc ?? item?.ci ?? "",
  nombre_cont: item?.nombre_cont ?? item?.nombre ?? item?.razon_social ?? "",
  direccion_cont: item?.direccion_cont ?? item?.direccion ?? item?.direccion_est ?? "",
  representante: item?.representante ?? item?.propietario ?? "",
  parroquia_id: item?.parroquia_id ?? item?.parroquia ?? item?.parroquiaId ?? "",
});

const normalizeParroquia = (item) => ({
  ...item,
  id: item?.id ?? item?.codigo ?? item?.parroquia_id ?? "",
  nombre: item?.nombre ?? item?.nombre_parroquia ?? "Sin parroquia",
});

const fetchJson = async (url) => {
  const response = await fetch(url, { method: "GET" });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
};

const Contribuyentes = () => {
  const [data, setData] = useState([]);
  const [parroquias, setParroquias] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingParroquias, setLoadingParroquias] = useState(true);
  const [errorData, setErrorData] = useState("");
  const [errorParroquias, setErrorParroquias] = useState("");
  const [nombreFilter, setNombreFilter] = useState("");
  const [direccionFilter, setDireccionFilter] = useState("");
  const [parroquiaFilter, setParroquiaFilter] = useState("");
  const [sortBy, setSortBy] = useState("nombre");
  const [sortDirection, setSortDirection] = useState("asc");

  const opcionesmenu = [
    { id: 1, path: "/dashboard", name: "Dashboard", icono: FaChartBar },
    { id: 2, path: "/contribuyentes", name: "Contribuyentes", icono: FaUsers },
    { id: 3, path: "/ListInformes", name: "Informes", icono: FaClipboardList },
    { id: 4, path: "/ListSolicitud", name: "Solicitudes", icono: FaFire },
    { id: 5, path: "/ListSolicitudCon", name: "Construccion", icono: FaHardHat },
    { id: 6, path: "/Listinspectores", name: "Inspectores", icono: FaUsers },
    { id: 7, path: "/reportes-inspectores", name: "Reportes", icono: FaChartBar },
    { id: 8, path: "/establecimientoslist", name: "Establecimientos", icono: FaBuilding },
  ];

  useEffect(() => {
    setLoadingData(true);
    setErrorData("");

    const loadContribuyentes = async () => {
      try {
        const response = await axiosInstance.get("/contribuyentes/listadoC//");
        const records = getArrayFromResponse(response.data).map(normalizeContribuyente);

        if (records.length > 0) {
          setData(records);
          return;
        }

        // Fallback when axios payload shape is unexpected in runtime.
        const fallbackPayload = await fetchJson(
          "https://api-bomberos-h6qj.onrender.com/contribuyentes/listadoC//"
        );
        const fallbackRecords = getArrayFromResponse(fallbackPayload).map(
          normalizeContribuyente
        );
        setData(fallbackRecords);
      } catch (error) {
        try {
          const fallbackPayload = await fetchJson(
            "https://api-bomberos-h6qj.onrender.com/contribuyentes/listadoC//"
          );
          const fallbackRecords = getArrayFromResponse(fallbackPayload).map(
            normalizeContribuyente
          );
          setData(fallbackRecords);
          setErrorData("");
        } catch (fallbackError) {
          setErrorData("No se pudo cargar el listado de contribuyentes.");
          console.error("Error cargando contribuyentes", error);
          console.error("Error fallback contribuyentes", fallbackError);
        }
      } finally {
        setLoadingData(false);
      }
    };

    loadContribuyentes();
  }, []);

  useEffect(() => {
    setLoadingParroquias(true);
    setErrorParroquias("");

    const loadParroquias = async () => {
      try {
        const response = await axiosInstance.get("/contribuyentes/listadopar//");
        const records = getArrayFromResponse(response.data).map(normalizeParroquia);

        if (records.length > 0) {
          setParroquias(records);
          return;
        }

        const fallbackPayload = await fetchJson(
          "https://api-bomberos-h6qj.onrender.com/contribuyentes/listadopar//"
        );
        const fallbackRecords = getArrayFromResponse(fallbackPayload).map(
          normalizeParroquia
        );
        setParroquias(fallbackRecords);
      } catch (error) {
        try {
          const fallbackPayload = await fetchJson(
            "https://api-bomberos-h6qj.onrender.com/contribuyentes/listadopar//"
          );
          const fallbackRecords = getArrayFromResponse(fallbackPayload).map(
            normalizeParroquia
          );
          setParroquias(fallbackRecords);
          setErrorParroquias("");
        } catch (fallbackError) {
          setErrorParroquias("No se pudieron cargar las parroquias.");
          console.error("Error cargando parroquias", error);
          console.error("Error fallback parroquias", fallbackError);
        }
      } finally {
        setLoadingParroquias(false);
      }
    };

    loadParroquias();
  }, []);

  const parroquiaMap = useMemo(
    () =>
      parroquias.reduce((accumulator, item) => {
        accumulator[String(item.id)] = item.nombre;
        return accumulator;
      }, {}),
    [parroquias]
  );

  const getNombreParroquia = (id) => parroquiaMap[String(id)] || "Sin parroquia";

  const filtered = useMemo(() => {
    const normalizedNombre = normalizeText(nombreFilter);
    const normalizedDireccion = normalizeText(direccionFilter);
    const safeData = Array.isArray(data) ? data : [];

    return safeData.filter((item) => {
      const matchesNombre =
        !normalizedNombre || normalizeText(item.nombre_cont).includes(normalizedNombre);
      const matchesDireccion =
        !normalizedDireccion ||
        normalizeText(item.direccion_cont).includes(normalizedDireccion);
      const matchesParroquia =
        !parroquiaFilter || String(item.parroquia_id) === String(parroquiaFilter);

      return matchesNombre && matchesDireccion && matchesParroquia;
    });
  }, [data, direccionFilter, nombreFilter, parroquiaFilter]);

  const sortedItems = useMemo(() => {
    const items = [...filtered];

    items.sort((left, right) => {
      if (sortBy === "direccion") {
        return compareValues(
          normalizeText(left.direccion_cont),
          normalizeText(right.direccion_cont),
          sortDirection
        );
      }

      if (sortBy === "parroquia") {
        return compareValues(
          normalizeText(getNombreParroquia(left.parroquia_id)),
          normalizeText(getNombreParroquia(right.parroquia_id)),
          sortDirection
        );
      }

      if (sortBy === "ruc") {
        return compareValues(
          normalizeText(left.ruc_cont),
          normalizeText(right.ruc_cont),
          sortDirection
        );
      }

      return compareValues(
        normalizeText(left.nombre_cont),
        normalizeText(right.nombre_cont),
        sortDirection
      );
    });

    return items;
  }, [filtered, getNombreParroquia, sortBy, sortDirection]);

  const currentItems = sortedItems;

  const totalsByParroquia = useMemo(() => {
    const grouped = sortedItems.reduce((accumulator, item) => {
      const key = getNombreParroquia(item.parroquia_id);
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {});

    return Object.entries(grouped).sort((a, b) =>
      a[0].localeCompare(b[0], "es", { sensitivity: "base" })
    );
  }, [getNombreParroquia, sortedItems]);

  const exportToCsv = () => {
    if (sortedItems.length === 0) {
      window.alert("No hay contribuyentes filtrados para exportar.");
      return;
    }

    const headers = ["RUC / CI", "Nombre", "Direccion", "Representante", "Parroquia"];
    const csvContent = [
      headers.join(","),
      ...sortedItems.map((item) =>
        [
          item.ruc_cont || "",
          item.nombre_cont || "",
          item.direccion_cont || "",
          item.representante || "",
          getNombreParroquia(item.parroquia_id),
        ]
          .map((value) => `"${`${value}`.replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `contribuyentes-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setNombreFilter("");
    setDireccionFilter("");
    setParroquiaFilter("");
    setSortBy("nombre");
    setSortDirection("asc");
  };

  const isLoading = loadingData || loadingParroquias;
  const hasError = Boolean(errorData || errorParroquias);
  const infoMessage = errorData || errorParroquias;
  const hasNoData = !isLoading && !hasError && data.length === 0;

  return (
    <div className="app">
      <Header opcionesmenu={opcionesmenu} />

      <div className="container contribuyentes-page">
        <section className="cont-hero">
          <div>
            <p className="cont-kicker">Panel general de contribuyentes</p>
            
            <p className="cont-subtitle">
              Consulte rapidamente la base de contribuyentes y la distribucion por
              parroquia sobre el filtro activo.
            </p>
          </div>

          <div className="cont-hero-side">
            <div className="cont-hero-actions">
              <button type="button" className="cont-export-button" onClick={exportToCsv}>
                <FaDownload />
                <span>Exportar CSV</span>
              </button>

              <Link to="/contribuyentesadd" className="cont-add-button">
                <FaUserPlus />
                <span>Nuevo contribuyente</span>
              </Link>
            </div>

            <section className="cont-stats-grid">
              <article className="cont-stat-card">
                <span>Total registrado</span>
                <strong>{data.length}</strong>
              </article>

              <article className="cont-stat-card cont-stat-card-accent">
                <span>Total filtrado</span>
                <strong>{sortedItems.length}</strong>
              </article>

              <article className="cont-stat-card">
                <span>Parroquias presentes</span>
                <strong>{totalsByParroquia.length}</strong>
              </article>
            </section>
          </div>
        </section>

        {isLoading && <p className="cont-info-banner">Cargando contribuyentes...</p>}
        {!isLoading && hasError && <p className="cont-info-banner cont-info-error">{infoMessage}</p>}
        {hasNoData && (
          <p className="cont-info-banner">
            El servicio respondio sin registros. Verifique si existen contribuyentes activos.
          </p>
        )}

        <section className="cont-filter-panel">
          <label className="cont-filter-group cont-search-group">
            <span>Nombre</span>
            <div className="cont-search-field">
              <FaSearch />
              <input
                type="text"
                placeholder="Buscar por nombre o razon social"
                value={nombreFilter}
                onChange={(event) => setNombreFilter(event.target.value)}
              />
            </div>
          </label>

          <label className="cont-filter-group cont-search-group">
            <span>Direccion</span>
            <div className="cont-search-field">
              <FaMapMarkedAlt />
              <input
                type="text"
                placeholder="Filtrar por direccion"
                value={direccionFilter}
                onChange={(event) => setDireccionFilter(event.target.value)}
              />
            </div>
          </label>

          <label className="cont-filter-group">
            <span>Parroquia</span>
            <select
              value={parroquiaFilter}
              onChange={(event) => setParroquiaFilter(event.target.value)}
            >
              <option value="">Todas</option>
              {parroquias.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="cont-filter-group">
            <span>Ordenar por</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="nombre">Nombre</option>
              <option value="direccion">Direccion</option>
              <option value="parroquia">Parroquia</option>
              <option value="ruc">RUC / CI</option>
            </select>
          </label>

          <label className="cont-filter-group">
            <span>Direccion orden</span>
            <select
              value={sortDirection}
              onChange={(event) => setSortDirection(event.target.value)}
            >
              <option value="asc">Ascendente</option>
              <option value="desc">Descendente</option>
            </select>
          </label>

          <button type="button" className="cont-clear-button" onClick={clearFilters}>
            Limpiar filtros
          </button>
        </section>

        <div className="cont-table-wrapper">
          {/* Tabla de contribuyentes con estilos originales restaurados */}
          <table className="cont-table" aria-label="Listado de contribuyentes">
            <thead>
              <tr>
                <th>RUC / CI</th>
                <th>Nombre</th>
                <th>Direccion</th>
                <th>Representante</th>
                <th>Parroquia</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td className="cont-empty-state" colSpan={6}>
                    No hay contribuyentes que coincidan con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.ruc_cont}>
                    <td>{item.ruc_cont}</td>
                    <td>
                      <Link to={`/establecimientos/${item.ruc_cont}`}>{item.nombre_cont}</Link>
                    </td>
                    <td>{item.direccion_cont || "Sin direccion"}</td>
                    <td>{item.representante || "Sin representante"}</td>
                    <td>{getNombreParroquia(item.parroquia_id)}</td>
                    <td className="cont-actions">
                      <Link to={`/contribuyentesadd/${item.ruc_cont}`} title="Editar">
                        <FaEdit />
                      </Link>
                      <Link to={`/establecimientos/${item.ruc_cont}`} title="Establecimientos">
                        <FaBuilding />
                      </Link>
                      <Link to={`/solicitudadd/${item.ruc_cont}`} title="Solicitud">
                        <FaFire />
                      </Link>
                      <Link to={`/solicitudConadd/${item.ruc_cont}`} title="Construccion">
                        <FaHardHat />
                      </Link>
                      <Link to={`/historial-permisos/${item.ruc_cont}`} title="Historial">
                        <FaHistory />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="cont-grid-footer">
            <span>Total de contribuyentes filtrados</span>
            <strong>{sortedItems.length}</strong>
          </div>
        </div>

        <section className="cont-breakdown-panel">
          <div className="cont-breakdown-header">
            <h3>Total por parroquia</h3>
          </div>

          <div className="cont-breakdown-list">
            {totalsByParroquia.length === 0 ? (
              <p className="cont-empty-breakdown">Sin datos para mostrar.</p>
            ) : (
              totalsByParroquia.map(([parroquia, total]) => (
                <article key={parroquia} className="cont-breakdown-item">
                  <span>{parroquia}</span>
                  <strong>{total}</strong>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contribuyentes;