import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../utils/api";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";

import { FaDownload, FaEdit, FaImages, FaSearch, FaTrash } from "react-icons/fa";
import { GrDocumentPdf } from "react-icons/gr";

import "./page.css";
import "./informe.css";

const normalizeText = (value) =>
	value
		?.toString()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.trim() || "";

const getArrayFromResponse = (payload) => {
	if (Array.isArray(payload)) {
		return payload;
	}

	if (Array.isArray(payload?.data?.results)) {
		return payload.data.results;
	}

	if (Array.isArray(payload?.data?.informes)) {
		return payload.data.informes;
	}

	if (Array.isArray(payload?.results)) {
		return payload.results;
	}

	if (Array.isArray(payload?.informes)) {
		return payload.informes;
	}

	if (Array.isArray(payload?.data)) {
		return payload.data;
	}

	return [];
};

const getResultClass = (value) => {
	const normalized = normalizeText(value);

	if (normalized.includes("aprob")) {
		return "approved";
	}

	if (normalized.includes("neg")) {
		return "denied";
	}

	if (normalized.includes("cond")) {
		return "conditional";
	}

	return "neutral";
};

const InformesList = () => {
	const { establecimiento_id } = useParams();

	const [data, setData] = useState([]);
	const [infoEstablecimiento, setInfoEstablecimiento] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [search, setSearch] = useState("");

	const opcionesmenu = [
		{ id: 1, path: `/InformeAdd/${establecimiento_id}`, name: "Agregar Informe" },
		{ id: 2, path: `/solicitudadd/${establecimiento_id}`, name: "Agregar Solicitud" },
	];

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				setError("");

				const [informesResponse, establecimientoResponse] = await Promise.all([
					axiosInstance.get(`/informes/listadoinfo/${establecimiento_id}/establecimiento/`),
					axiosInstance.get(`/contribuyentes/listadoec//${establecimiento_id}/`),
				]);

				setData(getArrayFromResponse(informesResponse.data));
				setInfoEstablecimiento(establecimientoResponse.data || {});
			} catch (err) {
				setError("No se pudieron cargar los informes del establecimiento.");
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [establecimiento_id]);

	const eliminarInforme = async (id, tieneImagen, nroInforme) => {
		if (tieneImagen) {
			window.alert("No se puede eliminar, tiene imagenes cargadas.");
			return;
		}

		if (nroInforme) {
			window.alert("No se puede eliminar, el informe ya tiene numero emitido.");
			return;
		}

		if (!window.confirm("Eliminar informe?")) {
			return;
		}

		try {
			await axiosInstance.delete(`/informes/eliminar/${id}/`);
			setData((prev) => prev.filter((item) => item.id !== id));
		} catch (err) {
			window.alert("Error eliminando informe.");
		}
	};

	const filtered = useMemo(() => {
		const searchTerm = normalizeText(search);

		if (!searchTerm) {
			return data;
		}

		return data.filter((inf) =>
			[
				inf.id,
				inf.Fecha_informe,
				inf.nro_socilitud,
				inf.inspector,
				inf.observacion,
				inf.resultado_informe,
			]
				.map(normalizeText)
				.some((value) => value.includes(searchTerm))
		);
	}, [data, search]);

	const totalAprobados = useMemo(
		() => filtered.filter((inf) => getResultClass(inf.resultado_informe) === "approved").length,
		[filtered]
	);

	const totalCondicionados = useMemo(
		() =>
			filtered.filter((inf) => getResultClass(inf.resultado_informe) === "conditional").length,
		[filtered]
	);

	const exportToCsv = () => {
		if (filtered.length === 0) {
			window.alert("No hay informes para exportar.");
			return;
		}

		const headers = [
			"ID",
			"Fecha",
			"Solicitud",
			"Inspector",
			"Observacion",
			"Resultado",
		];

		const csvContent = [
			headers.join(","),
			...filtered.map((inf) =>
				[
					inf.id || "",
					inf.Fecha_informe || "",
					inf.nro_socilitud || "",
					inf.inspector || "",
					inf.observacion || "",
					inf.resultado_informe || "",
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
		link.download = `informes-${new Date().toISOString().slice(0, 10)}.csv`;

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	return (
		<div className="app">
			<Header opcionesmenu={opcionesmenu} />

			<div className="container informes-page">
				<section className="inf-hero">
					<div>
						<p className="inf-kicker">Panel de informes</p>
						<p className="inf-subtitle">
							Gestion de informes vinculados al establecimiento seleccionado.
						</p>

						<div className="inf-est-grid">
							<div>
								<strong>Establecimiento</strong>
								<p>{infoEstablecimiento.nombre_est || "Sin nombre"}</p>
							</div>

							<div>
								<strong>Direccion</strong>
								<p>{infoEstablecimiento.direccion_est || "Sin direccion"}</p>
							</div>

							<div>
								<strong>Actividad</strong>
								<p>{infoEstablecimiento.actividad || "Sin actividad"}</p>
							</div>
						</div>
					</div>

					<div className="inf-hero-side">
						<div className="inf-hero-actions">
							<button type="button" className="inf-export-button" onClick={exportToCsv}>
								<FaDownload />
								<span>Exportar CSV</span>
							</button>

							<Link to={`/solicitudadd/${establecimiento_id}`} className="inf-secondary-button">
								<span>Nueva solicitud</span>
							</Link>

							<Link to={`/InformeAdd/${establecimiento_id}`} className="inf-add-button">
								<span>Nuevo informe</span>
							</Link>
						</div>

						<section className="inf-stats-grid">
							<article className="inf-stat-card">
								<span>Informes visibles</span>
								<strong>{filtered.length}</strong>
							</article>

							<article className="inf-stat-card inf-stat-card-success">
								<span>Aprobados</span>
								<strong>{totalAprobados}</strong>
							</article>

							<article className="inf-stat-card inf-stat-card-danger">
								<span>Condicionados</span>
								<strong>{totalCondicionados}</strong>
							</article>
						</section>
					</div>
				</section>

				<section className="inf-search-panel">
					<div className="inf-search-field">
						<FaSearch />
						<input
							type="text"
							placeholder="Buscar por fecha, solicitud, inspector u observacion..."
							value={search}
							onChange={(event) => setSearch(event.target.value)}
						/>
					</div>
				</section>

				{loading && <p className="inf-info-banner">Cargando informes...</p>}
				{!loading && error && <p className="inf-info-banner inf-info-error">{error}</p>}

				{!loading && !error && (
					<div className="inf-grid-wrapper">
						<div className="inf-grid-list" role="table" aria-label="Listado de informes">
							<div className="inf-grid-header" role="row">
								<span>ID</span>
								<span>Fecha</span>
								<span>Solicitud</span>
								<span>Inspector</span>
								<span>Observacion</span>
								<span>Resultado</span>
								<span>Acciones</span>
							</div>

							{filtered.length === 0 ? (
								<p className="inf-empty-state">No hay informes que coincidan con la busqueda.</p>
							) : (
								filtered.map((inf) => (
									<div className="inf-grid-row" role="row" key={inf.id}>
										<span>{inf.id}</span>
										<span>{inf.Fecha_informe || "Sin fecha"}</span>
										<span>{inf.nro_socilitud || "Sin solicitud"}</span>
										<span>{inf.inspector || "Sin inspector"}</span>
										<span>{inf.observacion || "Sin observacion"}</span>
										<span>
											<span className={`inf-result-badge ${getResultClass(inf.resultado_informe)}`}>
												{inf.resultado_informe || "Sin resultado"}
											</span>
										</span>

										<span className="inf-actions">
											<Link to={`/InformeImage/${establecimiento_id}`} title="Imagenes">
												<FaImages />
											</Link>

											<Link to={`/InformeAdd/${inf.id}`} title="Editar">
												<FaEdit />
											</Link>

											<Link to={`/informespdf/${establecimiento_id}/${inf.id}`} title="PDF">
												<GrDocumentPdf />
											</Link>

											<button
												type="button"
												onClick={() => eliminarInforme(inf.id, inf.tiene_imagen, inf.nro_informe)}
												title="Eliminar"
											>
												<FaTrash />
											</button>
										</span>
									</div>
								))
							)}

							<div className="inf-grid-footer">
								<span>Total de informes filtrados</span>
								<strong>{filtered.length}</strong>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default InformesList;