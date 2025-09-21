import React from "react";
const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-t from-gray-950 to-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-6 py-16">
        {/* Bottom section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 OweWow. All rights reserved. Made with ❤️ for better
              friendships.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
