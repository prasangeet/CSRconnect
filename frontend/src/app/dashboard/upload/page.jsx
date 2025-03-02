"use client";

import { useState } from "react";
import { uploadPDF } from "@/services/apiService";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setLoading(true);
    const result = await uploadPDF(file);
    setLoading(false);

    if (result) {
      setResponse(result); // Store API response to show user
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Upload PDF</h1>

      <input type="file" accept="application/pdf" onChange={handleFileChange} className="mt-4" />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {response && (
        <div className="mt-4 p-4 border border-gray-300 rounded">
          <h2 className="text-lg font-semibold">Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
