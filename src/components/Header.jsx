// src/components/Header.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

import image1 from "../assets/logoq.jpeg";
import LoginPanel from "../pages/LoginPanel";

const Header = ({ opcionesmenu = [] }) => {

  const [openLogin,setOpenLogin] = useState(false);

  return (

    <header className="header">

      {/* 🔥 LOGO */}
      <div className="logo-container">
        <img src={image1} alt="Bomberos Quinindé" className="logo-img"/>
        <div className="logo-text">
          <h3>Bomberos</h3>
          <span>Quinindé</span>
        </div>
      </div>

      {/* 🔥 MENU CON ICONOS */}
      <nav className="menu">

        {opcionesmenu.map((op)=>{

          const Icon = op.icono; // 👈 clave

          if(op.path === "/iniciar"){
            return(
              <button
                key={op.id}
                className="menu-item login-btn"
                onClick={()=>setOpenLogin(true)}
              >
                {Icon && <Icon />}
                <span>{op.name}</span>
              </button>
            );
          }

          return(
            <Link
              key={op.id}
              to={op.path}
              className="menu-item"
            >
              {Icon && <Icon />}
              <span>{op.name}</span>
            </Link>
          );
        })}

      </nav>

      {/* 🔐 LOGIN */}
      <LoginPanel
        isOpen={openLogin}
        onClose={()=>setOpenLogin(false)}
      />

    </header>
  );
};

export default Header;