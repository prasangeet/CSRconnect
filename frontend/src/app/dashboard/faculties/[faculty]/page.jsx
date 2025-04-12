"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddFacultyDialog from "@/components/add-faculty-dialog";
import FacultyCard from "@/components/faculty-card";
import { Search, GraduationCap } from "lucide-react";
import { fetchFacultyData, updateFacultyData } from "@/services/apiService";
import {
  EditFacultyName,
  EditFacultySpecialization,
  EditFacultyAreas,
  EditFacultySDG,
  EditFacultyPublications
} from "@/components/projectComponents";

function FacultyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [facultyData, setFacultyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [editDialog, setEditDialog] = useState({
    type: null, // e.g., "name", "specialization", etc.
    open: false
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchFacultyData();
        setFacultyData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching faculty:", err);
        setFacultyData([]);
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

  // Handle opening the edit dialog
  const handleEdit = (faculty, type) => {
    setSelectedFaculty(faculty);
    setEditDialog({ type, open: true });
  };

  // Handle saving the edited data
  const handleSave = async (updatedData) => {
    try {
      // Update the faculty data on the server
      await updateFacultyData(selectedFaculty.id, updatedData);
      
      // Update the local state
      setFacultyData((prev) =>
        prev.map((faculty) =>
          faculty.id === selectedFaculty.id 
            ? { ...faculty, ...updatedData } 
            : faculty
        )
      );
      
      // Close the dialog
      setEditDialog({ type: null, open: false });
    } catch (error) {
      console.error("Error updating faculty data:", error);
      // You might want to show an error message to the user here
    }
  };

  // Refresh data after any update
  const refreshData = async () => {
    try {
      const data = await fetchFacultyData();
      setFacultyData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error refreshing faculty data:", err);
    }
  };

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
              <AddFacultyDialog fetchFaculty={refreshData} />
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
        
        {/* Loading spinner */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* No results message */}
        {filteredFaculty.length === 0 && !loading && (
          <div className="text-center text-muted-foreground">
            No faculty found. Try searching for something else.
          </div>
        )}

        {/* Faculty Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFaculty.map((faculty) => (
            <FacultyCard 
              key={faculty.id} 
              faculty={faculty} 
              onEdit={(type) => handleEdit(faculty, type)}
            />
          ))}
        </div>
      </div>

      {/* Edit Dialogs */}
      {selectedFaculty && (
        <>
          <EditFacultyName
            faculty={selectedFaculty}
            open={editDialog.type === "name" && editDialog.open}
            onOpenChange={(open) => 
              setEditDialog(prev => ({ ...prev, open: open }))
            }
            onSave={handleSave}
          />
          
          <EditFacultySpecialization
            faculty={selectedFaculty}
            open={editDialog.type === "specialization" && editDialog.open}
            onOpenChange={(open) => 
              setEditDialog(prev => ({ ...prev, open: open }))
            }
            onSave={handleSave}
          />
          
          <EditFacultyAreas
            faculty={selectedFaculty}
            open={editDialog.type === "areas" && editDialog.open}
            onOpenChange={(open) => 
              setEditDialog(prev => ({ ...prev, open: open }))
            }
            onSave={handleSave}
          />
          
          <EditFacultySDG
            faculty={selectedFaculty}
            open={editDialog.type === "sdg" && editDialog.open}
            onOpenChange={(open) => 
              setEditDialog(prev => ({ ...prev, open: open }))
            }
            onSave={handleSave}
          />
          
          <EditFacultyPublications
            faculty={selectedFaculty}
            open={editDialog.type === "publications" && editDialog.open}
            onOpenChange={(open) => 
              setEditDialog(prev => ({ ...prev, open: open }))
            }
            onSave={handleSave}
          />
        </>
      )}
    </div>
  );
}

export default FacultyPage;
