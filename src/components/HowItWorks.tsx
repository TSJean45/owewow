import React from "react";
import { Upload, Scan, Users, CheckCircle } from "lucide-react";

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload Receipt",
      description:
        "Snap a photo or upload an image of any receipt. Our AI works with restaurants, groceries, delivery - everything.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Scan,
      title: "AI Processing",
      description:
        "Advanced OCR technology extracts every line item, calculates tax and tip distribution automatically.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Assign & Share",
      description:
        "Tag friends to items, generate magic share links, and let everyone see exactly what they owe.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: CheckCircle,
      title: "Get Paid",
      description:
        "Track payments in real-time, send gentle reminders, and celebrate when everyone's settled up.",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 px-6 bg-gradient-to-b from-gray-950 to-gray-900"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            From receipt to settlement in under 60 seconds. It's magic, but
            better.
          </p>
        </div>

        <div className="relative">
          {/* Connection lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-700 to-transparent transform -translate-y-1/2" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                {/* Step number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white lg:static lg:hidden">
                  {index + 1}
                </div>

                {/* Icon */}
                <div
                  className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group hover:scale-110 transition-all duration-300 shadow-lg relative z-10 bg-gray-900`}
                >
                  <step.icon className="w-10 h-10 text-white" />
                </div>

                {/* Step number for desktop */}
                <div className="hidden lg:block w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full items-center justify-center text-sm font-bold text-white mx-auto mb-4 relative z-20">
                  {index + 1}
                </div>

                <h3 className="text-xl font-semibold text-white mb-4">
                  {step.title}
                </h3>

                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Demo CTA */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25">
            Try It Now - Upload a Receipt
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
