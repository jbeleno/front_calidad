import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiUser, FiArrowLeft, FiAlertCircle } from "react-icons/fi";

export default function Register() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
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
      setIsLoading(false);
      navigate("/espera");
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="h-screen flex items-start md:items-center justify-center bg-white p-4 pt-8 md:pt-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/30 relative z-10 my-4"
      >
        {/* Header */}
        <div className="px-6 py-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-20 -left-10 w-40 h-40 bg-white/5 rounded-full"></div>
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            className="relative z-10"
          >
            <div className="flex justify-center mb-4">
              <motion.div 
                className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg"
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut'
                }}
              >
                <FiUser className="w-8 h-8 text-blue-600" />
              </motion.div>
            </div>
            <h1 className="text-2xl font-bold text-white">Crear cuenta</h1>
            <p className="mt-2 text-blue-100">Regístrate para continuar</p>
          </motion.div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center p-4 mb-2 text-sm text-red-700 bg-red-100 rounded-lg"
                role="alert"
              >
                <FiAlertCircle className="flex-shrink-0 w-5 h-5 mr-3" />
                <span className="font-medium">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Name Field */}
          <motion.div 
            className="space-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative">
              <motion.div 
                className="relative z-0"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <input
                  id="name"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-sm font-medium shadow-sm"
                  placeholder="Tu nombre completo"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-blue-500" />
                </div>
                <label
                  htmlFor="name"
                  className="absolute -top-2 left-4 px-2 text-xs font-medium text-blue-600 bg-white rounded-md"
                >
                  Nombre completo
                </label>
              </motion.div>
            </div>
          </motion.div>

          {/* Email Field */}
          <motion.div 
            className="space-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <motion.div 
                className="relative z-0"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <input
                  id="email"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-sm font-medium shadow-sm"
                  placeholder="tucorreo@ejemplo.com"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-blue-500" />
                </div>
                <label
                  htmlFor="email"
                  className="absolute -top-2 left-4 px-2 text-xs font-medium text-blue-600 bg-white rounded-md"
                >
                  Correo electrónico
                </label>
              </motion.div>
            </div>
          </motion.div>

          {/* Password Field */}
          <motion.div 
            className="space-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative">
              <motion.div 
                className="relative z-0"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <input
                  id="password"
                  type="password"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-sm font-medium shadow-sm"
                  placeholder="••••••••"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-blue-500" />
                </div>
                <label
                  htmlFor="password"
                  className="absolute -top-2 left-4 px-2 text-xs font-medium text-blue-600 bg-white rounded-md"
                >
                  Contraseña
                </label>
              </motion.div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-2"
          >
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando cuenta...
                </>
              ) : (
                'Registrarse'
              )}
            </motion.button>
          </motion.div>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center pt-2"
          >
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Inicia sesión
              </Link>
            </p>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
