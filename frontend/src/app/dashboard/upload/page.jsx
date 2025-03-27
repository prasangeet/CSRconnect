"use client";

import { useState } from "react";
import { uploadPDF } from "@/services/apiService";
import { FileText, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [extraPrompt, setExtraPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      toast.info("PDF selected", {
        description: `${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)`,
        icon: <FileText className="h-5 w-5" />,
      });
    } else if (selectedFile) {
      toast.error("Invalid file type", {
        description: "Please select a PDF file",
      });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        toast.info("PDF selected", {
          description: `${droppedFile.name} (${(droppedFile.size / 1024).toFixed(1)} KB)`,
          icon: <FileText className="h-5 w-5" />,
        });
      } else {
        toast.error("Invalid file type", {
          description: "Please select a PDF file",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warning("No file selected", {
        description: "Please select a PDF file to upload",
        icon: <AlertCircle className="h-5 w-5" />,
      });
      return;
    }

    setLoading(true);
    setConfirmed(false);

    try {
      const result = await uploadPDF(file, extraPrompt);
      setResponse(result);
      toast.success("Upload successful", {
        description: "Your PDF has been processed successfully",
        icon: <CheckCircle className="h-5 w-5" />,
      });
    } catch (error) {
      toast.error("Upload failed", {
        description: error.message || "There was an error uploading your file",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!response) return;
    setConfirmed(true);
    toast.success("Data confirmed", {
      description: "The extracted data has been verified",
      icon: <CheckCircle className="h-5 w-5" />,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-amber-400 to-green-400 bg-clip-text text-transparent">
          Document Upload
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload PDF documents for processing and analysis. The system will extract relevant information and categorize it accordingly.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Upload Area */}
        <div className="p-6 border-b border-gray-100">
          <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center ${
              dragActive ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-amber-300"
            } transition-all duration-200`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-amber-500" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-lg font-medium text-gray-800">
                  {file ? "File Selected" : "Drag & Drop PDF Here"}
                </h3>
                <p className="text-sm text-gray-500">
                  {file 
                    ? `${file.name} (${(file.size / 1024).toFixed(1)} KB)` 
                    : "or click to browse from your computer"}
                </p>
              </div>

              <label className="relative cursor-pointer bg-gradient-to-r from-amber-200 to-yellow-100 hover:from-amber-300 hover:to-yellow-200 text-gray-800 font-medium py-2 px-6 rounded-full transition-colors duration-300">
                Browse Files
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          {/* Extra Prompt Section */}
          <div className="mt-4">
            <label className="block text-gray-800 font-medium mb-2">Additional Instructions</label>
            <textarea
              value={extraPrompt}
              onChange={(e) => setExtraPrompt(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:border-green-400 focus:ring focus:ring-green-300"
              placeholder="Enter extra details to refine classification..."
            ></textarea>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className={`flex items-center space-x-2 py-3 px-8 rounded-full font-medium transition-all duration-300 ${
                loading || !file
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-300 to-green-200 text-gray-800 hover:from-green-400 hover:to-green-300"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span>Upload Document</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Response Confirmation */}
        {response && (
          <div className="p-6 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Processing Results
            </h2>
            <pre className="text-sm text-gray-700 bg-white p-4 rounded-lg border border-gray-200">{JSON.stringify(response, null, 2)}</pre>
            <button
              onClick={handleConfirm}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg"
            >
              Confirm Data
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Guidelines</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-100 text-amber-500 mr-3 flex-shrink-0">1</span>
              <span>Only PDF files are accepted for processing</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-100 text-amber-500 mr-3 flex-shrink-0">2</span>
              <span>Maximum file size is 10MB</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-100 text-amber-500 mr-3 flex-shrink-0">3</span>
              <span>Ensure documents are properly scanned and text is legible</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-100 text-amber-500 mr-3 flex-shrink-0">4</span>
              <span>Processing may take a few moments depending on document size</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}