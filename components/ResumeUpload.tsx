"use client";

import { ChangeEvent } from "react";
import { Stack, Typography } from "@mui/material";
import { useUploadResume } from "@/hooks/useApi";

export function ResumeUpload() {
  const upload = useUploadResume();

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    upload.mutate(file);
  };

  return (
    <Stack spacing={1}>
      <input type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFile} />
      {upload.isPending && <Typography variant="body2">Uploading and parsing...</Typography>}
    </Stack>
  );
}
