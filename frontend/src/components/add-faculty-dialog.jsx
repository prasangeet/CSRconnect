"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GraduationCap, Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

function AddFacultyDialog({ fetchFaculty }) {
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [areasOfWork, setAreasOfWork] = useState("");
  const [sdgContribution, setSdgContribution] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [csrfToken, setCsrfToken] = useState(""); // Store CSRF Token
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  // Fetch CSRF token on component mount
  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/csrf/", {
          withCredentials: true, // Ensure cookies are sent
        });
        console.log("CSRF token fetched:", response.data.csrfToken);
        setCsrfToken(response.data.csrfToken); // Store token in state
      } catch (err) {
        console.error("Error fetching CSRF token:", err);
      }
    };

    getCsrfToken();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      setPdfFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!csrfToken) {
      console.error("CSRF token is missing!");
      setError(true);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("specialization", specialization);
    formData.append("areas_of_work", areasOfWork);
    formData.append("sdg_contribution", sdgContribution);
    formData.append("proposal_pdf", pdfFile); // Match the backend field name

    try {
      setLoading(true);
      setError(false);
      setSuccess(false);

      const response = await axios.post("http://localhost:8000/api/faculty/add/", formData, {
        headers: {
          "X-CSRFToken": csrfToken, // Attach CSRF Token
          "Content-Type": "multipart/form-data",
        },
        // withCredentials: true, // Ensure cookies are sent
      });

      console.log("Faculty added successfully:", response.data);
      setSuccess(true);
      fetchFaculty(); // Refresh faculty list

      // Reset form state
      setName("");
      setSpecialization("");
      setAreasOfWork("");
      setSdgContribution("");
      setPdfFile(null);
    } catch (err) {
      console.error("Error adding faculty:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2">
          <GraduationCap className="w-4 h-4" />
          Add Faculty
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Add New Faculty</DialogTitle>
          <DialogDescription>
            Fill in the faculty member's information and upload their proposal paper.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Dr. Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Input
              id="specialization"
              placeholder="e.g., Machine Learning, Data Science"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="areasOfWork">Areas of Work</Label>
            <Textarea
              id="areasOfWork"
              placeholder="Enter areas separated by commas (e.g., AI Research, Neural Networks, Computer Vision)"
              value={areasOfWork}
              onChange={(e) => setAreasOfWork(e.target.value)}
              className="w-full min-h-[80px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sdgContribution">SDG Contribution</Label>
            <Input
              id="sdgContribution"
              placeholder="e.g., Quality Education (SDG 4)"
              value={sdgContribution}
              onChange={(e) => setSdgContribution(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposalPaper">Proposal Paper</Label>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-6 transition-colors",
                "hover:border-primary/50 hover:bg-muted/50",
                isDragging && "border-primary bg-muted",
                "cursor-pointer"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Input
                id="proposalPaper"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="proposalPaper" className="flex flex-col items-center gap-2 cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground text-center">
                  {pdfFile ? (
                    <>Selected: <span className="font-medium text-foreground">{pdfFile.name}</span></>
                  ) : (
                    <>Drag & drop your PDF here or <span className="text-primary">browse</span></>
                  )}
                </span>
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading || !csrfToken}>
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              "Add Faculty Member"
            )}
          </Button>

          {success && (
            <p className="text-green-600 text-sm">✅ Faculty added successfully!</p>
          )}

          {error && (
            <p className="text-red-600 text-sm">❌ Error uploading PDF. Try again.</p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddFacultyDialog;
