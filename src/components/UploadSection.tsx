import React from "react";
import { Upload, Zap } from "lucide-react";

interface UploadSectionProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  onProcess: () => void;
  loading: boolean;
  dragActive: boolean;
  onDragHandlers: {
    handleDrop: (e: React.DragEvent) => void;
    handleDrag: (e: React.DragEvent) => void;
  };
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  selectedFile,
  onFileSelect,
  onProcess,
  loading,
  dragActive,
  onDragHandlers,
  fileInputRef,
}) => {
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) onFileSelect(files[0]);
  };

  return (
    <>
      <div
        onDrop={onDragHandlers.handleDrop}
        onDragEnter={onDragHandlers.handleDrag}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDragLeave={onDragHandlers.handleDrag}
        className={`border-2 border-dashed rounded-xl transition p-10 text-center cursor-pointer mb-4 ${
          dragActive ? "border-purple-500 bg-purple-700" : "border-gray-600"
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
                onFileSelect(null);
              }}
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            <Upload size={48} className="mx-auto text-gray-400 mb-4" />
            <p>Drag & drop or click to select receipt</p>
            <p className="text-gray-400 text-sm mt-2">PNG, JPG, &lt; 10MB</p>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>
      <button
        onClick={onProcess}
        disabled={!selectedFile || loading}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition hover:shadow-lg active:scale-95"
      >
        Process Receipt
      </button>
    </>
  );
};

export default UploadSection;
