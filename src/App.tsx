// App.tsx - FINAL FIX
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { post } from "aws-amplify/api";

// Components
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import SplitChoice from "./components/SplitChoice";
import QuickSplit from "./components/QuickSplit";

// Landing Page Component
const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSplitReceipt = () => {
    navigate("/split-choice");
  };

  return (
    <div className="w-full min-h-screen">
      <Header onSplitReceipt={handleSplitReceipt} />
      <Hero onSplitReceipt={handleSplitReceipt} />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  );
};

// App.tsx - FINAL FIX
function App() {
  return (
    <BrowserRouter>
      <div
        className="min-h-screen w-screen
 bg-gray-950 text-white overflow-x-hidden"
      >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 pointer-events-none" />

        {/* Main content */}
        <div className="relative z-10 min-h-screen w-full">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/split-choice"
              element={
                <SplitChoice
                  onChoice={(choice) => {
                    if (choice === "quick") {
                      window.location.href = "/quick-split";
                    } else {
                      alert("Sign-in flow coming soon!");
                    }
                  }}
                />
              }
            />
            <Route path="/quick-split" element={<QuickSplit />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
