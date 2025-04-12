import axios from "axios";

export const addCompany_byName = async (companyName) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.post(
      "http://localhost:8000/api/company/add_company_by_name/",
      { name: companyName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 201) {
      return response.data; // Return the new company data
    } else {
      console.error("Failed to create company:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error creating company:", error);
    return null;
  }
};

/**
 * Upload a CSR policy PDF file for a specific company
 * @param {number} companyId - The ID of the company
 * @param {File} file - The PDF file to upload
 * @param {string} policyName - Optional name/title for the policy
 * @returns {Promise<Object>} - The response data from the server
 */
export const uploadCSRPolicy = async (companyId, file, policyName = "") => {
  if (!file) {
    throw new Error("Please select a PDF file first!")
  }

  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are accepted for CSR policies")
  }

  const formData = new FormData()
  formData.append("csr_policy", file)

  if (policyName) {
    formData.append("policy_name", policyName)
  }

  try {
    const token = localStorage.getItem("access_token")
    const response = await axios.post(`http://localhost:8000/api/company/add_csr_policy/${companyId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })

    if (response.status === 201 || response.status === 200) {
      return response.data
    } else {
      throw new Error("Failed to upload CSR policy")
    }
  } catch (error) {
    console.error("Error uploading CSR policy:", error)
    throw error
  }
}

export const deleteCSRPolicy = async (companyId) => {
  try {
    const token = localStorage.getItem("access_token")
    const response = await axios.delete(`http://localhost:8000/api/company/remove_csr_policy/${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 200) {
      return response.data
    } else {
      throw new Error("Failed to remove CSR policy")
    }
  } catch (error) {
    console.error("Error removing CSR policy:", error)
    throw error
  }
}

export const createCompanyUser = async (companyId, userData) => {
  try {
    const token = localStorage.getItem("access_token")
    const response = await axios.post(`http://localhost:8000/api/company/${companyId}/create_user`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (response.status === 201 || response.status === 200) {
      return response.data
    } else {
      throw new Error("Failed to create company user")
    }
  } catch (error) {
    console.error("Error creating company user:", error)
    throw error
  }
}


// /**
//  * Delete a CSR policy for a specific company
//  * @param {number} companyId - The ID of the company
//  * @param {number} policyId - The ID of the policy to delete
//  * @returns {Promise<Object>} - The response data from the server
//  */
// export const deleteCSRPolicy = async (companyId, policyId) => {
//   try {
//     const token = localStorage.getItem("access_token")
//     const response = await axios.delete(
//       `http://localhost:8000/api/company/delete_csr_policy/${companyId}/${policyId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     )

//     if (response.status === 200) {
//       return response.data
//     } else {
//       throw new Error("Failed to delete CSR policy")
//     }
//   } catch (error) {
//     console.error("Error deleting CSR policy:", error)
//     throw error
//   }
// }
