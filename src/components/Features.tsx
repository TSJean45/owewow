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
        "Advanced machine learning extracts every line item, tax, and tip with 99.8% accuracy from any receipt type.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Calculator,
      title: "Smart Bill Splitting",
      description:
        "Automatically calculates who owes what based on what they ordered, including tax and tip distribution.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Share2,
      title: "Magic Share Links",
      description:
        "Generate instant shareable links that friends can use to see their portion and pay directly.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: FileImage,
      title: "Any Receipt Type",
      description:
        "Restaurant bills, grocery receipts, shopping trips, delivery orders - works with everything.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Clock,
      title: "Real-Time Tracking",
      description:
        "See who's paid, who's pending, and send gentle reminders without the awkwardness.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Bank-level encryption ensures your financial data stays private and secure always.",
      gradient: "from-teal-500 to-blue-500",
    },
  ];

  return (
    <section id="features" className="py-20 px-6">
      <div className="w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Powered by Intelligence
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Cutting-edge AI technology meets intuitive design to solve bill
            splitting once and for all
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:-translate-y-2"
            >
              {/* Gradient glow effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
              />

              <div
                className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-gray-100 transition-colors duration-300">
                {feature.title}
              </h3>

              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
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
