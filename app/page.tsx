"use client";

import { useState } from "react";
import Image from "next/image"; // Kept this import ready for your logo

export default function Home() {
  // State management for the form
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    // Dispatch to your Next.js API route or Auth provider (e.g., NextAuth)
    console.log('Authenticating payload:', credentials);
    window.location.href = "/admin";
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Main Panel Container */}
      <div className="w-full max-w-md p-8 bg-white border border-gray-200 shadow-xl rounded-2xl">
        
        {/* Header */}
        <div className="mb-8 text-center">
          {/* Optional: Use your Image import here for a logo */}
          {/* <Image src="/logo.png" alt="Logo" width={48} height={48} className="mx-auto mb-4" /> */}
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            System Access
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Authenticate to continue to your dashboard
          </p>
        </div>

        {/* Auth Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 mt-1.5 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800 transition-all duration-200"
                placeholder="admin@local.host"
                value={credentials.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 mt-1.5 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800 transition-all duration-200"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>
          </div>

          

          <button
            type="submit"
            className="w-full px-4 py-3 text-sm font-bold text-white bg-slate-900 rounded-lg shadow-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all duration-200"
          >
            Authenticate
          </button>
        </form>
      </div>
    </main>
  );
}