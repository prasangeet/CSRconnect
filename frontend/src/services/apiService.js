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
    } else if (response.status === 401) {
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
    const response = await fetch(
      `http://127.0.0.1:8000/api/classification/sdg/${sdgNumber}/`
    );
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch SDG-specific data");
      return [];
    }
  } catch (error) {
    console.error("Error fetching SDG-specific data:", error);
    return [];
  }
};

export const uploadPDF = async (selectedFile) => {
  if (!selectedFile) {
    alert("Please select a PDF file first!");
    return false;
  }

  const formData = new FormData();
  formData.append("file", selectedFile);

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
