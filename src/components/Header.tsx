// Header.tsx - FIXED VERSION
import React, { useState, useEffect } from "react";
import { Menu, X, Receipt } from "lucide-react";

interface HeaderProps {
  onSplitReceipt: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSplitReceipt }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50"
          : "bg-transparent"
      }`}
    >
      {/* FIXED: Removed max-w-7xl, kept content container inside */}
      <nav className="w-full px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                OweWow
              </span>
              <div className="text-xs text-gray-400 -mt-1">
                AI Receipt Splitter
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              How It Works
            </a>
            <button
              onClick={onSplitReceipt}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-8 py-3 rounded-full text-white font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Split Receipt 🧾
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white transition-colors duration-200"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800/50">
            <div className="max-w-7xl mx-auto flex flex-col space-y-4 pt-4">
              <a
                href="#features"
                className="text-gray-300 hover:text-white transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-300 hover:text-white transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </a>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onSplitReceipt();
                }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-8 py-3 rounded-full text-white font-semibold transition-all duration-200 w-fit"
              >
                Split Receipt 🧾
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
