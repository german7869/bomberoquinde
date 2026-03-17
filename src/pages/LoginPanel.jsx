// src/components/LoginPanel.jsx

import React, { useState } from "react";
import axiosInstance from "../utils/api";
import { useNavigate } from "react-router-dom";

import { FaUser, FaLock, FaTimes } from "react-icons/fa";

import "./loginpanel.css";

const LoginPanel = ({ isOpen, onClose }) => {

const navigate = useNavigate();

const [username,setUsername] = useState("");
const [password,setPassword] = useState("");
const [error,setError] = useState(null);
const [loading,setLoading] = useState(false);

const handleSubmit = async (e)=>{

e.preventDefault();
setLoading(true);

try{

await axiosInstance.get(`/user/login/${username}/`);

navigate("/dashboard");

}catch(err){

setError("Usuario o contraseña incorrectos");

}finally{

setLoading(false);

}

};

return(

<div className={`login-panel ${isOpen ? "open" : ""}`}>

<div className="login-header">

<h3>Ingreso al Sistema</h3>

<button onClick={onClose}>
<FaTimes/>
</button>

</div>

<form onSubmit={handleSubmit}>

<label>
<FaUser/> Usuario
</label>

<input
type="text"
value={username}
onChange={(e)=>setUsername(e.target.value)}
required
/>

<label>
<FaLock/> Contraseña
</label>

<input
type="password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

<button type="submit">

{loading ? "Ingresando..." : "Ingresar"}

</button>

{error && <p className="error">{error}</p>}

</form>

</div>

);

};

export default LoginPanel;