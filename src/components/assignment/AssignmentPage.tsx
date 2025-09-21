import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Bot, Share2, MoreHorizontal } from "lucide-react";
import Header from "../Header";
import PeopleManager from "./PeopleManager";
interface Person {
  id: string;
  name: string;
  items: string[];
}

interface ResultLine {
  line_id: string;
  name: string;
  amount: number;
  qty: number;
  is_bundle?: boolean;
}

interface ResultTotals {
  subtotal: number;
  tax?: number;
  service_charge?: number;
  discount?: number;
  rounding?: number;
  grand_total: number;
}

interface ReceiptData {
  receiptid: string;
  lines: ResultLine[];
  totals: ResultTotals;
}

const AssignmentPage: React.FC = () => {
  const { receiptId } = useParams<{ receiptId: string }>();
  const navigate = useNavigate();

  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [newPersonName, setNewPersonName] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [assignmentMode, setAssignmentMode] = useState<
    "solo" | "collaborative"
  >("solo");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(`receipt_${receiptId}`);
    if (stored) {
      setReceiptData(JSON.parse(stored));
    }
  }, [receiptId]);

  // Add person
  const addPerson = () => {
    if (!newPersonName.trim()) return;
    const newPerson: Person = {
      id: `person_${Date.now()}`,
      name: newPersonName.trim(),
      items: [],
    };
    setPeople((prev) => [...prev, newPerson]);
    setNewPersonName("");
    setSelectedPerson(newPerson.id);
  };

  // Remove person
  const removePerson = (personId: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== personId));
    if (selectedPerson === personId) {
      setSelectedPerson(null);
    }
  };

  const splitAllEqually = () => {
    if (people.length === 0 || !receiptData) return;

    setPeople((prevPeople) =>
      prevPeople.map((person) => ({
        ...person,
        items: receiptData.lines.map((item) => item.line_id),
      }))
    );
  };

  const splitItemEqually = (lineId: string) => {
    if (people.length === 0) return;

    setPeople((prevPeople) =>
      prevPeople.map((person) => ({
        ...person,
        items: person.items.includes(lineId)
          ? person.items
          : [...person.items, lineId],
      }))
    );
  };

  const assignItem = (lineId: string) => {
    if (!selectedPerson) return;

    setPeople((prevPeople) =>
      prevPeople.map((person) =>
        person.id === selectedPerson
          ? {
              ...person,
              items: person.items.includes(lineId)
                ? person.items.filter((id) => id !== lineId)
                : [...person.items, lineId],
            }
          : person
      )
    );
  };

  const calculatePersonTotal = (personId: string): number => {
    const person = people.find((p) => p.id === personId);
    if (!person || !receiptData) return 0;

    const itemsTotal = person.items.reduce((sum, lineId) => {
      const item = receiptData.lines.find((line) => line.line_id === lineId);
      if (!item) return sum;

      const claimants = people.filter((p) => p.items.includes(lineId)).length;
      const splitCost = (item.amount * item.qty) / claimants;

      return sum + splitCost;
    }, 0);

    if (itemsTotal === 0) return 0;
    const proportion = itemsTotal / receiptData.totals.subtotal;
    const personTax = (receiptData.totals.tax || 0) * proportion;
    const personService = (receiptData.totals.service_charge || 0) * proportion;
    const personRounding = (receiptData.totals.rounding || 0) * proportion;
    const personDiscount = (receiptData.totals.discount || 0) * proportion;

    return (
      itemsTotal + personTax + personService + personRounding - personDiscount
    );
  };

  // Get stats
  const getAssignedItemsCount = (): number => {
    const allAssignedItems = new Set<string>();
    people.forEach((person) => {
      person.items.forEach((itemId) => allAssignedItems.add(itemId));
    });
    return allAssignedItems.size;
  };

  const getTotalAssignedAmount = (): number => {
    if (!receiptData) return 0;

    const allItemsAssigned = receiptData.lines.every((item) =>
      people.some((person) => person.items.includes(item.line_id))
    );

    if (allItemsAssigned) {
      return receiptData.totals.grand_total;
    }

    const assignedItemsTotal = receiptData.lines.reduce((total, item) => {
      const claimants = people.filter((p) => p.items.includes(item.line_id));
      return claimants.length > 0 ? total + item.amount * item.qty : total;
    }, 0);

    if (assignedItemsTotal === 0) return 0;

    const proportion = assignedItemsTotal / receiptData.totals.subtotal;
    const assignedTax = (receiptData.totals.tax || 0) * proportion;
    const assignedService =
      (receiptData.totals.service_charge || 0) * proportion;
    const assignedRounding = (receiptData.totals.rounding || 0) * proportion;
    const assignedDiscount = (receiptData.totals.discount || 0) * proportion;

    return (
      assignedItemsTotal +
      assignedTax +
      assignedService +
      assignedRounding -
      assignedDiscount
    );
  };

  // Multiple sharing options
  const handleFinalize = () => {
    const summary = people
      .map(
        (person) =>
          `${person.name}: RM${calculatePersonTotal(person.id).toFixed(2)}`
      )
      .join("\n");

    const message = `🧾 Bill Split Summary\n\n${summary}\n\n💰 Total: RM${receiptData?.totals.grand_total.toFixed(
      2
    )}\n\n💳 Split with OweWow`;

    // Show options modal
    setShowShareModal(true);
    setShareContent({ text: message, summary });
  };

  // Add state for share modal
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareContent, setShareContent] = useState({ text: "", summary: "" });

  // Share functions
  const shareViaText = () => {
    if (navigator.share) {
      navigator.share({ title: "Bill Split", text: shareContent.text });
    } else {
      navigator.clipboard.writeText(shareContent.text);
      alert("Summary copied to clipboard!");
    }
    setShowShareModal(false);
  };

  const shareViaWhatsApp = () => {
    const encoded = encodeURIComponent(shareContent.text);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
    setShowShareModal(false);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent("Bill Split Summary");
    const body = encodeURIComponent(shareContent.text);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
    setShowShareModal(false);
  };

  const generateImage = () => {
    // For demo - just show "generating..."
    alert(
      "🎨 Image generation feature coming soon!\n\nWould create a beautiful split summary image!"
    );
    setShowShareModal(false);
  };

  // AI Functions
  const startAIAssignment = () => {
    alert("AI Assistant feature coming soon!");
  };

  if (!receiptData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading receipt data...</div>
      </div>
    );
  }

  const unassignedCount = receiptData.lines.length - getAssignedItemsCount();
  const isFullyAssigned = unassignedCount === 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />

      <div className="max-w-7xl mx-auto p-6 pb-32">
        {/* Simple Header Row */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(`/results/${receiptId}`)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Mode Toggle */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setAssignmentMode("solo")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                assignmentMode === "solo"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Solo Split
            </button>
            <button
              onClick={() => setAssignmentMode("collaborative")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                assignmentMode === "collaborative"
                  ? "bg-green-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Collaborative
            </button>
          </div>
        </div>

        {/* Collaborative Share Link Box */}
        {assignmentMode === "collaborative" && (
          <div className="bg-green-900/20 border border-green-600/30 rounded-xl p-4 mb-6">
            <h3 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
              <Users size={18} />
              Live Mode Active
            </h3>
            <p className="text-green-300 mb-3 text-sm">
              Share this link so friends can join and assign their own items in
              real-time:
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={`${window.location.origin}/collaborate/${receiptId}`}
                readOnly
                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm"
              />
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${window.location.origin}/collaborate/${receiptId}`
                  )
                }
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Copy Link
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "Join Bill Split",
                      url: `${window.location.origin}/collaborate/${receiptId}`,
                    });
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-2">
          {/* People Manager */}
          <PeopleManager
            people={people}
            selectedPerson={selectedPerson}
            newPersonName={newPersonName}
            onAddPerson={addPerson}
            onSelectPerson={setSelectedPerson}
            onRemovePerson={removePerson}
            onNameChange={setNewPersonName}
            calculatePersonTotal={calculatePersonTotal}
          />

          <div className="lg:col-span-2 bg-[#1a1a1a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Assign Items</h2>
              <div className="text-sm text-gray-400">
                {isFullyAssigned ? (
                  <span className="text-green-400">✅ All assigned</span>
                ) : (
                  <span>{unassignedCount} unassigned</span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {receiptData.lines.map((item) => {
                const claimants = people.filter((p) =>
                  p.items.includes(item.line_id)
                );
                const splitCost =
                  claimants.length > 0
                    ? (item.amount * item.qty) / claimants.length
                    : item.amount * item.qty;

                return (
                  <div
                    key={item.line_id}
                    onClick={() => selectedPerson && assignItem(item.line_id)}
                    className={`p-4 rounded-lg cursor-pointer transition-all border ${
                      claimants.length > 0
                        ? "bg-green-900/40 border-green-600 text-green-100"
                        : selectedPerson
                        ? "bg-gray-700 hover:bg-blue-900/30 border-gray-600 hover:border-blue-500 text-white"
                        : "bg-gray-700/50 border-gray-600 opacity-50 cursor-not-allowed text-gray-400"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm opacity-75">
                          Qty {item.qty} × RM{item.amount.toFixed(2)}
                          {claimants.length > 1 && (
                            <span className="text-yellow-400 ml-2">
                              ÷ {claimants.length} = RM{splitCost.toFixed(2)}{" "}
                              each
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">
                          RM{(item.amount * item.qty).toFixed(2)}
                        </span>

                        {/* Dropdown Menu */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(
                                openDropdown === item.line_id
                                  ? null
                                  : item.line_id
                              );
                            }}
                            className="p-2 hover:bg-gray-600 rounded-full transition-colors"
                          >
                            <MoreHorizontal size={16} />
                          </button>

                          {openDropdown === item.line_id && (
                            <div className="absolute right-0 top-full mt-2 bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-10 min-w-48">
                              {selectedPerson && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    assignItem(item.line_id);
                                    setOpenDropdown(null);
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-gray-600 text-sm text-white transition-colors"
                                >
                                  Assign to{" "}
                                  {
                                    people.find((p) => p.id === selectedPerson)
                                      ?.name
                                  }
                                </button>
                              )}

                              {people.length > 1 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    splitItemEqually(item.line_id);
                                    setOpenDropdown(null);
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-gray-600 text-sm text-white border-t border-gray-600 transition-colors"
                                >
                                  Split among all {people.length} people
                                </button>
                              )}

                              {claimants.length > 0 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Clear this item from everyone
                                    setPeople((prev) =>
                                      prev.map((p) => ({
                                        ...p,
                                        items: p.items.filter(
                                          (id) => id !== item.line_id
                                        ),
                                      }))
                                    );
                                    setOpenDropdown(null);
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-red-600 text-sm text-red-400 hover:text-white border-t border-gray-600 transition-colors"
                                >
                                  Remove all assignments
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Avatar Display */}
                    {claimants.length > 0 && (
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs text-gray-400">
                          Claimed by:
                        </span>
                        <div className="flex -space-x-2">
                          {claimants.map((person) => (
                            <div
                              key={person.id}
                              className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-gray-800"
                              title={person.name}
                            >
                              {person.name.charAt(0).toUpperCase()}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold">Summary</h3>
          <div className="flex items-center justify-between gap-2  mb-4">
            <div className="flex gap-2">
              <button
                onClick={splitAllEqually}
                disabled={people.length === 0}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 text-white text-sm rounded-lg font-medium transition-colors"
              >
                Split All Equally
              </button>
              <button
                onClick={() => {
                  setPeople((prev) => prev.map((p) => ({ ...p, items: [] })));
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg font-medium transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-400">Total Bill</div>
              <div className="text-xl font-bold text-white">
                RM{receiptData.totals.grand_total.toFixed(2)}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-400">Assigned</div>
              <div className="text-xl font-bold text-green-400">
                RM{getTotalAssignedAmount().toFixed(2)}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-400">Progress</div>
              <div className="text-xl font-bold text-blue-400">
                {getAssignedItemsCount()}/{receiptData.lines.length}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-400">People</div>
              <div className="text-xl font-bold text-purple-400">
                {people.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
          <button
            onClick={startAIAssignment}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transition-all"
          >
            <Bot size={20} />
            AI Assistant
          </button>

          {people.length > 0 && isFullyAssigned && (
            <button
              onClick={handleFinalize}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 px-6 py-3 rounded-xl font-semibold text-white transition-all"
            >
              <Share2 size={20} />
              Finalize & Share
            </button>
          )}
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Share Bill Split
            </h3>
            x
            <div className="bg-gray-700 p-4 rounded-lg mb-4 text-sm">
              <pre className="text-gray-300 whitespace-pre-wrap">
                {shareContent.text}
              </pre>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={shareViaText}
                className="flex items-center gap-2 p-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors"
              >
                <Share2 size={18} />
                <span>Share Text</span>
              </button>

              <button
                onClick={shareViaWhatsApp}
                className="flex items-center gap-2 p-3 bg-green-600 hover:bg-green-500 rounded-lg text-white transition-colors"
              >
                <span>💬</span>
                <span>WhatsApp</span>
              </button>

              <button
                onClick={shareViaEmail}
                className="flex items-center gap-2 p-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-white transition-colors"
              >
                <span>✉️</span>
                <span>Email</span>
              </button>

              <button
                onClick={generateImage}
                className="flex items-center gap-2 p-3 bg-pink-600 hover:bg-pink-500 rounded-lg text-white transition-colors"
              >
                <span>🎨</span>
                <span>Generate Image</span>
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 p-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentPage;
