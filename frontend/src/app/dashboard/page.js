"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Globe2,
  Users,
  FileText,
  ArrowUpRight,
  Building2,
  Target,
  Wallet,
  GraduationCap,
  MapPin,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchFacultyData, fetchProjects } from "@/services/apiService";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [projectslength, setProjectslength] = useState(0);
  const [projects, setProjects] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [facultyData, setFacultyData] = useState([]);
  const [facultyHighlights, setFacultyHighlights] = useState([]);

  useEffect(() => {
    // try {
    //   fetchProjects().then((data) => {
    //     setProjects(data);
    //     console.log(data);
    //     setRecentProjects(data.slice(0, 3));
    //     setProjectslength(data.length);
    //     setLoading(false);
    //   });
    // } catch (error) {
    //   console.error("Error fetching projects:", error);
    //   return [];
    // }

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchProjects(); // Ensure API call is awaited
        setProjects(data);
        setRecentProjects(data.slice(0, 3));
        setProjectslength(data.length);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setProjects([]); // Set to an empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // add fetch faculty data
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setLoading(true);
        const data = await fetchFacultyData();
        console.log(data);
        setFacultyData(data);
        setFacultyHighlights(data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching faculty:", err);
        setFacultyData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  // Mock data for dashboard statistics
  const stats = [
    {
      title: "Total Projects",
      value: projectslength,
      // change: "+12%",
      icon: FileText,
      color: "bg-blue-500",
      description: "Active projects across all SDGs",
    },
    {
      title: "Faculty Members",
      value: facultyData.length,
      change: "+5%",
      icon: Users,
      color: "bg-green-500",
      description: "Contributing researchers and educators",
    },
    {
      title: "Active SDGs",
      //find unique sdgs from projects
      value: [...new Set(projects.map((project) => project.sdg_number))].length,
      change: "+3",
      icon: Target,
      color: "bg-amber-500",
      description: "Sustainable Development Goals being addressed",
    },
    {
      title: "Partner Organizations",
      //find unique organizations from projects
      value: [
        ...new Set(
          projects.map((project) => project.implementing_organisation)
        ),
      ].length,
      change: "+8%",
      icon: Building2,
      color: "bg-purple-500",
      description: "Collaborating institutions and companies",
    },
  ];

  // // Mock data for recent projects
  // const recentProjects = [
  //   {
  //     id: 1,
  //     title: "Clean Water Initiative",
  //     sdg: 6,
  //     status: "In Progress",
  //     organization: "WaterCare International",
  //     budget: "2.5",
  //     location: "Chennai, Tamil Nadu",
  //   },
  //   {
  //     id: 2,
  //     title: "Renewable Energy Research",
  //     sdg: 7,
  //     status: "Completed",
  //     organization: "EcoTech Solutions",
  //     budget: "3.8",
  //     location: "Bangalore, Karnataka",
  //   },
  //   {
  //     id: 3,
  //     title: "Education for All",
  //     sdg: 4,
  //     status: "Planned",
  //     organization: "LearnRight Foundation",
  //     budget: "1.2",
  //     location: "Mumbai, Maharashtra",
  //   },
  // ];

  // Mock data for faculty highlights
  // const facultyHighlights = [
  //   {
  //     id: 1,
  //     name: "Dr. Sarah Johnson",
  //     specialization: "Environmental Science",
  //     contributions: ["SDG 13", "SDG 15"],
  //     projects: 8,
  //   },
  //   {
  //     id: 2,
  //     name: "Prof. Rajesh Kumar",
  //     specialization: "Sustainable Energy",
  //     contributions: ["SDG 7", "SDG 11"],
  //     projects: 6,
  //   },
  //   {
  //     id: 3,
  //     name: "Dr. Emily Chen",
  //     specialization: "Public Health",
  //     contributions: ["SDG 3", "SDG 6"],
  //     projects: 5,
  //   },
  // ];

  // Get status badge color (reusing from your SDGDetailPage)
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
    };
    return colors[id] || "bg-slate-600";
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl bg-primary text-primary-foreground p-8 mb-8">
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold mb-4">CSR Connect Dashboard</h1>
                <p className="text-primary-foreground/80 max-w-2xl">
                  Track and monitor our institution's contributions to the UN
                  Sustainable Development Goals through various projects and
                  initiatives.
                </p>
              </div>
              <Button className="bg-white/10 hover:bg-white/20 text-white">
                <FileText className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
          <Globe2 className="absolute right-4 bottom-4 w-64 h-64 text-primary-foreground/10" />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.title} className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <h3 className="text-2xl font-bold mt-2">
                          {stat.value}
                        </h3>
                      </div>
                      <div className={`${stat.color} p-2 rounded-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {stat.description}
                    </p>
                    
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Projects */}
              <div className="lg:col-span-2">
                <Card>
                  <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">
                      Recent Projects
                    </h2>
                    <div className="space-y-4">
                      {recentProjects.length !== 0 ? (
                        recentProjects.map((project) => (
                          <div
                            key={project.id}
                            className="flex items-start space-x-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                          >
                            <div
                              className={`${getSDGColor(
                                project.sdg_number
                              )} w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shrink-0`}
                            >
                              {project.sdg_number}
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">
                                  {project.program_name}
                                </h3>
                                <span
                                  className={`${getStatusColor(
                                    project.status
                                  )} px-2.5 py-0.5 rounded-full text-xs`}
                                >
                                  {project.status}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {project.implementing_organisation
                                  ? project.implementing_organisation
                                  : "No organization"}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {project.district}, {project.state}
                                </span>
                                <span className="flex items-center">
                                  <Wallet className="w-4 h-4 mr-1" />₹
                                  {project.budget} Cr
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">
                          No projects found
                        </p>
                      )}
                    </div>
                    <Link href="/dashboard/sdgs">
                      <Button className="w-full mt-4" variant="outline">
                        View All Projects
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>

              {/* Faculty Highlights */}
              <div>
                <Card>
                  <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">
                      Faculty Highlights
                    </h2>
                    <div className="space-y-4">
                      {facultyHighlights.map((faculty) => (
                        <div
                          key={faculty.id}
                          className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Avatar>
                                <AvatarImage src={faculty.profile_picture_url} />
                                <AvatarFallback>
                                  <User className="w-5 h-5 text-primary" />
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div>
                              <h3 className="font-medium">{faculty.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {faculty.specialization}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            {/* <div className="flex items-center text-sm text-muted-foreground">
                              <BookOpen className="w-4 h-4 mr-1" />
                              {faculty.projects} Projects
                            </div> */}
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Target className="w-4 h-4 mr-1" />
                              <div className="flex flex-wrap gap-1 mt-1">
                                {faculty.linked_sdgs.map((sdg) => (
                                  <span
                                    key={sdg.number}
                                    className={`${getSDGColor(
                                      sdg.number
                                    )} px-1.5 py-0.5 rounded-full text-xs text-white inline-flex items-center justify-center`}
                                  >
                                    {sdg.number}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link href="/dashboard/faculties">
                      <Button className="w-full mt-4" variant="outline">
                        View All Faculty
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
