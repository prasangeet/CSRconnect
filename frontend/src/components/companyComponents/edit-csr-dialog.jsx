"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Trash, Upload, FileText, X, Download } from "lucide-react"
import { uploadCSRPolicy, deleteCSRPolicy } from "@/services/companyAPIServices/apiService"
import { toast } from "sonner"

export function EditCSRDialog({ company, onSave, open, onOpenChange }) {
  const [policyUrl, setPolicyUrl] = useState(company?.csr_policy || "")
  const [loading, setLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [policyName, setPolicyName] = useState(company?.csr_policy ? "Current Policy" : "")
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)

  const handleRemovePolicy = async () => {
    try {
      if (company.id && policyUrl) {
        await deleteCSRPolicy(company.id)
      }

      setPolicyUrl("")
      setPolicyName("")
      setSelectedFile(null)

      toast.success("Policy removed successfully")
    } catch (error) {
      toast.error("Failed to remove policy", {
        description: error.message || "There was an error removing the policy",
      })
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setSelectedFile(file)
      // Extract filename without extension as default policy name
      const fileName = file.name.replace(/\.[^/.]+$/, "")
      setPolicyName(fileName)
      toast.info("PDF selected", {
        description: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        icon: <FileText className="h-5 w-5" />,
      })
    } else if (file) {
      toast.error("Invalid file type", {
        description: "Please select a PDF file",
      })
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === "application/pdf") {
        setSelectedFile(droppedFile)
        const fileName = droppedFile.name.replace(/\.[^/.]+$/, "")
        setPolicyName(fileName)
        toast.info("PDF selected", {
          description: `${droppedFile.name} (${(droppedFile.size / 1024).toFixed(1)} KB)`,
          icon: <FileText className="h-5 w-5" />,
        })
      } else {
        toast.error("Invalid file type", {
          description: "Please select a PDF file",
        })
      }
    }
  }

  const handleUploadPolicy = async () => {
    if (!selectedFile) {
      toast.warning("No file selected", {
        description: "Please select a PDF file to upload",
        icon: <AlertCircle className="h-5 w-5" />,
      })
      return
    }

    setUploadLoading(true)
    try {
      const result = await uploadCSRPolicy(company.id, selectedFile, policyName)
      toast.success("CSR policy uploaded successfully")

      // Update the policy URL with the result
      setPolicyUrl(result.file_url || result)

      // Reset form
      setSelectedFile(null)
    } catch (error) {
      toast.error("Failed to upload policy", {
        description: error.message || "There was an error uploading your file",
      })
    } finally {
      setUploadLoading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // In a real implementation, you might need to call an API to update the policy URL
      // For now, we'll just update the local state and call onSave
      const updatedCompany = {
        ...company,
        csr_policy: policyUrl,
      }

      onSave(updatedCompany)
      onOpenChange(false)
      toast.success("CSR policy updated successfully")
    } catch (error) {
      toast.error("Failed to update CSR policy")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage CSR Policies</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Policy */}
          <div className="space-y-4">
            <Label>Current Policy</Label>
            {policyUrl ? (
              <div className="flex items-center gap-2 group p-2 rounded-md hover:bg-gray-50">
                <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="flex-1 text-sm">{policyName || "CSR Policy"}</span>

                {/* Download button */}
                <a
                  href={policyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80"
                >
                  <Download className="h-4 w-4" />
                </a>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleRemovePolicy}
                >
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No policy added yet</p>
            )}
          </div>

          {/* Upload PDF Policy */}
          <div className="space-y-2 border-t pt-4">
            <Label>Upload PDF Policy</Label>

            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                  <FileText className="h-7 w-7 text-primary" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium">{selectedFile ? "File Selected" : "Upload PDF Policy"}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedFile
                      ? `${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)`
                      : "Drag & drop or click to browse"}
                  </p>
                </div>

                {selectedFile ? (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)} className="text-xs">
                    <X className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                ) : (
                  <label className="relative cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary font-medium py-1 px-4 rounded-full text-xs transition-colors">
                    Browse Files
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                )}
              </div>
            </div>

            {selectedFile && (
              <div className="space-y-2 mt-3">
                <Label htmlFor="policy-name" className="text-sm">
                  Policy Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="policy-name"
                  value={policyName}
                  onChange={(e) => setPolicyName(e.target.value)}
                  placeholder="Enter a name for this policy"
                  className="text-sm"
                />

                <Button
                  onClick={handleUploadPolicy}
                  disabled={uploadLoading || !policyName.trim()}
                  className="w-full mt-2"
                >
                  {uploadLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      <span>Upload Policy</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                <span>Saving...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
