"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchUserDetails,
  fetchSDGData,
  uploadPDF,
} from "@/services/apiService";
import { SidebarTrigger } from "@/components/ui/sidebar";
import BlogsContainer from "@/components/blogs-container";
import ProfessorContainer from "@/components/professor-container";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sdgData, setSdgData] = useState([]);
  const [fetchingSDG, setFetchingSDG] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
    } else {
      getUserData(token);
      getSDGData();
    }
  }, []);

  const getUserData = async (token) => {
    setLoading(true);
    const userData = await fetchUserDetails(token, router);
    if (userData) {
      setUser(userData);
    }
    setLoading(false);
  };

  const getSDGData = async () => {
    setFetchingSDG(true);
    const data = await fetchSDGData();
    setSdgData(data);
    setFetchingSDG(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    setUploading(true);
    const success = await uploadPDF(selectedFile);
    if (success) getSDGData(); // Refresh SDG data if upload succeeds
    setUploading(false);
  };

  return (
    <>
      
    </>
  );
}
