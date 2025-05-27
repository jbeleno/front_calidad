import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLogOut, FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function Espera() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Verificar si el usuario ya tiene un rol asignado
  useEffect(() => {
    const rol = localStorage.getItem('rol');
    if (rol && rol !== 'usuario') {
      // Si el usuario ya tiene un rol asignado, redirigir según corresponda
      if (rol === 'evaluador') navigate('/empresas');
      else if (rol === 'superadmin') navigate('/admin');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
      >
        {/* Header */}
        <div className="px-6 py-8 text-center bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
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
                className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg"
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
                <FiClock className="w-10 h-10 text-blue-600" />
              </motion.div>
            </div>
            <h1 className="text-2xl font-bold text-white">Cuenta en revisión</h1>
            <p className="mt-2 text-blue-100">Estamos procesando tu solicitud</p>
          </motion.div>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 text-center"
          >
            <div className="flex items-center justify-center text-amber-500 mb-4">
              <FiAlertCircle className="w-8 h-8 mr-2" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">¡Registro exitoso!</h2>
            <p className="text-gray-600">
              Tu cuenta está siendo revisada por un administrador. Te notificaremos por correo electrónico 
              una vez que tu cuenta haya sido activada con el rol correspondiente.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md mb-6"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <FiCheckCircle className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Mientras tanto, puedes cerrar esta página. Serás redirigido automáticamente cuando tu cuenta esté lista.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col space-y-4"
          >
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <FiLogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </motion.button>
            
            <div className="text-center text-sm text-gray-500 mt-4">
              <p>¿Tienes alguna pregunta? <a href="mailto:soporte@tudominio.com" className="font-medium text-blue-600 hover:text-blue-500">Contáctanos</a></p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
