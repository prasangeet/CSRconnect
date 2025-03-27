"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchSDGData } from "@/services/apiService";
import {
  ArrowUpRight,
  Building2,
  Globe2,
  MapPin,
  Target,
  Timer,
  Wallet,
} from "lucide-react";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function SDGDetailPage() {
  const { sdg } = useParams();
  const [sdgData, setSdgData] = useState([]);
  const [loading, setLoading] = useState(true);

  function getSDGName(id) {
    const sdgNames = [
      "No Poverty",
      "Zero Hunger",
      "Good Health and Well-being",
      "Quality Education",
      "Gender Equality",
      "Clean Water and Sanitation",
      "Affordable and Clean Energy",
      "Decent Work and Economic Growth",
      "Industry, Innovation and Infrastructure",
      "Reduced Inequalities",
      "Sustainable Cities and Communities",
      "Responsible Consumption and Production",
      "Climate Action",
      "Life Below Water",
      "Life on Land",
      "Peace, Justice, and Strong Institutions",
      "Partnerships for the Goals",
    ];
    return sdgNames[id - 1] || `SDG ${id}`;
  }

  function getSDGDescription(id) {
    const descriptions = [
      "End poverty in all its forms everywhere",
      "End hunger, achieve food security and improved nutrition",
      "Ensure healthy lives and promote well-being for all",
      "Ensure inclusive and equitable quality education",
      "Achieve gender equality and empower all women and girls",
      "Ensure availability and sustainable management of water",
      "Ensure access to affordable, reliable, sustainable energy",
      "Promote sustained, inclusive and sustainable economic growth",
      "Build resilient infrastructure, promote inclusive industrialization",
      "Reduce inequality within and among countries",
      "Make cities and human settlements inclusive and sustainable",
      "Ensure sustainable consumption and production patterns",
      "Take urgent action to combat climate change",
      "Conserve and sustainably use the oceans and marine resources",
      "Protect, restore and promote sustainable use of ecosystems",
      "Promote peaceful and inclusive societies for sustainable development",
      "Strengthen the means of implementation and revitalize partnerships",
    ];
    return descriptions[id - 1] || "";
  }

  useEffect(() => {
    const getSDGData = async () => {
      try {
        setLoading(true);
        console.log("Fetching SDG data for:", sdg);
        const data = await fetchSDGData(sdg);
        console.log("Fetched SDG Data:", data);
        setSdgData(data);
      } catch (error) {
        console.error("Error fetching SDG data:", error);
        setSdgData([]);
      } finally {
        setLoading(false);
      }
    };

    if (sdg) {
      getSDGData();
    }
  }, [sdg]);

  // Get status badge color
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

  // Get SDG color based on number
  const getSDGColor = (sdgNumber) => {
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
    return colors[sdgNumber] || "bg-slate-600";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl bg-primary text-primary-foreground p-8 mb-8">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-12 h-12 ${getSDGColor(
                  sdg
                )} rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}
              >
                {sdg}
              </div>
              <h1 className="text-4xl font-bold">{getSDGName(sdg)}</h1>
            </div>
            <p className="text-primary-foreground/80 max-w-3xl">
              {getSDGDescription(sdg)}
            </p>
          </div>
          <Globe2 className="absolute right-4 bottom-4 w-64 h-64 text-primary-foreground/10" />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        ) : sdgData.length === 0 ? (
          <Card className="p-8 text-center">
            <Globe2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="text-xl font-semibold mb-2">No Projects Found</h2>
            <p className="text-muted-foreground">
              There are currently no projects associated with this SDG.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sdgData.map((project) => (
              <Card
                key={project.id}
                className="flex flex-col h-full overflow-hidden group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`h-2 ${getSDGColor(sdg)}`} />
                <div className="p-6 flex-grow">
                  <h2 className="text-xl font-semibold mb-4 line-clamp-2">
                    {project.implementing_organisation}
                  </h2>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        project.project_status
                      )}`}
                    >
                      {getStatusIcon(project.project_status)}
                      {project.project_status}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {project.project_type}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium">
                        {project.district}, {project.state}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Company:</span>
                      <span className="font-medium">
                        {project.company_name || "Not specified"}
                      </span>
                    </div>

                    {project.budget && (
                      <div className="flex items-center gap-2 text-sm">
                        <Wallet className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Budget:</span>
                        <span className="font-medium">
                          ₹{Number(project.budget).toLocaleString()} Cr
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <CardFooter className="mt-auto">
                  <Button className="w-full group">
                    View Details
                    <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SDGDetailPage;
