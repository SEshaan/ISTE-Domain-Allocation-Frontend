import React from "react";
import { FaYoutube, FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-primary pt-20 font-['Bebas Neue']">
      <div className="mx-auto px-6 md:px-12">

        {/* Top Section */}
        <div className="grid md:grid-cols-2 gap-14 border-b border-white/10 pb-12">

          {/* Address + Contact */}
          <div className="flex flex-col gap-8 text-center md:text-left">
            <div className="space-y-1">
              <p className="text-lg tracking-widest opacity-80">VIT UNIVERSITY</p>
              <p className="text-lg tracking-widest opacity-80">
                VELLORE, TAMIL NADU
              </p>
              <p className="text-lg tracking-widest opacity-80">
                INDIA - 632014
              </p>
            </div>

            <div className="space-y-2">
              <a className="text-2xl md:text-3xl tracking-wide" href="mailto:iste@vit.ac.in">
                iste@vit.ac.in
              </a>
              <p className="text-xl opacity-80">
                +91 63623 67135
              </p>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex flex-col items-center md:items-end gap-6">

            <p className="text-xl tracking-widest opacity-70">
              CONNECT WITH US
            </p>

            <div className="flex gap-5 flex-wrap justify-center md:justify-end">

              <a
                href="https://www.youtube.com/@ISTEVITVellore"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl p-3 rounded-full border border-white/20 hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
              >
                <FaYoutube />
              </a>

              <a
                href="https://www.linkedin.com/company/indian-society-for-technical-education/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl p-3 rounded-full border border-white/20 hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
              >
                <FaLinkedin />
              </a>

              <a
                href="https://www.instagram.com/iste_vit_vellore/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl p-3 rounded-full border border-white/20 hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
              >
                <FaInstagram />
              </a>

              <a
                href="https://github.com/ISTE-VIT"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl p-3 rounded-full border border-white/20 hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
              >
                <FaGithub />
              </a>

              <a
                href="https://x.com/iste_vitvellore"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl p-3 rounded-full border border-white/20 hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
              >
                <FaXTwitter />
              </a>

            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-10">

          <a
            href="https://istevit.in"
            className="text-xl tracking-widest hover:text-blue-600 transition-colors"
          >
            VISIT OUR WEBSITE →
          </a>

          <div className="text-lg tracking-wider flex items-center gap-2 opacity-80">
            MADE WITH <span className="text-blue-600 text-xl">❤</span> BY ISTE
          </div>

        </div>

        {/* Big Logo */}
        <div className="mt-16 opacity-90">
          <img
            src="/iste_bottom_logo.png"
            alt="ISTE"
            className="w-full object-contain"
          />
        </div>

      </div>
    </footer>
  );
};

export default Footer;