// App.tsx - SEMANTIC SOLUTION (Best Practice)
import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
// import { post } from "aws-amplify/api";

// Components
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import SplitChoice from "./components/SplitChoice";
import QuickSplit from "./components/QuickSplit";
import ResultsPage from "./components/results/ResultsPage";
import AssignmentPage from "./components/assignment/AssignmentPage";

const SplitChoiceWrapper: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen max-w-full">
      <SplitChoice
        onChoice={(choice) => {
          if (choice === "quick") {
            navigate("/quick-split");
          } else {
            alert("Sign-in flow coming soon!");
          }
        }}
      />
    </div>
  );
};

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

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

// App.tsx - Selective full-width
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen w-full bg-gray-950 text-white overflow-x-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 pointer-events-none" />

        <div className="relative z-10 min-h-screen w-full">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/split-choice" element={<SplitChoiceWrapper />} />

            <Route
              path="/quick-split"
              element={
                <div className="w-screen max-w-full">
                  {" "}
                  {/* Full width wrapper */}
                  <QuickSplit />
                </div>
              }
            />
            <Route path="/results/:receiptId" element={<ResultsPage />} />
            <Route path="/assignment/:receiptId" element={<AssignmentPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
