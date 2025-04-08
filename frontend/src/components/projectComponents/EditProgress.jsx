import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export function EditProgress({ project, onSave, open, onOpenChange }) {
  const [formData, setFormData] = useState({
    overall_completion: project?.progress_metrics?.overall_completion || 0,
    budget_utilized: project?.progress_metrics?.budget_utilized || 0,
    beneficiaries_reached: project?.progress_metrics?.beneficiaries_reached || 0,
    timeline_status: project?.progress_metrics?.timeline_status || ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Progress</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Overall Completion (%)</label>
            <Input
              type="number"
              min="0"
              max="100"
              value={formData.overall_completion}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                overall_completion: e.target.value
              }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Budget Utilized (%)</label>
            <Input
              type="number"
              min="0"
              max="100"
              value={formData.budget_utilized}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                budget_utilized: e.target.value
              }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Beneficiaries Reached</label>
            <Input
              type="number"
              value={formData.beneficiaries_reached}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                beneficiaries_reached: e.target.value
              }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Timeline Status</label>
            <Input
              value={formData.timeline_status}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                timeline_status: e.target.value
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