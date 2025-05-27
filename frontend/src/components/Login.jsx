import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "./UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn, FiAlertCircle, FiUser } from "react-icons/fi";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(
        "https://backendcalid-production.up.railway.app/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo, contraseña }),
        }
      );

      if (!res.ok) throw new Error("Correo o contraseña incorrectos");

      const user = await res.json();
      login(user);
      localStorage.setItem("id_usuario", user.id_usuario);
      localStorage.setItem("rol", user.rol);

      setTimeout(() => {
        if (user.rol === "evaluador") navigate("/empresas");
        else if (user.rol === "superadmin") navigate("/admin");
        else navigate("/espera");
      }, 300);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
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
            <h1 className="text-2xl font-bold text-white">Bienvenido de nuevo</h1>
            <p className="mt-2 text-blue-100">Ingresa tus credenciales para continuar</p>
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

          {/* Email Field */}
          <motion.div 
            className="space-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative">
              <motion.div 
                className="relative z-0"
                whileHover={{ 
                  scale: 1.01,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ 
                  scale: 0.99,
                  transition: { duration: 0.1 }
                }}
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
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <Link
                to="/forgot"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="••••••••"
                required
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center !bg-gray-100 !border !border-gray-200 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                whileTap={{ scale: 0.95 }}
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </motion.button>
            </motion.div>
          </div>

          {/* Submit Button */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                isLoading ? "opacity-90 cursor-not-allowed" : ""
              }`}
              whileHover={!isLoading ? { 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
              } : {}}
              whileTap={!isLoading ? { 
                scale: 0.98,
                boxShadow: "0 5px 15px -5px rgba(59, 130, 246, 0.4)"
              } : {}}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <motion.div 
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  ></motion.div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                <motion.span 
                  className="flex items-center justify-center space-x-2"
                  initial={{ opacity: 1 }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <span>Iniciar sesión</span>
                  <FiLogIn className="w-4 h-4 text-white" />
                </motion.span>
              )}
            </motion.button>
          </motion.div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">¿No tienes una cuenta?</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <Link
              to="/register"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 group transition-colors duration-200"
            >
              <span>Crear una cuenta</span>
              <svg className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </form>

        {/* Footer */}
        <div className="py-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.
        </div>
      </motion.div>
    </div>
  );
}
