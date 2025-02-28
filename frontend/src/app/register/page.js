"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function Register() {
  const router = useRouter();

  // State for form data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // State for submission messages
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Check if the user is already logged in
  const checkAuthStatus = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/users/me/", {
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

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/users/register/",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        setSuccessMessage("User registered successfully!");
        setTimeout(() => router.push("/login"), 1500); // Redirect after success
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response) {
        setErrorMessage(
          error.response.data.detail || "Registration failed. Please try again."
        );
      } else {
        setErrorMessage("Network error. Please check your connection.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-black">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>

        {errorMessage && (
          <div className="bg-red-200 text-red-800 p-2 rounded mb-4">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-200 text-green-800 p-2 rounded mb-4">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>

          <div>
            <span>
              Already have an account?
              <a
                href="/login"
                className="text-blue-500 hover:underline text-sm block"
              >
                Login here
              </a>
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 mt-4"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
