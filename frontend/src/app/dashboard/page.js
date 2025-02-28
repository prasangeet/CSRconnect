'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sdgData, setSdgData] = useState([]); // State to store SDG classifications
  const [fetchingSDG, setFetchingSDG] = useState(false); // State for SDG data loading

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
    } else {
      fetchUserDetails(token);
      fetchSDGData();
    }
  }, []);

  const fetchUserDetails = async (token) => {
    try {
      const response = await fetch('http://localhost:8000/api/users/me/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else if (response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        router.push('/login');
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSDGData = async () => {
    setFetchingSDG(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/classification/get_sdg_data/');
      if (response.ok) {
        const data = await response.json();
        setSdgData(data);
      } else {
        console.error('Failed to fetch SDG data');
      }
    } catch (error) {
      console.error('Error fetching SDG data:', error);
    } finally {
      setFetchingSDG(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a PDF file first!');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/api/classification/upload_pdf/', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('PDF uploaded and processed successfully!');
        fetchSDGData(); // Refresh SDG data after upload
      } else {
        console.error('Upload failed', response);
        alert('Failed to process PDF.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred while uploading.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-semibold">Welcome to Dashboard</h2>
        {user ? (
          <p className="mt-2 text-gray-700">Logged in as: {user.email}</p>
        ) : (
          <p className="mt-2 text-red-500">Failed to load user info.</p>
        )}

        {/* File Upload */}
        <div className="mt-4">
          <input type="file" accept=".pdf" onChange={handleFileChange} />
          <button
            onClick={handleUpload}
            className={`mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={uploading}
          >
            {uploading ? 'Processing...' : 'Upload PDF'}
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* SDG Classification Table */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-center">SDG Classifications</h2>
        {fetchingSDG ? (
          <p className="text-center mt-4">Fetching data...</p>
        ) : sdgData.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-3 py-2">Organisation</th>
                <th className="border border-gray-300 px-3 py-2">SDG Number</th>
                <th className="border border-gray-300 px-3 py-2">SDG Name</th>
                <th className="border border-gray-300 px-3 py-2">District</th>
                <th className="border border-gray-300 px-3 py-2">State</th>
                <th className="border border-gray-300 px-3 py-2">Project Status</th>
                <th className="border border-gray-300 px-3 py-2">Project Type</th>
              </tr>
            </thead>
            <tbody>
              {sdgData.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-3 py-2">{item.implementing_organisation}</td>
                  <td className="border border-gray-300 px-3 py-2">{item.sdg_number}</td>
                  <td className="border border-gray-300 px-3 py-2">{item.sdg_name}</td>
                  <td className="border border-gray-300 px-3 py-2">{item.district}</td>
                  <td className="border border-gray-300 px-3 py-2">{item.state}</td>
                  <td className="border border-gray-300 px-3 py-2">{item.project_status}</td>
                  <td className="border border-gray-300 px-3 py-2">{item.project_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center mt-4">No SDG data available. Upload a PDF to generate results.</p>
        )}
      </div>
    </div>
  );
}
