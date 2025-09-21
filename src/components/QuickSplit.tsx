import React, { useState, useRef } from "react";
import { post } from "aws-amplify/api";
import { useNavigate } from "react-router-dom";
import { uploadData } from "aws-amplify/storage";
import { Camera, Upload } from "lucide-react";

import Header from "./Header";
import ModeSelector from "./ModeSelector";
import ProcessingState from "./ProcessingState";
import ChatSection from "./ChatSection";

const QuickSplit: React.FC = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState<"upload" | "chat">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [state, setState] = useState<"input" | "processing">("input");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) setSelectedFile(files[0]);
  };

  const handleTakePhoto = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) setSelectedFile(file);
    };
    input.click();
  };

  const uploadToS3 = async (file: File): Promise<string> => {
    try {
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substr(2, 9);
      const fileExtension = file.name.split(".").pop();
      const fileKey = `receipts/${timestamp}_${randomId}.${fileExtension}`;

      console.log("📤 Uploading to S3:", fileKey);

      await uploadData({
        key: fileKey,
        data: file,
        options: {
          accessLevel: "guest",
        },
      });

      console.log("✅ Upload successful:", fileKey);
      return fileKey;
    } catch (error: any) {
      console.error("❌ S3 upload failed:", error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  };

  const processUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    setState("processing");

    try {
      console.log("📤 Step 1: Uploading to S3...");
      const objectKey = await uploadToS3(selectedFile);

      console.log("🤖 Step 2: Processing with AI...");
      const restOperation = post({
        apiName: "receipts",
        path: "/process",
        options: {
          body: {
            object_key: `public/${objectKey}`,
            bucket_name: "owewow-uploads-x9k4m292a00-dev",
            group_id: "quick-split",
          },
        },
      });

      const { body } = await restOperation.response;
      const data = await body.json();

      console.log("✅ Processing complete:", data);

      let processedResult: any = data;
      if (data && typeof data === "object" && "body" in data) {
        if (typeof data.body === "string") {
          try {
            processedResult = JSON.parse(data.body);
          } catch (e) {
            processedResult = data;
          }
        }
      }

      if (processedResult.receipt_id) {
        sessionStorage.setItem(
          `receipt_${processedResult.receipt_id}`,
          JSON.stringify(processedResult)
        );
        navigate(`/results/${processedResult.receipt_id}`);
      } else {
        throw new Error("No receipt ID received");
      }
    } catch (err: any) {
      console.error("❌ Process failed:", err);
      setError(err.message || "Failed to process receipt.");
      setState("input");
    } finally {
      setLoading(false);
    }
  };

  const processChat = async () => {
    if (!chatInput.trim()) return;
    setLoading(true);
    setError(null);
    setState("processing");

    try {
      const restOperation = post({
        apiName: "receipts",
        path: "/process",
        options: {
          body: {
            chat_input: chatInput,
            group_id: "quick-split",
            step: "initial",
          },
        },
      });

      const { body } = await restOperation.response;
      const data = await body.json();

      console.log("Chat result:", data);

      if (data && typeof data === "object" && data !== null && "body" in data) {
        const aiResponse = JSON.parse(data.body as string);

        if (aiResponse.receipt_data && aiResponse.receipt_data.calculations) {
          const total = aiResponse.receipt_data.calculations.estimated_total;
          const numPeople = aiResponse.receipt_data.people_count || 2;

          const splitResults = Array.from({ length: numPeople }, (_, i) => ({
            name: `Person ${i + 1}`,
            amount: total / numPeople,
            qty: 1,
            line_id: `person_${i + 1}`,
          }));

          const chatResult = {
            ...aiResponse,
            lines: splitResults,
            ai_message: aiResponse.ai_response,
            receipt_id: `chat_${Date.now()}`,
            totals: {
              subtotal: total,
              grand_total: total,
            },
            category: {
              category: "CHAT_SPLIT",
              confidence: "high",
            },
          };

          sessionStorage.setItem(
            `receipt_${chatResult.receipt_id}`,
            JSON.stringify(chatResult)
          );

          navigate(`/results/${chatResult.receipt_id}`);
        } else {
          throw new Error("Invalid chat response format");
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.error("Chat failed:", err);
      setError(err.message || "Failed to process chat input.");
      setState("input");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen max-w-full overflow-x-hidden relative">
      <Header onSplitReceipt={() => navigate("/split-choice")} />

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Quick
              </span>{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Split
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Split any bill with AI precision. Upload receipts or describe
              expenses - dining, shopping, utilities, and more.
            </p>
          </div>

          {error && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-red-900/20 border border-red-700 rounded-xl p-4 text-center">
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          )}

          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
              <div className="mb-8">
                <ModeSelector mode={mode} onModeChange={setMode} />
              </div>

              {state === "processing" && (
                <div className="text-center py-8">
                  <ProcessingState mode={mode} />
                </div>
              )}

              {state === "input" && (
                <>
                  {mode === "upload" && (
                    <div className="space-y-6">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setSelectedFile(file);
                        }}
                        className="hidden"
                      />

                      {!selectedFile ? (
                        <div
                          onDrop={handleDrop}
                          onDragOver={handleDrag}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                            dragActive
                              ? "border-purple-400 bg-purple-400/10"
                              : "border-gray-600 hover:border-gray-500"
                          }`}
                        >
                          <div className="space-y-4">
                            <div className="text-6xl">📄</div>
                            <p className="text-gray-300">
                              Take a photo or upload receipt
                            </p>
                            <div className="space-y-3">
                              <button
                                onClick={handleTakePhoto}
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all"
                              >
                                <Camera size={20} />
                                Take Photo
                              </button>
                              <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all"
                              >
                                <Upload size={20} />
                                Upload from Gallery
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">✓</span>
                              </div>
                              <div>
                                <p className="font-semibold text-white">
                                  {selectedFile.name}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                  MB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedFile(null)}
                              className="text-gray-400 hover:text-red-400 transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                          <button
                            onClick={processUpload}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 py-4 rounded-xl font-bold text-white transition-all disabled:opacity-50"
                          >
                            {loading
                              ? "Processing..."
                              : "Split This Receipt 🚀"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {mode === "chat" && (
                    <ChatSection
                      chatInput={chatInput}
                      onChatInputChange={setChatInput}
                      onProcess={processChat}
                      loading={loading}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center px-6 py-3 bg-gray-800/30 border border-gray-700/30 rounded-full backdrop-blur-sm hover:bg-gray-700/30 transition-colors">
              <span className="text-2xl mr-3">💡</span>
              <p className="text-gray-400 text-sm">
                <span className="font-medium text-gray-300">Tip:</span>
                {mode === "upload"
                  ? " Take a clear photo for best AI recognition results"
                  : " Be specific about items and prices for accurate splitting"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSplit;
