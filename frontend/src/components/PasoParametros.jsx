import React, { useEffect, useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

export default function PasoParametros({ parametros, onChange, onNext, onBack }) {
  const [parametrosPredeterminados, setParametrosPredeterminados] = useState([]);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    fetch('https://microev-production.up.railway.app/parametros_predeterminados/')
      .then(r => r.json())
      .then(setParametrosPredeterminados)
      .catch(console.error);
  }, []);

  const handleAddParametro = () => {
    const nuevos = [
      ...parametros,
      { id_parametro_predeterminado: '', nombre: '', descripcion: '', porcentaje_maximo: '', porcentaje_obtenido: '' }
    ];
    onChange(nuevos);
  };

  const handleSelect = (idx, e) => {
    const id = e.target.value;
    const sel = parametrosPredeterminados.find(p => p.id_parametro_predeterminado === +id) || {};
    const nuevos = parametros.slice();
    nuevos[idx] = {
      ...nuevos[idx],
      id_parametro_predeterminado: id ? +id : '',
      nombre: sel.nombre || '',
      descripcion: sel.descripcion || ''
    };
    onChange(nuevos);
  };

  const handleInput = (idx, e) => {
    const { name, value } = e.target;
    const nuevos = parametros.slice();
    nuevos[idx][name] = value;
    onChange(nuevos);
  };

  const handleNextClick = async () => {
    if (guardando) return;
    setGuardando(true);

    const suma = parametros.reduce((acc, p) => acc + (parseFloat(p.porcentaje_maximo) || 0), 0);
    if (suma > 100) {
      setError('La suma de los porcentajes no puede ser mayor a 100%.');
      setGuardando(false);
      return;
    }
    if (suma < 100) {
      setError('La suma de los porcentajes debe ser exactamente 100%.');
      setGuardando(false);
      return;
    }

    for (const p of parametros) {
      if (!p.id_parametro_predeterminado && (!p.nombre || !p.descripcion)) {
        setError('Si no seleccionas un parámetro predeterminado, debes llenar nombre y descripción.');
        setGuardando(false);
        return;
      }
      if (!p.porcentaje_maximo) {
        setError('Todos los parámetros deben tener porcentaje máximo.');
        setGuardando(false);
        return;
      }
    }

    // Validación de duplicados
    const llaves = new Set();
    for (const p of parametros) {
      const key = `${p.id_parametro_predeterminado}-${p.nombre.trim().toLowerCase()}`;
      if (llaves.has(key)) {
        setError('No puedes agregar parámetros repetidos.');
        setGuardando(false);
        return;
      }
      llaves.add(key);
    }

    setError('');
    // Aquí iría la lógica de guardado en backend si fuese necesaria...
    onNext();
    setGuardando(false);
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Parámetros y Porcentaje</h1>
      </div>

      {/* Lista de parámetros */}
      <div className="flex flex-col gap-6">
        {parametros.map((p, i) => (
          <div
            key={i}
            className="relative bg-gray-50 rounded-xl shadow-md flex flex-col md:flex-row md:items-start gap-4 border border-gray-200 transition hover:shadow-lg group px-6 py-5"
          >
            {/* Select + descripción */}
            <div className="flex-1 min-w-0 flex flex-col gap-2 md:pr-4">
              <select
                value={p.id_parametro_predeterminado || ''}
                onChange={e => handleSelect(i, e)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium shadow-sm"
              >
                <option value="">Selecciona un parámetro</option>
                {parametrosPredeterminados.map(pp => (
                  <option
                    key={pp.id_parametro_predeterminado}
                    value={pp.id_parametro_predeterminado}
                  >
                    {pp.nombre}
                  </option>
                ))}
              </select>
              {p.descripcion && (
                <p className="text-gray-500 text-sm font-normal italic">
                  {p.descripcion}
                </p>
              )}
            </div>

            {/* Porcentaje máximo alineado arriba */}
            <div className="flex flex-row items-start gap-2 md:w-48 min-w-[140px] md:pr-4">
              <label className="text-gray-700 text-sm font-semibold whitespace-nowrap mr-2">Porcentaje</label>
              <input
                name="porcentaje_maximo"
                type="number"
                placeholder="%"
                value={p.porcentaje_maximo}
                onChange={e => handleInput(i, e)}
                className="w-20 border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium shadow-sm"
                min="0"
                max="100"
              />
            </div>

            {/* Botón eliminar alineado arriba */}
            <div className="flex items-start md:justify-end md:w-40 mt-2 md:mt-0">
              <button
                type="button"
                onClick={() => {
                  const nuevos = parametros.slice();
                  nuevos.splice(i, 1);
                  onChange(nuevos);
                }}
                className="btn-eliminar"
                title="Eliminar parámetro"
              >
                <FiTrash2 className="mr-2" />
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Agregar parámetro */}
      <div className="flex justify-center mt-8 mb-4">
        <button
          type="button"
          onClick={handleAddParametro}
          className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold text-lg shadow-lg transition transform hover:scale-105 focus:outline-none"
        >
          <FiPlus className="mr-2 text-2xl" />
          Agregar parámetro
        </button>
      </div>

      {/* Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
        <button
          onClick={onBack}
          className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition shadow"
        >
          Atrás
        </button>

        {error && (
          <div className="flex-1 flex justify-center">
            <p className="bg-red-50 border border-red-300 text-red-700 px-6 py-3 rounded-lg text-center font-semibold shadow animate-shake">
              {error}
            </p>
          </div>
        )}

        <button
          onClick={handleNextClick}
          disabled={guardando}
          className="px-8 py-3 rounded-lg bg-black hover:bg-gray-800 text-white font-semibold text-lg transition shadow ml-auto disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {guardando ? 'Guardando...' : 'Siguiente'}
        </button>
      </div>
    </>
  );
}
