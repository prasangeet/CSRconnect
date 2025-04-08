import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export function EditProjectTitle({ project, onSave, open, onOpenChange }) {
  const [formData, setFormData] = useState({
    implementing_organisation: project?.implementing_organisation || "",
    project_status: project?.project_status || "",
    project_type: project?.project_type || ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Organization Name</label>
            <Input
              value={formData.implementing_organisation}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                implementing_organisation: e.target.value
              }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Status</label>
            <Input
              value={formData.project_status}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                project_status: e.target.value
              }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Type</label>
            <Input
              value={formData.project_type}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                project_type: e.target.value
              }))}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}