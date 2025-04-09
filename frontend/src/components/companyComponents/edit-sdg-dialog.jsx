"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, X } from "lucide-react"

export function EditSDGDialog({ company, onSave, open, onOpenChange }) {
  const [initiatives, setInitiatives] = useState(company?.sdg_initiatives || [])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...company, sdg_initiatives: initiatives })
  }

  const addInitiative = () => {
    setInitiatives([...initiatives, {
      id: Date.now(),
      number: "",
      name: "",
      description: "",
      budget: ""
    }])
  }

  const removeInitiative = (id) => {
    setInitiatives(initiatives.filter(initiative => initiative.id !== id))
  }

  const updateInitiative = (id, field, value) => {
    setInitiatives(initiatives.map(initiative => 
      initiative.id === id ? { ...initiative, [field]: value } : initiative
    ))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit SDG Initiatives</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {initiatives.map((initiative) => (
            <div key={initiative.id} className="space-y-3 p-4 border rounded-lg relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => removeInitiative(initiative.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Input
                    value={initiative.number}
                    onChange={(e) => updateInitiative(initiative.id, "number", e.target.value)}
                    placeholder="SDG Number"
                  />
                </div>
                <div>
                  <Input
                    value={initiative.name}
                    onChange={(e) => updateInitiative(initiative.id, "name", e.target.value)}
                    placeholder="Initiative Name"
                  />
                </div>
              </div>
              <Textarea
                value={initiative.description}
                onChange={(e) => updateInitiative(initiative.id, "description", e.target.value)}
                placeholder="Initiative Description"
              />
              <Input
                type="number"
                value={initiative.budget}
                onChange={(e) => updateInitiative(initiative.id, "budget", e.target.value)}
                placeholder="Budget Allocated"
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={addInitiative}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Initiative
          </Button>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}