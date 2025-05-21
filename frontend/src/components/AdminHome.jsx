import React, { useState } from "react";
import CrudUsuarios from "./CrudUsuarios";
import CrudEmpresas from "./CrudEmpresas";
import CrudMetodologias from "./CrudMetodologias";
import CrudFormularios from "./CrudFormularios";
import CrudParametrosPred from "./CrudParametrosPred";
import CrudPreguntasPred from "./CrudPreguntasPred";
import { useUser } from "./UserContext";
import { Navigate, useNavigate } from "react-router-dom";

const TABS = [
  { label: "Usuarios", comp: <CrudUsuarios /> },
  { label: "Empresas", comp: <CrudEmpresas /> },
  { label: "Metodologías", comp: <CrudMetodologias /> },
  { label: "Formularios", comp: <CrudFormularios /> },
  { label: "Parámetros Predeterminados", comp: <CrudParametrosPred /> },
  { label: "Preguntas Predeterminadas", comp: <CrudPreguntasPred /> },
];

export default function AdminHome() {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user || user.rol !== "superadmin") {
    return <Navigate to="/login" />;
  }

  const [tab, setTab] = useState(0);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div className="wizard-container" style={{minHeight:'100vh', position:'relative'}}>
      <button onClick={handleLogout} style={{position:'absolute', top:24, right:24, background:'#dc2626', color:'#fff', border:'none', padding:'8px 18px', borderRadius:6, fontWeight:500, cursor:'pointer'}}>Cerrar sesión</button>
      <h2 style={{marginBottom: 24}}>Panel de Administrador</h2>
      <div style={{display:'flex', gap:8, marginBottom:24, flexWrap:'wrap'}}>
        {TABS.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setTab(i)}
            style={{
              background: tab === i ? '#1976d2' : '#f9f9f9',
              color: tab === i ? '#fff' : '#1976d2',
              border: '1px solid #1976d2',
              borderRadius: 6,
              padding: '8px 18px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div style={{marginTop: 16}}>
        {TABS[tab].comp}
      </div>
    </div>
  );
}
