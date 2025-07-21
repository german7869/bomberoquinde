import React, { useState } from 'react';
import axios from 'axios';

const CedulaInput = () => {
    const [cedula, setCedula] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const value = e.target.value;
        // Validate if the input is a number and has 10 digits
        if (/^\d{0,10}$/.test(value)) {
            setCedula(value);
            setError('');
        } else {
            setError('Cedula must be a 10-digit number.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cedula.length === 10) {
            try {
                const response = await axios.post('YOUR_BACKEND_ENDPOINT', { cedula });
                console.log(response.data);
            } catch (error) {
                console.error('Error submitting cedula:', error);
            }
        } else {
            setError('Cedula must be exactly 10 digits.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={cedula}
                onChange={handleChange}
                placeholder="Enter Cedula"
            />
            <button type="submit">Submit</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default CedulaInput;