"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { update_project_details } from "@/services/projectAPIServices/apiService";
import { fetchCompanies } from "@/services/apiService";

export function EditProjectOverview({ project, onSave, open, onOpenChange }) {
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    description: project?.modalities || "",
    district: project?.district || "",
    state: project?.state || "",
    company_id: project?.company || "",
    beneficiaries: project?.beneficiaries || "",
    start_date: project?.start_date || "",
    end_date: project?.end_date || "",
    budget: project?.budget || "",
    contact_email: project?.contact_email || "",
  });

  useEffect(() => {
    const loadCompanies = async () => {
      const data = await fetchCompanies();
      if (data) setCompanies(data);
    };

    if (open) {
      loadCompanies();
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Project Overview</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">District</label>
              <Input
                value={formData.district}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    district: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">State</label>
              <Input
                value={formData.state}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    state: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Company</label>
            <select
              value={formData.company_id}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, company_id: e.target.value }))
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select a Company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    start_date: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    end_date: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Beneficiaries</label>
              <Input
                type="number"
                value={formData.beneficiaries}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    beneficiaries: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Budget (Cr)</label>
              <Input
                type="number"
                value={formData.budget}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    budget: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Contact Email</label>
            <Input
              type="email"
              value={formData.contact_email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact_email: e.target.value,
                }))
              }
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