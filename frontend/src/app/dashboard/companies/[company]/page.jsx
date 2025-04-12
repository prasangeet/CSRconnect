"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Building2,
  Globe,
  MapPin,
  Edit,
  DollarSign,
  Target,
  Building,
  FileText,
  Download,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import { fetchCompany } from "@/services/apiService";
import EditCompanyDialog from "@/components/edit-company-dialog";
import { getSDGColor } from "@/lib/sdg-utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditAboutDialog } from "@/components/companyComponents/edit-about-dialog";
import { EditCSRDialog } from "@/components/companyComponents/edit-csr-dialog";
import Link from "next/link";

function CompanyPage() {
  const params = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editAboutOpen, setEditAboutOpen] = useState(false);
  const [editCSROpen, setEditCSROpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);

  useEffect(() => {
    loadCompanyData();
  }, [params.company]);

  const loadCompanyData = async () => {
    const companyData = await fetchCompany(params.company);
    if (companyData) {
      setCompany(companyData);
    }
    setLoading(false);
  };

  const calculateSDGBudget = (sdgNumber) => {
    if (!company?.project_initiatives) return 0;
    return company.project_initiatives
      .filter((project) => project.sdg_number === sdgNumber)
      .reduce(
        (total, project) => total + (Number.parseFloat(project.budget) || 0),
        0
      );
  };

  const handleCompanyUpdate = (updatedCompany) => {
    setCompany(updatedCompany);
  };

  const getProjectStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "under implementation":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "planned":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreatingUser(true);

    try {
      // Here you would call your API to create a user
      // const response = await createCompanyUser(company.id, { username, email, password })

      // Reset form
      setUsername("");
      setEmail("");
      setPassword("");

      // Show success message
      alert("User created successfully!");
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user: " + (error.message || "Unknown error"));
    } finally {
      setCreatingUser(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-muted-foreground">Company not found</p>
      </div>
    );
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
                    src={company.logo || "/placeholder.svg"}
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
              <EditCompanyDialog
                company={company}
                onUpdate={handleCompanyUpdate}
              />
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
              <div className="mb-4">
                <h2 className="text-xl font-semibold">SDG Initiatives</h2>
              </div>
              {company.sdg_initiatives && company.sdg_initiatives.length > 0 ? (
                <ul className="space-y-4">
                  {company.sdg_initiatives.map((sdg) => (
                    <li key={sdg.id} className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${getSDGColor(
                          sdg.number
                        )}`}
                      >
                        <span className="text-lg font-bold text-white">
                          {sdg.number}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-card-foreground">
                          {sdg.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                          <p className="text-sm font-medium text-green-600">
                            <span className="text-muted-foreground">
                              Project Spend:
                            </span>{" "}
                            ₹{calculateSDGBudget(sdg.number).toFixed(2)} Cr
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No SDG initiatives available
                </p>
              )}
            </Card>

            {/* Project Initiatives */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Project Initiatives</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ongoing and completed projects under various SDGs
                  </p>
                </div>
              </div>

              {company.project_initiatives &&
              company.project_initiatives.length > 0 ? (
                <div className="grid gap-6">
                  {company.project_initiatives.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-primary/20 transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className={`px-3 py-1 rounded-full text-sm font-medium ${getSDGColor(
                                  project.sdg_number
                                )}`}
                              >
                                SDG {project.sdg_number}
                              </div>
                              <div
                                className={`px-3 py-1 rounded-full text-sm font-medium ${getProjectStatusColor(
                                  project.project_status
                                )}`}
                              >
                                {project.project_status}
                              </div>
                            </div>
                            <Link href={`/dashboard/sdgs/${project.sdg_number}/${project.id}`}>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {project.program_name}
                              </h3>
                            </Link>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {project.modalities}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 text-gray-600">
                            <Building className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">
                                Implementing Organisation
                              </p>
                              <p className="text-sm font-medium">
                                {project.implementing_organisation}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-gray-600">
                            <MapPin className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Location</p>
                              <p className="text-sm font-medium">
                                {project.district}, {project.state}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-gray-600">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">
                                Budget Allocated
                              </p>
                              <p className="text-sm font-medium">
                                ₹{project.budget} Cr
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-gray-600">
                            <Target className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">
                                Project Type
                              </p>
                              <p className="text-sm font-medium">
                                {project.project_type}
                              </p>
                            </div>
                          </div>
                        </div>

                        {project.details &&
                          project.details !== "Not applicable" && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium text-gray-700">
                                  Additional Details:
                                </span>{" "}
                                {project.details}
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-lg">No projects available</p>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - CSR Policy and Create User */}
          <div className="lg:col-span-1 space-y-8">
            {/* CSR Policy */}
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
              {company.csr_policy ? (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      CSR Policy Document
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {company.csr_policy.split("/").pop()}
                    </p>
                  </div>
                  <a
                    href={company.csr_policy}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <FileText className="w-10 h-10 text-muted-foreground/40 mb-2" />
                  <p className="text-muted-foreground">
                    No CSR policy available
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => setEditCSROpen(true)}
                  >
                    Upload Policy
                  </Button>
                </div>
              )}
            </Card>

            {/* Create Company User */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <UserPlus className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Create company user?</h2>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={creatingUser}
                >
                  {creatingUser ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Creating...
                    </>
                  ) : (
                    "Create User"
                  )}
                </Button>
              </form>
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
      <EditCSRDialog
        company={company}
        onSave={handleCompanyUpdate}
        open={editCSROpen}
        onOpenChange={setEditCSROpen}
      />
    </div>
  );
}

export default CompanyPage;
