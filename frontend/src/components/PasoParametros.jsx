import React, { useEffect, useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

export default function PasoParametros({ parametros, onChange, onNext, onBack, idFormulario, idMetodologia }) {
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
    onChange([
      ...parametros,
      {
        id_parametro_predeterminado: '',
        nombre: '',
        descripcion: '',
        porcentaje_maximo: '',
        porcentaje_obtenido: '',
        esManual: false
      }
    ]);
  };

  const handleAddParametroManual = () => {
    onChange([
      ...parametros,
      {
        id_parametro_predeterminado: '',
        nombre: '',
        descripcion: '',
        porcentaje_maximo: '',
        porcentaje_obtenido: '',
        esManual: true
      }
    ]);
  };

  const handleSelect = (idx, e) => {
    const id = e.target.value;
    const sel = parametrosPredeterminados.find(p => p.id_parametro_predeterminado === +id) || {};
    const copia = [...parametros];
    copia[idx] = {
      ...copia[idx],
      id_parametro_predeterminado: id ? +id : '',
      nombre: sel.nombre || '',
      descripcion: sel.descripcion || ''
    };
    onChange(copia);
  };

  const handleInput = (idx, e) => {
    const { name, value } = e.target;
    const copia = [...parametros];
    copia[idx][name] = value;
    onChange(copia);
  };

  const handleNextClick = async () => {
    if (guardando) return;
    setGuardando(true);

    // 1. Validaciones de suma
    const suma = parametros.reduce(
      (acc, p) => acc + (parseFloat(p.porcentaje_maximo) || 0),
      0
    );
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

    // 2. Validaciones de campos obligatorios
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

    // 3. Validación de duplicados
    const llaves = new Set();
    for (const p of parametros) {
      const clave = `${p.id_parametro_predeterminado}-${p.nombre.trim().toLowerCase()}`;
      if (llaves.has(clave)) {
        setError('No puedes agregar parámetros repetidos.');
        setGuardando(false);
        return;
      }
      llaves.add(clave);
    }

    // 4. Filtrar parámetros únicos igual que en la versión original
    const parametrosUnicos = parametros.filter((p, idx, arr) =>
      arr.findIndex(x =>
        Number(x.id_parametro_predeterminado) === Number(p.id_parametro_predeterminado) &&
        x.nombre === p.nombre
      ) === idx
    );

    // 5. (Opcional) Log para depurar
    console.log('Guardando parámetros...');
    console.log('Parámetros que se enviarán al backend:', parametrosUnicos);

    // 6. Limpiar error y avanzar
    setError('');
    onNext();
    setGuardando(false);
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Parámetros y Porcentaje
        </h1>
      </div>

      {/* Lista de parámetros */}
      <div className="flex flex-col gap-6">
        {parametros.map((p, i) => (
          <div
            key={i}
            className="relative bg-gray-50 rounded-xl shadow-md flex flex-col md:flex-row md:items-start gap-4 border border-gray-200 transition hover:shadow-lg group px-6 py-5"
          >
            {/* Select + descripción o inputs manuales */}
            <div className="flex-1 min-w-0 flex flex-col gap-2 md:pr-4">
              {p.esManual ? (
                <>
                  <input
                    name="nombre"
                    value={p.nombre}
                    onChange={e => handleInput(i, e)}
                    placeholder="Nombre del parámetro"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium shadow-sm"
                  />
                  <input
                    name="descripcion"
                    value={p.descripcion}
                    onChange={e => handleInput(i, e)}
                    placeholder="Descripción"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium shadow-sm"
                  />
                </>
              ) : (
                <>
                  <select
                    value={p.id_parametro_predeterminado || ''}
                    onChange={e => handleSelect(i, e)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium shadow-sm"
                  >
                    <option value="">Selecciona un parámetro</option>
                    {parametrosPredeterminados
                      .filter(pp => Number(pp.id_metodologia) === Number(idMetodologia))
                      .map(pp => (
                        <option key={pp.id_parametro_predeterminado} value={pp.id_parametro_predeterminado}>
                          {pp.nombre}
                        </option>
                      ))}
                  </select>
                  {p.descripcion && (
                    <p className="text-gray-500 text-sm font-normal italic">
                      {p.descripcion}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Porcentaje máximo */}
            <div className="flex flex-row items-start gap-2 md:w-48 min-w-[140px] md:pr-4">
              <label className="text-gray-700 text-sm font-semibold whitespace-nowrap mr-2">
                Porcentaje
              </label>
              <input
                name="porcentaje_maximo"
                type="number"
                placeholder="%"
                min="0"
                max="100"
                value={p.porcentaje_maximo}
                onChange={e => handleInput(i, e)}
                className="w-20 border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium shadow-sm"
              />
            </div>

            {/* Botón Eliminar */}
            <div className="flex items-start md:justify-end md:w-40 mt-2 md:mt-0">
              <button
                type="button"
                onClick={() => {
                  const copia = parametros.slice();
                  copia.splice(i, 1);
                  onChange(copia);
                }}
                className="btn-eliminar inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition"
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
      <div className="flex justify-center mt-8 mb-4 gap-4">
        <button
          type="button"
          onClick={handleAddParametro}
          className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold text-lg shadow-lg transition transform hover:scale-105 focus:outline-none"
        >
          <FiPlus className="mr-2 text-2xl" />
          Agregar parámetro predeterminado
        </button>
        <button
          type="button"
          onClick={handleAddParametroManual}
          className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-gray-600 to-gray-400 hover:from-gray-700 hover:to-gray-500 text-white font-bold text-lg shadow-lg transition transform hover:scale-105 focus:outline-none"
        >
          <FiPlus className="mr-2 text-2xl" />
          Agregar parámetro manualmente
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
