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
        apiName: "receipts", // Your API name
        path: "/process",
        options: {
          body: {
            object_key: file.name,
            group_id: "demo-group",
          },
        },
      });

      const { body } = await restOperation.response;
      const response = await body.json();

      setResult(response);
      console.log("Receipt processed:", response);
    } catch (error) {
      console.error("Processing failed:", error);
    }
    setLoading(false);
  }

  return (
    <div style={styles.container}>
      <h1>🧾 OweWow Receipt Processor</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        style={styles.input}
      />

      <button
        onClick={processReceipt}
        disabled={!file || loading}
        style={styles.button}
      >
        {loading ? "Processing..." : "Process Receipt 🤖"}
      </button>

      {result && (
        <div style={styles.result}>
          <h3>✅ Processing Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 600,
    margin: "0 auto",
    padding: 20,
    fontFamily: "system-ui",
  },
  input: {
    display: "block",
    marginBottom: 15,
    padding: 10,
    width: "100%",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "12px 24px",
    fontSize: 16,
    borderRadius: 6,
    cursor: "pointer",
  },
  result: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    border: "1px solid #e9ecef",
  },
} as const;

export default App;
