import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("https://backendcalid-production.up.railway.app/usuarios/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contraseña, nombre })
      });
      if (!res.ok) throw new Error("No se pudo registrar el usuario");
      const data = await res.json();
      localStorage.setItem('id_usuario', data.id_usuario);
      localStorage.setItem('rol', data.rol || 'usuario');
      setLoading(false);
      navigate("/espera");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="wizard-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <form onSubmit={handleSubmit} className="wizard-step" style={{width: 350, background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.10)', padding: 32, display: 'flex', flexDirection: 'column', gap: 8}}>
        <h2 style={{marginBottom: 24, color: '#111'}}>Registro de usuario</h2>
        <label style={{color:'#111', fontWeight:'bold', marginBottom:4}}>Nombre</label>
        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required style={{padding:8, border:'1px solid #bbb', borderRadius:4, marginBottom:12, color:'#111'}} />
        <label style={{color:'#111', fontWeight:'bold', marginBottom:4}}>Correo</label>
        <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} required style={{padding:8, border:'1px solid #bbb', borderRadius:4, marginBottom:12, color:'#111'}} />
        <label style={{color:'#111', fontWeight:'bold', marginBottom:4}}>Contraseña</label>
        <input type="password" value={contraseña} onChange={e => setContraseña(e.target.value)} required style={{padding:8, border:'1px solid #bbb', borderRadius:4, marginBottom:12, color:'#111'}} />
        {error && <div style={{color: 'red', marginBottom: 8}}>{error}</div>}
        <button type="submit" disabled={loading} style={{background:'#1976d2', color:'#fff', border:'none', padding:'10px 24px', borderRadius:6, fontSize:'1em', cursor:'pointer', marginTop:8}}>{loading ? "Registrando..." : "Registrarse"}</button>
        <div style={{marginTop: 16, textAlign: 'center'}}>
          ¿Ya tienes cuenta? <span style={{color: '#1976d2', cursor: 'pointer'}} onClick={() => navigate('/login')}>Inicia sesión</span>
        </div>
      </form>
    </div>
  );
}
