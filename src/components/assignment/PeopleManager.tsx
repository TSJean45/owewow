import React, { useState } from "react";
import { Users, Plus, Mic } from "lucide-react";

interface Person {
  id: string;
  name: string;
  items: string[];
}

interface PeopleManagerProps {
  people: Person[];
  selectedPerson: string | null;
  newPersonName: string;
  onAddPerson: () => void;
  onSelectPerson: (personId: string | null) => void;
  onRemovePerson: (personId: string) => void;
  onNameChange: (name: string) => void;
  calculatePersonTotal?: (personId: string) => number;
}

const PeopleManager: React.FC<PeopleManagerProps> = ({
  people,
  selectedPerson,
  newPersonName,
  onAddPerson,
  onSelectPerson,
  onRemovePerson,
  onNameChange,
  calculatePersonTotal,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);

  const handleVoice = () => {
    setVoiceActive(true);
    setTimeout(() => {
      alert("Simulated voice input: Adding Alice, Bob, Charlie");
      ["Alice", "Bob", "Charlie"].forEach((name) => {
        onNameChange(name);
        onAddPerson();
      });
      setVoiceActive(false);
    }, 2000);
  };

  //   const quickDemo = () => {
  //     ["Alice", "Bob", "Charlie"].forEach((name, index) => {
  //       setTimeout(() => {
  //         onNameChange(name);
  //         setTimeout(() => {
  //           onAddPerson();
  //         }, 100);
  //       }, index * 300);
  //     });
  //   };

  // Subtle, professional avatar colors
  const avatarColors = [
    "from-blue-500 to-blue-600",
    "from-gray-500 to-gray-600",
    "from-green-500 to-green-600",
    "from-purple-500 to-purple-600",
    "from-indigo-500 to-indigo-600",
    "from-slate-500 to-slate-600",
    "from-cyan-500 to-cyan-600",
    "from-teal-500 to-teal-600",
  ];

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6 mb-6 border border-gray-800">
      {/* Header - Same Design, Muted Colors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Who's joining?
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              {people.length === 0
                ? "Add your friends!"
                : `${people.length} people added`}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mb-4 sm:mb-6 group">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newPersonName}
              onChange={(e) => onNameChange(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onAddPerson()}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Enter friend's name..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400"
            />

            {showSuggestions && newPersonName.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-700 border border-gray-600 rounded-xl overflow-hidden z-10 shadow-2xl">
                {["Alice 👩", "Bob 👨", "Charlie 🧑", "Diana 👩‍🦰"].map(
                  (suggestion) => {
                    const name = suggestion.split(" ")[0];
                    if (people.some((p) => p.name === name)) return null;

                    return (
                      <button
                        key={suggestion}
                        onClick={() => {
                          onNameChange(name);
                          setTimeout(() => {
                            onAddPerson();
                          }, 100);
                        }}
                        className="w-full text-left px-4 py-4 text-white/80 hover:bg-gray-600 transition-colors text-sm flex items-center justify-between"
                      >
                        <span>{suggestion}</span>
                        <span className="text-xs text-gray-400">
                          Tap to add
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={handleVoice}
              disabled={voiceActive}
              className={`flex-1 sm:flex-none px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-semibold text-white transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 text-sm ${
                voiceActive
                  ? "bg-red-600 animate-pulse"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
              title="Voice input (wireframe)"
            >
              <Mic size={16} className={voiceActive ? "animate-pulse" : ""} />
              <span className="hidden sm:inline">
                {voiceActive ? "Listening..." : "Voice"}
              </span>
            </button>

            <button
              onClick={onAddPerson}
              disabled={!newPersonName.trim()}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-semibold text-white transition-all transform hover:scale-105 shadow-lg disabled:transform-none flex items-center justify-center gap-2 text-sm"
            >
              <Plus size={16} />
              <span>Add Friend</span>
            </button>
          </div>
        </div>
      </div>

      {/* People Display - Same Design, Subtle Colors */}
      <div className="space-y-3">
        {people.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-600/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={24} className="text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-400 mb-2">
              No friends added yet
            </h3>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {people.map((person, index) => {
              const isSelected = selectedPerson === person.id;
              const personTotal = calculatePersonTotal
                ? calculatePersonTotal(person.id)
                : 0;
              const colorClass = avatarColors[index % avatarColors.length];

              return (
                <div
                  key={person.id}
                  onClick={() =>
                    onSelectPerson(
                      selectedPerson === person.id ? null : person.id
                    )
                  }
                  className={`group relative p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-300 transform active:scale-95 sm:hover:scale-[1.02] ${
                    isSelected
                      ? "bg-blue-600/20 border-2 border-blue-500 shadow-xl shadow-blue-500/20"
                      : "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Subtle Avatar Colors */}
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${colorClass} rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-lg flex-shrink-0`}
                    >
                      {person.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <h3 className="font-semibold text-white truncate text-sm sm:text-base">
                          {person.name}
                        </h3>

                        <div className="flex items-center gap-2">
                          {index === 0 && (
                            <span className="text-xs bg-yellow-500/80 text-yellow-100 px-2 py-0.5 rounded-full font-medium">
                              Host
                            </span>
                          )}

                          {isSelected && (
                            <span className="text-xs bg-blue-500/80 text-blue-100 px-2 py-0.5 rounded-full font-medium animate-pulse">
                              Selected
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                        <span className="text-xs sm:text-sm text-gray-400">
                          {person.items.length === 0
                            ? "No items yet 🤷‍♀️"
                            : `${person.items.length} item${
                                person.items.length !== 1 ? "s" : ""
                              } 🍽️`}
                        </span>

                        {personTotal > 0 && (
                          <span className="text-xs sm:text-sm font-semibold text-green-400 bg-green-500/10 px-2 py-1 rounded-lg self-start">
                            RM{personTotal.toFixed(2)} 💰
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all ${
                          person.items.length > 0
                            ? "bg-green-600 text-white shadow-lg"
                            : "bg-gray-600/50 text-gray-400"
                        }`}
                      >
                        {person.items.length}
                      </div>

                      {people.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemovePerson(person.id);
                          }}
                          className="w-8 h-8 text-red-400 hover:text-red-300 text-xl font-bold sm:opacity-0 sm:group-hover:opacity-100 transform hover:scale-110 transition-all flex items-center justify-center"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Subtle Glow Effect */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-blue-500/5 rounded-xl pointer-events-none animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Status Message - Muted Colors */}
      {people.length > 0 && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          {selectedPerson ? (
            <div className="text-center">
              <p className="text-blue-300 font-medium text-sm sm:text-lg">
                ✨{" "}
                <strong>
                  {people.find((p) => p.id === selectedPerson)?.name}
                </strong>{" "}
                is ready to order!
              </p>
              <p className="text-xs sm:text-sm text-blue-400 mt-1">
                👇 Tap on items below to assign them
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-yellow-300 font-medium text-sm sm:text-base">
                👆 Select someone to start assigning items
              </p>
              <p className="text-xs sm:text-sm text-yellow-400 mt-1">
                Tap on any friend above to get started!
              </p>
            </div>
          )}
        </div>
      )}

      {voiceActive && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-xl animate-pulse">
          <div className="flex items-center gap-2 text-red-300">
            <Mic size={16} />
            <span className="text-sm font-medium">
              🎤 Voice recognition wireframe active...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeopleManager;
