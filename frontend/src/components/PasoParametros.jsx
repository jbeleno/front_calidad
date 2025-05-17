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
    <div>
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h1 className="text-2xl font-semibold text-gray-800">
          Parámetros y Porcentaje
        </h1>
      </div>

      {/* Body */}
      <div className="px-6 py-6 space-y-6">
        {parametros.map((p, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start"
          >
            {/* Select + descripción */}
            <div className="md:col-span-4">
              <select
                value={p.id_parametro_predeterminado || ''}
                onChange={e => handleSelect(i, e)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
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
                <p className="mt-2 text-gray-600 text-sm">
                  {p.descripcion}
                </p>
              )}
            </div>

            {/* Porcentaje máximo */}
            <input
              name="porcentaje_maximo"
              type="number"
              placeholder="%" 
              value={p.porcentaje_maximo}
              onChange={e => handleInput(i, e)}
              className="md:col-span-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />

            {/* Eliminar */}
            <button
              type="button"
              onClick={() => {
                const nuevos = parametros.slice();
                nuevos.splice(i, 1);
                onChange(nuevos);
              }}
              className="btn-eliminar md:col-span-1 ml-4 rounded-lg px-4 py-2"
            >
              <FiTrash2 className="mr-2" />
              Eliminar
            </button>
          </div>
        ))}

        {/* Agregar parámetro */}
        <div>
          <button
            type="button"
            onClick={handleAddParametro}
            className="inline-flex items-center px-5 py-2 rounded-lg bg-black hover:bg-gray-800 text-white font-medium transition"
          >
            <FiPlus className="mr-2" />
            Agregar parámetro
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          Atrás
        </button>

        {error && (
          <p className="text-red-600 text-center flex-1 mx-4">
            {error}
          </p>
        )}

        <button
          onClick={handleNextClick}
          disabled={guardando}
          className="px-6 py-3 rounded-lg bg-black hover:bg-gray-800 text-white font-semibold transition ml-auto"
        >
          {guardando ? 'Guardando...' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
}
