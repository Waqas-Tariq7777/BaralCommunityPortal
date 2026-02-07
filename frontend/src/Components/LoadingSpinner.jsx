// imports
import React from "react";
import { motion } from "framer-motion";

// sleek modern gradient spinner
export default function LoadingSpinner({ size = 50, color = "#748dff" }) {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        {/* Background ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: `${size / 10}px solid #e0e0e0`, // subtle light background
          }}
        ></div>

        {/* Gradient spinning arc */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: `${size / 10}px solid transparent`,
            borderTopColor: color,
            borderRightColor: color,
            boxShadow: `0 0 ${size / 5}px ${color}`, // subtle glow
          }}
        ></div>
      </motion.div>
    </div>
  );
}
