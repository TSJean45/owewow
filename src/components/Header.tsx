import React, { useState } from "react";
import { Menu, X, Receipt } from "lucide-react";

interface HeaderProps {
  onSplitReceipt?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSplitReceipt }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSplitClick = () => {
    setIsOpen(false);
    if (onSplitReceipt) {
      onSplitReceipt();
    }
  };

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur-xl border-b border-gray-800/50">
        <nav className="w-full px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
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

            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => handleNavClick("#features")}
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                Features
              </button>
              <button
                onClick={() => handleNavClick("#how-it-works")}
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                How It Works
              </button>
              <button
                onClick={handleSplitClick}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-8 py-3 rounded-full text-white font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Split Receipt 🧾
              </button>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-300 hover:text-white transition-colors duration-200 relative z-60"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-gray-950/98 backdrop-blur-xl border-t border-gray-800/50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex flex-col space-y-4">
              <button
                onClick={() => handleNavClick("#features")}
                className="text-gray-300 hover:text-white transition-colors duration-200 text-left py-2 hover:bg-gray-800/50 px-3 rounded-lg"
              >
                Features
              </button>
              <button
                onClick={() => handleNavClick("#how-it-works")}
                className="text-gray-300 hover:text-white transition-colors duration-200 text-left py-2 hover:bg-gray-800/50 px-3 rounded-lg"
              >
                How It Works
              </button>
              <button
                onClick={handleSplitClick}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-8 py-3 rounded-full text-white font-semibold transition-all duration-200 w-fit mt-2"
              >
                Split Receipt 🧾
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="h-24"></div>
    </>
  );
};

export default Header;
