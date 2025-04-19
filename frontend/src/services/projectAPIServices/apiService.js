import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Update full project details
 * @param {number} projectId - ID of the project
 * @param {Object} projectData - Data to update
 * @returns {Object|null}
 */
export const update_project_details = async (projectId, projectData) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.put(
      `${BASE_URL}/api/classification/sdg/update_project/${projectId}/`,
      projectData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to update project:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error updating project:", error);
    return null;
  }
};

/**
 * Update only project overview field
 * @param {number} projectId - ID of the project
 * @param {Object} projectData - { overview: string }
 * @returns {Object|null}
 */
export const update_project_overview = async (projectId, projectData) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.put(
      `${BASE_URL}/api/classification/sdg/update_project_overview/${projectId}/`,
      projectData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to update project overview:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error updating project overview:", error);
    return null;
  }
};
