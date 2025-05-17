import React, { useEffect, useState } from 'react';
import {
  FiCalendar,
  FiPlus,
  FiTrash2
} from 'react-icons/fi';

export default function PasoDatosGenerales({ datos, onChange, onNext }) {
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

  const handleNext = () => {
    // ... tus validaciones existentes ...
    setError('');
    onNext();
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
        {/* Descripción */}
        <input
          type="text"
          placeholder="Descripción"
          value={o.descripcion}
          onChange={e => updateObjetivo(i, 'descripcion', e.target.value)}
          className="md:col-span-4 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />

        {/* Tipo */}
        <select
          value={o.tipo}
          onChange={e => updateObjetivo(i, 'tipo', e.target.value)}
          className="md:col-span-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">Tipo</option>
          <option value="general">General</option>
          <option value="especifico">Específico</option>
        </select>

        {/* Eliminar */}
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

  {/* Agregar objetivo */}
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
        {/* Nombre */}
        <input
          type="text"
          placeholder="Nombre"
          value={p.nombre}
          onChange={e =>
            updateParticipante(i, 'nombre', e.target.value)
          }
          className="md:col-span-2 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />

        {/* Cargo */}
        <input
          type="text"
          placeholder="Cargo"
          value={p.cargo}
          onChange={e =>
            updateParticipante(i, 'cargo', e.target.value)
          }
          className="md:col-span-2 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />

        {/* Firma */}
        <input
          type="text"
          placeholder="Firma"
          value={p.firma}
          onChange={e =>
            updateParticipante(i, 'firma', e.target.value)
          }
          className="md:col-span-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />

        {/* Botón Eliminar con margen */}
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

  {/* Agregar participante con espacio superior */}
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
