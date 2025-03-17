"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddFacultyDialog from "@/components/add-faculty-dialog";
import FacultyCard from "@/components/faculty-card";
import { Search, GraduationCap } from "lucide-react";

function FacultyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [facultyData, setFacultyData] = useState([]);

  // Fetch Faculty Data from Backend
  const fetchFacultyData = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/faculty/get/");
      const data = await res.json();
      setFacultyData(data);
    } catch (err) {
      console.error("Error fetching faculty:", err);
    }
  };

  // Run on Component Mount
  useEffect(() => {
    fetchFacultyData();
  }, []);

  // Filter faculty based on search
  const filteredFaculty = facultyData.filter((faculty) =>
    `${faculty.name} ${faculty.specialization} ${faculty.areas_of_work.join(" ")} ${faculty.sdg_contribution}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl bg-primary text-primary-foreground p-8 mb-8">
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold mb-4">Faculty Directory</h1>
                <p className="text-primary-foreground/80 max-w-2xl">
                  Discover our distinguished faculty members and their contributions to SDGs.
                </p>
              </div>
              <AddFacultyDialog fetchFaculty={fetchFacultyData} />
            </div>
          </div>
          <GraduationCap className="absolute right-4 bottom-4 w-64 h-64 text-primary-foreground/10" />
        </div>

        {/* Search Input */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search faculty by name, specialization, research area, or SDG contribution..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Faculty Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFaculty.map((faculty) => (
            <FacultyCard key={faculty.id} faculty={faculty} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FacultyPage;
