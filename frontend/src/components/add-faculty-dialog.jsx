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
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  // Fetch CSRF token on component mount
  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/csrf/", {
          withCredentials: true,
        });
        console.log("CSRF token fetched:", response.data.csrfToken);
        setCsrfToken(response.data.csrfToken);
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
    formData.append("areas_of_work", JSON.stringify(areasOfWork.split(",").map(item => item.trim()))); // Convert to JSON array
    formData.append("sdg_contribution", JSON.stringify(sdgContribution.split(",").map(Number))); // Convert to JSON array of numbers
    formData.append("email", email);
    formData.append("phone_number", phoneNumber);
    formData.append("profile_picture_url", profilePictureUrl);
    formData.append("proposal_pdf", pdfFile);

    try {
      setLoading(true);
      setError(false);
      setSuccess(false);

      const response = await axios.post("http://localhost:8000/api/faculty/add/", formData, {
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Faculty added successfully:", response.data);
      setSuccess(true);
      fetchFaculty();

      // Reset form state
      setName("");
      setSpecialization("");
      setAreasOfWork("");
      setSdgContribution("");
      setEmail("");
      setPhoneNumber("");
      setProfilePictureUrl("");
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
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Input id="specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="areasOfWork">Areas of Work (comma-separated)</Label>
            <Textarea id="areasOfWork" value={areasOfWork} onChange={(e) => setAreasOfWork(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sdgContribution">SDG Contribution (comma-separated numbers)</Label>
            <Input id="sdgContribution" value={sdgContribution} onChange={(e) => setSdgContribution(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profilePictureUrl">Profile Picture URL</Label>
            <Input id="profilePictureUrl" type="url" value={profilePictureUrl} onChange={(e) => setProfilePictureUrl(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposalPaper">Proposal Paper</Label>
            <div className={cn("border-2 border-dashed rounded-lg p-6", isDragging && "border-primary bg-muted")} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
              <Input id="proposalPaper" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
              <label htmlFor="proposalPaper" className="cursor-pointer">{pdfFile ? `Selected: ${pdfFile.name}` : "Drag & drop or browse"}</label>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading || !csrfToken}>{loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Add Faculty"}</Button>
          {success && <p className="text-green-600">✅ Faculty added successfully!</p>}
          {error && <p className="text-red-600">❌ Error uploading PDF. Try again.</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddFacultyDialog;
