import React from 'react';
import { FaYoutube, FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-primary pt-16 px-10 font-['Bebas Neue'] overflow-hidden">
      <div className="mx-auto">
        {/* Top section */}
        <div className="flex justify-between items-end mb-20 pb-10">
          <div className="flex flex-col gap-8 text-left">
            <div>
              <p className="text-lg text-primary tracking-wider mb-1">VIT UNIVERSITY</p>
              <p className="text-lg text-primary tracking-wider mb-1">VELLORE, TAMIL NADU</p>
              <p className="text-lg text-primary tracking-wider">INDIA - 632014</p>
            </div>
            <div>
              <p className="text-2xl font-medium mb-2">iste@vit.ac.in</p>
              <p className="text-xl ">+91 63623 67135</p>
            </div>
          </div>
          <div className="flex gap-6">
            <a href="https://www.youtube.com/@ISTEVITVellore" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-blue-600 transition-colors">
              <FaYoutube />
            </a>
            <a href="https://www.linkedin.com/company/indian-society-for-technical-education/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-blue-600 transition-colors">
              <FaLinkedin />
            </a>
            <a href="https://www.instagram.com/iste_vit_vellore/" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-blue-600 transition-colors">
              <FaInstagram />
            </a>
            <a href="https://github.com/ISTE-VIT" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-blue-600 transition-colors">
              <FaGithub />
            </a>
            <a href="https://x.com/iste_vitvellore" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-blue-600 transition-colors">
              <FaXTwitter />
            </a>
            
          </div>
        </div>

        {/* Middle section */}
        <div className="flex justify-between items-center px-4">
          <a href="https://istevit.in" className="text-xl tracking-widest hover:text-blue-600 transition-colors flex items-center gap-2">
            VISIT OUR WEBSITE →
          </a>
          <div className="text-xl tracking-wider flex items-center gap-2">
            MADE WITH <span className="text-blue-600 text-lg">❤</span> BY ISTE
          </div>
        </div>

        {/* Large ISTE text */}
        <div className="relative overflow-hidden">
          <img src="/iste_bottom_logo.png" alt="ISTE" className="w-full" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
