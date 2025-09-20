// components/QuickSplit.tsx
import React, { useState } from "react";
import { post } from "aws-amplify/api";
import {
  ArrowLeft,
  Upload,
  Camera,
  MessageCircle,
  Send,
  Loader,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickSplit: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<"upload" | "chat">("upload");

  const handleFileUpload = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const restOperation = post({
        apiName: "receipts",
        path: "/process",
        options: {
          body: {
            object_key: file.name,
            group_id: "quick-split",
          },
        },
      });

      const { body } = await restOperation.response;
      setResult(await body.json());
    } catch (error) {
      console.error("Failed:", error);
    }
    setLoading(false);
  };

  const handleChatSubmit = async () => {
    if (!chatMessage.trim()) return;

    setLoading(true);
    try {
      const restOperation = post({
        apiName: "receipts",
        path: "/process",
        options: {
          body: {
            chat_input: chatMessage,
            group_id: "quick-split",
          },
        },
      });

      const { body } = await restOperation.response;
      setResult(await body.json());
    } catch (error) {
      console.error("Failed:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-gray-950 text-white">
      {/* Header with back button */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800/50 p-6 w-full">
        <div className="w-full max-w-4xl mx-auto flex items-center space-x-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Quick Split</h1>
            <p className="text-gray-400">
              Upload receipt or describe your meal
            </p>
          </div>
        </div>
      </div>

      <div className="w-full px-6 py-12">
        <div className="w-full max-w-4xl mx-auto">
          {/* Method Selection */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setMethod("upload")}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                method === "upload"
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-gray-700 bg-gray-800/50"
              }`}
            >
              <Camera className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">Upload Receipt</div>
              <div className="text-sm text-gray-400">Take or upload photo</div>
            </button>

            <button
              onClick={() => setMethod("chat")}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                method === "chat"
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-700 bg-gray-800/50"
              }`}
            >
              <MessageCircle className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">Tell Our AI</div>
              <div className="text-sm text-gray-400">Describe your meal</div>
            </button>
          </div>

          {/* Upload Method */}
          {method === "upload" && (
            <div className="bg-gray-800/50 rounded-2xl p-8 mb-8">
              <div className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center">
                {file ? (
                  <div className="space-y-4">
                    <div className="text-4xl">📄</div>
                    <div>
                      <p className="font-semibold">{file.name}</p>
                      <p className="text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-16 h-16 mx-auto text-gray-400" />
                    <div>
                      <p className="text-xl font-semibold mb-2">
                        Drop your receipt here
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg cursor-pointer transition-colors"
                      >
                        Choose File
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleFileUpload}
                disabled={!file || loading}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader className="animate-spin w-5 h-5 mx-auto" />
                ) : (
                  "Process Receipt"
                )}
              </button>
            </div>
          )}

          {/* Chat Method */}
          {method === "chat" && (
            <div className="bg-gray-800/50 rounded-2xl p-8 mb-8">
              <div className="space-y-4">
                <div className="text-lg font-semibold">Describe Your Meal</div>
                <div className="text-gray-400 text-sm">
                  Example: "We had dim sum at Tim Ho Wan, total was RM124.50, 4
                  people"
                </div>

                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Tell us about your meal..."
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                    onKeyPress={(e) => e.key === "Enter" && handleChatSubmit()}
                  />
                  <button
                    onClick={handleChatSubmit}
                    disabled={!chatMessage.trim() || loading}
                    className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader className="animate-spin w-5 h-5" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4 text-green-400">
                ✅ Split Complete!
              </h3>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>

              <button className="w-full mt-6 bg-green-600 hover:bg-green-500 py-4 rounded-xl font-semibold">
                Generate Share Link 🔗
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickSplit;
