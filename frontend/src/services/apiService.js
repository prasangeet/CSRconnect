import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Fetch user details
export const fetchUserDetails = async (token, router) => {
  try {
    const response = await fetch(`${BASE_URL}/api/users/me/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return await response.json();
    } else if (response.status === 500 || response.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      router.push("/login");
      return null;
    } else {
      console.error("Failed to fetch user data");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

// Fetch SDG data
export const fetchSDGData = async (sdgNumber) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${BASE_URL}/api/classification/sdg/${sdgNumber}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching SDG-specific data:", error);
    return [];
  }
};

// Upload PDF
export const uploadPDF = async (file, extraPrompt, companyId) => {
  if (!file) {
    alert("Please select a PDF file first!");
    return false;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("extra_prompt", extraPrompt);
  formData.append("company_id", companyId);

  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.post(
      `${BASE_URL}/api/classification/upload_pdf/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200) {
      alert("PDF uploaded and processed successfully!");
      return response.data;
    } else {
      console.error("Upload failed", response);
      alert("Failed to process PDF.");
      return false;
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("An error occurred while uploading.");
    return false;
  }
};

// Fetch all projects
export const fetchProjects = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${BASE_URL}/api/classification/get_sdg_data/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

// Fetch faculty data
export const fetchFacultyData = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${BASE_URL}/api/faculty/get/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    console.error("Error fetching faculty:", err);
    return [];
  }
};

export const fetchFacultyById = async (facultyId) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${BASE_URL}/api/faculty/getfaculty/${facultyId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    console.error("Error fetching faculty by ID:", err);
    return null;
  }
}

// Add a new company
export const addCompany = async (formData) => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await axios.post(`${BASE_URL}/api/company/add-company/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 201) {
      console.log("Company added successfully:", response.data);
      return response.data;
    } else {
      console.error("Failed to add company:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error adding company:", error.response?.data || error.message);
    return null;
  }
};

// Fetch all companies
export const fetchCompanies = async () => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await axios.get(`${BASE_URL}/api/company/get-all-companies/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status == 200) {
      return response.data;
    } else {
      console.error("Failed to fetch companies:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching companies:", error);
    return null;
  }
};

// Fetch a single company by ID
export const fetchCompany = async (companyId) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${BASE_URL}/api/company/get-company/${companyId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status == 200) {
      return response.data;
    } else {
      console.error("Failed to fetch company:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching company:", error);
    return null;
  }
};

// Fetch project by ID
export const fetchProjectById = async (projectId) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${BASE_URL}/api/classification/sdg/get_project/${projectId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return null;
  }
};
