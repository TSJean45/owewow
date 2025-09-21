import React from "react";
import {
  Brain,
  Calculator,
  Share2,
  FileImage,
  Clock,
  Shield,
} from "lucide-react";

const Features: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered OCR",
      description:
        "Extracts every item, tax, and tip with 99.8% accuracy from any receipt.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Calculator,
      title: "Smart Bill Splitting",
      description:
        "Automates fair calculations including tax and tip distribution.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Share2,
      title: "Magic Share Links",
      description:
        "Generate instant share links so friends can claim their share quickly.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: FileImage,
      title: "Any Receipt",
      description:
        "Works perfectly on restaurant, grocery, delivery & shopping receipts.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Clock,
      title: "Real-Time Tracking",
      description:
        "Track who’s paid or pending, and send gentle automatic reminders.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Bank-level encryption keeps your financial data private and safe.",
      gradient: "from-teal-500 to-blue-500",
    },
  ];

  return (
    <section id="features" className="py-20 px-6">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Powered by Intelligence
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Cutting-edge AI meets intuitive design to fix bill splitting
            forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-gray-600/50 transition-shadow duration-300 hover:shadow-lg"
            >
              {/* Gradient glow effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
              />

              <div
                className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-gray-100 transition-colors duration-300 relative z-10">
                {feature.title}
              </h3>

              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300 relative z-10">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
