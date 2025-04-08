"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Edit, Loader2, Pencil } from "lucide-react";
import axios from "axios";

export default function EditCompanyDialog({ company, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: company.name || "",
      industry: company.industry || "",
      location: company.location || "",
      website: company.website || "",
      description: company.description || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("access_token");
      const response = await axios.put(
        `http://localhost:8000/api/company/update-company/${company.id}/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        onUpdate(response.data);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error updating company:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white/10 hover:bg-white/20 text-white">
          <Pencil className="w-4 h-4 mr-2" />
          Edit Company
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Company Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Name</label>
            <Input
              {...register("name", { required: "Company name is required" })}
              placeholder="Enter company name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Industry</label>
            <Input {...register("industry")} placeholder="Enter industry" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input {...register("location")} placeholder="Enter location" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Website</label>
            <Input {...register("website")} placeholder="Enter website URL" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              {...register("description")}
              placeholder="Enter company description"
              className="h-32"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
