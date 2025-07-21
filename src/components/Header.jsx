// src/components/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser  } from '../pages/usercontext';
import './header.css';
import image1 from '../assets/logoq.jpeg';

const Header = ({ opcionesmenu }) => {
    const [selectedOption, setSelectedOption] = useState(opcionesmenu[0]);

    const handleOptionChange = (opcion) => {
        setSelectedOption(opcion);
    };

    return (
        <header>
            <nav className="navbar">
                <div className="imagen">
                    <img className="logo" src={image1} alt="Logo" />
                </div>
                <ul className="nav-links">
                    {opcionesmenu?.map((opcion) => (
                        <li key={opcion.name}>
                            <Link to={opcion.path} onClick={() => handleOptionChange(opcion)}>
                                {opcion.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
};

export default Header;