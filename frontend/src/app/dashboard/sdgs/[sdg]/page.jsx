"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchSDGData } from "@/services/apiService";

function SDGDetailPage() {
  const { sdg } = useParams();
  const [sdgData, setSdgData] = useState([]);
  const [loading, setLoading] = useState(true);

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
      case "completed": return "bg-green-100 text-green-800";
      case "in progress": return "bg-blue-100 text-blue-800";
      case "planned": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center md:text-left ">
        SDG {sdg} Projects
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-lg">Loading projects...</div>
        </div>
      ) : sdgData.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-lg text-gray-600">No projects found for this SDG.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sdgData.map((project) => (
            <div
              key={project.id}
              className="rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full"
            >
              {/* Simpler Gradient Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-500 h-24 flex items-center justify-center">
                <h2 className="text-xl font-bold text-white px-4 text-center">
                  {project.implementing_organisation}
                </h2>
              </div>
              
              {/* Content */}
              <div className="bg-white p-5 flex-grow flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.project_status)}`}>
                    {project.project_status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                    {project.project_type}
                  </span>
                </div>
                
                <div className="space-y-2 flex-grow">
                  <div className="flex items-start">
                    <span className="text-gray-500 w-24 flex-shrink-0">Location:</span>
                    <span className="text-gray-800 font-medium">
                      {project.district}, {project.state}
                    </span>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-gray-500 w-24 flex-shrink-0">Company:</span>
                    <span className="text-gray-800 font-medium">
                      {project.company_name || "Not specified"}
                    </span>
                  </div>
                  
                  {project.budget && (
                    <div className="flex items-start">
                      <span className="text-gray-500 w-24 flex-shrink-0">Budget:</span>
                      <span className="text-gray-800 font-medium">
                        ₹{Number(project.budget).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* View Details Button */}
                <button className="mt-4 w-full py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-md hover:opacity-90 transition-opacity">
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