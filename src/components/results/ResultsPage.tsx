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
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Percent,
} from "lucide-react";
import Header from "../Header";
import AIAssistant from "./AIAssistant";

interface ResultLine {
  name: string;
  amount: number;
  qty: number;
  line_id: string;
  is_bundle?: boolean;
  description?: string;
  components?: string[];
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
  totals: ResultTotals;
  message: string;
}

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
  commands?: VoiceCommand[];
  confidence?: string;
}

interface ResultTotals {
  subtotal: number;
  tax?: number;
  tax_percent?: number;
  service_charge?: number;
  service_percent?: number;
  discount?: number;
  rounding?: number;
  grand_total: number;
}

const ResultsPage: React.FC = () => {
  const { receiptId } = useParams<{ receiptId: string }>();

  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", amount: 0, qty: 1 });
  //   const [showAIChat, setShowAIChat] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", amount: 0, qty: 1 });
  const [showAssignment, setShowAssignment] = useState(false);
  const [showActions, setShowActions] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTotals, setEditingTotals] = useState(false);
  const [totalsForm, setTotalsForm] = useState({
    taxPercent: 0,
    taxAmount: 0,
    servicePercent: 0,
    serviceAmount: 0,
    discountPercent: 0,
    discountAmount: 0,
    rounding: 0,
  });

  const [showAIAssistant, setShowAIAssistant] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(`receipt_${receiptId}`);
    if (stored) {
      const data = JSON.parse(stored);
      setReceiptData(data);

      setTotalsForm({
        taxPercent: data.totals?.tax_percent || 0,
        taxAmount: data.totals?.tax || 0,
        servicePercent: data.totals?.service_percent || 0,
        serviceAmount: data.totals?.service_charge || 0,
        discountPercent: 0,
        discountAmount: data.totals?.discount || 0,
        rounding: data.totals?.rounding || 0,
      });
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

  // Helper functions for percentage calculations
  const calcPercentAmount = (percent: number, baseAmount: number) => {
    return Number(((percent / 100) * baseAmount).toFixed(2));
  };

  const handleTaxPercentChange = (val: number) => {
    const newAmount = calcPercentAmount(val, receiptData.totals.subtotal);
    setTotalsForm((prev) => ({
      ...prev,
      taxPercent: val,
      taxAmount: newAmount,
    }));
  };

  const handleTaxAmountChange = (val: number) => {
    setTotalsForm((prev) => ({
      ...prev,
      taxAmount: val,
      taxPercent: 0, // Clear percent when manually editing
    }));
  };

  const handleServicePercentChange = (val: number) => {
    const newAmount = calcPercentAmount(val, receiptData.totals.subtotal);
    setTotalsForm((prev) => ({
      ...prev,
      servicePercent: val,
      serviceAmount: newAmount,
    }));
  };

  const handleServiceAmountChange = (val: number) => {
    setTotalsForm((prev) => ({
      ...prev,
      serviceAmount: val,
      servicePercent: 0,
    }));
  };

  const handleDiscountPercentChange = (val: number) => {
    const newAmount = calcPercentAmount(val, receiptData.totals.subtotal);
    setTotalsForm((prev) => ({
      ...prev,
      discountPercent: val,
      discountAmount: newAmount,
    }));
  };

  const handleDiscountAmountChange = (val: number) => {
    setTotalsForm((prev) => ({
      ...prev,
      discountAmount: val,
      discountPercent: 0,
    }));
  };

  const handleEditItem = (lineId: string) => {
    const item = receiptData.lines.find((line) => line.line_id === lineId);
    if (item) {
      setEditForm({ name: item.name, amount: item.amount, qty: item.qty });
      setEditingItem(lineId);
      setShowActions(null);
      setShowEditModal(true);
    }
  };

  const calculateSubtotal = (lines: ResultLine[]): number => {
    const subtotal = lines.reduce((sum, line) => {
      const lineTotal = (line.amount || 0) * (line.qty || 1);
      console.log(
        `📊 ${line.name}: ${line.amount} × ${line.qty} = ${lineTotal}`
      );
      return sum + lineTotal;
    }, 0);

    console.log(`💰 Subtotal: ${subtotal}`);
    return subtotal;
  };

  const recalculateTotals = (
    lines: ResultLine[],
    currentTotals: ResultTotals
  ): ResultTotals => {
    const subtotal = calculateSubtotal(lines);

    const taxPercent = currentTotals.tax_percent || 0;
    const servicePercent = currentTotals.service_percent || 0;

    const tax =
      taxPercent > 0 ? (subtotal * taxPercent) / 100 : currentTotals.tax || 0;
    const service_charge =
      servicePercent > 0
        ? (subtotal * servicePercent) / 100
        : currentTotals.service_charge || 0;

    const discount = currentTotals.discount || 0;
    const beforeRounding = subtotal + tax + service_charge - discount;

    const rounding = calculateRounding(beforeRounding);
    const grand_total = beforeRounding + rounding;

    return {
      ...currentTotals,
      subtotal,
      tax,
      service_charge,
      grand_total,
    };
  };
  const applyMalaysianRounding = (amount: number): number => {
    const cents = Math.round(amount * 100);
    const lastDigit = cents % 10;

    let roundedCents;
    if (lastDigit <= 2) {
      roundedCents = cents - lastDigit;
    } else if (lastDigit <= 7) {
      roundedCents = cents + (5 - lastDigit);
    } else {
      roundedCents = cents + (10 - lastDigit);
    }

    return roundedCents / 100;
  };

  const calculateRounding = (beforeRounding: number): number => {
    const afterRounding = applyMalaysianRounding(beforeRounding);
    return afterRounding - beforeRounding;
  };

  const handleSaveEdit = () => {
    if (!receiptData || !editingItem) return;

    const updatedLines = receiptData.lines.map((line) =>
      line.line_id === editingItem
        ? {
            ...line,
            name: editForm.name,
            amount: editForm.amount,
            qty: editForm.qty,
          }
        : line
    );

    const updatedTotals = recalculateTotals(updatedLines, receiptData.totals);
    const updatedData = {
      ...receiptData,
      lines: updatedLines,
      totals: updatedTotals,
    };

    setReceiptData(updatedData);
    sessionStorage.setItem(`receipt_${receiptId}`, JSON.stringify(updatedData));
    setEditingItem(null);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setShowAddModal(false);
    setEditingItem(null);
    setEditForm({ name: "", amount: 0, qty: 1 });
    setEditingTotals(false);
    // Reset totals form
    if (receiptData) {
      setTotalsForm({
        taxPercent: 0,
        taxAmount: receiptData.totals?.tax || 0,
        servicePercent: 0,
        serviceAmount: receiptData.totals?.service_charge || 0,
        discountPercent: 0,
        discountAmount: receiptData.totals?.discount || 0,
        rounding: receiptData.totals?.rounding || 0,
      });
    }
  };

  const handleDeleteItem = (lineId: string) => {
    if (!receiptData) return;

    const updatedLines = receiptData.lines.filter(
      (line) => line.line_id !== lineId
    );

    const updatedTotals = recalculateTotals(updatedLines, receiptData.totals);
    const updatedData = {
      ...receiptData,
      lines: updatedLines,
      totals: updatedTotals,
    };

    setReceiptData(updatedData);
    sessionStorage.setItem(`receipt_${receiptId}`, JSON.stringify(updatedData));
  };

  const handleAddItem = () => {
    if (!receiptData || !newItem.name.trim() || newItem.amount <= 0) return;

    const newLine: ResultLine = {
      name: newItem.name.trim(),
      amount: newItem.amount,
      qty: newItem.qty,
      line_id: `line_${Date.now()}`,
    };

    const updatedLines = [...receiptData.lines, newLine];

    // ✅ ADD THIS: Smart recalculation with tax/service percentages
    const updatedTotals = recalculateTotals(updatedLines, receiptData.totals);
    const updatedData = {
      ...receiptData,
      lines: updatedLines,
      totals: updatedTotals,
    };

    setReceiptData(updatedData);
    sessionStorage.setItem(`receipt_${receiptId}`, JSON.stringify(updatedData));
    setNewItem({ name: "", amount: 0, qty: 1 });
    setShowAddModal(false);
  };

  const handleSaveTotals = () => {
    if (!receiptData) return;

    const updatedTotals: ResultTotals = {
      ...receiptData.totals,
      tax: totalsForm.taxAmount,
      tax_percent: totalsForm.taxPercent,
      service_charge: totalsForm.serviceAmount,
      service_percent: totalsForm.servicePercent,
      discount: totalsForm.discountAmount,
      rounding: totalsForm.rounding,
      grand_total:
        receiptData.totals.subtotal +
        totalsForm.taxAmount +
        totalsForm.serviceAmount +
        totalsForm.rounding -
        totalsForm.discountAmount,
    };

    const updatedData = { ...receiptData, totals: updatedTotals };
    setReceiptData(updatedData);
    sessionStorage.setItem(`receipt_${receiptId}`, JSON.stringify(updatedData));
    setEditingTotals(false);
  };

  const toggleActions = (lineId: string) => {
    setShowActions(showActions === lineId ? null : lineId);
  };

  const toggleExpanded = (lineId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lineId)) {
        newSet.delete(lineId);
      } else {
        newSet.add(lineId);
      }
      return newSet;
    });
  };

  const applyCommandToReceipt = (
    data: ReceiptData,
    cmd: VoiceCommand
  ): ReceiptData => {
    let updatedLines = [...data.lines];
    let updatedTotals = { ...data.totals };

    switch (cmd.action) {
      case "edit_price":
        updatedLines = updatedLines.map((line) =>
          line.name === cmd.itemName
            ? { ...line, amount: cmd.amount ?? line.amount }
            : line
        );
        break;

      case "add_item":
        if (cmd.itemName && cmd.amount !== undefined) {
          const newItem: ResultLine = {
            name: cmd.itemName,
            amount: cmd.amount,
            qty: cmd.quantity ?? 1,
            line_id: `line_${Date.now()}`,
          };
          updatedLines = [...updatedLines, newItem];
        }
        break;

      case "delete_item":
        updatedLines = updatedLines.filter(
          (line) => line.name !== cmd.itemName
        );
        break;

      case "edit_tax":
        if (cmd.percentage !== undefined) {
          const taxAmount =
            (data.totals.subtotal || 0) * (cmd.percentage / 100);
          updatedTotals.tax = taxAmount;
        }
        break;

      case "edit_service":
        if (cmd.percentage !== undefined) {
          const serviceAmount =
            (data.totals.subtotal || 0) * (cmd.percentage / 100);
          updatedTotals.service_charge = serviceAmount;
        }
        break;

      default:
        break;
    }

    const finalTotals = recalculateTotals(updatedLines, updatedTotals);

    return {
      ...data,
      lines: updatedLines,
      totals: finalTotals,
    };
  };

  const handleVoiceCommand = (command: VoiceCommand) => {
    if (!receiptData) return;

    if (
      command.action === "bulk_commands" &&
      command.commands &&
      command.commands.length > 0
    ) {
      let updatedData = receiptData;
      command.commands.forEach((cmd: VoiceCommand) => {
        updatedData = applyCommandToReceipt(updatedData, cmd);
      });
      setReceiptData(updatedData);
      sessionStorage.setItem(
        `receipt_${receiptData.receipt_id}`,
        JSON.stringify(updatedData)
      );
    } else {
      const updatedData = applyCommandToReceipt(receiptData, command);
      setReceiptData(updatedData);
      sessionStorage.setItem(
        `receipt_${receiptData.receipt_id}`,
        JSON.stringify(updatedData)
      );
    }
  };

  // Only show expandable if has components (not description that duplicates name)
  const hasExpandableContent = (item: ResultLine) => {
    return item.components && item.components.length > 0;
  };

  const calculateNewTotal = () => {
    return (
      receiptData.totals.subtotal +
      totalsForm.taxAmount +
      totalsForm.serviceAmount +
      totalsForm.rounding -
      totalsForm.discountAmount
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-32">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header Info */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 mb-6 border border-gray-800">
          <div className="flex items-center gap-3">
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
        </div>

        <div className="space-y-6">
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800">
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Receipt Items</h3>
                <button
                  onClick={() => setShowAddModal(true)}
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
                  className={`bg-[#0a0a0a] rounded-lg p-4 ${
                    item.is_bundle
                      ? "border-l-4 border-orange-500"
                      : item.amount === 0
                      ? "border-l-4 border-green-500"
                      : ""
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-lg">{item.name}</h4>
                          {hasExpandableContent(item) && (
                            <button
                              onClick={() => toggleExpanded(item.line_id)}
                              className="text-gray-400 hover:text-white transition-colors ml-2"
                            >
                              {expandedItems.has(item.line_id) ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </button>
                          )}
                        </div>

                        <p className="text-sm text-gray-400">
                          {item.amount === 0 ? (
                            <span className="text-green-400 font-medium">
                              Complimentary service
                            </span>
                          ) : item.is_bundle ? (
                            `Bundle price • Qty: ${item.qty}`
                          ) : (
                            `Qty: ${item.qty} • RM${(
                              item.amount / item.qty
                            ).toFixed(2)} each`
                          )}
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span
                          className={`font-bold text-lg ${
                            item.amount === 0
                              ? "text-green-400"
                              : "text-green-400"
                          }`}
                        >
                          {item.amount === 0
                            ? "FREE"
                            : `RM${item.amount.toFixed(2)}`}
                        </span>

                        <button
                          onClick={() => toggleActions(item.line_id)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition"
                        >
                          <MoreHorizontal size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Content - Only Bundle Components */}
                    {hasExpandableContent(item) &&
                      expandedItems.has(item.line_id) && (
                        <div className="overflow-hidden transition-all duration-300 ease-in-out">
                          <div className="bg-gray-800/30 rounded-lg p-4">
                            <p className="text-xs text-gray-400 font-medium mb-2">
                              🥩 Includes:
                            </p>
                            <div className="space-y-1">
                              {item.components?.map((component, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2"
                                >
                                  <span className="w-1 h-1 bg-orange-400 rounded-full flex-shrink-0"></span>
                                  <span className="text-xs text-gray-300">
                                    {component}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                    {showActions === item.line_id && (
                      <div className="flex gap-2 pt-3 border-t border-gray-700">
                        <button
                          onClick={() => handleEditItem(item.line_id)}
                          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded text-sm transition"
                        >
                          <Edit3 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.line_id)}
                          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm transition"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Totals Breakdown */}
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800">
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Bill Summary</h3>
                <button
                  onClick={() => setEditingTotals(true)}
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <Edit3 size={14} />
                  Edit Totals
                </button>
              </div>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between text-gray-300">
                <span>Subtotal</span>
                <span>RM{receiptData.totals.subtotal.toFixed(2)}</span>
              </div>

              {receiptData.totals.tax && receiptData.totals.tax > 0 && (
                <div className="flex items-center justify-between text-gray-300">
                  <span>
                    Tax (SST){" "}
                    {receiptData.totals.tax_percent
                      ? `${receiptData.totals.tax_percent}%`
                      : ""}
                  </span>
                  <span>RM{receiptData.totals.tax.toFixed(2)}</span>
                </div>
              )}

              {receiptData.totals.service_charge &&
                receiptData.totals.service_charge > 0 && (
                  <div className="flex items-center justify-between text-gray-300">
                    <span>
                      Service Charge{" "}
                      {receiptData.totals.service_percent
                        ? `${receiptData.totals.service_percent}%`
                        : ""}
                    </span>
                    <span>
                      RM{receiptData.totals.service_charge.toFixed(2)}
                    </span>
                  </div>
                )}

              {(receiptData.totals.discount || 0) > 0 && (
                <div className="flex items-center justify-between text-red-300">
                  <span>Discount</span>
                  <span>
                    -RM{(receiptData.totals.discount || 0).toFixed(2)}
                  </span>
                </div>
              )}

              {receiptData.totals.rounding &&
                receiptData.totals.rounding !== 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Rounding (5-sen rule)</span>
                    <span
                      className={
                        receiptData.totals.rounding > 0
                          ? "text-red-300"
                          : "text-green-300"
                      }
                    >
                      {receiptData.totals.rounding > 0 ? "+" : ""}RM
                      {receiptData.totals.rounding.toFixed(2)}
                    </span>
                  </div>
                )}

              <div className="border-t border-gray-600 pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Receipt size={20} className="text-green-400" />
                    <span className="text-lg font-semibold">Total</span>
                  </div>
                  <p className="text-green-400 text-2xl font-bold">
                    RM{receiptData.totals.grand_total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-700 p-4 z-40">
        <div className="max-w-4xl mx-auto flex gap-3">
          <button
            onClick={() => setShowAIAssistant(true)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all"
          >
            <span className="text-xl">🤖</span>
            AI Assistant
          </button>

          <button
            onClick={() => setShowAssignment(true)}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all"
          >
            <Users size={20} />
            Assign People
          </button>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Add New Item</h3>

            <div className="space-y-4">
              <input
                type="text"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Item name"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400"
              />

              <input
                type="number"
                value={newItem.amount === 0 ? "" : newItem.amount}
                onChange={(e) =>
                  setNewItem((prev) => ({
                    ...prev,
                    amount:
                      e.target.value === ""
                        ? 0
                        : parseFloat(e.target.value) || 0,
                  }))
                }
                onFocus={(e) => e.target.select()}
                placeholder="Amount (RM)"
                step="0.01"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400"
              />

              <input
                type="number"
                value={newItem.qty === 0 ? "" : newItem.qty}
                onChange={(e) =>
                  setNewItem((prev) => ({
                    ...prev,
                    qty:
                      e.target.value === ""
                        ? 1
                        : Math.max(1, parseInt(e.target.value) || 1),
                  }))
                }
                onFocus={(e) => e.target.select()}
                placeholder="Quantity"
                min="1"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddItem}
                disabled={!newItem.name.trim() || newItem.amount <= 0}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 py-3 rounded-lg font-semibold transition-colors"
              >
                Add Item
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewItem({ name: "", amount: 0, qty: 1 });
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 py-3 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] rounded-xl p-6 max-w-md w-full border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Edit Item</h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="Enter item name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={editForm.qty}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        qty: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Total Amount (RM)
                  </label>
                  <input
                    type="number"
                    value={editForm.amount === 0 ? "" : editForm.amount}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        amount:
                          e.target.value === ""
                            ? 0
                            : parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-colors"
                >
                  <Save size={18} />
                  Save Changes
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 py-3 px-4 rounded-lg font-semibold text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Totals Modal with Percentage Support */}
      {editingTotals && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] rounded-xl p-6 max-w-lg w-full border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Edit Bill Totals
              </h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Tax Section */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Tax (SST)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Percent className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={
                        totalsForm.taxPercent === 0 ? "" : totalsForm.taxPercent
                      }
                      onChange={(e) =>
                        handleTaxPercentChange(
                          e.target.value === ""
                            ? 0
                            : parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                      step="0.1"
                      min="0"
                      placeholder="0.0%"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      RM
                    </span>
                    <input
                      type="number"
                      value={
                        totalsForm.taxAmount === 0 ? "" : totalsForm.taxAmount
                      }
                      onChange={(e) =>
                        handleTaxAmountChange(
                          e.target.value === ""
                            ? 0
                            : parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Service Charge Section */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Service Charge
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Percent className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={
                        totalsForm.servicePercent === 0
                          ? ""
                          : totalsForm.servicePercent
                      }
                      onChange={(e) =>
                        handleServicePercentChange(
                          e.target.value === ""
                            ? 0
                            : parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                      step="0.1"
                      min="0"
                      placeholder="0.0%"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      RM
                    </span>
                    <input
                      type="number"
                      value={
                        totalsForm.serviceAmount === 0
                          ? ""
                          : totalsForm.serviceAmount
                      }
                      onChange={(e) =>
                        handleServiceAmountChange(
                          e.target.value === ""
                            ? 0
                            : parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Discount Section */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Discount
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Percent className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={
                        totalsForm.discountPercent === 0
                          ? ""
                          : totalsForm.discountPercent
                      }
                      onChange={(e) =>
                        handleDiscountPercentChange(
                          e.target.value === ""
                            ? 0
                            : parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                      step="0.1"
                      min="0"
                      placeholder="0.0%"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      RM
                    </span>
                    <input
                      type="number"
                      value={
                        totalsForm.discountAmount === 0
                          ? ""
                          : totalsForm.discountAmount
                      }
                      onChange={(e) =>
                        handleDiscountAmountChange(
                          e.target.value === ""
                            ? 0
                            : parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Rounding */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Rounding (RM)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    RM
                  </span>
                  <input
                    type="number"
                    value={totalsForm.rounding === 0 ? "" : totalsForm.rounding}
                    onChange={(e) =>
                      setTotalsForm((prev) => ({
                        ...prev,
                        rounding: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* New Total Preview */}
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">New Total:</span>
                  <span className="text-green-400 font-bold text-lg">
                    RM{calculateNewTotal().toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Subtotal: RM{receiptData.totals.subtotal.toFixed(2)} + Tax: RM
                  {totalsForm.taxAmount.toFixed(2)} + Service: RM
                  {totalsForm.serviceAmount.toFixed(2)} + Rounding: RM
                  {totalsForm.rounding.toFixed(2)} - Discount: RM
                  {totalsForm.discountAmount.toFixed(2)}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveTotals}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 py-3 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-colors"
                >
                  <Save size={18} />
                  Save Totals
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 py-3 px-4 rounded-lg font-semibold text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AIAssistant
        onCommand={handleVoiceCommand}
        receiptItems={receiptData.lines}
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
      />

      {/* Assignment Modal */}
      {showAssignment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] rounded-xl p-6 max-w-md w-full border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">👥 Assign to People</h3>
              <button
                onClick={() => setShowAssignment(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-gray-400">
                Coming soon! Assign items to different people and generate
                individual bills.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
