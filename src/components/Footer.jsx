import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { Mail, Phone } from "lucide-react"; import logo from '../assets/logo.png';


const Footer = ({ setView, switchSite, currentSite }) => (
  <footer className="bg-[#0f172a] text-slate-400 py-16">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-12 mb-12">

        {/* LOGO + CONTACT INFO + SOCIAL - LEFT SIDE */}
        <div className="md:col-span-3">
          <div className="flex flex-col">
            {/* Logo and Contact Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <img
                  src={logo}
                  alt="WORSO Logo"
                  className="h-12 w-auto object-contain"
                />
                <span className="text-white font-bold text-xl tracking-tight">
                  {currentSite.is_partner ? "TECHNOXIAN" : "WORSO"}
                </span>
              </div>

              {/* Contact Info - Email & Phone */}
              <div className="mb-6 space-y-4">
                <p className="max-w-md mb-8 leading-relaxed text-sm">
                  {currentSite.is_partner
                    ? "The official regional chapter of the World Robotics Championship."
                    : "The World Robotics Sports Organization is the global regulatory body for robotics competitions and esports."}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-slate-500" />
                <a
                  href="mailto:info@worso.in"
                  className="text-sm hover:text-white transition-colors"
                >
                  info@worso.in
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-slate-500" />
                <a
                  href="tel:+917835053333"
                  className="text-sm hover:text-white transition-colors"
                >
                  +91 7835053333</a>
              </div>
            </div>


            {/* SOCIAL ICONS */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Follow Us</h4>
              <div className="flex gap-4 text-xl">
                <a
                  href="https://www.facebook.com/WORSOcommunity"
                  className="hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
                  aria-label="Facebook"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="https://in.linkedin.com/company/worso"
                  className="hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
                <a
                  href="https://www.youtube.com/@WORSOassociation"
                  className="hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
                  aria-label="YouTube"
                >
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK LINKS - RIGHT SIDE */}
        <div className="md:col-span-1">
          <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <button
                onClick={() => setView("technoxian")}
                className="hover:text-white transition-colors text-left w-full py-1"
              >
                Technoxian Games
              </button>
            </li>
            <li>
              <button
                onClick={() => setView("teams")}
                className="hover:text-white transition-colors text-left w-full py-1"
              >
                Teams & Rankings
              </button>
            </li>
            <li>
              <button
                onClick={() => setView("login")}
                className="hover:text-white transition-colors text-left w-full py-1"
              >
                Verify Certificates
              </button>
            </li>
            <li>
              <button
                onClick={() => setView("careers")}
                className="hover:text-white transition-colors text-left w-full py-1"
              >
                Careers
              </button>
            </li>
            <li>
              <button
                onClick={() => setView("news")}
                className="hover:text-white transition-colors text-left w-full py-1"
              >
                News
              </button>
            </li>
            <li className="pt-4 mt-4 border-t border-slate-800">
              <button
                onClick={() => setView("privacy-policy")}
                className="hover:text-white transition-colors text-left w-full py-1"
              >
                Privacy Policy
              </button>
            </li>
            <li>
              <button
                onClick={() => setView("terms-of-use")}
                className="hover:text-white transition-colors text-left w-full py-1"
              >
                Terms of Use
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* FOOTER BOTTOM */}
      <div className="pt-8 border-t border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setView("staff-login")}
              className="text-[10px] text-slate-700 hover:text-white font-bold uppercase transition-colors"
            >
              Staff Access
            </button>

            <div className="h-4 w-px bg-slate-800"></div>

            <span className="text-[10px] font-bold text-slate-400 uppercase">
              View As:
            </span>

            <button
              onClick={() => switchSite("global")}
              className={`text-[10px] font-bold transition-colors ${currentSite.id === "global" ? "text-blue-500" : "text-slate-400 hover:text-white"
                }`}
            >
              Global
            </button>

            <button
              onClick={() => switchSite("uae")}
              className={`text-[10px] font-bold transition-colors ${currentSite.id === "uae" ? "text-emerald-500" : "text-slate-400 hover:text-white"
                }`}
            >
              UAE
            </button>
          </div>

          <div className="text-xs text-slate-400 md:mx-auto">
            © 2025 World Robotics Sports Organization. All Rights Reserved.
          </div>
        </div>
      </div>

    </div>
  </footer>
);

export default Footer;