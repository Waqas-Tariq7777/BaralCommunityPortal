import { CiGlobe, CiPhone, CiMail, CiLocationOn } from "react-icons/ci";
import { FaBalanceScale, FaInfoCircle } from "react-icons/fa";
import { MdOutlineChevronRight } from "react-icons/md";
import { Link } from "react-router-dom";
import WapdaLogo from "../assets/images/wapda_logo_bg.png"; // adjust path if needed
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#748dff] text-white dark:bg-slate-900 dark:border-t dark:border-[#748dff]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* About / Logo */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img src={WapdaLogo} alt="WAPDA Logo" className="w-12 h-12 bg-white rounded-lg border-2 border-white dark:bg-[#748dff] dark:border-[#748dff]" />
            <h2 className="text-2xl font-bold hover:text-white transition dark:text-[#748dff]">{t("community_name")}</h2>
          </div>
          <p className="text-white/90 text-sm leading-relaxed">{t("about_description")}</p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 hover:text-white transition dark:text-[#748dff]">
            <FaInfoCircle /> {t("quick_links")}
          </h2>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/20 transition">
                <MdOutlineChevronRight className="text-white" /> {t("home")}
              </Link>
            </li>
            <li>
              <Link to="/about" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/20 transition">
                <MdOutlineChevronRight className="text-white" /> {t("about_us")}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/20 transition">
                <MdOutlineChevronRight className="text-white" /> {t("contact_us")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 hover:text-white transition dark:text-[#748dff]">
            <FaBalanceScale /> {t("legal")}
          </h2>
          <ul className="space-y-2">
            <li>
              <Link to="/privacyPolicy" className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/20 transition"><MdOutlineChevronRight className="text-white" />{t("terms_of_service")}</Link>
            </li>
            <li>
              <Link to="/privacyPolicy" className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/20 transition"><MdOutlineChevronRight className="text-white" />{t("privacy_policy")}</Link>
            </li>
            <li>
              <Link to="/privacyPolicy" className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/20 transition"><MdOutlineChevronRight className="text-white" />{t("disclaimer")}</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 hover:text-white transition dark:text-[#748dff]">
            <CiGlobe /> {t("contact")}
          </h2>

          <ul className="space-y-3">
            <li className="flex items-start gap-3 px-2 py-1 rounded hover:bg-white/20 transition">
              <CiPhone className="w-6 h-6 md:w-5 md:h-5 flex-shrink-0 text-white mt-0.5" />
              <span className="leading-relaxed">{t("phone")}</span>
            </li>
            <li className="flex items-start gap-3 px-2 py-1 rounded hover:bg-white/20 transition">
              <CiMail className="w-6 h-6 md:w-5 md:h-5 flex-shrink-0 text-white mt-0.5" />
              <span className="break-all leading-relaxed">{t("email")}</span>
            </li>
            <li className="flex items-start gap-3 px-2 py-1 rounded hover:bg-white/20 transition">
              <CiLocationOn className="w-6 h-6 md:w-5 md:h-5 flex-shrink-0 text-white mt-0.5" />
              <span className="leading-relaxed">{t("address")}</span>
            </li>
          </ul>
        </div>

      </div>

      <hr className="border-white/30 mx-6 md:mx-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex flex-col lg:flex-row justify-between items-center gap-4 text-white/80 text-sm">
        <p>{t("copyright")}</p>
        <div className="flex gap-6">
          <Link to="/privacyPolicy" className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/20 transition">{t("terms")}</Link>
          <Link to="/privacyPolicy" className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/20 transition">{t("privacy")}</Link>
          <Link to="/privacyPolicy" className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/20 transition">{t("disclaimer_short")}</Link>
        </div>
      </div>
    </footer>
  );
}