import React from "react";
import { Twitter, Linkedin, Github, User, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://x.com/Devansh2k4",
      color: "hover:text-blue-400",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/in/devanshsabharwal/",
      color: "hover:text-blue-500",
    },
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com/Devansh-Sabharwal",
      color: "hover:text-gray-300",
    },
    {
      name: "Portfolio",
      icon: User,
      href: "https://devanshsabharwal.vercel.app",
      color: "hover:text-purple-400",
    },
  ];

  const productLinks = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Examples", href: "#demo" },
  ];

  return (
    <footer className="relative rounded-t-2xl mx-2 border-t border-l border-r border-white/20">
      <div className="relative z-10 max-w-7xl mx-auto sm:px-6 py-8 px-3 sm:py-16">
        <div className="mb-4 flex w-full justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4">
              <img alt="logo" src={"/logo2.svg"} className="w-24 sm:w-32" />
            </div>

            {/* Tagline */}
            <p className="text-sm sm:text-xl tracking-tighter font-medium bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-1">
              Say it. See it. Animate it.
            </p>
            <p className="hidden sm:block text-gray-400 text-sm mb-6">
              {`All with Visura's AI`}
            </p>

            <div className="flex items-center mt-4 gap-2 sm:gap-4 sm:mb-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 transition-all duration-300 hover:scale-110 hover:bg-white/10 hover:border-white/20 ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon className="w-4 sm:w-5 h-4 sm:h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6 text-base sm:text-lg">
              Product
            </h3>
            <div className="flex flex-col sm:flex-row gap-x-8 gap-y-2">
              {productLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-all duration-300 text-xs sm:text-sm hover:translate-x-1 inline-block"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1 sm:gap-2 text-gray-400 text-xs sm:text-sm">
              <span>© {currentYear} Visura. Made with</span>
              <Heart className="w-4 h-4 text-red-400" />
              <span>for creators everywhere.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
