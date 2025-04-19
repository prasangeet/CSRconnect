"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function Register() {
  const router = useRouter();

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  // State for form data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // State for submission messages
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if the user is already logged in
  const checkAuthStatus = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;

    try {
      const response = await axios.get(`${BASE_URL}/api/users/me/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status === 200) {
        console.log("Valid token, redirecting to dashboard...");
        router.push("/dashboard");
      }
    } catch (err) {
      console.warn("Invalid or expired token, forcing login...");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  };

  // Run authentication check on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/users/register/`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        setSuccessMessage("User registered successfully!");

        // Show success toast notification
        toast.success("Registration successful!", {
          description: "Your account has been created. Redirecting to login...",
          duration: 3000,
        });

        setTimeout(() => router.push("/login"), 1500); // Redirect after success
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response) {
        const errorMsg =
          error.response.data.detail ||
          "Registration failed. Please try again.";
        setErrorMessage(errorMsg);

        // Show error toast notification
        toast.error("Registration failed", {
          description: errorMsg,
          duration: 3000,
        });
      } else {
        setErrorMessage("Network error. Please check your connection.");

        // Show network error toast notification
        toast.error("Network error", {
          description: "Please check your connection and try again.",
          duration: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full max-w-4xl rounded-2xl overflow-hidden shadow-lg">
      {/* Left Panel: CSR Connect Branding with Gradient */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-[#ff9ede] to-[#7b6dff] flex items-center justify-center p-8">
        <div className="text-center text-white">
          <span className="block text-5xl md:text-6xl font-medium font-['Poppins']">
            CSR
          </span>
          <span className="block text-3xl md:text-5xl font-medium font-['Poppins']">
            Connect
          </span>
        </div>
      </div>
      {/* Right Panel: Registration Form */}
      <div className="w-full md:w-1/2 bg-white p-8">
        <h2 className="text-3xl font-medium text-gray-800 text-center mb-8">
          Create Account
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-base font-medium text-gray-600 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              className="w-full px-4 py-3 rounded-xl bg-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-950"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-base font-medium text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 rounded-xl bg-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-950"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-base font-medium text-gray-600 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full px-4 py-3 rounded-xl bg-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-950"
              required
            />
          </div>
          {errorMessage && (
            <div className="mb-4 text-red-500 text-sm text-center">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 text-green-500 text-sm text-center">
              {successMessage}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-auto px-8 py-3 bg-gradient-to-br from-[#ff9ede] to-[#7b6dff] text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 mx-auto block"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => router.push("/login")}
              >
                Sign in
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
