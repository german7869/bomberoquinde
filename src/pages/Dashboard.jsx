import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import axiosInstance from "../utils/api";
import { FaChartBar, FaClipboardList, FaFire, FaHardHat, FaUsers } from "react-icons/fa";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import "./dashboard.css";

const MONTH_NAMES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

const normalizeText = (value) =>
  value
    ?.toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim() || "";

const toArray = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.data?.results)) {
    return payload.data.results;
  }

  if (Array.isArray(payload?.contribuyenteE)) {
    return payload.contribuyenteE;
  }

  if (Array.isArray(payload?.data?.contribuyenteE)) {
    return payload.data.contribuyenteE;
  }

  if (Array.isArray(payload?.informes)) {
    return payload.informes;
  }

  return [];
};

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  const raw = value.toString().trim();
  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (isoMatch) {
    return new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}T00:00:00`);
  }

  const localMatch = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (localMatch) {
    return new Date(`${localMatch[3]}-${localMatch[2]}-${localMatch[1]}T00:00:00`);
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
};

const getAnyDate = (item, keys) => {
  for (const key of keys) {
    const parsed = parseDate(item?.[key]);
    if (parsed) {
      return parsed;
    }
  }

  return null;
};

const getContribuyenteKey = (item) => {
  const raw =
    item?.id ??
    item?.contribuyente_id ??
    item?.contribuyente ??
    item?.ruc_cont ??
    item?.ruc ??
    item?.cedula;

  if (raw == null) {
    return "";
  }

  if (typeof raw === "object") {
    return String(raw?.id ?? raw?.ruc_cont ?? raw?.ruc ?? "");
  }

  return String(raw);
};

const getInspectorData = (item) => {
  if (item?.inspector && typeof item.inspector === "object") {
    return {
      id: String(item.inspector.id ?? item.inspector.cedula ?? ""),
      name: item.inspector.nombre_insp || item.inspector.nombre || "Inspector",
    };
  }

  return {
    id: String(item?.inspector_id ?? item?.inspector ?? item?.inspectorCedula ?? ""),
    name:
      item?.inspector_nombre ||
      item?.inspector_name ||
      item?.nombre_insp ||
      (item?.inspector && typeof item.inspector === "string" ? item.inspector : "Inspector"),
  };
};

const getEstablecimientoId = (item) => {
  const raw = item?.establecimiento_id ?? item?.establecimiento;

  if (raw == null) {
    return "";
  }

  if (typeof raw === "object") {
    return String(raw?.id ?? raw?.establecimiento_id ?? "");
  }

  return String(raw);
};

const isClosedState = (estado) => {
  const normalized = normalizeText(estado);
  return (
    normalized.includes("cerr") ||
    normalized.includes("inact") ||
    normalized.includes("suspend") ||
    normalized.includes("baja")
  );
};

const Dashboard = () => {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [informesPermisos, setInformesPermisos] = useState([]);
  const [informesConstruccion, setInformesConstruccion] = useState([]);
  const [solicitudesPermisos, setSolicitudesPermisos] = useState([]);
  const [solicitudesConstruccion, setSolicitudesConstruccion] = useState([]);
  const [establecimientos, setEstablecimientos] = useState([]);
  const [contribuyentes, setContribuyentes] = useState([]);
  const [parroquias, setParroquias] = useState([]);

  const [ultimosInformes, setUltimosInformes] = useState([]);

  const opcionesmenu = [
    { id: 1, path: "/dashboard", name: "Dashboard", icono: FaChartBar },
    { id: 2, path: "/contribuyentes", name: "Contribuyentes", icono: FaUsers },
    { id: 3, path: "/ListInformes", name: "Informes", icono: FaClipboardList },
    { id: 4, path: "/ListSolicitud", name: "Solicitudes", icono: FaFire },
    { id: 5, path: "/ListSolicitudCon", name: "Construccion", icono: FaHardHat },
    { id: 6, path: "/iniciar", name: "Cerrar sesion" },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const requests = await Promise.allSettled([
          axiosInstance.get(`/dashboard/${anio}`),
          axiosInstance.get("/informes/listadoinfo//"),
          axiosInstance.get("/informes/listadoinfocons//"),
          axiosInstance.get("/contribuyentes/listadoSolicitude//"),
          axiosInstance.get("/contribuyentes/listadoSolicitudcons//"),
          axiosInstance.get("/contribuyentes/listador//"),
          axiosInstance.get("/contribuyentes/listadoC//"),
          axiosInstance.get("/contribuyentes/listadopar//"),
        ]);

        const dashboardData =
          requests[0].status === "fulfilled" ? requests[0].value.data : null;
        const permisosData =
          requests[1].status === "fulfilled" ? toArray(requests[1].value.data) : [];
        const construccionData =
          requests[2].status === "fulfilled" ? toArray(requests[2].value.data) : [];
        const solicitudesPermisosData =
          requests[3].status === "fulfilled" ? toArray(requests[3].value.data) : [];
        const solicitudesConstruccionData =
          requests[4].status === "fulfilled" ? toArray(requests[4].value.data) : [];
        const establecimientosData =
          requests[5].status === "fulfilled" ? toArray(requests[5].value.data) : [];
        const contribuyentesData =
          requests[6].status === "fulfilled" ? toArray(requests[6].value.data) : [];
        const parroquiasData =
          requests[7].status === "fulfilled" ? toArray(requests[7].value.data) : [];

        setInformesPermisos(permisosData);
        setInformesConstruccion(construccionData);
        setSolicitudesPermisos(solicitudesPermisosData);
        setSolicitudesConstruccion(solicitudesConstruccionData);
        setEstablecimientos(establecimientosData);
        setContribuyentes(contribuyentesData);
        setParroquias(parroquiasData);

        const fallbackUltimos = [...permisosData, ...construccionData]
          .map((item) => {
            const inspector = getInspectorData(item);
            return {
              id: item?.id,
              fecha: getAnyDate(item, ["fecha_informe", "Fecha_informe", "fecha_solicitud"]),
              tipo: item?.contribuyente || item?.tipoconstruccion ? "Construccion" : "Permiso",
              inspector: inspector.name,
              establecimiento:
                item?.establecimiento_nombre ||
                item?.establecimiento?.nombre_est ||
                item?.establecimiento ||
                item?.contribuyente ||
                "Sin referencia",
            };
          })
          .filter((item) => item.fecha)
          .sort((a, b) => b.fecha - a.fecha)
          .slice(0, 8);

        setUltimosInformes(
          Array.isArray(dashboardData?.ultimos_informes) && dashboardData.ultimos_informes.length > 0
            ? dashboardData.ultimos_informes
            : fallbackUltimos
        );
      } catch (requestError) {
        console.error("Error cargando dashboard", requestError);
        setError("No se pudieron cargar los datos del dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [anio]);

  const metrics = useMemo(() => {
    const selectedYear = Number(anio);

    const parroquiaMap = (Array.isArray(parroquias) ? parroquias : []).reduce((acc, item) => {
      const key = String(item?.id ?? item?.parroquia_id ?? "");
      if (key) {
        acc[key] = item?.nombre || item?.nombre_parroquia || "Sin parroquia";
      }
      return acc;
    }, {});

    const normalizedContribuyentes = (Array.isArray(contribuyentes) ? contribuyentes : []).map((item) => {
      const key = getContribuyenteKey(item);
      const parroquiaId = String(item?.parroquia_id ?? item?.parroquia ?? "");
      return {
        key,
        parroquia: parroquiaMap[parroquiaId] || item?.parroquia_nombre || "Sin parroquia",
      };
    });

    const contribuyenteParroquiaMap = normalizedContribuyentes.reduce((acc, item) => {
      if (item.key) {
        acc[item.key] = item.parroquia;
      }
      return acc;
    }, {});

    const establecimientosNorm = (Array.isArray(establecimientos) ? establecimientos : []).map((item) => {
      const id = String(item?.id ?? item?.establecimiento_id ?? "");
      const contribuyenteKey = getContribuyenteKey(item?.contribuyente ?? item);
      const parroquiaId = String(
        item?.parroquia?.id ?? item?.parroquia_id ?? item?.contribuyente?.parroquia_id ?? ""
      );

      return {
        id,
        contribuyenteKey,
        estado: item?.estado || "",
        parroquia:
          item?.parroquia?.nombre ||
          item?.parroquia_nombre ||
          parroquiaMap[parroquiaId] ||
          contribuyenteParroquiaMap[contribuyenteKey] ||
          "Sin parroquia",
      };
    });

    const establecimientoMap = establecimientosNorm.reduce((acc, item) => {
      if (item.id) {
        acc[item.id] = item;
      }
      return acc;
    }, {});

    const permisosYear = (Array.isArray(informesPermisos) ? informesPermisos : []).filter((item) => {
      const date = getAnyDate(item, ["fecha_informe", "Fecha_informe"]);
      return date && date.getFullYear() === selectedYear;
    });

    const construccionYear = (Array.isArray(informesConstruccion) ? informesConstruccion : []).filter(
      (item) => {
        const date = getAnyDate(item, ["fecha_informe", "Fecha_informe", "fecha_solicitud"]);
        return date && date.getFullYear() === selectedYear;
      }
    );

    const solicitudesPermisosYear =
      (Array.isArray(solicitudesPermisos) ? solicitudesPermisos : []).filter((item) => {
        const date = getAnyDate(item, ["fecha_solicitud", "Fecha_solicitud"]);
        return date && date.getFullYear() === selectedYear;
      });

    const solicitudesConstruccionYear =
      (Array.isArray(solicitudesConstruccion) ? solicitudesConstruccion : []).filter((item) => {
        const date = getAnyDate(item, ["fecha_solicitud", "Fecha_solicitud"]);
        return date && date.getFullYear() === selectedYear;
      });

    const months = MONTH_NAMES.map((month, index) => ({
      mes: month,
      permisos: 0,
      construccion: 0,
    }));

    permisosYear.forEach((item) => {
      const date = getAnyDate(item, ["fecha_informe", "Fecha_informe"]);
      if (date) {
        months[date.getMonth()].permisos += 1;
      }
    });

    construccionYear.forEach((item) => {
      const date = getAnyDate(item, ["fecha_informe", "Fecha_informe", "fecha_solicitud"]);
      if (date) {
        months[date.getMonth()].construccion += 1;
      }
    });

    const inspectorAccum = {};

    [...permisosYear, ...construccionYear].forEach((item) => {
      const inspector = getInspectorData(item);
      const key = inspector.id || inspector.name || "sin-inspector";

      if (!inspectorAccum[key]) {
        inspectorAccum[key] = {
          inspector: inspector.name || "Sin inspector",
          total: 0,
        };
      }

      inspectorAccum[key].total += 1;
    });

    const productividadInspectores = Object.values(inspectorAccum)
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);

    const parroquiaAccum = {};

    permisosYear.forEach((item) => {
      const estId = getEstablecimientoId(item);
      const parroquia = establecimientoMap[estId]?.parroquia || "Sin parroquia";
      parroquiaAccum[parroquia] = (parroquiaAccum[parroquia] || 0) + 1;
    });

    construccionYear.forEach((item) => {
      const contribuyenteKey = getContribuyenteKey(item?.contribuyente ?? item);
      const parroquia = contribuyenteParroquiaMap[contribuyenteKey] || "Sin parroquia";
      parroquiaAccum[parroquia] = (parroquiaAccum[parroquia] || 0) + 1;
    });

    const informesPorParroquia = Object.entries(parroquiaAccum)
      .map(([parroquia, total]) => ({ parroquia, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);

    const contribuyentesConInformes = new Set();

    permisosYear.forEach((item) => {
      const estId = getEstablecimientoId(item);
      const contribuyenteKey = establecimientoMap[estId]?.contribuyenteKey;
      if (contribuyenteKey) {
        contribuyentesConInformes.add(contribuyenteKey);
      }
    });

    construccionYear.forEach((item) => {
      const contribuyenteKey = getContribuyenteKey(item?.contribuyente ?? item);
      if (contribuyenteKey) {
        contribuyentesConInformes.add(contribuyenteKey);
      }
    });

    const totalContribuyentes = normalizedContribuyentes.filter((item) => item.key).length;

    const contribuyentesSinInforme = normalizedContribuyentes.filter(
      (item) => item.key && !contribuyentesConInformes.has(item.key)
    ).length;

    const contribuyentesConEstablecimientoCerrado = new Set(
      establecimientosNorm
        .filter((item) => isClosedState(item.estado) && item.contribuyenteKey)
        .map((item) => item.contribuyenteKey)
    ).size;

    const porcentajeCumplimiento =
      totalContribuyentes > 0
        ? ((totalContribuyentes - contribuyentesSinInforme) / totalContribuyentes) * 100
        : 0;

    return {
      totalInformesPermisos: permisosYear.length,
      totalInformesConstruccion: construccionYear.length,
      totalInformes: permisosYear.length + construccionYear.length,
      totalSolicitudesPermisos: solicitudesPermisosYear.length,
      totalSolicitudesConstruccion: solicitudesConstruccionYear.length,
      totalContribuyentes,
      contribuyentesSinInforme,
      contribuyentesConEstablecimientoCerrado,
      porcentajeCumplimiento,
      porcentajePendiente: Math.max(0, 100 - porcentajeCumplimiento),
      informesPorMes: months,
      productividadInspectores,
      informesPorParroquia,
    };
  }, [
    anio,
    contribuyentes,
    establecimientos,
    informesConstruccion,
    informesPermisos,
    parroquias,
    solicitudesConstruccion,
    solicitudesPermisos,
  ]);

  return (
    <div className="app">
      <Header opcionesmenu={opcionesmenu} />

      <div className="container dashboard-page">
        <section className="dash-hero">
          <div>
            <p className="dash-kicker">Panel analitico</p>
            <h2>Dashboard Bomberos Quininde</h2>
            <p className="dash-subtitle">
              Estadisticas operativas de informes, cumplimiento y productividad por inspector y
              parroquia.
            </p>
          </div>

          <label className="dash-year-filter">
            <span>Anio</span>
            <select value={anio} onChange={(event) => setAnio(Number(event.target.value))}>
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
            </select>
          </label>
        </section>

        {error && <p className="dash-banner dash-banner-error">{error}</p>}
        {loading && <p className="dash-banner">Cargando indicadores...</p>}

        <section className="dash-card-grid">
          <article className="dash-card">
            <h4>Informes permisos</h4>
            <strong>{metrics.totalInformesPermisos}</strong>
          </article>

          <article className="dash-card">
            <h4>Informes construccion</h4>
            <strong>{metrics.totalInformesConstruccion}</strong>
          </article>

          <article className="dash-card">
            <h4>Total informes</h4>
            <strong>{metrics.totalInformes}</strong>
          </article>

          <article className="dash-card">
            <h4>Solicitudes permisos</h4>
            <strong>{metrics.totalSolicitudesPermisos}</strong>
          </article>

          <article className="dash-card">
            <h4>Solicitudes construccion</h4>
            <strong>{metrics.totalSolicitudesConstruccion}</strong>
          </article>

          <article className="dash-card">
            <h4>Contribuyentes con cierre</h4>
            <strong>{metrics.contribuyentesConEstablecimientoCerrado}</strong>
          </article>

          <article className="dash-card">
            <h4>Contribuyentes sin informe</h4>
            <strong>{metrics.contribuyentesSinInforme}</strong>
          </article>

          <article className="dash-card">
            <h4>Porcentaje cumplimiento</h4>
            <strong>{metrics.porcentajeCumplimiento.toFixed(1)}%</strong>
            <small>Pendiente: {metrics.porcentajePendiente.toFixed(1)}%</small>
          </article>
        </section>

        <section className="dash-chart-shell">
          <h3>Nro informes por tipo por mes</h3>
          <div className="dash-chart-wrap">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={metrics.informesPorMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d8e1eb" />
                <XAxis dataKey="mes" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="permisos" fill="#c1121f" name="Permisos" radius={[6, 6, 0, 0]} />
                <Bar
                  dataKey="construccion"
                  fill="#1f4e79"
                  name="Construccion"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="dash-grid-two">
          <article className="dash-panel">
            <h3>Productividad de inspectores</h3>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Inspector</th>
                  <th>Total informes</th>
                </tr>
              </thead>
              <tbody>
                {metrics.productividadInspectores.length === 0 ? (
                  <tr>
                    <td colSpan={2}>Sin datos disponibles</td>
                  </tr>
                ) : (
                  metrics.productividadInspectores.map((item) => (
                    <tr key={item.inspector}>
                      <td>{item.inspector}</td>
                      <td>{item.total}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </article>

          <article className="dash-panel">
            <h3>Informes por parroquia</h3>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Parroquia</th>
                  <th>Total informes</th>
                </tr>
              </thead>
              <tbody>
                {metrics.informesPorParroquia.length === 0 ? (
                  <tr>
                    <td colSpan={2}>Sin datos disponibles</td>
                  </tr>
                ) : (
                  metrics.informesPorParroquia.map((item) => (
                    <tr key={item.parroquia}>
                      <td>{item.parroquia}</td>
                      <td>{item.total}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </article>
        </section>

        <section className="dash-panel">
          <h3>Ultimos informes registrados</h3>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Inspector</th>
                <th>Referencia</th>
              </tr>
            </thead>
            <tbody>
              {ultimosInformes.length === 0 ? (
                <tr>
                  <td colSpan={4}>Sin datos disponibles</td>
                </tr>
              ) : (
                ultimosInformes.map((item, index) => {
                  const date = parseDate(item?.fecha || item?.fecha_informe || item?.Fecha_informe);
                  const formattedDate = date
                    ? `${`${date.getDate()}`.padStart(2, "0")}/${`${date.getMonth() + 1}`.padStart(
                        2,
                        "0"
                      )}/${date.getFullYear()}`
                    : "Sin fecha";

                  return (
                    <tr key={`${item?.id || "item"}-${index}`}>
                      <td>{formattedDate}</td>
                      <td>{item?.tipo || "Permiso"}</td>
                      <td>{item?.inspector || item?.inspector_nombre || "Sin inspector"}</td>
                      <td>
                        {item?.establecimiento ||
                          item?.establecimiento_nombre ||
                          item?.contribuyente ||
                          "Sin referencia"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
