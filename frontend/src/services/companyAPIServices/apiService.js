import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Add company by name
export const addCompany_byName = async (companyName) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.post(
      `${BASE_URL}/api/company/add_company_by_name/`,
      { name: companyName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 201) {
      return response.data;
    } else {
      console.error("Failed to create company:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error creating company:", error);
    return null;
  }
};

// Upload a CSR policy PDF
export const uploadCSRPolicy = async (companyId, file, policyName = "") => {
  if (!file) {
    throw new Error("Please select a PDF file first!");
  }

  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are accepted for CSR policies");
  }

  const formData = new FormData();
  formData.append("csr_policy", file);
  if (policyName) formData.append("policy_name", policyName);

  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.post(
      `${BASE_URL}/api/company/add_csr_policy/${companyId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 201 || response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to upload CSR policy");
    }
  } catch (error) {
    console.error("Error uploading CSR policy:", error);
    throw error;
  }
};

// Remove CSR policy
export const deleteCSRPolicy = async (companyId) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.delete(
      `${BASE_URL}/api/company/remove_csr_policy/${companyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to remove CSR policy");
    }
  } catch (error) {
    console.error("Error removing CSR policy:", error);
    throw error;
  }
};

// Create a company user
export const createCompanyUser = async (companyId, userData) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.post(
      `${BASE_URL}/api/company/${companyId}/create_user`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 201 || response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to create company user");
    }
  } catch (error) {
    console.error("Error creating company user:", error);
    throw error;
  }
};

// Update company details
export const updateCompanyDetails = async (companyId, data) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.post(
      `${BASE_URL}/api/company/update-company/${companyId}/`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to update company details" };
  }
};
