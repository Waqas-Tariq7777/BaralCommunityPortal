import { useState } from "react";
import ComplaintModal from "../../Components/User/ComplaintModal";
import { 
  AiOutlineThunderbolt, 
  AiOutlineTool, 
  AiOutlineBuild, 
  AiOutlineHome, 
  AiOutlineFormatPainter, 
  AiOutlineStar 
} from "react-icons/ai";
import { FiCheckCircle, FiInfo, FiTool, FiLayers } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../Store/LanguageStore.js";

const categories = [
  { 
    key: "electrician", 
    icon: <AiOutlineThunderbolt />, 
    color: "from-amber-500 to-yellow-400",
    darkColor: "dark:from-amber-600 dark:to-yellow-500",
    descEn: "Electrical wiring, power outage, socket & breaker repair",
    descUr: "بجلی کی وائرنگ، پاور کی بندش، ساکٹ اور بریکر کی مرمت"
  },
  { 
    key: "plumber", 
    icon: <AiOutlineTool />, 
    color: "from-blue-600 to-cyan-500",
    darkColor: "dark:from-blue-700 dark:to-cyan-600",
    descEn: "Water supply leaks, tap & pipe repairs, drainage issues",
    descUr: "پانی کی فراہمی، پائپ اور نل کی مرمت، ڈرینیج کے مسائل"
  },
  { 
    key: "masonry", 
    icon: <AiOutlineBuild />, 
    color: "from-slate-600 to-gray-500",
    darkColor: "dark:from-slate-700 dark:to-gray-600",
    descEn: "Wall plastering, brickwork, floor tiles & concrete repairs",
    descUr: "دیوار کا پلستر، اینٹوں کا کام، فلور ٹائلز اور کنکریٹ کی مرمت"
  },
  { 
    key: "carpenter", 
    icon: <AiOutlineHome />, 
    color: "from-orange-600 to-amber-500",
    darkColor: "dark:from-orange-700 dark:to-amber-600",
    descEn: "Door & window repair, locks, cabinets & wooden furniture",
    descUr: "دروازے اور کھڑکیوں کی مرمت، تالے، الماریاں اور لکڑی کا کام"
  },
  { 
    key: "painter", 
    icon: <AiOutlineFormatPainter />, 
    color: "from-purple-600 to-pink-500",
    darkColor: "dark:from-purple-700 dark:to-pink-600",
    descEn: "Wall painting, coat touch-ups, moisture & dampness treatment",
    descUr: "دیواروں کی پینٹنگ، ٹچ اپس اور نمی کے علاج کی کوٹنگ"
  },
];

