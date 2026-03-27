import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaDownload, FaFileAlt, FaPlus, FaSearch } from "react-icons/fa";
import { MdDeleteForever, MdEdit } from "react-icons/md";

import Header from "../components/Header";
import axiosInstance from "../utils/api";

import "./page.css";
import "./establecimiento.css";

const ITEMS_PER_PAGE = 8;

const normalizeText = (value) =>
  value
    ?.toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim() || "";

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

const Establecimientos = () => {
  const { contribuyente_id } = useParams();

  const [data, setData] = useState([]);
  const [contribuyente, setContribuyente] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const opcionesmenu = [
    {
      id: 1,
      path: `/establecimientoadd/${contribuyente_id}`,
      name: "Agregar Establecimiento",
      icono: FaPlus,
    },
    {
      id: 2,
      path: `/informeConadd/${contribuyente_id}`,
      name: "Informe Construccion",
      icono: FaFileAlt,
    },
  ];

  useEffect(() => {
    axiosInstance
      .get(`/contribuyentes/listador//${contribuyente_id}/`)
      .then((res) => {
        const establecimientos =
          res.data?.contribuyenteE || res.data?.establecimientos || [];

        const contribuyenteData =
          res.data?.contribuyente ||
          res.data?.contribuyenteE?.[0]?.contribuyente ||
          {};

        setData(Array.isArray(establecimientos) ? establecimientos : []);
        setContribuyente(contribuyenteData);
      })
      .catch((error) => {
        console.error("Error cargando establecimientos", error);
      });
  }, [contribuyente_id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleDelete = async (id, tieneInformes) => {
    if (tieneInformes) {
      window.alert("No se puede eliminar. Tiene informes registrados.");
      return;
    }

    if (!window.confirm("Eliminar establecimiento?")) {
      return;
    }

    try {
      await axiosInstance.delete(`/contribuyentes/listadoe/${id}/`);
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error eliminando", error);
    }
  };

  const filtered = useMemo(() => {
    const searchTerm = normalizeText(search);

    return data.filter((item) => {
      if (!searchTerm) {
        return true;
      }

      return [item.nombre_est, item.actividad, item.tipo_negocio, item.estado, item.id]
        .map(normalizeText)
        .some((value) => value.includes(searchTerm));
    });
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const currentItems = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const totalTiposNegocio = useMemo(
    () => new Set(filtered.map((item) => item.tipo_negocio).filter(Boolean)).size,
    [filtered]
  );

  const totalCerrados = useMemo(
    () => filtered.filter((item) => getEstadoClassName(item.estado) === "cerrado").length,
    [filtered]
  );

  const contributorFields = [
    { label: "RUC / CI", value: contribuyente.ruc_cont || contribuyente.ruc },
    { label: "Nombre", value: contribuyente.nombre_cont || contribuyente.nombre },
    { label: "Direccion", value: contribuyente.direccion || contribuyente.direccion_cont },
    { label: "Representante", value: contribuyente.representante },
  ].filter((field) => field.value);

  const exportToCsv = () => {
    if (filtered.length === 0) {
      window.alert("No hay establecimientos para exportar.");
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
      ...filtered.map((item) =>
        [
          item.id || "",
          item.nombre_est || "",
          item.fec_apertura || "",
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

  return (
    <div className="app">
      <Header opcionesmenu={opcionesmenu} />

      <div className="container establecimientos-page">
        <section className="est-listing-hero">
          <div>
            <p className="est-listing-kicker">Panel de establecimientos</p>
            <p className="est-listing-subtitle">
              Gestion de establecimientos vinculados al contribuyente actual.
            </p>

            {contributorFields.length > 0 && (
              <div className="grid-info est-contrib-panel-grid">
                {contributorFields.map((field) => (
                  <div key={field.label}>
                    <strong>{field.label}</strong>
                    <p>{field.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="est-hero-side">
            <div className="est-hero-actions">
              <button type="button" className="est-export-button" onClick={exportToCsv}>
                <FaDownload />
                <span>Exportar CSV</span>
              </button>

              <Link to={`/establecimientoadd/${contribuyente_id}`} className="est-btn-solicitud">
                <FaPlus />
                <span>Nuevo establecimiento</span>
              </Link>
            </div>

            <div className="est-hero-stats">
              <article className="est-stat-card">
                <span>Establecimientos visibles</span>
                <strong>{filtered.length}</strong>
              </article>

              <article className="est-stat-card est-stat-card-success">
                <span>Tipos de negocio</span>
                <strong>{totalTiposNegocio}</strong>
              </article>

              <article className="est-stat-card est-stat-card-danger">
                <span>Cerrados o inactivos</span>
                <strong>{totalCerrados}</strong>
              </article>
            </div>
          </div>
        </section>

        <section className="est-filter-panel est-filter-panel-simple">
          <div className="search-container est-search-field">
            <FaSearch />
            <input
              type="text"
              placeholder="Buscar por nombre, actividad, estado o tipo..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </section>

        <div className="est-grid-wrapper">
          <div className="est-grid-list" role="table">
            <div className="est-grid-header" role="row">
              <span>ID</span>
              <span>Nombre comercial</span>
              <span>Fecha apertura</span>
              <span>Actividad</span>
              <span>Estado</span>
              <span>Tipo negocio</span>
              <span>Solicitudes</span>
              <span>Acciones</span>
            </div>

            {currentItems.length === 0 ? (
              <p className="est-empty-state">No hay establecimientos que coincidan con la busqueda.</p>
            ) : (
              currentItems.map((est) => (
                <div className="est-grid-row" role="row" key={est.id}>
                  <span>{est.id}</span>

                  <span>
                    <Link to={`/informes/${est.id}`}>{est.nombre_est}</Link>
                  </span>

                  <span>{est.fec_apertura || "Sin fecha"}</span>
                  <span>{est.actividad || "Sin actividad"}</span>

                  <span>
                    <span className={`estado ${getEstadoClassName(est.estado)}`}>
                      {est.estado || "Sin estado"}
                    </span>
                  </span>

                  <span>{est.tipo_negocio || "Sin tipo"}</span>

                  <span>
                    <Link to={`/solicitudadd/${est.id}`} className="est-btn-solicitud">
                      + Solicitud
                    </Link>
                  </span>

                  <span className="est-actions">
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
                  </span>
                </div>
              ))
            )}

            <div className="est-grid-footer">
              <span>Total de establecimientos filtrados</span>
              <strong>{filtered.length}</strong>
            </div>
          </div>
        </div>

        <div className="paginacion">
          <button
            type="button"
            disabled={safePage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          >
            Anterior
          </button>

          <span>
            Pagina {safePage} de {totalPages}
          </span>

          <button
            type="button"
            disabled={safePage === totalPages}
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default Establecimientos;
