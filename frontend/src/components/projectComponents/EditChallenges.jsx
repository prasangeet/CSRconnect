import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";

export function EditChallenges({ project, onSave, open, onOpenChange }) {
  const [challenges, setChallenges] = useState(project?.challenges || []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(challenges);
  };

  const addChallenge = () => {
    setChallenges([...challenges, ""]);
  };

  const removeChallenge = (index) => {
    setChallenges(challenges.filter((_, i) => i !== index));
  };

  const updateChallenge = (index, value) => {
    const newChallenges = [...challenges];
    newChallenges[index] = value;
    setChallenges(newChallenges);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Challenges</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {challenges.map((challenge, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={challenge}
                onChange={(e) => updateChallenge(index, e.target.value)}
                placeholder="Enter challenge"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeChallenge(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={addChallenge}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Challenge
          </Button>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}