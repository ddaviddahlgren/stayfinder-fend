"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import type { Property } from "@/types";

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Property[]>("/properties")
      .then((data) => setProperties(data.slice(0, 6)))
      .catch((error) =>
        setError(
          error instanceof ApiError
            ? error.message
            : "Could not load properties",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>Welcome to StayFinder</h1>
      <p>Find and book your next stay.</p>

      <h2>Latest properties</h2>

      {loading && <p>Loading properties...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && properties.length === 0 && (
        <p>No properties yet.</p>
      )}

      <ul>
        {properties.map((p) => (
          <li key={p.id}>
            <h3>
              <Link href={`/properties/${p.id}`}>{p.title}</Link>
            </h3>
            <p>{p.location}</p>
            <p>{p.price_per_night} SEK per night</p>
          </li>
        ))}
      </ul>

      <Link href="/properties">See all properties</Link>
    </div>
  );
}
