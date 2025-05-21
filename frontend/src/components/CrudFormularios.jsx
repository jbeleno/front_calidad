import React, { useEffect, useState } from "react";

const API = "https://microform-production.up.railway.app/formularios/";
const EMPRESAS_API = "https://backendcalid-production.up.railway.app/empresas/";
const USUARIOS_API = "https://backendcalid-production.up.railway.app/usuarios/";
const METODOLOGIAS_API = "https://microform-production.up.railway.app/metodologias/";

export default function CrudFormularios() {
  const [formularios, setFormularios] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [metodologias, setMetodologias] = useState([]);
  const [form, setForm] = useState({
    id_empresa: "",
    fecha: "",
    ciudad: "",
    nombre_software: "",
    id_usuario: "",
    id_metodologia: ""
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchFormularios = async () => {
    const res = await fetch(API);
    setFormularios(await res.json());
  };
  const fetchEmpresas = async () => {
    const res = await fetch(EMPRESAS_API);
    setEmpresas(await res.json());
  };
  const fetchUsuarios = async () => {
    const res = await fetch(USUARIOS_API);
    setUsuarios(await res.json());
  };
  const fetchMetodologias = async () => {
    const res = await fetch(METODOLOGIAS_API);
    setMetodologias(await res.json());
  };

  useEffect(() => {
    fetchFormularios();
    fetchEmpresas();
    fetchUsuarios();
    fetchMetodologias();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? API + editId : API;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          id_empresa: Number(form.id_empresa),
          id_usuario: Number(form.id_usuario),
          id_metodologia: Number(form.id_metodologia)
        })
      });
      if (!res.ok) throw new Error("Error al guardar formulario");
      setForm({ id_empresa: "", fecha: "", ciudad: "", nombre_software: "", id_usuario: "", id_metodologia: "" });
      setEditId(null);
      fetchFormularios();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleEdit = f => {
    setForm({
      id_empresa: f.id_empresa,
      fecha: f.fecha,
      ciudad: f.ciudad || "",
      nombre_software: f.nombre_software || "",
      id_usuario: f.id_usuario,
      id_metodologia: f.id_metodologia
    });
    setEditId(f.id_formulario);
  };

  const handleDelete = async id => {
    if (!window.confirm("¿Eliminar formulario?")) return;
    await fetch(API + id, { method: "DELETE" });
    fetchFormularios();
  };

  return (
    <div className="wizard-container" style={{margin:0, padding:0}}>
      <h3 style={{marginBottom:16}}>Formularios</h3>
      <div className="shadow-md rounded-xl bg-white" style={{overflowX:'auto'}}>
        <table className="min-w-full table-auto" style={{marginBottom:24}}>
          <thead className="bg-gray-100">
            <tr>
              <th>ID</th>
              <th>Empresa</th>
              <th>Fecha</th>
              <th>Ciudad</th>
              <th>Software</th>
              <th>Usuario</th>
              <th>Metodología</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {formularios.map(f => (
              <tr key={f.id_formulario}>
                <td>{f.id_formulario}</td>
                <td>{empresas.find(e => e.id_empresa === f.id_empresa)?.nombre || f.id_empresa}</td>
                <td>{f.fecha}</td>
                <td>{f.ciudad}</td>
                <td>{f.nombre_software}</td>
                <td>{usuarios.find(u => u.id_usuario === f.id_usuario)?.nombre || f.id_usuario}</td>
                <td>{metodologias.find(m => m.id_metodologia === f.id_metodologia)?.nombre || f.id_metodologia}</td>
                <td>
                  <button onClick={() => handleEdit(f)} style={{marginRight:8, color:'#1976d2'}}>Editar</button>
                  <button onClick={() => handleDelete(f.id_formulario)} style={{color:'#dc2626'}}>Eliminar</button>
                </td>
              </tr>
            ))}
            {formularios.length === 0 && (
              <tr><td colSpan={8} style={{textAlign:'center'}}>No hay formularios</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {editId && (
        <form onSubmit={handleSubmit} className="wizard-step" style={{maxWidth:400, margin:'0 auto', display:'flex', flexDirection:'column', gap:8}}>
          <h4>Editar formulario</h4>
          <label>Empresa</label>
          <select name="id_empresa" value={form.id_empresa} onChange={handleChange} required className="input" style={{padding:8, border:'1px solid #bbb', borderRadius:4, color:'#111'}}>
            <option value="">Seleccione una empresa</option>
            {empresas.map(e => (
              <option key={e.id_empresa} value={e.id_empresa}>{e.nombre}</option>
            ))}
          </select>
          <label>Fecha</label>
          <input name="fecha" type="date" value={form.fecha} onChange={handleChange} required className="input" style={{padding:8, border:'1px solid #bbb', borderRadius:4, color:'#111'}} />
          <label>Ciudad</label>
          <input name="ciudad" value={form.ciudad} onChange={handleChange} className="input" style={{padding:8, border:'1px solid #bbb', borderRadius:4, color:'#111'}} />
          <label>Nombre del software</label>
          <input name="nombre_software" value={form.nombre_software} onChange={handleChange} className="input" style={{padding:8, border:'1px solid #bbb', borderRadius:4, color:'#111'}} />
          <label>Usuario</label>
          <select name="id_usuario" value={form.id_usuario} onChange={handleChange} required className="input" style={{padding:8, border:'1px solid #bbb', borderRadius:4, color:'#111'}} disabled={!!editId}>
            <option value="">Seleccione un usuario</option>
            {usuarios.map(u => (
              <option key={u.id_usuario} value={u.id_usuario}>{u.nombre} ({u.correo})</option>
            ))}
          </select>
          <label>Metodología</label>
          <select name="id_metodologia" value={form.id_metodologia} onChange={handleChange} required className="input" style={{padding:8, border:'1px solid #bbb', borderRadius:4, color:'#111'}} disabled={!!editId}>
            <option value="">Seleccione una metodología</option>
            {metodologias.map(m => (
              <option key={m.id_metodologia} value={m.id_metodologia}>{m.nombre}</option>
            ))}
          </select>
          {error && <div style={{color:'red'}}>{error}</div>}
          <button type="submit" disabled={loading} className="btn" style={{background:'#1976d2', color:'#fff', border:'none', padding:'10px 24px', borderRadius:6, fontSize:'1em', cursor:'pointer', marginTop:8}}>{loading ? "Guardando..." : "Guardar cambios"}</button>
          <button type="button" onClick={()=>{setEditId(null);setForm({ id_empresa: "", fecha: "", ciudad: "", nombre_software: "", id_usuario: "", id_metodologia: "" });}} style={{marginTop:8}}>Cancelar</button>
        </form>
      )}
    </div>
  );
}
