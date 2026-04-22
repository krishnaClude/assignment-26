"use client";

import { useState } from "react";
import { Stack, TextField } from "@mui/material";
import { AppButton } from "@/ui/AppButton";
import { useCreateJob } from "@/hooks/useApi";

export function JobForm() {
  const createJob = useCreateJob();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");

  return (
    <Stack spacing={2}>
      <TextField label="Job title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextField label="Description" multiline minRows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
      <TextField label="Required skills (comma-separated)" value={requiredSkills} onChange={(e) => setRequiredSkills(e.target.value)} />
      <AppButton
        disabled={createJob.isPending}
        onClick={() =>
          createJob.mutate({
            title,
            description,
            minExperienceYears: 0,
            requiredSkills: requiredSkills.split(",").map((s) => s.trim()).filter(Boolean)
          })
        }
      >
        Create job
      </AppButton>
    </Stack>
  );
}
