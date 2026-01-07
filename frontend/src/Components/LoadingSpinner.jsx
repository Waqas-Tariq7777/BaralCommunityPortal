// imports
import React from "react";
import { motion } from "framer-motion";

// loading spinner component
export default function LoadingSpinner({ size = 50, color = "#748dff" }) {
  return (

    <motion.div className="flex items-center justify-center" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
      <div style={{ borderTopColor: color, width: size, height: size }} className="border-4 border-gray-200 border-t-4 rounded-full"></div>
    </motion.div>
  );
}
