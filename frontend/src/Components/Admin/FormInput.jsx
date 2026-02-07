import React from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const FormInput = ({
  label,
  required,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  showPasswordToggle,
  onTogglePassword,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error
            ? "border-red-300 bg-red-50"
            : "border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
        }`}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
        >
          {type === "password" ? <FiEye /> : <FiEyeOff />}
        </button>
      )}
    </div>
    {error && (
      <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
    )}
  </div>
);

export default FormInput;
