// components/SplitChoice.tsx - ENHANCED FOR HACKATHON WIN! 🚀
import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Zap,
  ArrowRight,
  Users,
  Clock,
  Timer,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";

interface SplitChoiceProps {
  onChoice: (choice: "quick" | "signin") => void;
}

const SplitChoice: React.FC<SplitChoiceProps> = ({ onChoice }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Add mouse tracking for subtle parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen w-screen max-w-full flex items-center justify-center px-4 py-12 overflow-x-hidden relative">
      {/* Enhanced Background with Floating Elements - 2025 Trend */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
        }}
      >
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="w-full max-w-6xl mx-auto relative z-10">
        {/* Enhanced Header with Status Badge */}
        <div className="text-center mb-12">
          {/* Status Badge - Hackathon Appeal */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-purple-400 mr-2 animate-pulse" />
            <span className="text-sm text-purple-300 font-medium">
              AI-Powered • Lightning Fast
            </span>
            <TrendingUp className="w-4 h-4 text-blue-400 ml-2" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Choose Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Splitting Style
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Two powerful ways to split bills with AI. Pick what works for you.
          </p>
        </div>

        {/* Enhanced Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 w-full">
          {/* Quick Split - Enhanced */}
          <div
            onClick={() => onChoice("quick")}
            onMouseEnter={() => setHoveredCard("quick")}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden"
          >
            {/* Enhanced Glow Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500" />
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-all duration-500" />

            <div className="relative z-10">
              {/* Enhanced Icon with Rotation */}
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-purple-500/25">
                <Zap className="w-8 h-8 text-white" />
              </div>

              {/* Enhanced Badges Row */}
              <div className="flex items-center gap-2 mb-4">
                <div className="inline-flex items-center px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                  <Timer className="w-3 h-3 text-green-400 mr-1" />
                  <span className="text-xs text-green-300 font-medium">
                    30 seconds
                  </span>
                </div>
                <div className="inline-flex items-center px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
                  <span className="text-xs text-purple-300 font-medium">
                    No Setup
                  </span>
                </div>
              </div>

              <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-purple-100 transition-colors">
                Quick Split
              </h3>

              <p className="text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300 transition-colors">
                Upload receipt, AI reads everything, generates shareable links
                instantly.
                <span className="text-purple-300 font-semibold">
                  {" "}
                  Zero friction!
                </span>
              </p>

              {/* Enhanced Features with Icons */}
              <div className="space-y-3 mb-8">
                {[
                  { emoji: "⚡", text: "AI OCR in seconds", delay: "0ms" },
                  {
                    emoji: "🔗",
                    text: "Magic shareable links",
                    delay: "100ms",
                  },
                  { emoji: "🚫", text: "No account needed", delay: "200ms" },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center text-sm text-gray-300 group-hover:translate-x-2 transition-all duration-300"
                    style={{ transitionDelay: feature.delay }}
                  >
                    <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center mr-3 border border-green-500/30">
                      <span className="text-xs">{feature.emoji}</span>
                    </div>
                    <span className="font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Enhanced Button with Shimmer */}
              <button className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 py-4 rounded-2xl font-bold text-lg transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-500/40 relative overflow-hidden">
                <span className="relative z-10 flex items-center justify-center">
                  Start Quick Split
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>
          </div>

          {/* Create Account - Enhanced */}
          <div
            onClick={() => onChoice("signin")}
            onMouseEnter={() => setHoveredCard("signin")}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500" />
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all duration-500" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-blue-500/25">
                <UserPlus className="w-8 h-8 text-white" />
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="inline-flex items-center px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                  <Users className="w-3 h-3 text-blue-400 mr-1" />
                  <span className="text-xs text-blue-300 font-medium">
                    For Groups
                  </span>
                </div>
                <div className="inline-flex items-center px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full">
                  <span className="text-xs text-cyan-300 font-medium">
                    Advanced
                  </span>
                </div>
              </div>

              <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-100 transition-colors">
                Create Account
              </h3>

              <p className="text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300 transition-colors">
                Perfect for regular friend groups. Save contacts, track history,
                manage ongoing expenses.
                <span className="text-blue-300 font-semibold">
                  {" "}
                  Built for teams!
                </span>
              </p>

              <div className="space-y-3 mb-8">
                {[
                  {
                    icon: Users,
                    text: "Save friend groups",
                    color: "text-blue-400",
                    delay: "0ms",
                  },
                  {
                    icon: Clock,
                    text: "Track split history",
                    color: "text-blue-400",
                    delay: "100ms",
                  },
                  {
                    icon: TrendingUp,
                    text: "Expense analytics",
                    color: "text-blue-400",
                    delay: "200ms",
                  },
                ].map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center text-sm text-gray-300 group-hover:translate-x-2 transition-all duration-300"
                      style={{ transitionDelay: feature.delay }}
                    >
                      <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 border border-blue-500/30">
                        <Icon className={`w-3 h-3 ${feature.color}`} />
                      </div>
                      <span className="font-medium">{feature.text}</span>
                    </div>
                  );
                })}
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-500 hover:via-cyan-500 hover:to-blue-500 py-4 rounded-2xl font-bold text-lg transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/40 relative overflow-hidden">
                <span className="relative z-10 flex items-center justify-center">
                  Sign Up Free
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center px-6 py-3 bg-gray-800/30 border border-gray-700/30 rounded-full backdrop-blur-sm hover:bg-gray-700/30 transition-colors">
            <span className="text-2xl mr-3">💡</span>
            <p className="text-gray-400 text-sm">
              <span className="font-medium text-gray-300">Tip:</span> You can
              always upgrade later to unlock premium features
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitChoice;
