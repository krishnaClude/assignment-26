"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" })
    }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message);
  }
  return res.json();
}

export function useJobs() {
  return useQuery({ queryKey: ["jobs"], queryFn: () => fetchJson<any[]>("/api/jobs") });
}

export function useResumes() {
  return useQuery({ queryKey: ["resumes"], queryFn: () => fetchJson<any[]>("/api/resumes") });
}

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; description: string; requiredSkills: string[]; minExperienceYears: number }) =>
      fetchJson("/api/jobs", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] })
  });
}

export function useUploadResume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return fetchJson("/api/resumes", { method: "POST", body: formData });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["resumes"] })
  });
}

export function useGenerateMatch() {
  return useMutation({
    mutationFn: (jobId: string) => fetchJson<any[]>("/api/matches", { method: "POST", body: JSON.stringify({ jobId }) })
  });
}
