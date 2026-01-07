import { Link } from "react-router-dom";

export default function QuickAction({ icon, label, color, to }) {
  const Tag = to ? Link : "button";

  return (
    <Tag
      to={to} 
      className={`
        cursor-pointer flex items-center gap-4 p-4 rounded-xl shadow-md 
        bg-white dark:bg-slate-800 dark:text-white
        border-l-4 ${color}
        hover:scale-105 hover:shadow-xl transition-transform transition-shadow duration-300
        group
        w-full text-left
      `}
    >
      {/* Icon */}
      <span className="text-2xl text-gray-700 dark:text-white group-hover:text-[#748dff] transition-colors duration-300">
        {icon}
      </span>

      {/* Label */}
      <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-[#748dff] transition-colors duration-300">
        {label}
      </span>
    </Tag>
  );
}
