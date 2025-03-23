"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import AddCompanyDialog from "@/components/add-company-dialog"
import CompanyCard from "@/components/company-card"
import { Search, Building2 } from "lucide-react"
import { fetchCompaniesData } from "@/services/apiService"

function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [companiesData, setCompaniesData] = useState([])
  const [loading, setLoading] = useState(true)

  // Run on Component Mount
  useEffect(() => {
    // Dummy data for companies
    const dummyCompanies = [
      {
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
      },
      {
        id: 2,
        name: "AquaPure Systems",
        industry: "Water Treatment",
        location: "Chennai, Tamil Nadu",
        website: "https://aquapure.example.com",
        description:
          "Developing innovative water purification and conservation technologies to address water scarcity and provide clean drinking water to underserved communities.",
        sdg_initiatives: [
          { id: 4, number: 6, name: "Clean Water and Sanitation" },
          { id: 5, number: 3, name: "Good Health and Well-being" },
        ],
      },
      {
        id: 3,
        name: "GreenHarvest Farms",
        industry: "Sustainable Agriculture",
        location: "Pune, Maharashtra",
        website: "https://greenharvest.example.com",
        description:
          "Pioneering sustainable farming practices that increase crop yields while reducing environmental impact. Supporting small farmers with training and resources.",
        sdg_initiatives: [
          { id: 6, number: 2, name: "Zero Hunger" },
          { id: 7, number: 12, name: "Responsible Consumption and Production" },
          { id: 8, number: 15, name: "Life on Land" },
        ],
      },
      {
        id: 4,
        name: "EduAccess Foundation",
        industry: "Education Technology",
        location: "Delhi, NCR",
        website: "https://eduaccess.example.org",
        description:
          "Non-profit organization providing digital learning tools and resources to underserved schools and communities, bridging the educational divide.",
        sdg_initiatives: [
          { id: 9, number: 4, name: "Quality Education" },
          { id: 10, number: 10, name: "Reduced Inequalities" },
        ],
      },
      {
        id: 5,
        name: "MediCare Innovations",
        industry: "Healthcare",
        location: "Hyderabad, Telangana",
        website: "https://medicare-innovations.example.com",
        description:
          "Developing affordable medical devices and telemedicine solutions to improve healthcare access in rural and remote areas of India.",
        sdg_initiatives: [
          { id: 11, number: 3, name: "Good Health and Well-being" },
          { id: 12, number: 9, name: "Industry, Innovation and Infrastructure" },
        ],
      },
      {
        id: 6,
        name: "Urban Mobility Solutions",
        industry: "Transportation",
        location: "Mumbai, Maharashtra",
        website: "https://urbanmobility.example.com",
        description:
          "Creating sustainable urban transportation systems including electric vehicle infrastructure and smart public transit solutions.",
        sdg_initiatives: [
          { id: 13, number: 11, name: "Sustainable Cities and Communities" },
          { id: 14, number: 13, name: "Climate Action" },
        ],
      },
      {
        id: 7,
        name: "WomenEmpowerTech",
        industry: "Information Technology",
        location: "Kolkata, West Bengal",
        website: "https://womenempowertech.example.org",
        description:
          "Social enterprise focused on training women in technology skills and supporting female entrepreneurs in the tech industry.",
        sdg_initiatives: [
          { id: 15, number: 5, name: "Gender Equality" },
          { id: 16, number: 8, name: "Decent Work and Economic Growth" },
          { id: 17, number: 10, name: "Reduced Inequalities" },
        ],
      },
      {
        id: 8,
        name: "CircularEconomy Partners",
        industry: "Waste Management",
        location: "Ahmedabad, Gujarat",
        website: "https://circulareconomy.example.com",
        description:
          "Pioneering waste reduction and recycling solutions, helping businesses transition to circular economy models that minimize waste and maximize resource efficiency.",
        sdg_initiatives: [
          { id: 18, number: 12, name: "Responsible Consumption and Production" },
          { id: 19, number: 11, name: "Sustainable Cities and Communities" },
        ],
      },
      {
        id: 9,
        name: "Microfinance Inclusion",
        industry: "Financial Services",
        location: "Lucknow, Uttar Pradesh",
        website: "https://microfinance-inclusion.example.org",
        description:
          "Providing microloans and financial services to underserved communities, with a focus on supporting small businesses and entrepreneurs in rural areas.",
        sdg_initiatives: [
          { id: 20, number: 1, name: "No Poverty" },
          { id: 21, number: 8, name: "Decent Work and Economic Growth" },
        ],
      },
    ]

    // Simulate loading delay
    setTimeout(() => {
      setCompaniesData(dummyCompanies)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter companies based on search
  const filteredCompanies = companiesData.filter((company) =>
    `${company.name} ${company.industry} ${company.sdg_initiatives.join(" ")} ${company.location}`
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

        {/* If loading show spinner*/}
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

