"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import TodaysTasks from "@/components/dashboard/TodaysTasks";
import UpcomingBills from "@/components/dashboard/UpcomingBills";
import ThisWeekTodos from "@/components/dashboard/ThisWeekTodos";
import PendingJobs from "@/components/dashboard/PendingJobs";
import DashboardStats from "@/components/dashboard/DashboardStats";
import {
  getActiveTodos,
  getThisWeekTodos,
  getUpcomingBills,
  getPendingJobs,
} from "@/lib/data/dashboard";
import { getBillsForUser } from "@/lib/data/bills";
import { getTeagueJobsForUser } from "@/lib/data/teagueJobs";
import { Todo, Bill, TeagueJob } from "@/types/db";

export default function DashboardPage() {
  const [activeTodos, setActiveTodos] = useState<Todo[]>([]);
  const [weekTodos, setWeekTodos] = useState<Todo[]>([]);
  const [upcomingBills, setUpcomingBills] = useState<Bill[]>([]);
  const [allBills, setAllBills] = useState<Bill[]>([]);
  const [pendingJobs, setPendingJobs] = useState<TeagueJob[]>([]);
  const [allJobs, setAllJobs] = useState<TeagueJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      try {
        const [active, week, bills, allBillsData, jobs, allJobsData] = await Promise.all([
          getActiveTodos(),
          getThisWeekTodos(),
          getUpcomingBills(),
          getBillsForUser(),
          getPendingJobs(),
          getTeagueJobsForUser(),
        ]);

        setActiveTodos(active);
        setWeekTodos(week);
        setUpcomingBills(bills);
        setAllBills(allBillsData);
        setPendingJobs(jobs);
        setAllJobs(allJobsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Dashboard"
          subtitle="Today's focus and upcoming obligations at a glance."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Today's focus and upcoming obligations at a glance."
      />

      {/* Stats Row */}
      <DashboardStats
        activeTodos={activeTodos}
        allBills={allBills}
        allJobs={allJobs}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Row */}
        <TodaysTasks todos={activeTodos} />
        <UpcomingBills bills={upcomingBills} />

        {/* Bottom Row */}
        <ThisWeekTodos todos={weekTodos} />
        <PendingJobs jobs={pendingJobs} />
      </div>
    </div>
  );
}

