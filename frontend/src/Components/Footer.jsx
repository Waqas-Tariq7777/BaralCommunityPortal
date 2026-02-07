import { CiGlobe, CiPhone, CiMail, CiLocationOn } from "react-icons/ci";
import { FaBalanceScale, FaInfoCircle } from "react-icons/fa";
import { MdOutlineChevronRight } from "react-icons/md";
import { Link } from "react-router-dom";
import WapdaLogo from "../assets/images/wapda_logo_bg.png"; // adjust path if needed

export default function Footer() {
  return (
    <footer className="bg-[#748dff] text-white dark:bg-slate-900 dark:border-t dark:border-[#748dff]">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">


        {/* About / Logo */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img src={WapdaLogo} alt="WAPDA Logo" className="w-12 h-12 bg-white rounded-lg border-2 border-white dark:bg-[#748dff] dark:border-[#748dff]" />
            <h2 className="text-2xl font-bold hover:text-white transition dark:text-[#748dff]">Baral WAPDA Community</h2>
          </div>
          <p className="text-white/90 text-sm leading-relaxed">
            Your trusted platform for community updates, services, and engagement. Stay connected, report issues, and access local services efficiently.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 hover:text-white transition dark:text-[#748dff]">
            <FaInfoCircle /> Quick Links
          </h2>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/20 transition">
                <MdOutlineChevronRight className="text-white" /> Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/20 transition">
                <MdOutlineChevronRight className="text-white" /> About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/20 transition">
                <MdOutlineChevronRight className="text-white" /> Contact Us
              </Link>
            </li>
           
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 hover:text-white transition dark:text-[#748dff]">
            <FaBalanceScale /> Legal
          </h2>
          <ul className="space-y-2">
            <li>
              <Link to="/privacyPolicy" className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/20 transition">
                 Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/privacyPolicy" className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/20 transition">
                 Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/privacyPolicy" className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/20 transition">
                 Disclaimer
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
<div>
  <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 hover:text-white transition dark:text-[#748dff]">
    <CiGlobe /> Contact
  </h2>

  <ul className="space-y-3">
    {/* Phone */}
    <li className="flex items-start gap-3 px-2 py-1 rounded hover:bg-white/20 transition">
      <CiPhone className="w-6 h-6 md:w-5 md:h-5 flex-shrink-0 text-white mt-0.5" />
      <span className="leading-relaxed">+92 300 1234567</span>
    </li>

    {/* Email */}
    <li className="flex items-start gap-3 px-2 py-1 rounded hover:bg-white/20 transition">
      <CiMail className="w-6 h-6 md:w-5 md:h-5 flex-shrink-0 text-white mt-0.5" />
      <span className="break-all leading-relaxed">
        support@baralcommunity.com
      </span>
    </li>

    {/* Address */}
    <li className="flex items-start gap-3 px-2 py-1 rounded hover:bg-white/20 transition">
      <CiLocationOn className="w-6 h-6 md:w-5 md:h-5 flex-shrink-0 text-white mt-0.5" />
      <span className="leading-relaxed">
        House No. 1, Baral Colony, Mangla, Pakistan
      </span>
    </li>
  </ul>
</div>

      </div>

      {/* Divider */}
      <hr className="border-white/30 mx-6 md:mx-10" />

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex flex-col lg:flex-row justify-between items-center gap-4 text-white/80 text-sm">

        <p>© 2026 Baral WAPDA Community. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/privacyPolicy" className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/20 transition"> Terms</Link>
          <Link to="/privacyPolicy" className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/20 transition"> Privacy</Link>
          <Link to="/privacyPolicy" className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/20 transition"> Disclaimer</Link>
        </div>
      </div>
    </footer>
  );
}
