import React, { useEffect, useState } from 'react';
import {
  FiCalendar,
  FiPlus,
  FiTrash2
} from 'react-icons/fi';

export default function PasoDatosGenerales({ datos, onChange, onNext, idMetodologia }) {
  const [empresas, setEmpresas] = useState([]);
  const objetivos     = datos.objetivos     || [];
  const participantes = datos.participantes || [];
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('https://backendcalid-production.up.railway.app/empresas/')
      .then(r => r.json())
      .then(setEmpresas)
      .catch(console.error);
  }, []);

  const handleInput = e =>
    onChange({ ...datos, [e.target.name]: e.target.value });

  const handleEmpresaChange = e => {
    if (e.target.value === 'otra') {
      onChange({
        ...datos,
        empresa_nueva: true,
        empresa: '',
        empresa_id: null,
        telefono: ''
      });
    } else {
      const sel = empresas.find(emp => emp.id_empresa === +e.target.value) || {};
      onChange({
        ...datos,
        empresa_nueva: false,
        empresa_id: sel.id_empresa || null,
        empresa: sel.nombre     || '',
        telefono: sel.telefono  || ''
      });
    }
  };

  // —— Objetivos —— 
  const addObjetivo = () =>
    onChange({
      ...datos,
      objetivos: [...objetivos, { descripcion: '', tipo: '' }]
    });

  const updateObjetivo = (idx, field, value) => {
    const nuevos = objetivos.map((o, i) =>
      i === idx ? { ...o, [field]: value } : o
    );
    onChange({ ...datos, objetivos: nuevos });
  };

  const removeObjetivo = idx => {
    const nuevos = objetivos.filter((_, i) => i !== idx);
    onChange({ ...datos, objetivos: nuevos });
  };

  // —— Participantes —— 
  const addParticipante = () =>
    onChange({
      ...datos,
      participantes: [...participantes, { nombre: '', cargo: '', firma: '' }]
    });

  const updateParticipante = (idx, field, value) => {
    const nuevos = participantes.map((p, i) =>
      i === idx ? { ...p, [field]: value } : p
    );
    onChange({ ...datos, participantes: nuevos });
  };

  const removeParticipante = idx => {
    const nuevos = participantes.filter((_, i) => i !== idx);
    onChange({ ...datos, participantes: nuevos });
  };

  // —— Reinyección de la capa funcional original —— 
  const handleNext = async () => {
    // Validar campos básicos
    if (
      !datos.fecha ||
      !datos.ciudad ||
      !datos.nombre_software ||
      (!datos.empresa_nueva && !datos.empresa_id) ||
      !datos.telefono
    ) {
      setError('Todos los campos de datos generales son obligatorios.');
      return;
    }
    if (datos.empresa_nueva && !datos.empresa) {
      setError('El nombre de la nueva empresa es obligatorio.');
      return;
    }

    // Validar participantes
    if (participantes.length < 1) {
      setError('Debe haber al menos un participante.');
      return;
    }
    for (const p of participantes) {
      if (!p.nombre || !p.cargo || !p.firma) {
        setError('Todos los campos de cada participante son obligatorios.');
        return;
      }
    }

    // Validar objetivos
    if (objetivos.length < 1) {
      setError('Debe haber al menos un objetivo.');
      return;
    }
    const generales = objetivos.filter(o => o.tipo === 'general');
    const especificos = objetivos.filter(o => o.tipo === 'especifico');
    if (generales.length < 1) {
      setError('Debe haber al menos un objetivo general.');
      return;
    }
    if (especificos.length < 1) {
      setError('Debe haber al menos un objetivo específico.');
      return;
    }
    for (const o of objetivos) {
      if (!o.descripcion || !o.tipo) {
        setError('Todos los campos de cada objetivo son obligatorios.');
        return;
      }
    }

    setError('');

    // 1. Crear empresa si es nueva
    let id_empresa = datos.empresa_id;
    if (datos.empresa_nueva) {
      try {
        const res = await fetch('https://backendcalid-production.up.railway.app/empresas/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: datos.empresa,
            telefono: datos.telefono
          })
        });
        if (!res.ok) throw new Error('Error creando la empresa');
        const empresaCreada = await res.json();
        id_empresa = empresaCreada.id_empresa;
      } catch (err) {
        setError('No se pudo crear la empresa: ' + err.message);
        return;
      }
    }
    if (!id_empresa) {
      setError('Debes seleccionar o crear una empresa válida.');
      return;
    }

    // 2. Crear el formulario
    let formulario;
    try {
      const id_usuario = Number(localStorage.getItem('id_usuario'));
      const formularioPayload = {
        id_empresa,
        fecha: datos.fecha,
        ciudad: datos.ciudad,
        nombre_software: datos.nombre_software,
        id_metodologia: Number(idMetodologia),
        id_usuario
      };
      console.log('JSON que se enviará al backend para crear el formulario:', formularioPayload);
      const res = await fetch('https://microform-production.up.railway.app/formularios/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formularioPayload)
      });
      if (!res.ok) throw new Error('Error creando el formulario');
      formulario = await res.json();
    } catch (err) {
      setError('No se pudo crear el formulario: ' + err.message);
      return;
    }
    const id_formulario = formulario.id_formulario;

    // 3. Crear objetivos
    for (const obj of objetivos) {
      try {
        const res = await fetch('https://microform-production.up.railway.app/objetivos/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_formulario,
            descripcion: obj.descripcion,
            tipo: obj.tipo
          })
        });
        if (!res.ok) throw new Error('Error creando objetivo');
      } catch (err) {
        setError('No se pudo crear un objetivo: ' + err.message);
        return;
      }
    }

    // 4. Crear participantes
    for (const p of participantes) {
      try {
        const res = await fetch('https://microform-production.up.railway.app/participantes/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_formulario,
            nombre: p.nombre,
            cargo: p.cargo,
            firma: p.firma
          })
        });
        if (!res.ok) throw new Error('Error creando participante');
      } catch (err) {
        setError('No se pudo crear un participante: ' + err.message);
        return;
      }
    }

    // 5. Continuar al siguiente paso con el ID creado
    setError('');
    onNext(id_formulario);
  };

  return (
    <div>
      {/* HEADER */}
      <div className="px-6 py-4 border-b">
        <h1 className="text-2xl font-semibold text-gray-800">
          Datos Generales
        </h1>
      </div>

      {/* CUERPO DEL FORM */}
      <div className="px-6 py-6 space-y-8">
        {/* Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha
            </label>
            <div className="mt-1 relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                name="fecha"
                value={datos.fecha || ''}
                onChange={handleInput}
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Ciudad */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ciudad
            </label>
            <input
              type="text"
              name="ciudad"
              value={datos.ciudad || ''}
              onChange={handleInput}
              placeholder="Ej: Bogotá"
              className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Empresa */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Empresa
            </label>
            <select
              value={datos.empresa_id || ''}
              onChange={handleEmpresaChange}
              className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Selecciona una empresa</option>
              {empresas.map(emp => (
                <option key={emp.id_empresa} value={emp.id_empresa}>
                  {emp.nombre}
                </option>
              ))}
              <option value="otra">Otra (especificar)</option>
            </select>
            {datos.empresa_nueva && (
              <input
                name="empresa"
                placeholder="Nombre de la nueva empresa"
                value={datos.empresa || ''}
                onChange={handleInput}
                className="mt-3 w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              name="telefono"
              value={datos.telefono || ''}
              onChange={handleInput}
              disabled={!!datos.empresa_id && !datos.empresa_nueva}
              placeholder="Ej: +57 300 1234567"
              className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Nombre del Software */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre del Software
            </label>
            <input
              name="nombre_software"
              value={datos.nombre_software || ''}
              onChange={handleInput}
              placeholder="Ej: Sistema de Facturación"
              className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* Objetivos */}
        <section>
          <h2 className="text-lg font-medium text-gray-700 border-b pb-2 mb-4">
            Objetivos
          </h2>
          <div className="space-y-4">
            {objetivos.map((o, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center"
              >
                <input
                  type="text"
                  placeholder="Descripción"
                  value={o.descripcion}
                  onChange={e => updateObjetivo(i, 'descripcion', e.target.value)}
                  className="md:col-span-4 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <select
                  value={o.tipo}
                  onChange={e => updateObjetivo(i, 'tipo', e.target.value)}
                  className="md:col-span-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Tipo</option>
                  <option value="general">General</option>
                  <option value="especifico">Específico</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeObjetivo(i)}
                  className="btn-eliminar ml-4 rounded-lg p-2"
                >
                  <FiTrash2 className="mr-2" />
                  Eliminar
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button
              onClick={addObjetivo}
              className="inline-flex items-center px-5 py-2 rounded-lg bg-black hover:bg-gray-800 text-white font-medium transition"
            >
              <FiPlus className="mr-2" /> Agregar objetivo
            </button>
          </div>
        </section>

        {/* Participantes */}
        <section>
          <h2 className="text-lg font-medium text-gray-700 border-b pb-2 mb-4">
            Participantes
          </h2>
          <div className="space-y-4">
            {participantes.map((p, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center"
              >
                <input
                  type="text"
                  placeholder="Nombre"
                  value={p.nombre}
                  onChange={e => updateParticipante(i, 'nombre', e.target.value)}
                  className="md:col-span-2 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="text"
                  placeholder="Cargo"
                  value={p.cargo}
                  onChange={e => updateParticipante(i, 'cargo', e.target.value)}
                  className="md:col-span-2 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="text"
                  placeholder="Firma"
                  value={p.firma}
                  onChange={e => updateParticipante(i, 'firma', e.target.value)}
                  className="md:col-span-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  type="button"
                  onClick={() => removeParticipante(i)}
                  className="btn-eliminar ml-4 rounded-lg p-2"
                >
                  <FiTrash2 className="mr-2" />
                  Eliminar
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button
              onClick={addParticipante}
              className="inline-flex items-center px-5 py-2 rounded-lg bg-black hover:bg-gray-800 text-white font-medium transition"
            >
              <FiPlus className="mr-2" /> Agregar participante
            </button>
          </div>
        </section>

        {error && (
          <p className="text-red-600">
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-lg bg-black hover:bg-gray-800 text-white font-semibold transition"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
