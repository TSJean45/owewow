// src/App.tsx - NO AUTH NEEDED
import { useState } from "react";
import { post } from "aws-amplify/api";

const App = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function processReceipt() {
    if (!file) return;

    setLoading(true);
    try {
      const restOperation = post({
        apiName: "receipts",
        path: "/process",
        options: {
          body: {
            object_key: file.name,
            group_id: "public-demo", // No user needed!
          },
        },
      });

      const { body } = await restOperation.response;
      setResult(await body.json());
    } catch (error) {
      console.error("Failed:", error);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          🧾 OweWow Receipt Splitter
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full mb-4 p-3 border rounded"
          />

          <button
            onClick={processReceipt}
            disabled={!file || loading}
            className="w-full bg-blue-600 text-white py-3 rounded font-semibold disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Split This Receipt! 🤖"}
          </button>
        </div>

        {result && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">✅ Split Results:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
