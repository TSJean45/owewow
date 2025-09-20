import React, { useState, useRef } from "react";
import { post } from "aws-amplify/api";
import {
  ArrowLeft,
  Camera,
  MessageSquare,
  Upload,
  Send,
  Loader,
  CheckCircle2,
  Link2,
  Zap,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { uploadData } from "aws-amplify/storage";

const QuickSplit: React.FC = () => {
  const navigate = useNavigate();

  // UI States
  const [mode, setMode] = useState<"upload" | "chat">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [state, setState] = useState<"input" | "processing" | "results">(
    "input"
  );
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Example prompts for chat
  const examplePrompts = [
    "Dinner at Tim's Bistro, RM104.50 for 3",
    "Coffee shop bill RM8.60, split between 2",
    "Lunch at Mamak, RM50 for 4",
  ];

  // Drag and drop handlers
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) setSelectedFile(files[0]);
  };

  const uploadToS3 = async (file: File): Promise<string> => {
    try {
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substr(2, 9);
      const fileExtension = file.name.split(".").pop();
      const fileKey = `receipts/${timestamp}_${randomId}.${fileExtension}`;

      console.log("📤 Uploading to S3:", fileKey);

      const result = await uploadData({
        key: fileKey,
        data: file,
        options: {
          accessLevel: "guest", // Anonymous access
        },
      });

      console.log("✅ Upload successful:", fileKey);
      return fileKey;
    } catch (error: any) {
      console.error("❌ S3 upload failed:", error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  };

  // Upload processing
  const processUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    setState("processing");

    try {
      const restOperation = post({
        apiName: "receipts",
        path: "/process",
        options: {
          body: {
            object_key: selectedFile.name,
            bucket_name: "owewow-uploads-x9k4m2", // Your actual bucket
            group_id: "quick-split",
          },
        },
      });

      // FIXED: Proper Amplify API response handling
      const { body } = await restOperation.response;
      const data = await body.json();

      console.log("Upload result:", data);
      setResult(data);
      setState("results");
    } catch (err: any) {
      console.error("Upload failed:", err);
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
      setResult(data);
      setState("results");
    } catch (err: any) {
      console.error("Chat failed:", err);
      setError(err.message || "Failed to process chat input.");
      setState("input");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setChatInput("");
    setResult(null);
    setState("input");
    setError(null);
  };

  const shareResults = async () => {
    if (!result) return;
    const shareText = `OweWow Split Result:\n${(result.lines ?? [])
      .map((line: any) => `${line.name}: RM${line.amount?.toFixed(2)}`)
      .join("\n")}`;
    if (navigator.share) {
      await navigator.share({ title: "OweWow Split", text: shareText });
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("Results copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-start py-6 px-4 text-white font-inter relative overflow-hidden">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 bg-[#1a1a1a]/70 p-2 rounded-md hover:bg-[#2a2a2a] transition"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="w-full max-w-sm bg-[#1a1a1a]/70 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/10 z-10">
        <h1 className="text-3xl font-bold text-center mb-3">QuickSplit</h1>
        <p className="text-center text-gray-400 mb-6">
          AI-powered bill splitting, Malaysian style 🇲🇾
        </p>

        {error && (
          <div className="text-red-500 bg-red-900/50 border border-red-700 rounded p-2 mb-4 text-center">
            {error}
          </div>
        )}

        {/* Mode selection */}
        <div className="flex bg-[#0a0a0a]/30 rounded-full p-1 mb-6">
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full transition ${
              mode === "upload"
                ? "bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg text-white"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setMode("upload")}
          >
            <Camera size={16} /> Upload
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full transition ${
              mode === "chat"
                ? "bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg text-white"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setMode("chat")}
          >
            <MessageSquare size={16} /> Describe
          </button>
        </div>

        {/* Upload mode */}
        {mode === "upload" && (
          <>
            <div
              onDrop={handleDrop}
              onDragEnter={handleDrag}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={handleDrag}
              className={`border-2 border-dashed rounded-xl transition p-10 text-center cursor-pointer mb-4 ${
                dragActive
                  ? "border-purple-500 bg-purple-700"
                  : "border-gray-600"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedFile ? (
                <div className="text-white">
                  <div>
                    <Zap
                      size={32}
                      className="mx-auto mb-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded"
                    />
                    <p className="truncate">{selectedFile.name}</p>
                    <p className="text-gray-400 text-sm">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    className="mt-3 px-4 py-2 border border-purple-600 rounded text-purple-500 hover:text-purple-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <p>Drag & drop or click to select receipt</p>
                  <p className="text-gray-400 text-sm mt-2">
                    PNG, JPG, &lt; 10MB
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            <button
              onClick={processUpload}
              disabled={!selectedFile || loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition hover:shadow-lg active:scale-95"
            >
              {loading ? (
                <Loader size={20} className="animate-spin mx-auto" />
              ) : (
                "Process Receipt"
              )}
            </button>
          </>
        )}

        {/* Chat mode */}
        {mode === "chat" && (
          <>
            <div className="mb-4">
              <p className="text-gray-400 mb-2">Try one of these examples:</p>
              <div className="flex flex-col gap-2">
                {examplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    className="text-left bg-[#0a0a0a]/20 hover:bg-[#0a0a0a]/50 px-4 py-2 rounded font-mono text-sm text-gray-400 hover:text-gray-300 transition"
                    onClick={() => setChatInput(p)}
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
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") processChat();
                }}
              />
              <button
                className="absolute top-1/2 right-3 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 p-2 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={processChat}
                disabled={!chatInput.trim() || loading}
              >
                <Send size={20} />
              </button>
            </div>
          </>
        )}

        {/* Result mode */}
        {state === "results" && (
          <>
            <div className="text-center my-8">
              <CheckCircle2
                size={56}
                className="mx-auto text-green-500 mb-4 animate-pulse"
              />
              <h2 className="text-2xl font-bold mb-2">Split Complete!</h2>
              <p className="text-gray-400 mb-6">
                Here's how the bill was split based on your input.
              </p>
            </div>
            <div className="space-y-4">
              {(result?.lines || []).map((line: any, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-[#121212] rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 flex justify-center items-center text-white font-bold">
                      {line.name?.[0] || "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{line.name}</p>
                      <p className="text-gray-400 text-sm">
                        Qty: {line.qty ?? 1}, Price: RM{" "}
                        {line.amount?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-white text-lg">
                    RM {line.amount?.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              <button
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-xl flex justify-center items-center gap-2 text-white font-semibold hover:shadow-lg active:scale-95 transition-all duration-300"
                onClick={shareResults}
              >
                <Link2 size={20} /> Share Results
              </button>
              <button
                className="w-full border border-gray-600 py-3 rounded-xl flex justify-center items-center gap-2 text-gray-400 font-semibold hover:bg-[#222] active:scale-95 transition-all duration-300"
                onClick={reset}
              >
                <ArrowLeft size={20} className="rotate-180" /> New Split
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuickSplit;
