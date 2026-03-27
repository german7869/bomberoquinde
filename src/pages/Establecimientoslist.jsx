import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChartBar,
  FaClipboardList,
  FaDownload,
  FaFire,
  FaHardHat,
  FaSearch,
  FaUsers,
} from "react-icons/fa";
import { MdDeleteForever, MdEdit } from "react-icons/md";

import Header from "../components/Header";
import axiosInstance from "../utils/api";

import "./page.css";
import "./establecimiento.css";

const itemsPerPage = 8;

const normalizeText = (value) =>
  value
    ?.toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim() || "";

const normalizeDate = (value) => {
  if (!value) {
    return "";
  }

  const rawValue = value.toString().trim();
  const isoMatch = rawValue.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  const localMatch = rawValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (localMatch) {
    return `${localMatch[3]}-${localMatch[2]}-${localMatch[1]}`;
  }

  const parsedDate = new Date(rawValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const year = parsedDate.getFullYear();
  const month = `${parsedDate.getMonth() + 1}`.padStart(2, "0");
  const day = `${parsedDate.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = (value) => {
  const normalized = normalizeDate(value);

  if (!normalized) {
    return value || "Sin fecha";
  }

  const [year, month, day] = normalized.split("-");
  return `${day}/${month}/${year}`;
};

const getEstadoClassName = (estado) => {
  const normalized = normalizeText(estado);

  if (
    normalized.includes("cerr") ||
    normalized.includes("inactivo") ||
    normalized.includes("suspend")
  ) {
    return "cerrado";
  }

  if (
    normalized.includes("activ") ||
    normalized.includes("abiert") ||
    normalized.includes("vigent")
  ) {
    return "activo";
  }

  return "pendiente";
};

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

const isEstablecimientoLike = (item) =>
  item &&
  typeof item === "object" &&
  (item.nombre_est !== undefined ||
    item.fec_apertura !== undefined ||
    item.actividad !== undefined ||
    item.tipo_negocio !== undefined);

const collectEstablecimientos = (payload) => {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload.flatMap((item) => collectEstablecimientos(item));
  }

  if (isEstablecimientoLike(payload)) {
    return [payload];
  }

  if (typeof payload !== "object") {
    return [];
  }

  return [
    payload.contribuyenteE,
    payload.establecimientos,
    payload.results,
    payload.data,
    payload.items,
  ].flatMap((source) => collectEstablecimientos(source));
};

const normalizeEstablecimiento = (item, index) => ({
  ...item,
  id: item?.id ?? item?.establecimiento_id ?? item?.pk ?? `est-${index + 1}`,
  nombre_est:
    item?.nombre_est ?? item?.nombre_comercial ?? item?.nombre ?? `Establecimiento ${index + 1}`,
  fec_apertura: item?.fec_apertura ?? item?.fecha_apertura ?? item?.fecha ?? "",
  actividad: item?.actividad ?? item?.giro ?? "",
  estado: item?.estado ?? item?.estado_est ?? item?.activo ?? "",
  tipo_negocio: item?.tipo_negocio ?? item?.tipo ?? "",
  tieneInformes: item?.tieneInformes ?? item?.tiene_informes ?? false,
});

const Establecimientoslst = () => {
  const [data, setData] = useState([]);
  const [contribuyente, setContribuyente] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [sortBy, setSortBy] = useState("fecha");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const opcionesmenu = [
    { id: 1, path: "/dashboard", name: "Dashboard", icono: FaChartBar },
    { id: 2, path: "/contribuyentes", name: "Contribuyentes", icono: FaUsers },
    { id: 3, path: "/ListInformes", name: "Informes", icono: FaClipboardList },
    { id: 4, path: "/ListSolicitud", name: "Solicitudes", icono: FaFire },
    { id: 5, path: "/ListSolicitudCon", name: "Construccion", icono: FaHardHat },
    { id: 6, path: "/listinspectores", name: "Inspectores", icono: FaUsers },
    { id: 7, path: "/reportes-inspectores", name: "Reportes", icono: FaChartBar },
  ];

  useEffect(() => {
    setLoading(true);
    setErrorMsg("");
    axiosInstance
      .get("/contribuyentes/listador//")
      .then((res) => {
        const payload = res.data;
        const establecimientos = collectEstablecimientos(payload).map(normalizeEstablecimiento);
        setData(establecimientos);
        setContribuyente(
          !Array.isArray(payload) && payload?.contribuyente
            ? payload.contribuyente
            : {}
        );
      })
      .catch((error) => {
        console.error("Error cargando establecimientos", error);
        setErrorMsg(
          error?.response?.data?.detail ||
          error?.message ||
          "Error al cargar los establecimientos."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, estadoFilter, tipoFilter, fechaDesde, fechaHasta, sortBy, sortDirection]);

  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  const handleDelete = async (id, tieneInformes) => {
    if (tieneInformes) {
      alert("No se puede eliminar. Tiene informes registrados.");
      return;
    }

    if (!window.confirm("Eliminar establecimiento?")) {
      return;
    }

    try {
      await axiosInstance.delete(`/contribuyentes/listadoe//${id}/`);
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error eliminando", error);
    }
  };

  const estadoOptions = useMemo(
    () =>
      [...new Set(data.map((item) => item.estado).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b, "es", { sensitivity: "base" })
      ),
    [data]
  );

  const tipoOptions = useMemo(
    () =>
      [...new Set(data.map((item) => item.tipo_negocio).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b, "es", { sensitivity: "base" })
      ),
    [data]
  );

  const filtered = useMemo(() => {
    const searchTerm = normalizeText(search);

    return data.filter((item) => {
      const itemDate = normalizeDate(item.fec_apertura);
      const matchesSearch =
        !searchTerm ||
        [item.nombre_est, item.actividad, item.tipo_negocio, item.estado, item.id]
          .map(normalizeText)
          .some((value) => value.includes(searchTerm));

      const matchesEstado = !estadoFilter || item.estado === estadoFilter;
      const matchesTipo = !tipoFilter || item.tipo_negocio === tipoFilter;
      const matchesFechaDesde = !fechaDesde || (itemDate && itemDate >= fechaDesde);
      const matchesFechaHasta = !fechaHasta || (itemDate && itemDate <= fechaHasta);

      return (
        matchesSearch &&
        matchesEstado &&
        matchesTipo &&
        matchesFechaDesde &&
        matchesFechaHasta
      );
    });
  }, [data, estadoFilter, fechaDesde, fechaHasta, search, tipoFilter]);

  const sortedItems = useMemo(() => {
    const items = [...filtered];

    items.sort((left, right) => {
      if (sortBy === "id") {
        return compareValues(Number(left.id) || 0, Number(right.id) || 0, sortDirection);
      }

      if (sortBy === "fecha") {
        return compareValues(
          normalizeDate(left.fec_apertura),
          normalizeDate(right.fec_apertura),
          sortDirection
        );
      }

      if (sortBy === "estado") {
        return compareValues(
          normalizeText(left.estado),
          normalizeText(right.estado),
          sortDirection
        );
      }

      if (sortBy === "tipo") {
        return compareValues(
          normalizeText(left.tipo_negocio),
          normalizeText(right.tipo_negocio),
          sortDirection
        );
      }

      return compareValues(
        normalizeText(left.nombre_est),
        normalizeText(right.nombre_est),
        sortDirection
      );
    });

    return items;
  }, [filtered, sortBy, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / itemsPerPage));
  const visiblePage = Math.min(Math.max(1, currentPage), totalPages);
  const currentItems = sortedItems.slice(
    (visiblePage - 1) * itemsPerPage,
    visiblePage * itemsPerPage
  );

  const totalCerrados = sortedItems.filter(
    (item) => getEstadoClassName(item.estado) === "cerrado"
  ).length;
  const totalsByType = useMemo(() => {
    const grouped = sortedItems.reduce((accumulator, item) => {
      const key = item.tipo_negocio || "Sin tipo de negocio";
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {});

    return Object.entries(grouped).sort((a, b) =>
      a[0].localeCompare(b[0], "es", { sensitivity: "base" })
    );
  }, [sortedItems]);

  const contributorFields = [
    { label: "RUC / CI", value: contribuyente.ruc },
    { label: "Nombre", value: contribuyente.nombre },
    { label: "Direccion", value: contribuyente.direccion },
    { label: "Representante", value: contribuyente.representante },
  ].filter((field) => field.value);

  const clearFilters = () => {
    setSearch("");
    setEstadoFilter("");
    setTipoFilter("");
    setFechaDesde("");
    setFechaHasta("");
    setSortBy("fecha");
    setSortDirection("desc");
  };

  const exportToCsv = () => {
    if (sortedItems.length === 0) {
      window.alert("No hay datos filtrados para exportar.");
      return;
    }

    const headers = [
      "ID",
      "Nombre comercial",
      "Fecha apertura",
      "Actividad",
      "Estado",
      "Tipo negocio",
    ];

    const csvContent = [
      headers.join(","),
      ...sortedItems.map((item) =>
        [
          item.id || "",
          item.nombre_est || "",
          formatDate(item.fec_apertura),
          item.actividad || "",
          item.estado || "",
          item.tipo_negocio || "",
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
    link.download = `establecimientos-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="app">
        <Header opcionesmenu={opcionesmenu} />
        <div className="container" style={{ padding: "2rem", textAlign: "center" }}>
          <p>Cargando establecimientos...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="app">
        <Header opcionesmenu={opcionesmenu} />
        <div className="container" style={{ padding: "2rem" }}>
          <div style={{ background: "#fee", border: "1px solid #c1121f", borderRadius: "8px", padding: "1rem", color: "#c1121f" }}>
            <strong>Error: </strong>{errorMsg}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header opcionesmenu={opcionesmenu} />

      <div className="container establecimientos-page">
        <section className="est-listing-hero">
          <div>
            <p className="est-listing-kicker">Panel general de establecimientos</p>
            
            <p className="est-listing-subtitle">
              Consulte aperturas, cierres y concentracion por tipo de negocio en un
              solo tablero.
            </p>
          </div>

          <div className="est-hero-side">
            <div className="est-hero-actions">
              <button type="button" className="est-export-button" onClick={exportToCsv}>
                <FaDownload />
                <span>Exportar CSV</span>
              </button>
            </div>

            <div className="est-hero-stats">
              <article className="est-stat-card">
                <span>Establecimientos visibles</span>
                <strong>{sortedItems.length}</strong>
              </article>

              <article className="est-stat-card est-stat-card-success">
                <span>Tipos de negocio</span>
                <strong>{totalsByType.length}</strong>
              </article>

              <article className="est-stat-card est-stat-card-danger">
                <span>Cerrados o inactivos</span>
                <strong>{totalCerrados}</strong>
              </article>
            </div>
          </div>
        </section>

        {contributorFields.length > 0 && (
          <div className="card-contribuyente card-contribuyente-compacta">
            <h3>Informacion relacionada</h3>
            <div className="grid-info">
              {contributorFields.map((field) => (
                <div key={field.label}>
                  <strong>{field.label}</strong>
                  <p>{field.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <section className="est-filter-panel">
          <div className="search-container est-search-field">
            <FaSearch />
            <input
              type="text"
              placeholder="Buscar por nombre, actividad, estado o tipo..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <label className="est-filter-group">
            <span>Estado</span>
            <select
              value={estadoFilter}
              onChange={(event) => setEstadoFilter(event.target.value)}
            >
              <option value="">Todos</option>
              {estadoOptions.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </label>

          <label className="est-filter-group">
            <span>Tipo de negocio</span>
            <select
              value={tipoFilter}
              onChange={(event) => setTipoFilter(event.target.value)}
            >
              <option value="">Todos</option>
              {tipoOptions.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </label>

          <label className="est-filter-group">
            <span>Fecha apertura desde</span>
            <input
              type="date"
              value={fechaDesde}
              onChange={(event) => setFechaDesde(event.target.value)}
            />
          </label>

          <label className="est-filter-group">
            <span>Fecha apertura hasta</span>
            <input
              type="date"
              value={fechaHasta}
              onChange={(event) => setFechaHasta(event.target.value)}
            />
          </label>

          <button type="button" className="est-clear-button" onClick={clearFilters}>
            Limpiar filtros
          </button>
        </section>

        <section className="est-toolbar-panel">
          <div className="est-toolbar-group">
            <label className="est-filter-group">
              <span>Ordenar por</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="fecha">Fecha apertura</option>
                <option value="nombre">Nombre comercial</option>
                <option value="tipo">Tipo de negocio</option>
                <option value="estado">Estado</option>
                <option value="id">ID</option>
              </select>
            </label>

            <label className="est-filter-group">
              <span>Direccion</span>
              <select
                value={sortDirection}
                onChange={(event) => setSortDirection(event.target.value)}
              >
                <option value="asc">Ascendente</option>
                <option value="desc">Descendente</option>
              </select>
            </label>
          </div>

        </section>

        <div className="cont-table-wrapper">
          {/* Tabla de establecimientos con formato unificado igual a contribuyentes */}
          <table className="cont-table" aria-label="Listado de establecimientos">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre comercial</th>
                <th>Fecha apertura</th>
                <th>Actividad</th>
                <th>Estado</th>
                <th>Tipo negocio</th>
                <th>Solicitudes</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td className="est-empty-state" colSpan={8}>
                    No hay establecimientos que coincidan con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                currentItems.map((est) => (
                  <tr key={est.id}>
                    <td>{est.id}</td>
                    <td>
                      <Link to={`/informes/${est.id}`}>{est.nombre_est}</Link>
                    </td>
                    <td>{formatDate(est.fec_apertura)}</td>
                    <td>{est.actividad || "Sin actividad"}</td>
                    <td>
                      <span className={`estado ${getEstadoClassName(est.estado)}`}>
                        {est.estado || "Sin estado"}
                      </span>
                    </td>
                    <td>{est.tipo_negocio || "Sin tipo"}</td>
                    <td>
                      <Link to={`/solicitudadd/${est.id}`} className="est-btn-solicitud">
                        + Solicitud
                      </Link>
                    </td>
                    <td className="est-actions">
                      <Link to={`/establecimientoedit/${est.id}`} title="Editar">
                        <MdEdit />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(est.id, est.tieneInformes)}
                        title="Eliminar"
                      >
                        <MdDeleteForever />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="est-grid-footer">
            <span>Total de establecimientos filtrados</span>
            <strong>{sortedItems.length}</strong>
          </div>
        </div>

        <p className="est-debug-counts">
          Datos: {data.length} | Filtrados: {sortedItems.length} | En pagina: {currentItems.length}
        </p>

        <div className="paginacion">
          <button
            type="button"
            disabled={visiblePage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          >
            Anterior
          </button>

          <span>
            Pagina {visiblePage} de {totalPages}
          </span>

          <button
            type="button"
            disabled={visiblePage === totalPages}
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          >
            Siguiente
          </button>
        </div>

        <section className="est-breakdown-panel">
          <div className="est-breakdown-header">
            <h3>Total por tipo de negocio</h3>
          </div>

          <div className="est-breakdown-list">
            {totalsByType.length === 0 ? (
              <p className="est-empty-breakdown">Sin datos para mostrar.</p>
            ) : (
              totalsByType.map(([tipo, total]) => (
                <article key={tipo} className="est-breakdown-item">
                  <span>{tipo}</span>
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

export default Establecimientoslst;