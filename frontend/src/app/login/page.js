'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function Login() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to check if the access token is valid
  const checkAuthStatus = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return;

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/users/me/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status === 200) {
        console.log('Valid token, redirecting to dashboard...');
        router.push('/dashboard');
      }
    } catch (err) {
      console.warn('Invalid or expired token, forcing login...');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/login/', {
        username,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Show success toast notification with custom styling
      toast.success('Login successful!', {
        description: 'Welcome back to CSR Connect',
        duration: 3000,
        icon: '👋',
      });

      console.log('Login successful! Redirecting...');
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (err) {
      setError('Invalid credentials, please try again');
      // Show error toast notification with custom styling
      toast.error('Login failed', {
        description: 'Invalid credentials, please try again',
        duration: 3000,
      });
      console.error('Login failed:', err);
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
      {/* Right Panel: Login Form */}
      <div className="w-full md:w-1/2 bg-white p-8">
        <h2 className="text-3xl font-medium text-gray-800 text-center mb-8">
          Login To Portal
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block text-base font-medium text-gray-600 mb-2">
              User Name
            </label>
            <input
              type="name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username here"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your Password here"
              className="w-full px-4 py-3 rounded-xl bg-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-950"
              required
            />
          </div>
          {error && (
            <div className="mb-4 text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-auto px-8 py-3 bg-gradient-to-br from-[#ff9ede] to-[#7b6dff] text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 mx-auto block"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <span 
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => router.push('/register')}
              >
                Register
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;