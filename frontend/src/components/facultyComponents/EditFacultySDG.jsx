import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

export function EditFacultySDG({ faculty, onSave, open, onOpenChange }) {
  const sdgOptions = [
    { id: 1, label: "No Poverty" },
    { id: 2, label: "Zero Hunger" },
    { id: 3, label: "Good Health and Well-being" },
    { id: 4, label: "Quality Education" },
    { id: 5, label: "Gender Equality" },
    { id: 6, label: "Clean Water and Sanitation" },
    { id: 7, label: "Affordable and Clean Energy" },
    { id: 8, label: "Decent Work and Economic Growth" },
    { id: 9, label: "Industry, Innovation and Infrastructure" },
    { id: 10, label: "Reduced Inequalities" },
    { id: 11, label: "Sustainable Cities and Communities" },
    { id: 12, label: "Responsible Consumption and Production" },
    { id: 13, label: "Climate Action" },
    { id: 14, label: "Life Below Water" },
    { id: 15, label: "Life on Land" },
    { id: 16, label: "Peace, Justice and Strong Institutions" },
    { id: 17, label: "Partnerships for the Goals" }
  ];

  const [formData, setFormData] = useState({
    sdg_contribution: faculty?.sdg_contribution || "",
    selected_sdgs: faculty?.selected_sdgs || [],
    impact_description: faculty?.impact_description || ""
  });

  const toggleSDG = (sdgId) => {
    setFormData(prev => {
      const isSelected = prev.selected_sdgs.includes(sdgId);
      return {
        ...prev,
        selected_sdgs: isSelected 
          ? prev.selected_sdgs.filter(id => id !== sdgId) 
          : [...prev.selected_sdgs, sdgId]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit SDG Contribution</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">SDG Contribution Summary</label>
            <Textarea
              value={formData.sdg_contribution}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                sdg_contribution: e.target.value
              }))}
              rows={3}
              placeholder="Brief summary of contribution to Sustainable Development Goals"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Relevant SDGs</label>
            <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-md">
              {sdgOptions.map(sdg => (
                <div key={sdg.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`sdg-${sdg.id}`}
                    checked={formData.selected_sdgs.includes(sdg.id)}
                    onCheckedChange={() => toggleSDG(sdg.id)}
                  />
                  <label 
                    htmlFor={`sdg-${sdg.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {sdg.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Impact Description</label>
            <Textarea
              value={formData.impact_description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                impact_description: e.target.value
              }))}
              rows={3}
              placeholder="Describe the specific impact of your work on selected SDGs"
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
