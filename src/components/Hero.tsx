import React from "react";
import { ArrowRight, Camera, Link, Zap } from "lucide-react";

interface HeroProps {
  onSplitReceipt: () => void;
}

const Hero: React.FC<HeroProps> = ({ onSplitReceipt }) => {
  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="w-full">
        <div className="text-center relative z-10">
          {/* Main heading with better styling */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text text-transparent">
              Split Bills,
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Not Friendships
            </span>
          </h1>

          {/* Better subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Snap your receipt, AI reads everything, generates magic links.
            <br />
            <span className="text-purple-300">
              Your friends just click & pay. That's it.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={onSplitReceipt}
              className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40"
            >
              <Camera className="inline-block mr-2 w-5 h-5" />
              Upload Receipt Now
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

          {/* Flexible Process Flow - Two Options */}
          <div className="mb-16 max-w-5xl mx-auto">
            {/* Option Toggle */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Two Ways to Split
              </h3>
              <p className="text-gray-400">
                Choose what works best for your situation
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Receipt Upload Flow */}
              <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                <h4 className="text-lg font-semibold text-purple-300 mb-4">
                  📸 Upload Receipt
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-sm">1</span>
                    </div>
                    <span className="text-gray-300">
                      Snap or upload receipt photo
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <span className="text-sm">2</span>
                    </div>
                    <span className="text-gray-300">
                      AI reads all items & prices
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-sm">3</span>
                    </div>
                    <span className="text-gray-300">
                      Automatic split calculation
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat Flow */}
              <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                <h4 className="text-lg font-semibold text-blue-300 mb-4">
                  💬 Just Tell Our AI
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-sm">1</span>
                    </div>
                    <span className="text-gray-300">
                      Type: "We had dim sum, $124 total"
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <span className="text-sm">2</span>
                    </div>
                    <span className="text-gray-300">
                      AI asks smart follow-up questions
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-sm">3</span>
                    </div>
                    <span className="text-gray-300">Fair split in seconds</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Step */}
            <div className="text-center mt-8">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full border border-purple-500/20">
                <Link className="text-blue-400 w-5 h-5 mr-2" />
                <span className="text-white font-medium">
                  Either way → Get shareable link for friends
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
