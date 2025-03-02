"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchSDGData } from "@/services/apiService";

function SDGDetailPage() {
  const { sdg } = useParams();
  const [sdgData, setSdgData] = useState([]);
  const [loading, setLoading] = useState(true);

  function getSDGName(id) {
    const sdgNames = [
      "No Poverty", "Zero Hunger", "Good Health and Well-being", "Quality Education",
      "Gender Equality", "Clean Water and Sanitation", "Affordable and Clean Energy",
      "Decent Work and Economic Growth", "Industry, Innovation and Infrastructure",
      "Reduced Inequalities", "Sustainable Cities and Communities",
      "Responsible Consumption and Production", "Climate Action",
      "Life Below Water", "Life on Land", "Peace, Justice, and Strong Institutions",
      "Partnerships for the Goals",
    ];
    return sdgNames[id - 1] || `SDG ${id}`;
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

  // Get SDG color based on number
  const getSDGColor = (sdgNumber) => {
    const colors = {
      "1": "bg-red-600",
      "2": "bg-yellow-500",
      "3": "bg-green-500",
      "4": "bg-red-400",
      "5": "bg-red-600",
      "6": "bg-blue-400",
      "7": "bg-yellow-400",
      "8": "bg-red-500",
      "9": "bg-orange-500",
      "10": "bg-pink-500",
      "11": "bg-orange-400",
      "12": "bg-amber-600",
      "13": "bg-green-600",
      "14": "bg-blue-600",
      "15": "bg-green-500",
      "16": "bg-blue-700",
      "17": "bg-blue-500",
    };
    return colors[sdgNumber] || "bg-slate-600";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left flex items-center gap-3">
        <span className={`inline-block w-4 h-4 rounded-full ${getSDGColor(sdg)}`}></span>
        {getSDGName(sdg)} Projects
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-lg">Loading projects...</div>
        </div>
      ) : sdgData.length === 0 ? (
        <div className="bg-card rounded-xl shadow-md p-10 text-center border border-border">
          <p className="text-lg text-muted-foreground">
            No projects found for this SDG.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sdgData.map((project) => (
            <div
              key={project.id}
              className="rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full bg-card border border-border"
            >
              {/* Header with SDG color */}
              <div className={`${getSDGColor(sdg)} h-3`}></div>
              
              {/* Organization name */}
              <div className="px-5 pt-5 pb-2">
                <h2 className="text-xl font-bold text-card-foreground line-clamp-2">
                  {project.implementing_organisation}
                </h2>
              </div>
              
              {/* Content */}
              <div className="px-5 pb-5 flex-grow flex flex-col">
                <div className="flex flex-wrap gap-2 mb-5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      project.project_status
                    )}`}
                  >
                    {project.project_status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 border border-teal-200">
                    {project.project_type}
                  </span>
                </div>

                <div className="space-y-4 flex-grow">
                  <div className="flex items-start">
                    <span className="text-muted-foreground w-24 flex-shrink-0 text-sm">
                      Location:
                    </span>
                    <span className="text-card-foreground font-medium text-sm">
                      {project.district}, {project.state}
                    </span>
                  </div>

                  <div className="flex items-start">
                    <span className="text-muted-foreground w-24 flex-shrink-0 text-sm">
                      Company:
                    </span>
                    <span className="text-card-foreground font-medium text-sm">
                      {project.company_name || "Not specified"}
                    </span>
                  </div>

                  {project.budget && (
                    <div className="flex items-start">
                      <span className="text-muted-foreground w-24 flex-shrink-0 text-sm">
                        Budget:
                      </span>
                      <span className="text-card-foreground font-medium text-sm">
                        ₹{Number(project.budget).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* View Details Button */}
                <button className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors w-fit text-sm font-medium shadow-sm">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SDGDetailPage;