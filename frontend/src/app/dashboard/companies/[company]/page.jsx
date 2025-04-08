"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Building2, Globe, MapPin } from "lucide-react"
import Image from "next/image"
import { fetchCompany } from "@/services/apiService"
import EditCompanyDialog from "@/components/edit-company-dialog"
import { getSDGColor } from "@/lib/sdg-utils"

function CompanyPage() {
  const params = useParams()
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCompanyData()
  }, [params.company])

  const loadCompanyData = async () => {
    const companyData = await fetchCompany(params.company)
    if (companyData) {
      setCompany(companyData)
      console.log(companyData)
    }
    setLoading(false)
  }

  const handleCompanyUpdate = (updatedCompany) => {
    setCompany(updatedCompany)
  }

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
                  <Image
                    width={96}
                    height={96}
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
                    {company.industry || "Industry not specified"}
                  </p>
                </div>
              </div>
              <EditCompanyDialog company={company} onUpdate={handleCompanyUpdate} />
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
              <span>{company.location || "Location not available"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {company.website ? (
                <a 
                  href={company.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline"
                >
                  {company.website.replace(/(^\w+:|^)\/\//, "")}
                </a>
              ) : (
                <span>Website not available</span>
              )}
            </div>
          </div>

          {/* SDG Initiatives */}
          {company.sdg_initiatives && company.sdg_initiatives.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">SDG Initiatives</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {company.sdg_initiatives.map((sdg) => (
                  <div
                    key={sdg.id}
                    className="bg-card rounded-lg p-4 shadow-sm border"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getSDGColor(sdg.number)}`}>
                        <span className="text-lg font-bold text-white">{sdg.number}</span>
                      </div>
                      <h3 className="text-sm font-medium text-card-foreground">{sdg.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">SDG Initiatives</h2>
              <p className="text-muted-foreground">No SDG initiatives available</p>
            </div>
          )}

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-muted-foreground">
              {company.description || "No description available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyPage