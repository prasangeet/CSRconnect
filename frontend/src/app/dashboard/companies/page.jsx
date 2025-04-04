"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import AddCompanyDialog from "@/components/add-company-dialog"
import CompanyCard from "@/components/company-card"
import { Search, Building2 } from "lucide-react"
import { fetchCompaniesData } from "@/services/apiService"
import { dummyCompanies } from "@/temp_utils/data" // Import dummy data

function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [companiesData, setCompaniesData] = useState([])
  const [loading, setLoading] = useState(true)

  // Run on Component Mount
  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setCompaniesData(dummyCompanies)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter companies based on search
  const filteredCompanies = companiesData.filter((company) =>
    `${company.name} ${company.industry} ${company.sdg_initiatives.map((sdg) => sdg.name).join(" ")} ${company.location}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl bg-primary text-primary-foreground p-8 mb-8">
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold mb-4">Partner Companies</h1>
                <p className="text-primary-foreground/80 max-w-2xl">
                  Explore our partner organizations and their contributions to sustainable development goals.
                </p>
              </div>
              <AddCompanyDialog fetchCompanies={fetchCompaniesData} />
            </div>
          </div>
          <Building2 className="absolute right-4 bottom-4 w-64 h-64 text-primary-foreground/10" />
        </div>

        {/* Search Input */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search companies by name, industry, SDG initiatives, or location..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* If loading show spinner */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Company Cards Grid */}
        {filteredCompanies.length === 0 && !loading && (
          <div className="text-center text-muted-foreground">No companies found. Try searching for something else.</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CompaniesPage
