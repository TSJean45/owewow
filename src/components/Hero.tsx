import React from "react";
import { ArrowRight, Camera, Link } from "lucide-react";

interface HeroProps {
  onSplitReceipt: () => void;
}

const Hero: React.FC<HeroProps> = ({ onSplitReceipt }) => {
  return (
    <section className="pt-20 pb-20 px-6 relative overflow-hidden bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-snug tracking-tight">
            <span className="bg-gradient-to-r from-white via-purple-300 to-blue-300 bg-clip-text text-transparent">
              Split Bills,
            </span>{" "}
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              Not Friendships
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-2xl text-gray-300 mb-7 max-w-3xl mx-auto leading-relaxed">
            Snap your receipt, AI reads everything step-by-step, then share
            magic links.
            <br />
            <span className="text-purple-300 font-semibold">
              Your friends just click & pay — no fuss, no mistakes.
            </span>
          </p>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-14">
            <button
              onClick={onSplitReceipt}
              className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-10 py-4 rounded-full text-white font-semibold text-lg transition-transform duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/50 flex items-center justify-center gap-3"
              aria-label="Upload receipt and split bill"
            >
              <Camera className="w-6 h-6" />
              Upload Receipt Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Highlighted no login/download notice */}
          <div className="mb-10 mx-auto max-w-md rounded-full bg-purple-700 bg-opacity-30 px-6 py-3 font-semibold text-white shadow-lg backdrop-blur-md select-none">
            🚫{" "}
            <span className="underline decoration-pink-400">No downloads</span>,
            🚫{" "}
            <span className="underline decoration-purple-400">No logins</span> —
            Start instantly
          </div>

          {/* Clear Step-by-Step feature */}
          <div className="text-center max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 tracking-tight">
              How It Works
            </h3>

            <div className="grid md:grid-cols-3 gap-12 text-left">
              <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50 space-y-3 shadow-lg">
                <div className="text-4xl font-bold text-purple-400 text-center">
                  1
                </div>
                <h4 className="text-xl font-semibold text-white text-center">
                  Upload Receipt
                </h4>
                <p className="text-gray-400 text-center">
                  Snap or upload any receipt photo.
                </p>
              </div>
              <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50 space-y-3 shadow-lg">
                <div className="text-4xl font-bold text-purple-400 text-center">
                  2
                </div>
                <h4 className="text-xl font-semibold text-white text-center">
                  AI Reads Items
                </h4>
                <p className="text-gray-400 text-center">
                  Step-by-step verification for unmatched accuracy.
                </p>
              </div>
              <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50 space-y-3 shadow-lg">
                <div className="text-4xl font-bold text-purple-400 text-center">
                  3
                </div>
                <h4 className="text-xl font-semibold text-white text-center">
                  Get Smart Share Links
                </h4>
                <p className="text-gray-400 text-center">
                  Your friends just click & pay easily.
                </p>
              </div>
            </div>

            <div className="mt-10 inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full border border-purple-500/20 mx-auto max-w-fit gap-2 text-white font-medium tracking-wide select-none text-sm">
              <Link className="w-5 h-5 text-blue-400" />
              Either way → Fast, easy, and accurate bill splits
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
