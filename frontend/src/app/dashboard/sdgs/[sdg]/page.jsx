"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchSDGData } from "@/services/apiService";

function SDGDetailPage() {
  const { sdg } = useParams();
  const [sdgData, setSdgData] = useState([]);

  useEffect(() => {
    const getSDGData = async () => {
      try {
        console.log("Fetching SDG data for:", sdg);
        const data = await fetchSDGData(sdg);
        console.log("Fetched SDG Data:", data);
        setSdgData(data);
      } catch (error) {
        console.error("Error fetching SDG data:", error);
        setSdgData([]);
      }
    };

    if (sdg) {
      getSDGData(); // Call the async function inside useEffect
    }
  }, [sdg]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold">SDG {sdg} Projects</h1>
      {sdgData.length === 0 ? (
        <p>No projects found for this SDG.</p>
      ) : (
        <ul className="mt-4">
          {sdgData.map((project) => (
            <li
              key={project.id}
              className="bg-white p-4 shadow-md rounded-md mb-2"
            >
              <h2 className="text-lg font-semibold">
                {project.implementing_organisation}
              </h2>
              <p>
                <strong>District:</strong> {project.district}, {project.state}
              </p>
              <p>
                <strong>Project Type:</strong> {project.project_type}
              </p>
              <p>
                <strong>Status:</strong> {project.project_status}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SDGDetailPage;
