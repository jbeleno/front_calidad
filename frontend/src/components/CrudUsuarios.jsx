import React, { useEffect, useState } from "react";

const API = "https://backendcalid-production.up.railway.app/usuarios/";

export default function CrudUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ correo: "", contraseña: "", nombre: "", rol: "usuario" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUsuarios = async () => {
    const res = await fetch(API);
    setUsuarios(await res.json());
  };

  useEffect(() => { fetchUsuarios(); }, []);

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
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Error al guardar usuario");
      setForm({ correo: "", contraseña: "", nombre: "", rol: "usuario" });
      setEditId(null);
      fetchUsuarios();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleEdit = usuario => {
    setForm({ correo: usuario.correo, contraseña: "", nombre: usuario.nombre, rol: usuario.rol });
    setEditId(usuario.id_usuario);
  };

  const handleDelete = async id => {
    if (!window.confirm("¿Eliminar usuario?")) return;
    await fetch(API + id, { method: "DELETE" });
    fetchUsuarios();
  };

  return (
    <div className="wizard-container" style={{margin:0, padding:0}}>
      <h3 style={{marginBottom:16}}>Usuarios</h3>
      <div className="shadow-md rounded-xl bg-white" style={{overflowX:'auto'}}>
        <table className="min-w-full table-auto" style={{marginBottom:24}}>
          <thead className="bg-gray-100">
            <tr>
              <th>ID</th>
              <th>Correo</th>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id_usuario}>
                <td>{u.id_usuario}</td>
                <td>{u.correo}</td>
                <td>{u.nombre}</td>
                <td>{u.rol}</td>
                <td>
                  <button onClick={() => handleEdit(u)} style={{marginRight:8, color:'#1976d2'}}>Editar</button>
                  <button onClick={() => handleDelete(u.id_usuario)} style={{color:'#dc2626'}}>Eliminar</button>
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr><td colSpan={5} style={{textAlign:'center'}}>No hay usuarios</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <form onSubmit={handleSubmit} className="wizard-step" style={{maxWidth:400, margin:'0 auto', display:'flex', flexDirection:'column', gap:8}}>
        <h4>{editId ? "Editar usuario" : "Crear usuario"}</h4>
        <label>Correo</label>
        <input name="correo" value={form.correo} onChange={handleChange} required className="input" style={{padding:8, border:'1px solid #bbb', borderRadius:4, color:'#111'}} />
        <label>Contraseña {editId && <span style={{fontWeight:400, color:'#888'}}>(dejar vacío para no cambiar)</span>}</label>
        <input name="contraseña" type="password" value={form.contraseña} onChange={handleChange} required={!editId} className="input" style={{padding:8, border:'1px solid #bbb', borderRadius:4, color:'#111'}} />
        <label>Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} required className="input" style={{padding:8, border:'1px solid #bbb', borderRadius:4, color:'#111'}} />
        <label>Rol</label>
        <select name="rol" value={form.rol} onChange={handleChange} className="input" style={{padding:8, border:'1px solid #bbb', borderRadius:4, color:'#111'}}>
          <option value="usuario">usuario</option>
          <option value="evaluador">evaluador</option>
          <option value="superadmin">superadmin</option>
        </select>
        {error && <div style={{color:'red'}}>{error}</div>}
        <button type="submit" disabled={loading} className="btn" style={{background:'#1976d2', color:'#fff', border:'none', padding:'10px 24px', borderRadius:6, fontSize:'1em', cursor:'pointer', marginTop:8}}>{loading ? "Guardando..." : (editId ? "Guardar cambios" : "Crear usuario")}</button>
        {editId && <button type="button" onClick={()=>{setEditId(null);setForm({ correo: "", contraseña: "", nombre: "", rol: "usuario" });}} style={{marginTop:8}}>Cancelar</button>}
      </form>
    </div>
  );
}
