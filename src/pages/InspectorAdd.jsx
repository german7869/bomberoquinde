import { useEffect, useState } from "react";
import Header from "../components/Header";
import axiosInstance from "../utils/api";
import { useNavigate, useParams } from "react-router-dom";

import "./inspectoradd.css";

const InspectorsAdd = () => {
	const navigate = useNavigate();
	const { ruc } = useParams();

	const [modoEdicion, setModoEdicion] = useState(false);
	const [mensaje, setMensaje] = useState("");
	const [esError, setEsError] = useState(false);

	const [form, setForm] = useState({
		cedula: "",
		nombre_insp: "",
		direccion_insp: "",
		email_insp: "",
		telefono_insp: "",
		ceclular_insp: "",
		activo: "V",
	});

	const opcionesmenu = [{ id: 1, path: "/contribuyentes", name: "Volver" }];

	useEffect(() => {
		if (!ruc) {
			return;
		}

		const loadInspector = async () => {
			try {
				setModoEdicion(true);
				const response = await axiosInstance.get(`/contribuyentes/listadoins//${ruc}/`);
				setForm(response.data);
			} catch (error) {
				console.error("Error cargando inspector", error);
				setMensaje("No se pudo cargar el inspector para edicion");
				setEsError(true);
			}
		};

		loadInspector();
	}, [ruc]);

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
				await axiosInstance.put(`/contribuyentes/listadoins//`, form);
				setMensaje("Inspector actualizado correctamente");
			} else {
				await axiosInstance.post("/contribuyentes/listadoins//", form);
				setMensaje("Inspector creado correctamente");
			}

			setEsError(false);
			setTimeout(() => {
				navigate("/contribuyentes");
			}, 1200);
		} catch (error) {
			console.error("Error guardando inspector", error);
			setMensaje("Error guardando datos");
			setEsError(true);
		}
	};

	return (
		<div className="app">
			<Header opcionesmenu={opcionesmenu} />

			<div className="container inspadd-page">
				<section className="inspadd-hero">
					<div>
						<p className="inspadd-kicker">Panel de inspector</p>
						<h2>{modoEdicion ? "Editar inspector" : "Nuevo inspector"}</h2>
						<p className="inspadd-subtitle">
							Registre o actualice los datos del inspector para mantener disponible el equipo de
							inspeccion.
						</p>

						<div className="inspadd-meta-grid">
							<div>
								<strong>Modo</strong>
								<p>{modoEdicion ? "Edicion" : "Registro"}</p>
							</div>

							<div>
								<strong>Estado</strong>
								<p>{form.activo === "V" ? "Vigente" : "Inactivo"}</p>
							</div>

							<div>
								<strong>Identificador</strong>
								<p>{ruc || "Nuevo"}</p>
							</div>
						</div>
					</div>

					<div className="inspadd-hero-actions">
						<button
							type="button"
							className="inspadd-secondary-button"
							onClick={() => navigate("/contribuyentes")}
						>
							Cancelar
						</button>
						<button type="submit" form="inspadd-form" className="inspadd-primary-button">
							{modoEdicion ? "Actualizar" : "Guardar"}
						</button>
					</div>
				</section>

				<section className="inspadd-form-shell">
					<form id="inspadd-form" onSubmit={handleSubmit} className="inspadd-form-grid">
						<label className="inspadd-field">
							<span>Cedula</span>
							<input
								name="cedula"
								value={form.cedula}
								onChange={handleChange}
								disabled={modoEdicion}
								required
							/>
						</label>

						<label className="inspadd-field">
							<span>Nombre</span>
							<input name="nombre_insp" value={form.nombre_insp} onChange={handleChange} required />
						</label>

						<label className="inspadd-field inspadd-field-full">
							<span>Direccion</span>
							<input name="direccion_insp" value={form.direccion_insp} onChange={handleChange} />
						</label>

						<label className="inspadd-field">
							<span>Email</span>
							<input
								name="email_insp"
								value={form.email_insp}
								onChange={handleChange}
								type="email"
							/>
						</label>

						<label className="inspadd-field">
							<span>Telefono</span>
							<input name="telefono_insp" value={form.telefono_insp} onChange={handleChange} />
						</label>

						<label className="inspadd-field inspadd-field-full">
							<span>Celular</span>
							<input name="ceclular_insp" value={form.ceclular_insp} onChange={handleChange} />
						</label>
					</form>

					{mensaje && (
						<p className={`inspadd-info-banner ${esError ? "inspadd-info-error" : ""}`}>{mensaje}</p>
					)}
				</section>
			</div>
		</div>
	);
};

export default InspectorsAdd;