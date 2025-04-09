"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, X } from "lucide-react"

export function EditCSRDialog({ company, onSave, open, onOpenChange }) {
  const [policies, setPolicies] = useState(company?.csr_policies || [])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...company, csr_policies: policies })
  }

  const addPolicy = () => {
    setPolicies([...policies, ""])
  }

  const removePolicy = (index) => {
    setPolicies(policies.filter((_, i) => i !== index))
  }

  const updatePolicy = (index, value) => {
    const newPolicies = [...policies]
    newPolicies[index] = value
    setPolicies(newPolicies)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit CSR Policies</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {policies.map((policy, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={policy}
                onChange={(e) => updatePolicy(index, e.target.value)}
                placeholder="Enter policy"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removePolicy(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={addPolicy}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Policy
          </Button>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}