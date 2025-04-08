"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Edit,
  Globe2,
  MapPin,
  Target,
  Timer,
  Users,
  Wallet,
  Mail,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { fetchProjectById } from "@/services/apiService";
import { useRouter } from "next/navigation";
import {
  EditProjectTitle,
  EditProjectOverview,
  EditProgress,
  EditObjectives,
  EditKeyOutcomes,
  EditChallenges,
  EditStakeholders,
} from "@/components/projectComponents";

function ProjectDashboard() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Dialog open states
  const [editTitleOpen, setEditTitleOpen] = useState(false);
  const [editOverviewOpen, setEditOverviewOpen] = useState(false);
  const [editProgressOpen, setEditProgressOpen] = useState(false);
  const [editObjectivesOpen, setEditObjectivesOpen] = useState(false);
  const [editOutcomesOpen, setEditOutcomesOpen] = useState(false);
  const [editChallengesOpen, setEditChallengesOpen] = useState(false);
  const [editStakeholdersOpen, setEditStakeholdersOpen] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await fetchProjectById(projectId);
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "in progress":
        return "bg-sky-100 text-sky-800 border border-sky-200";
      case "planned":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      default:
        return "bg-slate-100 text-slate-800 border border-slate-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <Target className="w-4 h-4" />;
      case "in progress":
        return <Timer className="w-4 h-4" />;
      case "planned":
        return <Globe2 className="w-4 h-4" />;
      default:
        return <Globe2 className="w-4 h-4" />;
    }
  };

  // Save handlers
  const handleSaveTitle = async (data) => {
    console.log("Saving title:", data);
    setEditTitleOpen(false);
  };

  const handleSaveOverview = async (data) => {
    console.log("Saving overview:", data);
    setEditOverviewOpen(false);
  };

  const handleSaveProgress = async (data) => {
    console.log("Saving progress:", data);
    setEditProgressOpen(false);
  };

  const handleSaveObjectives = async (data) => {
    console.log("Saving objectives:", data);
    setEditObjectivesOpen(false);
  };

  const handleSaveOutcomes = async (data) => {
    console.log("Saving outcomes:", data);
    setEditOutcomesOpen(false);
  };

  const handleSaveChallenges = async (data) => {
    console.log("Saving challenges:", data);
    setEditChallengesOpen(false);
  };

  const handleSaveStakeholders = async (data) => {
    console.log("Saving stakeholders:", data);
    setEditStakeholdersOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <Globe2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const noInfo = "No information available";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/sdg/1">
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Button>
          </Link>
          <Button className="gap-2" onClick={() => setEditTitleOpen(true)}>
            <Edit className="w-4 h-4" />
            Edit Project
          </Button>
        </div>

        {/* Project Title and Status */}
        <div className="bg-primary text-primary-foreground p-8 rounded-xl mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-4">
                {project.implementing_organisation || noInfo}
              </h1>
              <div className="flex flex-wrap gap-4 items-center">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    project.project_status
                  )}`}
                >
                  {getStatusIcon(project.project_status)}
                  {project.project_status || "Status unknown"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-primary-foreground/10">
                  {project.project_type || "Type unknown"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Project Overview</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditOverviewOpen(true)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-muted-foreground mb-6">
                {project.modalities || noInfo}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">
                      {project.district && project.state
                        ? `${project.district}, ${project.state}`
                        : noInfo}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Organization:</span>
                    <span className="font-medium">
                      {project.company_name || noInfo}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Beneficiaries:
                    </span>
                    <span className="font-medium">
                      {project.beneficiaries
                        ? Number(project.beneficiaries).toLocaleString()
                        : noInfo}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">
                      {project.start_date && project.end_date
                        ? `${new Date(
                            project.start_date
                          ).toLocaleDateString()} - ${new Date(
                            project.end_date
                          ).toLocaleDateString()}`
                        : noInfo}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Budget:</span>
                    <span className="font-medium">
                      {project.budget
                        ? `₹${Number(project.budget).toLocaleString()} Cr`
                        : noInfo}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Contact:</span>
                    {project.contact_email ? (
                      <a
                        href={`mailto:${project.contact_email}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {project.contact_email}
                      </a>
                    ) : (
                      <span className="font-medium">{noInfo}</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Progress Overview</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditProgressOpen(true)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              {project.progress_metrics ? (
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Overall Completion
                      </span>
                      <span className="font-medium">
                        {project.progress_metrics.overall_completion}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${project.progress_metrics.overall_completion}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Budget Utilized
                      </span>
                      <span className="font-medium">
                        {project.progress_metrics.budget_utilized}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${project.progress_metrics.budget_utilized}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Beneficiaries Reached
                      </span>
                      <span className="font-medium">
                        {Number(
                          project.progress_metrics.beneficiaries_reached
                        ).toLocaleString()}{" "}
                        of {Number(project.beneficiaries).toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${
                            (project.progress_metrics.beneficiaries_reached /
                              project.beneficiaries) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Timeline Status:
                      </span>
                      <span className="font-medium">
                        {project.progress_metrics.timeline_status || noInfo}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  {noInfo}
                </p>
              )}
            </Card>
          </div>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Objectives</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditObjectivesOpen(true)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            {project.objectives && project.objectives.length > 0 ? (
              <ul className="space-y-3">
                {project.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">{noInfo}</p>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Key Outcomes</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditOutcomesOpen(true)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            {project.key_outcomes && project.key_outcomes.length > 0 ? (
              <ul className="space-y-3">
                {project.key_outcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Target className="w-5 h-5 text-primary mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">{noInfo}</p>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Challenges</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditChallengesOpen(true)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            {project.challenges && project.challenges.length > 0 ? (
              <ul className="space-y-3">
                {project.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">{noInfo}</p>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Stakeholders</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditStakeholdersOpen(true)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            {project.stakeholders && project.stakeholders.length > 0 ? (
              <div className="space-y-4">
                {project.stakeholders.map((stakeholder, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Users className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium">{stakeholder.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {stakeholder.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">{noInfo}</p>
            )}
          </Card>
        </div>

        {/* Edit Dialogs */}
        <EditProjectTitle
          project={project}
          onSave={handleSaveTitle}
          open={editTitleOpen}
          onOpenChange={setEditTitleOpen}
        />
        <EditProjectOverview
          project={project}
          onSave={handleSaveOverview}
          open={editOverviewOpen}
          onOpenChange={setEditOverviewOpen}
        />
        <EditProgress
          project={project}
          onSave={handleSaveProgress}
          open={editProgressOpen}
          onOpenChange={setEditProgressOpen}
        />
        <EditObjectives
          project={project}
          onSave={handleSaveObjectives}
          open={editObjectivesOpen}
          onOpenChange={setEditObjectivesOpen}
        />
        <EditKeyOutcomes
          project={project}
          onSave={handleSaveOutcomes}
          open={editOutcomesOpen}
          onOpenChange={setEditOutcomesOpen}
        />
        <EditChallenges
          project={project}
          onSave={handleSaveChallenges}
          open={editChallengesOpen}
          onOpenChange={setEditChallengesOpen}
        />
        <EditStakeholders
          project={project}
          onSave={handleSaveStakeholders}
          open={editStakeholdersOpen}
          onOpenChange={setEditStakeholdersOpen}
        />
      </div>
    </div>
  );
}

export default ProjectDashboard;