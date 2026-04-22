"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { AppButton } from "@/ui/AppButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) router.push("/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5">Recruiter Login</Typography>
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <AppButton onClick={submit}>Login</AppButton>
          </Stack>
        </CardContent>
      </Card>
    </main>
  );
}