export default function SubmitComplaint() {
  const [type, setType] = useState("general");
  const [selected, setSelected] = useState(null);
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  const isUrdu = language === "ur";

  return (
    <div dir={isUrdu ? "rtl" : "ltr"} className="min-h-screen dark:bg-slate-900 p-3 sm:p-6 md:p-8 transition-colors duration-300">
      
      {/* PAGE HEADER */}
      <div className="max-w-5xl mx-auto text-center mb-8 sm:mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#748dff]/15 text-[#748dff] mb-3">
          <FiLayers className="text-sm" />
          {t("community_system") || "WAPDA Community Services"}
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          {t("select_complaint_type")}
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-2xl mx-auto leading-relaxed">
          {t("complaint_guide_subtitle")}
        </p>
      </div>

      {/* COMPLAINT TYPES VISUAL SELECTOR CARDS */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
        
        {/* CARD 1: GENERAL COMPLAINTS */}
        <div
          onClick={() => setType("general")}
          className={`cursor-pointer rounded-2xl p-5 sm:p-6 transition-all duration-300 relative border-2 ${
            type === "general"
              ? "bg-gradient-to-br from-blue-50/90 via-indigo-50/50 to-white dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900 border-[#748dff] shadow-xl ring-2 ring-[#748dff]/20 scale-[1.01]"
              : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/70 hover:border-indigo-300 dark:hover:border-slate-600 shadow-md hover:shadow-lg opacity-90 hover:opacity-100"
          }`}
        >
          {type === "general" && (
            <span className="absolute top-4 right-4 text-[#748dff] text-xl">
              <FiCheckCircle />
            </span>
          )}

          <div className="flex items-center gap-3.5 mb-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl shadow-md ${
              type === "general"
                ? "bg-gradient-to-br from-[#748dff] to-indigo-600"
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
            }`}>
              <FiTool />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                {t("general_badge")}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white leading-tight mt-0.5">
                {t("general_title")}
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            {t("general_desc")}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300">⚡ Electricity</span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300">💧 Water</span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300">🛠 Maintenance</span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300">🔧 Plumbing</span>
          </div>
        </div>

        {/* CARD 2: SPECIAL REQUESTS */}
        <div
          onClick={() => setType("special")}
          className={`cursor-pointer rounded-2xl p-5 sm:p-6 transition-all duration-300 relative border-2 ${
            type === "special"
              ? "bg-gradient-to-br from-purple-50/90 via-pink-50/50 to-white dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900 border-purple-500 shadow-xl ring-2 ring-purple-500/20 scale-[1.01]"
              : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/70 hover:border-purple-300 dark:hover:border-slate-600 shadow-md hover:shadow-lg opacity-90 hover:opacity-100"
          }`}
        >
          {type === "special" && (
            <span className="absolute top-4 right-4 text-purple-600 dark:text-purple-400 text-xl">
              <FiCheckCircle />
            </span>
          )}

          <div className="flex items-center gap-3.5 mb-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl shadow-md ${
              type === "special"
                ? "bg-gradient-to-br from-purple-600 to-indigo-600"
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
            }`}>
              <AiOutlineHome />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                {t("special_badge")}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white leading-tight mt-0.5">
                {t("special_title")}
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            {t("special_desc")}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">🏠 House Renovation</span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">🛠 Structural Alterations</span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">🏗 Construction Modifications</span>
          </div>
        </div>

      </div>

      {/* GENERAL COMPLAINTS VIEW */}
      {type === "general" && (
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-6 text-slate-800 dark:text-slate-100">
            <FiInfo className="text-lg text-[#748dff]" />
            <h3 className="text-base sm:text-lg font-bold">
              {isUrdu ? "معمول کی شکایت کا زمرہ منتخب کریں:" : "Select a Maintenance Category for General Complaint:"}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <div
                key={cat.key}
                onClick={() => setSelected({ type: "general", category: cat.key })}
                className={`cursor-pointer group p-5 rounded-2xl shadow-md bg-gradient-to-br ${cat.color} ${cat.darkColor} text-white transform transition-all duration-300 hover:scale-[1.03] hover:shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[140px]`}
              >
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-white/80">
                      {t("category")}
                    </span>
                    <h4 className="text-xl font-extrabold text-white mt-0.5">
                      {t(cat.key)}
                    </h4>
                  </div>
                  <div className="text-3xl text-white/90 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    {cat.icon}
                  </div>
                </div>

                <p className="text-xs text-white/90 mt-3 relative z-10 leading-relaxed font-normal">
                  {isUrdu ? cat.descUr : cat.descEn}
                </p>

                <div className="mt-4 pt-2 border-t border-white/20 flex items-center justify-between text-[11px] font-semibold text-white/90 relative z-10">
                  <span>{isUrdu ? "شکایت درج کریں" : "File Complaint"}</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SPECIAL REQUESTS VIEW */}
      {type === "special" && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-white to-purple-50/50 dark:from-slate-800 dark:to-slate-900 border border-purple-200 dark:border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6">
            
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-3xl mx-auto shadow-lg shadow-purple-500/20 animate-bounce">
              <AiOutlineStar />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                {t("special_request")}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white">
                {t("special_title")}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
                {t("special_desc")}
              </p>
            </div>

            {/* PROCESS HIGHLIGHT STEPS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left py-2">
              <div className="p-3 rounded-xl bg-purple-50/70 dark:bg-slate-800/80 border border-purple-100 dark:border-slate-700">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center mb-1.5">1</span>
                <h5 className="font-semibold text-xs text-slate-800 dark:text-slate-200">Submit Proposal</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Specify house changes & timeline</p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/70 dark:bg-slate-800/80 border border-purple-100 dark:border-slate-700">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center mb-1.5">2</span>
                <h5 className="font-semibold text-xs text-slate-800 dark:text-slate-200">Admin Review</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">WAPDA engineers inspect plan</p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/70 dark:bg-slate-800/80 border border-purple-100 dark:border-slate-700">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center mb-1.5">3</span>
                <h5 className="font-semibold text-xs text-slate-800 dark:text-slate-200">Approval Issued</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Formal permit & work authorization</p>
              </div>
            </div>

            <button
              onClick={() => setSelected({ type: "special", category: "special" })}
              className="cursor-pointer inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-[#748dff] hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-purple-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-98 transition-all duration-200"
            >
              <AiOutlineStar className="text-xl" />
              <span>{t("submit_special_complaint")}</span>
            </button>
          </div>
        </div>
      )}

      {selected && <ComplaintModal data={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}