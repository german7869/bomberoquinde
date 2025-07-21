import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React  from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import Contribuyentes from './Contribuyentes';
import axiosInstance from '../utils/api'


const ExisteUser = ({ usevalida, username }) => {
    
  const [data, setData] = useState([]);
  
  React.useEffect(() => {
    axiosInstance.get(`/login/login//${username}/`)
    .then((response) => {
      setData(response.data);
      if (response,data.length >0 ) {
        usevalida(true);
      } else {
        usevalida(false);
      }
      
    });
  }, []);
  
  return (
      <div>validando...</div>          
  
  );
};

export default ExisteUser;