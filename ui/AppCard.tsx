"use client";

import { Card, CardContent, Typography } from "@mui/material";

export function AppCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="h-full">
      <CardContent>
        <Typography variant="h6" className="mb-4">{title}</Typography>
        {children}
      </CardContent>
    </Card>
  );
}
