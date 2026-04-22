"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { AppButton } from "@/ui/AppButton";
import { useGenerateMatch } from "@/hooks/useApi";

export function CandidateRankingTable() {
  const match = useGenerateMatch();
  const [jobId, setJobId] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <TextField size="small" label="Job ID" value={jobId} onChange={(e) => setJobId(e.target.value)} />
        <AppButton onClick={() => match.mutate(jobId)} disabled={match.isPending || !jobId}>Rank candidates</AppButton>
      </div>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Candidate</TableCell>
            <TableCell>Score</TableCell>
            <TableCell>Missing Skills</TableCell>
            <TableCell>Strengths</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(match.data ?? []).map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.resume?.parsedData?.name ?? row.resumeId}</TableCell>
              <TableCell>{row.score}%</TableCell>
              <TableCell>{(row.missingSkills ?? []).join(", ")}</TableCell>
              <TableCell>{(row.strengths ?? []).join(", ")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
