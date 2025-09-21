import React from "react";
import { Send } from "lucide-react";

interface ChatSectionProps {
  chatInput: string;
  onChatInputChange: (value: string) => void;
  onProcess: () => void;
  loading: boolean;
}

const ChatSection: React.FC<ChatSectionProps> = ({
  chatInput,
  onChatInputChange,
  onProcess,
  loading,
}) => {
  const examplePrompts = [
    "Dinner at Tim's Bistro, RM104.50 for 3",
    "Coffee shop bill RM8.60, split between 2",
    "Lunch at Mamak, RM50 for 4",
  ];

  return (
    <>
      <div className="mb-4">
        <p className="text-gray-400 mb-2">Try one of these examples:</p>
        <div className="flex flex-col gap-2">
          {examplePrompts.map((p, idx) => (
            <button
              key={idx}
              className="text-left bg-[#0a0a0a]/20 hover:bg-[#0a0a0a]/50 px-4 py-2 rounded font-mono text-sm text-gray-400 hover:text-gray-300 transition"
              onClick={() => onChatInputChange(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder="Describe your meal, e.g., Lunch at Mamak, RM60 for 3"
          className="w-full rounded-xl bg-[#0a0a0a]/40 border border-gray-600 px-4 py-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          value={chatInput}
          onChange={(e) => onChatInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onProcess();
          }}
        />
        <button
          className="absolute top-1/2 right-3 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 p-2 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onProcess}
          disabled={!chatInput.trim() || loading}
        >
          <Send size={20} />
        </button>
      </div>
    </>
  );
};

export default ChatSection;
