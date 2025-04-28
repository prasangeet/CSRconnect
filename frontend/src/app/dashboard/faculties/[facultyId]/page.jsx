'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FileText,
  Mail,
  Phone,
  BookOpen,
  Target,
  GraduationCap,
  Building,
  Award,
  Calendar,
  Link as LinkIcon,
  ExternalLink,
  ChevronLeft,
  Globe2,
  User,
} from "lucide-react";
import { fetchFacultyById } from "@/services/apiService";

function FacultyProfilePage() {
  const { facultyId } = useParams();
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFacultyProfile = async () => {
      setLoading(true);
      const facultyData = await fetchFacultyById(facultyId);
      if (facultyData) {
        setFaculty(facultyData);
      }
      setLoading(false);
    };
    loadFacultyProfile();
  }, [facultyId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Faculty Not Found</h2>
          <p className="text-muted-foreground">The requested faculty profile could not be found.</p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 hover:bg-secondary"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Faculty List
        </Button>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl bg-primary text-primary-foreground p-8 mb-8">
          <div className="relative z-10 flex items-center gap-6">
            <div className="shrink-0">
              <img
                src={faculty.profile_picture_url || "/default-avatar.png"}
                alt={faculty.name}
                className="w-24 h-24 rounded-full border-4 border-white/20 object-cover"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{faculty.name}</h1>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <GraduationCap className="w-5 h-5" />
                <p className="text-lg">{faculty.specialization}</p>
              </div>
            </div>
          </div>
          <Globe2 className="absolute right-4 bottom-4 w-64 h-64 text-primary-foreground/10" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">SDG Contributions</p>
              <p className="text-xl font-semibold">{faculty.linked_sdgs?.length || 0}</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Research Areas</p>
              <p className="text-xl font-semibold">{faculty.areas_of_work?.length || 0}</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Publications</p>
              <p className="text-xl font-semibold">{faculty.publications?.length || 0}</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Contact Information</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a href={`mailto:${faculty.email}`} className="hover:text-primary">
                      {faculty.email}
                    </a>
                  </div>
                </div>
                {faculty.phone_number && (
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p>{faculty.phone_number}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* SDG Contributions */}
            <Card className="overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">SDG Contributions</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {faculty.linked_sdgs?.map((sdg) => (
                    <div
                      key={sdg.id}
                      className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Target className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">SDG {sdg.number}</div>
                          <div className="text-sm text-muted-foreground">{sdg.name}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Research Proposal */}
            {faculty.proposal_pdf_url && (
              <Card className="p-6">
                <Button className="w-full" size="lg" asChild>
                  <a
                    href={faculty.proposal_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    View Research Proposal
                  </a>
                </Button>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Research Areas */}
            <Card className="overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Research Areas</h2>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {faculty.areas_of_work?.map((area, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 bg-secondary hover:bg-secondary/80 transition-colors rounded-lg flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Publications */}
            {faculty.publications && (
              <Card className="overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Publications</h2>
                </div>
                <div className="divide-y">
                  {faculty.publications.map((publication, index) => (
                    <div key={index} className="p-6 hover:bg-secondary/50 transition-colors">
                      <div className="flex gap-4">
                        <div className="bg-primary/10 p-2 rounded-lg h-fit">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg mb-1">{publication.title}</h3>
                          <p className="text-muted-foreground">{publication.journal}, {publication.year}</p>
                          {publication.url && (
                            <a
                              href={publication.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline inline-flex items-center gap-1 mt-2"
                            >
                              View Publication <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Research Projects */}
            {faculty.research_projects && (
              <Card className="overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Research Projects</h2>
                </div>
                <div className="divide-y">
                  {faculty.research_projects.map((project, index) => (
                    <div key={index} className="p-6 hover:bg-secondary/50 transition-colors">
                      <div className="flex gap-4">
                        <div className="bg-primary/10 p-2 rounded-lg h-fit">
                          <Target className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg mb-1">{project.title}</h3>
                          <p className="text-muted-foreground">{project.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{project.year}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyProfilePage;