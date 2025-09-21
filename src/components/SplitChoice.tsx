import React from "react";
import {
  UserPlus,
  Zap,
  ArrowRight,
  Users,
  Clock,
  Timer,
  TrendingUp,
} from "lucide-react";
import Header from "./Header";

interface SplitChoiceProps {
  onChoice: (choice: "quick" | "signin") => void;
}

const SplitChoice: React.FC<SplitChoiceProps> = ({ onChoice }) => {
  const handleSplitReceipt = () => {
    document.querySelector(".grid")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen w-screen max-w-full overflow-x-hidden relative">
      <Header onSplitReceipt={handleSplitReceipt} />

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
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

          <div className="grid md:grid-cols-2 gap-8 w-full">
            <div
              onClick={() => onChoice("quick")}
              className="group relative bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500" />
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-all duration-500" />

              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-purple-500/25">
                  <Zap className="w-8 h-8 text-white" />
                </div>

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

                <button className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 py-4 rounded-2xl font-bold text-lg transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-500/40 relative overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center">
                    Start Quick Split
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
              </div>
            </div>

            <div
              onClick={() => onChoice("signin")}
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
                  Perfect for regular friend groups. Save contacts, track
                  history, manage ongoing expenses.
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
    </div>
  );
};

export default SplitChoice;
