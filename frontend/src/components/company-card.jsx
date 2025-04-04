"use client" // Add this at the top if you're using Next.js App Router

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation" // Use `next/navigation` in App Router
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Globe, Target } from "lucide-react"
import { Button } from "@/components/ui/button"

function CompanyCard({ company }) {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  // Ensure router is only used on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Function to navigate to the company details page
  const handleViewDetails = () => {
    if (!isClient) return;
    router.push(`/dashboard/companies/${company.id}`); // Use id instead of name
  };
  

  // Get SDG color (reusing from your SDGPage)
  const getSDGColor = (id) => {
    const colors = {
      1: "bg-red-600",
      2: "bg-yellow-500",
      3: "bg-green-500",
      4: "bg-red-400",
      5: "bg-red-600",
      6: "bg-blue-400",
      7: "bg-yellow-400",
      8: "bg-red-500",
      9: "bg-orange-500",
      10: "bg-pink-500",
      11: "bg-orange-400",
      12: "bg-amber-600",
      13: "bg-green-600",
      14: "bg-blue-600",
      15: "bg-green-500",
      16: "bg-blue-700",
      17: "bg-blue-500",
    }
    return colors[id] || "bg-slate-600"
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="h-3 bg-primary"></div>
      <CardContent className="p-6 flex-grow">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{company.name}</h3>
            <p className="text-sm text-muted-foreground">{company.industry}</p>

            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-1" />
              {company.location}
            </div>

            {company.website && (
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <Globe className="w-4 h-4 mr-1" />
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {company.website.replace(/(^\w+:|^)\/\//, "")}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <Target className="w-4 h-4 mr-1" />
            SDG Initiatives
          </h4>
          <div className="flex flex-wrap gap-1">
            {company.sdg_initiatives.map((sdg) => (
              <Badge key={sdg.id} className={`${getSDGColor(sdg.number)} text-white hover:${getSDGColor(sdg.number)}`}>
                SDG {sdg.number}
              </Badge>
            ))}
          </div>
        </div>

        {company.description && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground line-clamp-3">{company.description}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/50 px-6 py-3 mt-auto">
        <Button variant="outline" className="w-full" onClick={handleViewDetails} disabled={!isClient}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CompanyCard
