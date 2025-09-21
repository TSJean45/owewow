import React from "react";
import { Camera, MessageSquare } from "lucide-react";

interface ModeSelectorProps {
  mode: "upload" | "chat";
  onModeChange: (mode: "upload" | "chat") => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onModeChange }) => {
  return (
    <div className="flex bg-[#0a0a0a]/30 rounded-full p-1 mb-6">
      <button
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full transition ${
          mode === "upload"
            ? "bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg text-white"
            : "text-gray-400 hover:text-gray-300"
        }`}
        onClick={() => onModeChange("upload")}
      >
        <Camera size={16} /> Upload
      </button>
      <button
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full transition ${
          mode === "chat"
            ? "bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg text-white"
            : "text-gray-400 hover:text-gray-300"
        }`}
        onClick={() => onModeChange("chat")}
      >
        <MessageSquare size={16} /> Describe
      </button>
    </div>
  );
};

export default ModeSelector;
