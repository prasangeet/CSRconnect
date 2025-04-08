import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";

export function EditStakeholders({ project, onSave, open, onOpenChange }) {
  const [stakeholders, setStakeholders] = useState(
    project?.stakeholders || []
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(stakeholders);
  };

  const addStakeholder = () => {
    setStakeholders([...stakeholders, { name: "", role: "" }]);
  };

  const removeStakeholder = (index) => {
    setStakeholders(stakeholders.filter((_, i) => i !== index));
  };

  const updateStakeholder = (index, field, value) => {
    const newStakeholders = [...stakeholders];
    newStakeholders[index] = {
      ...newStakeholders[index],
      [field]: value
    };
    setStakeholders(newStakeholders);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Stakeholders</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {stakeholders.map((stakeholder, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    value={stakeholder.name}
                    onChange={(e) => updateStakeholder(index, "name", e.target.value)}
                    placeholder="Stakeholder name"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStakeholder(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Input
                value={stakeholder.role}
                onChange={(e) => updateStakeholder(index, "role", e.target.value)}
                placeholder="Stakeholder role"
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={addStakeholder}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Stakeholder
          </Button>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}