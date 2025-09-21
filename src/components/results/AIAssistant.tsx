import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Loader,
  Check,
  X,
  Sparkles,
  Volume2,
  Edit3,
  Trash2,
  Plus,
  Percent,
} from "lucide-react";
import { post } from "aws-amplify/api";

interface VoiceCommand {
  action:
    | "edit_price"
    | "add_item"
    | "delete_item"
    | "edit_tax"
    | "edit_service"
    | "bulk_commands";
  itemName?: string;
  amount?: number;
  percentage?: number;
  quantity?: number;
  originalText: string;
  commands?: VoiceCommand[]; // For bulk commands
  confidence?: string;
}

interface ResultLine {
  name: string;
  amount: number;
  qty: number;
  line_id: string;
  is_bundle?: boolean;
}

interface AIAssistantProps {
  onCommand: (command: VoiceCommand) => void;
  receiptItems: ResultLine[];
  isOpen: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  onCommand,
  receiptItems,
  isOpen,
  onClose,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [parsedCommand, setParsedCommand] = useState<VoiceCommand | null>(null);

  const recognitionRef = useRef<any>(null);
  const [isSupported, setIsSupported] = useState(false);

  const [showEditTranscript, setShowEditTranscript] = useState(false);
  const [editableTranscript, setEditableTranscript] = useState("");

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      setIsSupported(true);
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript("");
        setFeedback("🎤 Listening... You can give multiple commands at once!");
      };

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = finalTranscript + interimTranscript;
        setTranscript(fullTranscript);

        if (fullTranscript.trim()) {
          setFeedback(`🎤 Hearing: "${fullTranscript.trim()}"`);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        setIsListening(false);
        setFeedback(`❌ Speech recognition error: ${event.error}`);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsSupported(false);
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      setParsedCommand(null);
      setFeedback("");
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);

      if (transcript.trim().length > 3) {
        processCommand(transcript.trim());
      } else {
        setFeedback("❌ Please speak longer and try again!");
      }
    }
  };

  const processCommand = async (text: string) => {
    setIsProcessing(true);

    try {
      console.log("🎤 Processing command:", text);

      const parsedCommand = await parseCommandWithLambda(text);

      if (parsedCommand) {
        setParsedCommand(parsedCommand);
        setFeedback(`✅ ${getCommandDescription(parsedCommand)}`);
      } else {
        setFeedback(
          "🤔 Sorry, I didn't understand that. Try saying something like:\n• 'Change army stew to 25 and honey lemon to 8'\n• 'Add iced coffee for 8 and delete seafood pancake'\n• 'Set tax to 6 percent and service charge to 10 percent'"
        );
      }
    } catch (error) {
      console.error("❌ Command processing error:", error);
      setFeedback("❌ Error processing command. Please try again.");
    }

    setIsProcessing(false);
  };

  const parseCommandWithLambda = async (
    text: string
  ): Promise<VoiceCommand | null> => {
    try {
      const requestBody = {
        voice_command: text,
        receiptItems: receiptItems.map((item) => ({
          name: item.name,
          amount: item.amount,
        })),
      };

      console.log("🚀 Sending to Lambda:", requestBody);

      const restOperation = post({
        apiName: "receipts",
        path: "/process",
        options: {
          body: requestBody,
        },
      });

      const { body } = await restOperation.response;
      const result: any = await body.json();

      console.log("🎉 Voice command response:", result);

      let processedResult: any = result;
      if (result && typeof result === "object" && "body" in result) {
        if (typeof result.body === "string") {
          try {
            processedResult = JSON.parse(result.body);
          } catch (e) {
            processedResult = result;
          }
        }
      }

      const normalizeCommand = (cmd: any): VoiceCommand => ({
        action: cmd.command || cmd.action,
        itemName: cmd.item_name || cmd.itemName,
        amount: cmd.amount,
        percentage: cmd.percentage,
        quantity: cmd.quantity || 1,
        confidence: cmd.confidence || "medium",
        originalText: text,
      });

      if (processedResult?.command) {
        const command = processedResult.command;

        if (command.action === "bulk_commands" && command.commands) {
          const normalizedCommands = command.commands
            .map(normalizeCommand)
            .filter((cmd: any) => cmd.action !== "unknown");

          if (normalizedCommands.length === 0) {
            return null;
          }

          return {
            action: "bulk_commands",
            commands: normalizedCommands,
            originalText: text,
          };
        } else if (command.command && command.command !== "unknown") {
          return normalizeCommand(command);
        }
      }

      return null;
    } catch (error) {
      console.error("❌ Voice command parsing failed:", error);
      return null;
    }
  };

  const getCommandDescription = (command: VoiceCommand): string => {
    switch (command.action) {
      case "edit_price":
        return `Change "${command.itemName}" price to RM${command.amount}`;
      case "add_item":
        return `Add "${command.itemName}" for RM${command.amount}`;
      case "delete_item":
        return `Delete "${command.itemName}"`;
      case "edit_tax":
        return `Set tax to ${command.percentage}%`;
      case "edit_service":
        return `Set service charge to ${command.percentage}%`;
      case "bulk_commands":
        const count = command.commands?.length || 0;
        const commandTypes =
          command.commands
            ?.map((cmd) => {
              switch (cmd.action) {
                case "edit_price":
                  return "✏️ Price change";
                case "add_item":
                  return "➕ Add item";
                case "delete_item":
                  return "🗑️ Delete item";
                case "edit_tax":
                  return "💰 Tax update";
                case "edit_service":
                  return "🔧 Service fee";
                default:
                  return "❓ Unknown";
              }
            })
            .join(", ") || "";
        return `Found ${count} commands: ${commandTypes}`;
      default:
        return "Unknown command";
    }
  };

  const removeCommand = (indexToRemove: number) => {
    if (
      parsedCommand &&
      parsedCommand.action === "bulk_commands" &&
      parsedCommand.commands
    ) {
      const updatedCommands = parsedCommand.commands.filter(
        (_, index) => index !== indexToRemove
      );

      if (updatedCommands.length === 0) {
        setParsedCommand(null);
        setFeedback("All commands removed. Please try again.");
      } else if (updatedCommands.length === 1) {
        setParsedCommand({
          ...updatedCommands[0],
          originalText: parsedCommand.originalText,
        });
        setFeedback(`✅ ${getCommandDescription(updatedCommands[0])}`);
      } else {
        setParsedCommand({
          ...parsedCommand,
          commands: updatedCommands,
        });
        setFeedback(`✅ ${updatedCommands.length} commands ready`);
      }
    }
  };

  const getCommandIcon = (action: string) => {
    switch (action) {
      case "edit_price":
        return <Edit3 size={14} className="text-blue-400" />;
      case "add_item":
        return <Plus size={14} className="text-green-400" />;
      case "delete_item":
        return <Trash2 size={14} className="text-red-400" />;
      case "edit_tax":
        return <Percent size={14} className="text-yellow-400" />;
      case "edit_service":
        return <Percent size={14} className="text-orange-400" />;
      default:
        return <Sparkles size={14} className="text-purple-400" />;
    }
  };

  // Helper to get individual command description
  const getIndividualCommandDescription = (cmd: VoiceCommand): string => {
    switch (cmd.action) {
      case "edit_price":
        return `Change "${cmd.itemName}" to RM${cmd.amount}`;
      case "add_item":
        return `Add "${cmd.itemName}" for RM${cmd.amount}`;
      case "delete_item":
        return `Delete "${cmd.itemName}"`;
      case "edit_tax":
        return `Tax: ${cmd.percentage}%`;
      case "edit_service":
        return `Service: ${cmd.percentage}%`;
      default:
        return "Unknown command";
    }
  };

  const executeCommand = () => {
    if (parsedCommand) {
      onCommand(parsedCommand);
      setFeedback("✅ Command executed successfully!");
      setParsedCommand(null);
      setTranscript("");

      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  const clearCommand = () => {
    setParsedCommand(null);
    setTranscript("");
    setFeedback("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-md w-full border border-gray-600 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header with Gradient */}
        <div className=" p-6 text-center relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors bg-white/10 rounded-full p-2 backdrop-blur-sm"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {!isSupported ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🎤❌</div>
            <p className="text-red-400 mb-2 font-semibold">
              Speech not supported
            </p>
            <p className="text-gray-400 text-sm">
              Please use Chrome or Edge for voice commands
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Voice Input Section */}
            <div className="text-center">
              <div className="relative inline-block">
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing}
                  className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all transform shadow-lg ${
                    isListening
                      ? "bg-gradient-to-r from-red-500 to-pink-500 animate-pulse scale-110 shadow-red-500/30"
                      : isProcessing
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 shadow-orange-500/30"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 shadow-blue-500/30"
                  } ${isProcessing ? "animate-spin" : ""}`}
                >
                  {isProcessing ? (
                    <Loader className="w-10 h-10 text-white" />
                  ) : isListening ? (
                    <MicOff className="w-10 h-10 text-white" />
                  ) : (
                    <Mic className="w-10 h-10 text-white" />
                  )}

                  {/* Pulsing Ring Effect */}
                  {isListening && (
                    <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></div>
                  )}
                </button>
              </div>

              <p className="text-gray-400 text-sm mt-6">
                {isListening
                  ? "Click to stop and process"
                  : isProcessing
                  ? "AI is thinking..."
                  : "Click and speak multiple commands"}
              </p>
            </div>

            {(transcript || isListening) && (
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-4 backdrop-blur-sm border border-gray-600/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Volume2 size={16} className="text-blue-400" />
                    <span className="text-sm font-medium text-gray-300">
                      {isListening ? "Live Transcript" : "You Said"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {isListening && (
                      <button
                        onClick={stopListening}
                        className="text-xs bg-red-500 hover:bg-red-600 px-3 py-1 rounded-full text-white font-medium transition-colors"
                      >
                        Stop & Process
                      </button>
                    )}
                    {/* NEW: Edit button after recording */}
                    {!isListening && transcript && !isProcessing && (
                      <button
                        onClick={() => {
                          setEditableTranscript(transcript);
                          setShowEditTranscript(true);
                        }}
                        className="text-xs bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-full text-white font-medium transition-colors"
                      >
                        Edit Text
                      </button>
                    )}
                  </div>
                </div>

                <div
                  className={`text-white font-medium ${
                    isListening ? "animate-pulse" : ""
                  }`}
                >
                  {transcript || (
                    <span className="text-gray-400 italic">
                      Listening for your voice...
                    </span>
                  )}
                </div>

                {/* NEW: Speech recognition wonky message */}
                {!isListening &&
                  transcript &&
                  transcript.length > 10 &&
                  !isProcessing && (
                    <div className="mt-2 text-xs text-gray-400">
                      💡 Speech recognition wonky? Click "Edit Text" to fix it!
                    </div>
                  )}
              </div>
            )}

            {/* Feedback Section */}
            {feedback && (
              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-4 border border-blue-500/30">
                <p className="text-sm text-gray-200 whitespace-pre-line">
                  {feedback}
                </p>
              </div>
            )}

            {/* Enhanced Command Confirmation */}
            {parsedCommand && (
              <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-500/50 rounded-xl p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Check size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-400">
                    {parsedCommand.action === "bulk_commands"
                      ? "Multiple Commands Ready"
                      : "Command Ready"}
                  </span>
                </div>

                <div className="mb-4">
                  {parsedCommand.action === "bulk_commands" &&
                  parsedCommand.commands ? (
                    <div className="space-y-3">
                      <p className="text-white font-semibold mb-3">
                        {parsedCommand.commands.length} commands to execute:
                      </p>
                      {parsedCommand.commands.map((cmd, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 text-sm text-gray-200 bg-white/5 rounded-lg p-3"
                        >
                          <div className="flex-shrink-0">
                            {getCommandIcon(cmd.action)}
                          </div>
                          <div className="flex-1">
                            <span>{getIndividualCommandDescription(cmd)}</span>
                          </div>
                          <button
                            onClick={() => removeCommand(idx)}
                            className="flex-shrink-0 p-1 bg-red-600/20 hover:bg-red-600/40 rounded text-red-400 hover:text-red-300 transition-colors"
                            title="Remove this command"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white font-semibold">
                      {getCommandDescription(parsedCommand)}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={executeCommand}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 py-3 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <Check size={18} />
                    Execute{" "}
                    {parsedCommand.action === "bulk_commands" ? "All" : ""}
                  </button>
                  <button
                    onClick={clearCommand}
                    className="px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {showEditTranscript && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Edit Your Command
                    </h3>
                    <button
                      onClick={() => setShowEditTranscript(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">
                      Original (from speech):
                    </p>
                    <div className="bg-gray-700/50 rounded-lg p-3 text-sm text-gray-300 mb-3">
                      {transcript}
                    </div>

                    <p className="text-sm text-gray-400 mb-2">Edit and fix:</p>
                    <textarea
                      value={editableTranscript}
                      onChange={(e) => setEditableTranscript(e.target.value)}
                      className="w-full h-24 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white resize-none focus:border-blue-500 focus:outline-none"
                      placeholder="Fix the speech recognition errors here..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        if (editableTranscript.trim()) {
                          setTranscript(editableTranscript.trim());
                          setShowEditTranscript(false);
                          processCommand(editableTranscript.trim());
                        }
                      }}
                      disabled={!editableTranscript.trim()}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 py-3 rounded-lg font-semibold text-white transition-colors"
                    >
                      Process Fixed Text
                    </button>
                    <button
                      onClick={() => setShowEditTranscript(false)}
                      className="px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium text-white transition-colors"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="mt-3 text-xs text-gray-400">
                    💡 Examples: "Change barley to 15" or "Add 2 cans of 100
                    plus for 6 ringgit"
                  </div>
                </div>
              </div>
            )}

            {/* Examples Section */}
            <div className="bg-gradient-to-r from-gray-800/30 to-gray-700/30 rounded-xl p-4 border border-gray-600/30">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-purple-400" />
                <span className="text-sm font-medium text-gray-300">
                  Try bulk commands:
                </span>
              </div>

              <div className="grid gap-2">
                {[
                  "Change army stew to 25 and honey lemon to 8",
                  "Add iced coffee for 8 and delete seafood pancake",
                  "Set tax to 6 percent and service charge to 10 percent",
                  "Change char kway teow to 16 and add green tea for 5",
                ].map((example, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    <span className="text-xs text-gray-400">{example}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
