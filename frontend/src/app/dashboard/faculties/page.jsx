"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddFacultyDialog from "@/components/add-faculty-dialog";
import FacultyCard from "@/components/faculty-card";
import { Search, GraduationCap } from "lucide-react";
import { fetchFacultyData } from "@/services/apiService";

function FacultyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [facultyData, setFacultyData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Faculty Data from Backend
  // const fetchFacultyData = async () => {
  //   try {
  //     const res = await fetch("http://localhost:8000/api/faculty/get/");
  //     const data = await res.json();
  //     setFacultyData(data);
  //     setLoading(false);
  //   } catch (err) {
  //     console.error("Error fetching faculty:", err);
  //     setLoading(false);
  //   }
  // };

  // Run on Component Mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchFacultyData(); // Ensure API call is awaited
        setFacultyData(Array.isArray(data) ? data : []); // Ensure data is an array
      } catch (err) {
        console.error("Error fetching faculty:", err);
        setFacultyData([]); // Set to an empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter faculty based on search
  const filteredFaculty = facultyData.filter((faculty) =>
    `${faculty.name} ${faculty.specialization} ${faculty.areas_of_work.join(
      " "
    )} ${faculty.sdg_contribution}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // //use a spinner when loading
  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="w-10 h-10 border-t-2 border-b-2 border-primary rounded-full animate-spin" />
  //     </div>
  //   );
  // }

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
                  Discover our distinguished faculty members and their
                  contributions to SDGs.
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
        {/* If loading show spinner*/}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Faculty Cards Grid */}
        {filteredFaculty.length === 0 && !loading && (
          <div className="text-center text-muted-foreground">
            No faculty found. Try searching for something else.
          </div>
        )}

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
