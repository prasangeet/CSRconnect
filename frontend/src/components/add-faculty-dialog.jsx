"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { GraduationCap, Camera, Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

function AddFacultyDialog({ fetchFaculty }) {
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    areasOfWork: "",
    sdgContributions: "",
    email: "",
    phoneNumber: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/csrf/", {
          withCredentials: true,
        });
        setCsrfToken(response.data.csrfToken);
      } catch (err) {
        console.error("Error fetching CSRF token:", err);
      }
    };
    getCsrfToken();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleProfilePicture = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingPdf(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingPdf(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingPdf(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setPdfFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!csrfToken) {
      setError(true);
      return;
    }

    const submitFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'areasOfWork') {
        submitFormData.append(key, JSON.stringify(value.split(',').map(item => item.trim())));
      } else if (key === 'sdgContributions') {
        submitFormData.append(key, JSON.stringify(value.split(',').map(Number)));
      } else {
        submitFormData.append(key, value);
      }
    });

    if (profilePicture) submitFormData.append("profile_picture", profilePicture);
    if (pdfFile) submitFormData.append("proposal_pdf", pdfFile);

    try {
      setLoading(true);
      setError(false);
      setSuccess(false);

      await axios.post("http://localhost:8000/api/faculty/add/", submitFormData, {
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);
      fetchFaculty();
      
      // Reset form
      setFormData({
        name: "",
        specialization: "",
        areasOfWork: "",
        sdgContributions: "",
        email: "",
        phoneNumber: "",
      });
      setProfilePicture(null);
      setProfilePreview(null);
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
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Input
                type="file"
                id="profilePicture"
                accept="image/*"
                onChange={handleProfilePicture}
                className="hidden"
              />
              <label
                htmlFor="profilePicture"
                className="block w-16 h-16 rounded-full bg-muted cursor-pointer overflow-hidden"
              >
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </label>
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">Add New Faculty</DialogTitle>
              <DialogDescription>
                Fill in the faculty member's information
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name" className="text-sm">Name</Label>
              <Input id="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="specialization" className="text-sm">Specialization</Label>
              <Input id="specialization" value={formData.specialization} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="phoneNumber" className="text-sm">Phone</Label>
              <Input id="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required />
            </div>
          </div>

          <div>
            <Label htmlFor="areasOfWork" className="text-sm">Areas of Work (comma-separated)</Label>
            <Input id="areasOfWork" value={formData.areasOfWork} onChange={handleInputChange} required />
          </div>

          <div>
            <Label htmlFor="sdgContributions" className="text-sm">SDG Contribution (comma-separated numbers)</Label>
            <Input id="sdgContributions" value={formData.sdgContributions} onChange={handleInputChange} required />
          </div>

          <div>
            <Label htmlFor="proposalPaper" className="text-sm">Proposal Paper</Label>
            <div 
              className={cn(
                "border-2 border-dashed rounded-lg p-3", 
                isDraggingPdf && "border-primary bg-muted"
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
              <label htmlFor="proposalPaper" className="cursor-pointer flex items-center justify-center">
                <Upload className="w-4 h-4 mr-2" />
                {pdfFile ? `Selected: ${pdfFile.name}` : "Drag & drop or browse"}
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading || !csrfToken}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Add Faculty"}
          </Button>
          
          {success && <p className="text-green-600 text-sm">✅ Faculty added successfully!</p>}
          {error && <p className="text-red-600 text-sm">❌ Error adding faculty. Please try again.</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddFacultyDialog;