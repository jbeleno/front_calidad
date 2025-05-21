import React from "react";
import { useNavigate } from "react-router-dom";

export default function Espera() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };
  return (
    <div className="wizard-container">
      <h2>Espere a que el super admin le cambie el rol</h2>
      <p>Su registro fue exitoso. Un administrador debe asignarle el rol adecuado antes de poder acceder al sistema.</p>
      <button onClick={handleLogout} style={{marginTop: 24, background:'#1976d2', color:'#fff', border:'none', padding:'10px 24px', borderRadius:6, fontSize:'1em', cursor:'pointer'}}>Cerrar sesión</button>
    </div>
  );
}
