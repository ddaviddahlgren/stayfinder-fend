"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await register(email, password);
      router.push("/properties");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not register");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1>Register</h1>

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
          {submitting ? "Creating account..." : "Register"}
        </button>
      </form>

      <p>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </div>
  );
}
