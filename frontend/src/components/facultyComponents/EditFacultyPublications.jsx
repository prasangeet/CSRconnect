import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { X, Plus } from "lucide-react";

export function EditFacultyPublications({ faculty, onSave, open, onOpenChange }) {
  const [formData, setFormData] = useState({
    publications: faculty?.publications || [],
    new_publication: {
      title: "",
      journal: "",
      year: "",
      url: ""
    }
  });

  const addPublication = () => {
    const { title, journal, year } = formData.new_publication;
    if (title.trim() && journal.trim() && year) {
      setFormData(prev => ({
        ...prev,
        publications: [...prev.publications, prev.new_publication],
        new_publication: { title: "", journal: "", year: "", url: "" }
      }));
    }
  };

  const removePublication = (index) => {
    const updatedPublications = [...formData.publications];
    updatedPublications.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      publications: updatedPublications
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { new_publication, ...dataToSave } = formData;
    onSave(dataToSave);
  };

  const updateNewPublication = (field, value) => {
    setFormData(prev => ({
      ...prev,
      new_publication: {
        ...prev.new_publication,
        [field]: value
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Publications</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Publications</label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {formData.publications.map((pub, index) => (
                <div key={index} className="bg-muted/50 p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium">{pub.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {pub.journal} ({pub.year})
                      </div>
                      {pub.url && (
                        <a href={pub.url} target="_blank" rel="noopener noreferrer" 
                           className="text-xs text-primary hover:underline">
                          View publication
                        </a>
                      )}
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removePublication(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 bg-muted/30 p-3 rounded-md mt-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={formData.new_publication.title}
                  onChange={(e) => updateNewPublication('title', e.target.value)}
                  placeholder="Publication title"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Journal/Conference</label>
                  <Input
                    value={formData.new_publication.journal}
                    onChange={(e) => updateNewPublication('journal', e.target.value)}
                    placeholder="Journal or conference"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <Input
                    type="number"
                    value={formData.new_publication.year}
                    onChange={(e) => updateNewPublication('year', e.target.value)}
                    placeholder="Publication year"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">URL (optional)</label>
                <Input
                  value={formData.new_publication.url}
                  onChange={(e) => updateNewPublication('url', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <Button 
                type="button" 
                onClick={addPublication}
                disabled={!formData.new_publication.title.trim() || !formData.new_publication.journal.trim() || !formData.new_publication.year}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Publication
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
