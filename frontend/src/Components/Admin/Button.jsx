import React from "react";

const Button = ({ children, onClick, loading, disabled, className }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`cursor-pointer drop-shadow-xl w-full bg-[#748dff] text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors ${className}`}>
    {loading ? <span className="animate-spin border-b-2 border-white h-4 w-4 inline-block mr-2"></span> : null}
    {children}
  </button>
);

export default Button;
