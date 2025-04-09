import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";


export function EditFacultySpecialization({ faculty, onSave, open, onOpenChange }) {
    const [formData, setFreomData ]= useState({
        spectilization:faculty?.spectilization || " ",
        exportise: faculty?.exportise || " ",
        qualification: faculty?.qualification || "",
        experience_years: faculty?.experience_years || "",
        bio: faculty?.bio || ""
    });

    const handelSubmit  = (e)=>{
        e.preventDefault();
        onSave(formData);

    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Faculty Specialization</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Primary Specialization</label>
                <Input
                  value={formData.specialization}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    specialization: e.target.value
                  }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Areas of Expertise</label>
                <Input
                  value={formData.expertise}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    expertise: e.target.value
                  }))}
                  placeholder="e.g., Machine Learning, Data Science"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Qualification</label>
                  <Input
                    value={formData.qualification}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      qualification: e.target.value
                    }))}
                    placeholder="e.g., Ph.D. in Computer Science"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Years of Experience</label>
                  <Input
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      experience_years: e.target.value
                    }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Professional Bio</label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    bio: e.target.value
                  }))}
                  rows={3}
                  placeholder="Brief professional biography"
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
