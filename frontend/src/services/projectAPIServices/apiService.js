import axios from "axios";

export const update_project_details = async (projectId, projectData) => {
    try{
        const token = localStorage.getItem("access_token");
        const response = await axios.put(
            `http://localhost:8000/api/classification/sdg/update_project/${projectId}/`,
            projectData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        )

        if (response.status === 200) {
            return response.data; // Return the updated project data
        }
        else {
            console.error("Failed to update project:", response.statusText);
            return null; // Return null if the update failed
        }
    }catch(error){
        console.error("Error updating project:", error);
        return null; // Return null in case of an error
    }
}