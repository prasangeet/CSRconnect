import axios from "axios";

export const fetchUserDetails = async (token, router) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/users/me/", {
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

export const fetchSDGData = async (sdgNumber) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(
      `http://127.0.0.1:8000/api/classification/sdg/${sdgNumber}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add JWT token
        },
      }
    );

    return response.data; // Axios automatically parses JSON
  } catch (error) {
    console.error("Error fetching SDG-specific data:", error);
    return [];
  }
};

export const uploadPDF = async (file, extraPrompt) => {
  if (!file) {
    alert("Please select a PDF file first!");
    return false;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("extra_prompt", extraPrompt);

  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(
      "http://127.0.0.1:8000/api/classification/upload_pdf/",
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      alert("PDF uploaded and processed successfully!");
      return true;
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

export const fetchProjects = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(
      "http://localhost:8000/api/classification/get_sdg_data/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // Axios automatically parses JSON
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

export const fetchFacultyData = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get("http://localhost:8000/api/faculty/get/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Axios automatically parses JSON
  } catch (err) {
    console.error("Error fetching faculty:", err);
    return [];
  }
};

export const addCompany = async (formData) => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await axios.post(
      "http://localhost:8000/api/company/add-company/",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 201) {
      console.log("Company added successfully:", response.data);
      return response.data;
    } else {
      console.error("Failed to add company:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error(
      "Error adding company:",
      error.response?.data || error.message
    );
    return null;
  }
};

export const fetchCompanies = async () => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await axios.get(
      "http://localhost:8000/api/company/get-all-companies/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status == 200) {
      return response.data; // Return the list of companies
    } else {
      console.error("Failed to fetch companies:", response.statusText);
      return null; // Return null if the fetch failed
    }
  } catch (error) {
    console.error("Error fetching companies:", error);
    return null; // Return null in case of an error
  }
};

export const fetchCompany = async (companyId) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(
      `http://localhost:8000/api/company/get-company/${companyId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status == 200) {
      return response.data; // Return the company data
    } else {
      console.error("Failed to fetch company:", response.statusText);
      return null; // Return null if the fetch failed
    }
  } catch (error) {
    console.error("Error fetching company:", error);
    return null; // Return null in case of an error
  }
};

export const fetchProjectById = async (projectId) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(
      `http://localhost:8000/api/classification/sdg/get_project/${projectId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // Axios automatically parses JSON
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return null;
  }
};
