"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Building2, Globe, MapPin, AlertCircle, Edit } from "lucide-react"
import Image from "next/image"
import { fetchCompany } from "@/services/apiService"
import EditCompanyDialog from "@/components/edit-company-dialog"
import { getSDGColor } from "@/lib/sdg-utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EditAboutDialog } from "@/components/companyComponents/edit-about-dialog"
import { EditSDGDialog } from "@/components/companyComponents/edit-sdg-dialog"
import { EditCSRDialog } from "@/components/companyComponents/edit-csr-dialog"

function CompanyPage() {
  const params = useParams()
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editAboutOpen, setEditAboutOpen] = useState(false)
  const [editSDGOpen, setEditSDGOpen] = useState(false)
  const [editCSROpen, setEditCSROpen] = useState(false)

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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - About and SDG Initiatives */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">About</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditAboutOpen(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-muted-foreground mb-6">
                {company.description || "No description available"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 text-muted-foreground border-t pt-4">
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
            </Card>

            {/* SDG Initiatives */}
            <Card className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">SDG Initiatives</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditSDGOpen(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              {company.sdg_initiatives && company.sdg_initiatives.length > 0 ? (
                <ul className="space-y-4">
                  {company.sdg_initiatives.map((sdg) => (
                    <li key={sdg.id} className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${getSDGColor(sdg.number)}`}>
                        <span className="text-lg font-bold text-white">{sdg.number}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-card-foreground">{sdg.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{sdg.description}</p>
                        <p className="text-sm font-medium text-primary mt-2">
                          Budget Allocated: ${sdg.budget?.toLocaleString() || "Not specified"}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-4">No SDG initiatives available</p>
              )}
            </Card>
          </div>

          {/* Right Column - CSR Policy */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">CSR Policy</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditCSROpen(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              {company.csr_policies && company.csr_policies.length > 0 ? (
                <ul className="space-y-3">
                  {company.csr_policies.map((policy, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                      <span className="text-sm">{policy}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-4">No CSR policies available</p>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Dialogs */}
      <EditAboutDialog
        company={company}
        onSave={handleCompanyUpdate}
        open={editAboutOpen}
        onOpenChange={setEditAboutOpen}
      />
      <EditSDGDialog
        company={company}
        onSave={handleCompanyUpdate}
        open={editSDGOpen}
        onOpenChange={setEditSDGOpen}
      />
      <EditCSRDialog
        company={company}
        onSave={handleCompanyUpdate}
        open={editCSROpen}
        onOpenChange={setEditCSROpen}
      />
    </div>
  )
}

export default CompanyPage