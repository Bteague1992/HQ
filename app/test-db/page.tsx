"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { getTodosForUser } from "@/lib/data/todos";
import { getBillsForUser } from "@/lib/data/bills";
import { getTeagueJobsForUser } from "@/lib/data/teagueJobs";
import { supabase } from "@/lib/supabase/client";

export default function TestDbPage() {
  const [connectionStatus, setConnectionStatus] = useState<string>("Testing...");
  const [todos, setTodos] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    testConnection();
  }, []);

  async function testConnection() {
    try {
      // Test 1: Check if Supabase client is configured
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!url || !key || url.includes("your-project") || key.includes("your-anon-key")) {
        setConnectionStatus("❌ Not configured");
        setError("Please set up your .env.local file with real Supabase credentials");
        return;
      }

      setConnectionStatus("✅ Environment variables found");

      // Test 2: Try to fetch data
      console.log("Testing Supabase connection...");
      
      const [todosData, billsData, jobsData] = await Promise.all([
        getTodosForUser(),
        getBillsForUser(),
        getTeagueJobsForUser(),
      ]);

      setTodos(todosData);
      setBills(billsData);
      setJobs(jobsData);

      setConnectionStatus("✅ Connected successfully!");
      console.log("Todos:", todosData);
      console.log("Bills:", billsData);
      console.log("Jobs:", jobsData);
    } catch (err) {
      setConnectionStatus("❌ Connection failed");
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Connection test error:", err);
    }
  }

  return (
    <div>
      <PageHeader
        title="Database Connection Test"
        subtitle="Test your Supabase integration"
      />

      <div className="space-y-6">
        {/* Connection Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <p className="text-lg mb-2">{connectionStatus}</p>
          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="text-red-700 font-semibold">Error:</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          )}
        </div>

        {/* Environment Check */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-mono text-gray-600">NEXT_PUBLIC_SUPABASE_URL:</span>
              <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? "text-green-600" : "text-red-600"}>
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Set" : "✗ Not set"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-gray-600">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
              <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "text-green-600" : "text-red-600"}>
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ Set" : "✗ Not set"}
              </span>
            </div>
          </div>
        </div>

        {/* Data Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-3">Todos</h3>
            <p className="text-3xl font-bold text-indigo-600">{todos.length}</p>
            <p className="text-sm text-gray-600 mt-1">records found</p>
            {todos.length > 0 && (
              <div className="mt-4 text-xs text-gray-500">
                <p>First todo: {todos[0].title}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-3">Bills</h3>
            <p className="text-3xl font-bold text-indigo-600">{bills.length}</p>
            <p className="text-sm text-gray-600 mt-1">records found</p>
            {bills.length > 0 && (
              <div className="mt-4 text-xs text-gray-500">
                <p>First bill: {bills[0].account_name}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-3">Teague Jobs</h3>
            <p className="text-3xl font-bold text-indigo-600">{jobs.length}</p>
            <p className="text-sm text-gray-600 mt-1">records found</p>
            {jobs.length > 0 && (
              <div className="mt-4 text-xs text-gray-500">
                <p>First job: {jobs[0].client_name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            📋 Setup Checklist
          </h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li>1. Create a Supabase project at supabase.com</li>
            <li>2. Copy your project URL and anon key</li>
            <li>3. Create .env.local in your project root</li>
            <li>4. Add your credentials to .env.local</li>
            <li>5. Restart your dev server (npm run dev)</li>
            <li>6. Create these tables in Supabase:
              <ul className="ml-4 mt-1 space-y-1 text-xs">
                <li>• todos</li>
                <li>• bills</li>
                <li>• teague_jobs</li>
              </ul>
            </li>
            <li>7. Refresh this page to test</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

