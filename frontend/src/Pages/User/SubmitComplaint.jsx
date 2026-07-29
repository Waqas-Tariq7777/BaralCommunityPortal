import { useState } from "react";
import ComplaintModal from "../../Components/User/ComplaintModal";
import { AiOutlineThunderbolt, AiOutlineTool, AiOutlineBuild, AiOutlineHome, AiOutlineFormatPainter, AiOutlineStar } from "react-icons/ai";
import { useTranslation } from "react-i18next";

const categories = [
  { key: "electrician", icon: <AiOutlineThunderbolt />, color: "from-yellow-500 to-yellow-400" },
  { key: "plumber", icon: <AiOutlineTool />, color: "from-blue-500 to-blue-400" },
  { key: "masonry", icon: <AiOutlineBuild />, color: "from-gray-600 to-gray-500" },
  { key: "carpenter", icon: <AiOutlineHome />, color: "from-orange-500 to-orange-400" },
  { key: "painter", icon: <AiOutlineFormatPainter />, color: "from-pink-500 to-pink-400" },
];

export default function SubmitComplaint() {
  const [type, setType] = useState("general");
  const [selected, setSelected] = useState(null);
  const { t } = useTranslation();

  return (
    <div className="min-h-screen dark:bg-slate-900 p-6">
      <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
        {t("select_complaint_type")}
      </h1>

      <div className="flex justify-center mb-10">
        <div className="bg-gray-200 dark:bg-gray-800 p-1 rounded-full flex w-[260px] relative">
          <button onClick={() => setType("general")} className={`cursor-pointer flex-1 py-2 rounded-full text-sm font-semibold transition-all z-10 ${type === "general" ? "text-white" : "text-gray-700 dark:text-gray-300"}`}>
            {t("general")}
          </button>
          <button onClick={() => setType("special")} className={`cursor-pointer flex-1 py-2 rounded-full text-sm font-semibold transition-all z-10 ${type === "special" ? "text-white" : "text-gray-700 dark:text-gray-300"}`}>
            {t("special")}
          </button>
          <span className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-gradient-to-r from-[#748dff] to-indigo-500 transition-all duration-300 ${type === "general" ? "left-1" : "left-1/2"}`} />
        </div>
      </div>

      {type === "general" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.key} onClick={() => setSelected({ type: "general", category: cat.key })} className={`cursor-pointer p-5 rounded-xl shadow-lg bg-gradient-to-br ${cat.color} text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:rotate-1 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500 before:to-blue-500 before:opacity-20 before:animate-pulse`}>
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <p className="text-sm opacity-90">{t("category")}</p>
                  <h2 className="text-2xl font-bold">{t(cat.key)}</h2>
                </div>
                <div className="text-4xl opacity-80">{cat.icon}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {type === "special" && (
        <div className="max-w-xl mx-auto text-center space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            {t("special_text")}
          </p>
          <div onClick={() => setSelected({ type: "special", category: "special" })} className="cursor-pointer p-6 rounded-xl shadow-lg bg-gradient-to-br from-[#748dff] to-indigo-400 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#748dff] before:to-indigo-400 before:opacity-20 before:animate-pulse">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">{t("special_request")}</p>
                <h2 className="text-2xl font-bold">{t("submit_special_complaint")}</h2>
              </div>
              <AiOutlineStar className="text-4xl opacity-80" />
            </div>
          </div>
        </div>
      )}

      {selected && <ComplaintModal data={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}