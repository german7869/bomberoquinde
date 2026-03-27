import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import axiosInstance from "../utils/api";
import { useNavigate, useParams } from "react-router-dom";

import "./contribuyentesadd.css";

const ContribuyentesAdd = () => {
	const navigate = useNavigate();
	const { ruc } = useParams();

	const [modoEdicion, setModoEdicion] = useState(false);
	const [cargandoCatalogos, setCargandoCatalogos] = useState(true);
	const [mensaje, setMensaje] = useState("");
	const [esError, setEsError] = useState(false);

	const [form, setForm] = useState({
		ruc_cont: "",
		nombre_cont: "",
		direccion_cont: "",
		email_cont: "",
		razon_social_cont: "",
		telefono_cont: "",
		ceclular_cont: "",
		representante: "",
		parroquia_id: "",
	});

	const [parroquias, setParroquias] = useState([]);

	const opcionesmenu = [{ id: 1, path: "/contribuyentes", name: "Volver" }];

	useEffect(() => {
		const loadParroquias = async () => {
			try {
				setCargandoCatalogos(true);
				const response = await axiosInstance.get("/contribuyentes/listadopar//");
				setParroquias(Array.isArray(response.data) ? response.data : []);
			} catch (error) {
				console.error("Error cargando parroquias", error);
				setParroquias([]);
			} finally {
				setCargandoCatalogos(false);
			}
		};

		loadParroquias();
	}, []);

	useEffect(() => {
		if (!ruc) {
			return;
		}

		const loadContribuyente = async () => {
			try {
				setModoEdicion(true);
				const response = await axiosInstance.get(`/contribuyentes/listadoC//${ruc}/`);
				setForm(response.data);
			} catch (error) {
				console.error("Error cargando contribuyente", error);
				setMensaje("No se pudo cargar el contribuyente para edicion");
				setEsError(true);
			}
		};

		loadContribuyente();
	}, [ruc]);

	const parroquiasDisponibles = useMemo(
		() => (Array.isArray(parroquias) ? parroquias : []),
		[parroquias]
	);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			if (modoEdicion) {
				await axiosInstance.put(`/contribuyentes/listadoC//${ruc}/`, form);
				setMensaje("Contribuyente actualizado correctamente");
			} else {
				await axiosInstance.post("/contribuyentes/listadoC//", form);
				setMensaje("Contribuyente creado correctamente");
			}

			setEsError(false);
			setTimeout(() => {
				navigate("/contribuyentes");
			}, 1200);
		} catch (error) {
			console.error("Error guardando contribuyente", error);
			setMensaje("Error guardando datos");
			setEsError(true);
		}
	};

	return (
		<div className="app">
			<Header opcionesmenu={opcionesmenu} />

			<div className="container contadd-page">
				<section className="contadd-hero">
					<div>
						<p className="contadd-kicker">Panel de contribuyente</p>
						<h2>{modoEdicion ? "Editar contribuyente" : "Nuevo contribuyente"}</h2>
						<p className="contadd-subtitle">
							Complete los datos para registrar al contribuyente y mantener actualizado el catastro.
						</p>

						<div className="contadd-meta-grid">
							<div>
								<strong>Modo</strong>
								<p>{modoEdicion ? "Edicion" : "Registro"}</p>
							</div>

							<div>
								<strong>Parroquias</strong>
								<p>{parroquiasDisponibles.length}</p>
							</div>

							<div>
								<strong>Identificador</strong>
								<p>{ruc || "Nuevo"}</p>
							</div>
						</div>
					</div>

					<div className="contadd-hero-actions">
						<button
							type="button"
							className="contadd-secondary-button"
							onClick={() => navigate("/contribuyentes")}
						>
							Cancelar
						</button>
						<button type="submit" form="contadd-form" className="contadd-primary-button">
							{modoEdicion ? "Actualizar" : "Guardar"}
						</button>
					</div>
				</section>

				<section className="contadd-form-shell">
					{cargandoCatalogos && <p className="contadd-info-banner">Cargando catalogos...</p>}

					<form id="contadd-form" onSubmit={handleSubmit} className="contadd-form-grid">
						<label className="contadd-field">
							<span>RUC / Cedula</span>
							<input
								name="ruc_cont"
								value={form.ruc_cont}
								onChange={handleChange}
								disabled={modoEdicion}
								required
							/>
						</label>

						<label className="contadd-field">
							<span>Nombre</span>
							<input name="nombre_cont" value={form.nombre_cont} onChange={handleChange} required />
						</label>

						<label className="contadd-field contadd-field-full">
							<span>Direccion</span>
							<input name="direccion_cont" value={form.direccion_cont} onChange={handleChange} />
						</label>

						<label className="contadd-field">
							<span>Email</span>
							<input name="email_cont" value={form.email_cont} onChange={handleChange} type="email" />
						</label>

						<label className="contadd-field">
							<span>Razon social</span>
							<input name="razon_social_cont" value={form.razon_social_cont} onChange={handleChange} />
						</label>

						<label className="contadd-field">
							<span>Telefono</span>
							<input name="telefono_cont" value={form.telefono_cont} onChange={handleChange} />
						</label>

						<label className="contadd-field">
							<span>Celular</span>
							<input name="ceclular_cont" value={form.ceclular_cont} onChange={handleChange} />
						</label>

						<label className="contadd-field contadd-field-full">
							<span>Representante</span>
							<input name="representante" value={form.representante} onChange={handleChange} />
						</label>

						<label className="contadd-field contadd-field-full">
							<span>Parroquia</span>
							<select name="parroquia_id" value={form.parroquia_id} onChange={handleChange} required>
								<option value="">Seleccione una parroquia</option>
								{parroquiasDisponibles.map((item) => (
									<option key={item.id} value={item.id}>
										{item.nombre}
									</option>
								))}
							</select>
						</label>
					</form>

					{mensaje && (
						<p className={`contadd-info-banner ${esError ? "contadd-info-error" : ""}`}>{mensaje}</p>
					)}
				</section>
			</div>
		</div>
	);
};

export default ContribuyentesAdd;