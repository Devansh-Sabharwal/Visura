"use client";
import { Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // Ref for the dropdown menu

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div>
      <div className="mt-2 relative max-w-[82rem] mx-auto">
        <div className="py-4 px-6 rounded-xl flex items-center justify-between">
          <div>
            <img src="/logo2.svg" alt="Logo" className="h-6 sm:h-[40px]" />
          </div>

          <div className="hidden sm:flex justify-between w-full max-w-sm items-center text-xs sm:text-base">
            <Link
              href="#features"
              className="hover:scale-110 transition-all duration-300 cursor-pointer"
            >
              Features
            </Link>
            <Link
              href="#demo"
              className="hover:scale-110 transition-all duration-300 cursor-pointer"
            >
              Examples
            </Link>
            <Link
              href="/signin"
              className="hover:scale-110 transition-all duration-300 cursor-pointer"
            >
              Signin
            </Link>
            <Link
              href="/signup"
              style={{
                background:
                  "linear-gradient(to bottom, rgb(139, 85, 255) 0%, rgb(55, 63, 224) 100%)",
              }}
              className="hover:scale-105 rounded-xl sm:rounded-xl text-xs sm:text-sm font-medium text-white p-2 sm:px-4 cursor-pointer transition-all duration-300"
            >
              Try Now
            </Link>
          </div>

          {/* Mobile Menu Button (visible on sm and below) */}
          <div className="sm:hidden flex">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown (overlay) */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="sm:hidden absolute top-full left-0 bg-black border border-white/10 p-4 rounded-xl z-50"
          >
            <div className="flex flex-col w-[80vw] gap-3">
              <Link href="#features" className="text-sm cursor-pointer">
                Features
              </Link>
              <Link href="#demo" className="text-sm cursor-pointer">
                Examples
              </Link>
              <Link href="/signin" className="text-sm cursor-pointer">
                Signin
              </Link>
              <Link href="/signup" className="text-sm cursor-pointer">
                Try Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
