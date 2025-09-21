import React from "react";
import { Loader } from "lucide-react";

interface ProcessingStateProps {
  mode: "upload" | "chat";
}

const ProcessingState: React.FC<ProcessingStateProps> = ({ mode }) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center animate-pulse">
        <Loader className="w-8 h-8 animate-spin text-white" />
      </div>
      <p className="text-white font-medium mb-1">
        {mode === "upload" ? "Uploading & Processing..." : "AI is analyzing..."}
      </p>
      <p className="text-gray-400 text-sm">
        {mode === "upload"
          ? "📤 Upload → 🤖 AI Analysis → 📊 Results"
          : "🤖 Understanding your meal..."}
      </p>
    </div>
  );
};

export default ProcessingState;
