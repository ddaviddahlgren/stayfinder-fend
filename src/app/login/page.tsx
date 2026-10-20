"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      router.push("/properties");
    } catch (error) {
      setError(error instanceof ApiError ? error.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1>Log in</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={submitting}>
            {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p>
        New to StayFinder? <Link href="/register">Register here</Link>
      </p>
    </div>
  );
}
