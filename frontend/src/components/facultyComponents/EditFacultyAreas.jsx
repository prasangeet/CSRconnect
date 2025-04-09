import {useState }from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";    
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus,X } from "lucide-react";


export function EditFacultyAreas({ faculty, onSave, open, onOpenChange }) {
    const [formData,setFormData ]= useState({
        areas_of_work: faculty?.areas_of_work || [],
        new_area:""
  
}
);


    const addArea=()=>{
        if(formData.new_area.trim()){
            setFormData(prev=>({
                ...prev,
                areas_of_work:[...prev.areas_of_work,formData.new_area],
                new_area:""
            }))
        }
    }

    const removeArea = (index)=>{
        const updatedAreas = [...formData.areas_of_work];
    updatedAreas.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      areas_of_work: updatedAreas
    }));
    }

    const handelSubmit = (e)=>{
        e.preventDefault();
        const { new_area, ...dataToSave } = formData;
        onSave(dataToSave);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Areas of Work</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Areas of Work</label>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {formData.areas_of_work.map((area, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                      <span className="flex-1">{area}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeArea(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={formData.new_area}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      new_area: e.target.value
                    }))}
                    placeholder="Add new area of work"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={addArea}
                    disabled={!formData.new_area.trim()}
                  >
                    <Plus className="h-4 w-4" />
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