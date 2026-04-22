"use client";

import { AppCard } from "@/ui/AppCard";
import { JobForm } from "@/components/JobForm";
import { ResumeUpload } from "@/components/ResumeUpload";
import { CandidateRankingTable } from "@/components/CandidateRankingTable";

export default function DashboardPage() {
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">AI Resume Screening Dashboard</h1>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AppCard title="Create Job Posting">
          <JobForm />
        </AppCard>
        <AppCard title="Upload Resume">
          <ResumeUpload />
        </AppCard>
      </section>
      <AppCard title="Candidate Ranking & Insights">
        <CandidateRankingTable />
      </AppCard>
    </main>
  );
}
