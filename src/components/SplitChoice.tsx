import React from "react";
import { UserPlus, Zap, ArrowRight, Users, Clock } from "lucide-react";

interface SplitChoiceProps {
  onChoice: (choice: "quick" | "signin") => void;
}

const SplitChoice: React.FC<SplitChoiceProps> = ({ onChoice }) => {
  return (
    // Remove duplicate background since App.tsx provides it, use full width
    <div className="min-h-screen flex items-center justify-center px-6 py-20 w-full">
      {/* CHANGED: Use max-w-none to remove width constraint OR increase to max-w-7xl for wider layout */}
      <div className="w-full max-w-none mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              How would you like to split?
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Choose your preferred experience
          </p>
        </div>

        {/* Two Options - CHANGED: Added max-width here for content readability */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto">
          {/* Quick Action */}
          <div
            onClick={() => onChoice("quick")}
            className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:-translate-y-2 cursor-pointer"
          >
            {/* Gradient glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">
                Quick Split
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Perfect for one-time splits. Upload receipt, get results, share
                link instantly.
                <span className="text-purple-300"> No signup needed!</span>
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  </div>
                  <span className="text-gray-300">
                    Upload & split instantly
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  </div>
                  <span className="text-gray-300">
                    Share magic link with friends
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  </div>
                  <span className="text-gray-300">No account required</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 py-4 rounded-xl font-semibold transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/25">
                Start Quick Split
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Sign In Option */}
          <div
            onClick={() => onChoice("signin")}
            className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:-translate-y-2 cursor-pointer"
          >
            {/* Gradient glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <UserPlus className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">
                Create Account
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                For frequent splitters. Save your groups, track history, and
                manage ongoing expenses.
                <span className="text-blue-300">
                  {" "}
                  Perfect for regular friend groups!
                </span>
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-blue-400" />
                  <span className="text-gray-300">
                    Save permanent friend groups
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-blue-400" />
                  <span className="text-gray-300">Track split history</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ArrowRight className="w-6 h-6 text-blue-400" />
                  <span className="text-gray-300">Manage ongoing expenses</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 py-4 rounded-xl font-semibold transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/25">
                Sign Up Free
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            You can always create an account later to save your groups and
            history
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplitChoice;
