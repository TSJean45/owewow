import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Edit3,
  Trash2,
  Plus,
  Store,
  Receipt,
  Users,
  Save,
  X,
} from "lucide-react";
import Header from "../Header";

interface ResultLine {
  name: string;
  amount: number;
  qty: number;
  line_id: string;
}

interface ReceiptData {
  receipt_id: string;
  source_file: string;
  category: {
    category: string;
    confidence: string;
    reasoning?: string;
  };
  lines: ResultLine[];
  totals: {
    subtotal: number;
    grand_total: number;
  };
  message: string;
}

const ResultsPage: React.FC = () => {
  const { receiptId } = useParams<{ receiptId: string }>();
  //   const navigate = useNavigate();

  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", amount: 0, qty: 1 });
  const [showAIChat, setShowAIChat] = useState(false);
  const [showAssignment, setShowAssignment] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(`receipt_${receiptId}`);
    if (stored) {
      setReceiptData(JSON.parse(stored));
    } else {
      console.log("No receipt data found for:", receiptId);
    }
  }, [receiptId]);

  if (!receiptData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Header />
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center animate-pulse">
            <Receipt className="w-8 h-8 text-white" />
          </div>
          <p className="text-white">Loading receipt...</p>
        </div>
      </div>
    );
  }

  const handleEditItem = (lineId: string) => {
    const item = receiptData.lines.find((line) => line.line_id === lineId);
    if (item) {
      setEditForm({ name: item.name, amount: item.amount, qty: item.qty });
      setEditingItem(lineId);
    }
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    setReceiptData((prev) =>
      prev
        ? {
            ...prev,
            lines: prev.lines.map((line) =>
              line.line_id === editingItem
                ? {
                    ...line,
                    name: editForm.name,
                    amount: editForm.amount,
                    qty: editForm.qty,
                  }
                : line
            ),
            totals: {
              subtotal: prev.lines.reduce(
                (sum, line) =>
                  sum +
                  (line.line_id === editingItem
                    ? editForm.amount
                    : line.amount),
                0
              ),
              grand_total: prev.lines.reduce(
                (sum, line) =>
                  sum +
                  (line.line_id === editingItem
                    ? editForm.amount
                    : line.amount),
                0
              ),
            },
          }
        : null
    );

    setEditingItem(null);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditForm({ name: "", amount: 0, qty: 1 });
  };

  const handleDeleteItem = (lineId: string) => {
    setReceiptData((prev) =>
      prev
        ? {
            ...prev,
            lines: prev.lines.filter((line) => line.line_id !== lineId),
            totals: {
              subtotal: prev.lines
                .filter((line) => line.line_id !== lineId)
                .reduce((sum, line) => sum + line.amount, 0),
              grand_total: prev.lines
                .filter((line) => line.line_id !== lineId)
                .reduce((sum, line) => sum + line.amount, 0),
            },
          }
        : null
    );
  };

  const handleAddItem = () => {
    const newItem: ResultLine = {
      name: "New Item",
      amount: 0,
      qty: 1,
      line_id: `line_new_${Date.now()}`,
    };

    setReceiptData((prev) =>
      prev
        ? {
            ...prev,
            lines: [...prev.lines, newItem],
          }
        : null
    );

    setEditForm({
      name: newItem.name,
      amount: newItem.amount,
      qty: newItem.qty,
    });
    setEditingItem(newItem.line_id);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-[#1a1a1a] rounded-xl p-6 mb-6 border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Store size={24} className="text-blue-400" />
            <div>
              <h2 className="text-xl font-semibold text-white">
                {receiptData.category?.category.replace("_", " ") || "Receipt"}
              </h2>
              <p className="text-gray-400 text-sm">
                ID: #{receiptData.receipt_id}
              </p>
            </div>
          </div>
          {receiptData.message && (
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-3">
              <p className="text-green-300 text-sm">{receiptData.message}</p>
            </div>
          )}
        </div>

        <div className="flex bg-[#1a1a1a] rounded-xl p-2 mb-6 border border-gray-800">
          <button
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition ${
              !showAIChat && !showAssignment
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => {
              setShowAIChat(false);
              setShowAssignment(false);
            }}
          >
            <Edit3 size={16} />
            Edit Items
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition ${
              showAIChat
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => {
              setShowAIChat(true);
              setShowAssignment(false);
            }}
          >
            🤖 AI Assistant
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition ${
              showAssignment
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => {
              setShowAIChat(false);
              setShowAssignment(true);
            }}
          >
            <Users size={16} />
            Assign People
          </button>
        </div>

        {!showAIChat && !showAssignment && (
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800">
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Receipt Items</h3>
                  <button
                    onClick={handleAddItem}
                    className="flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg transition"
                  >
                    <Plus size={16} />
                    Add Item
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {receiptData.lines.map((item) => (
                  <div
                    key={item.line_id}
                    className="bg-[#0a0a0a] rounded-lg p-4"
                  >
                    {editingItem === item.line_id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                          placeholder="Item name"
                        />
                        <div className="flex gap-3">
                          <input
                            type="number"
                            value={editForm.qty}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                qty: parseInt(e.target.value) || 1,
                              }))
                            }
                            className="w-20 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                            placeholder="Qty"
                            min="1"
                          />
                          <input
                            type="number"
                            value={editForm.amount}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                amount: parseFloat(e.target.value) || 0,
                              }))
                            }
                            className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                            placeholder="Total amount"
                            step="0.01"
                            min="0"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEdit}
                            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded text-sm transition"
                          >
                            <Save size={14} />
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 px-3 py-1.5 rounded text-sm transition"
                          >
                            <X size={14} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-sm font-bold">
                              {item.name[0]}
                            </div>
                            <div>
                              <h4 className="font-semibold">{item.name}</h4>
                              <p className="text-sm text-gray-400">
                                Qty: {item.qty} • RM
                                {(item.amount / item.qty).toFixed(2)} each
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-lg">
                            RM{item.amount.toFixed(2)}
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditItem(item.line_id)}
                              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.line_id)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt size={20} className="text-green-400" />
                  <span className="text-lg font-semibold">Total</span>
                </div>
                <div className="text-right">
                  <p className="text-green-400 text-2xl font-bold">
                    RM{receiptData.totals.grand_total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAIChat && (
          <div className="bg-[#1a1a1a] rounded-xl p-8 border border-gray-800 text-center">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
            <p className="text-gray-400">
              Coming soon! Chat with AI to make corrections.
            </p>
          </div>
        )}

        {showAssignment && (
          <div className="bg-[#1a1a1a] rounded-xl p-8 border border-gray-800 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">People Assignment</h3>
            <p className="text-gray-400">
              Coming soon! Assign items to different people.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
