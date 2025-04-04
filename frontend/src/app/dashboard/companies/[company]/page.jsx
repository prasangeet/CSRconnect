"use client"
import { useState, useEffect } from "react"
import { Building2, Globe, MapPin } from "lucide-react"

function CompanyPage() {
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)

  const getSDGColor = (number) => {
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
    return colors[number] || "bg-gray-500"
  }

  useEffect(() => {
    // Simulate fetching company data
    setTimeout(() => {
      setCompany({
        id: 1,
        name: "EcoTech Solutions",
        industry: "Renewable Energy",
        location: "Bangalore, Karnataka",
        website: "https://ecotechsolutions.example.com",
        description:
          "Leading provider of renewable energy solutions focused on solar and wind power technologies. Working to make clean energy accessible to communities across India.",
        sdg_initiatives: [
          { id: 1, number: 7, name: "Affordable and Clean Energy" },
          { id: 2, number: 9, name: "Industry, Innovation and Infrastructure" },
          { id: 3, number: 13, name: "Climate Action" },
        ],
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=200&h=200&fit=crop"
      })
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-muted-foreground">Company not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="relative overflow-hidden rounded-xl bg-primary text-primary-foreground p-8 mb-8">
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-6">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary-foreground/20"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-primary-foreground/60" />
                  </div>
                )}
                <div>
                  <h1 className="text-4xl font-bold mb-2">{company.name}</h1>
                  <p className="text-primary-foreground/80 text-lg">
                    {company.industry}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Building2 className="absolute right-4 bottom-4 w-64 h-64 text-primary-foreground/10" />
        </div>

        {/* Company Details */}
        <div className="space-y-8">
          {/* Location and Website */}
          <div className="flex flex-col sm:flex-row gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{company.location}</span>
            </div>
            {company.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <a 
                  href={company.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline"
                >
                  {company.website.replace(/(^\w+:|^)\/\//, "")}
                </a>
              </div>
            )}
          </div>

          {/* SDG Initiatives */}
          <div>
            <h2 className="text-xl font-semibold mb-4">SDG Initiatives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {company.sdg_initiatives.map((sdg) => (
                <div
                  key={sdg.id}
                  className="bg-white rounded-lg p-4 shadow-sm border"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${getSDGColor(sdg.number)} flex items-center justify-center`}>
                      <span className="text-lg font-bold text-white">{sdg.number}</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">{sdg.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-muted-foreground">
              {company.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyPage